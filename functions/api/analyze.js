// Cloudflare Pages Function: POST /api/analyze
// Receives a food photo, a typed food name, or both, asks the AI model, returns nutrition JSON.
//
// Environment variables (Cloudflare Pages > Settings > Variables and Secrets):
//   GEMINI_API_KEY     Google Gemini API key from aistudio.google.com (has a free tier)
//   GEMINI_MODEL       optional, model name to use (see README)
//   ANTHROPIC_API_KEY  optional paid alternative, used only when GEMINI_API_KEY is not set
//   ANTHROPIC_MODEL    optional
//   FIREBASE_API_KEY   optional, set it to make Google sign-in compulsory for analysis

const FORMAT = `For each item estimate the portion in Indian household measures (katori, roti count, piece, cup, tablespoon) and in grams, list the likely ingredients (including cooking fat, spices that matter, and hidden sugar), and estimate nutrition for THAT portion as normally cooked in Indian homes or restaurants.

Reply with ONLY one JSON object in exactly this shape, numbers as plain numbers:
{
 "is_food": true,
 "reason": "",
 "meal_name": "short name of the dish or meal in English",
 "meal_name_hindi": "same name in Hindi (Devanagari)",
 "diet": "veg" | "non-veg" | "egg" | "vegan",
 "confidence": "high" | "medium" | "low",
 "items": [{"name": "", "name_hindi": "", "portion": "e.g. 1 katori", "grams": 0, "ingredients": [""], "calories": 0, "protein_g": 0, "carbs_g": 0, "fat_g": 0}],
 "total": {"saturated_fat_g": 0, "fiber_g": 0, "sugar_g": 0, "sodium_mg": 0, "cholesterol_mg": 0, "calcium_mg": 0, "iron_mg": 0},
 "allergens": ["e.g. milk, gluten (wheat), nuts"],
 "notes": ["2 or 3 short, plain health observations about this meal"]
}
"total" covers all items together. If the input is not food, reply {"is_food": false, "reason": "what it is instead"}.`;

function buildPrompt(name, hasPhoto) {
  const intro = hasPhoto
    ? "Look at the attached photo and identify every food and drink item visible." +
      (name ? ` The user says the food is: "${name}". Trust this for what the dish is, and use the photo to judge portion size and anything else visible.` : "")
    : `There is no photo. The user typed this food description: "${name}". Identify each food and drink item in it. Where no quantity is given, assume one typical serving.`;
  return "You are a nutrition analyst who specialises in Indian food. " + intro + "\n\n" + FORMAT;
}

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { "content-type": "application/json", "cache-control": "no-store" } });
const safeParse = (s) => { try { return JSON.parse(s); } catch { return null; } };

// Light per-IP limit. It is best-effort (memory is not shared between servers),
// so the real protection is the sign-in check and the provider's own quota.
const hits = new Map();
const LIMIT = 10, WINDOW_MS = 10 * 60 * 1000;
function allowed(ip) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  if (list.length >= LIMIT) { hits.set(ip, list); return false; }
  list.push(now); hits.set(ip, list);
  if (hits.size > 5000) hits.clear();
  return true;
}

// Asks Firebase whether the sign-in token belongs to a real, current account.
async function validToken(key, idToken) {
  try {
    const r = await fetch("https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=" + encodeURIComponent(key), {
      method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ idToken }),
    });
    if (!r.ok) return false;
    const j = await r.json();
    return Array.isArray(j.users) && j.users.length === 1;
  } catch { return false; }
}

async function askGemini(env, prompt, image, mediaType) {
  const model = env.GEMINI_MODEL || "gemini-2.5-flash";
  const parts = [];
  if (image) parts.push({ inlineData: { mimeType: mediaType, data: image } });
  parts.push({ text: prompt });
  const r = await fetch("https://generativelanguage.googleapis.com/v1beta/models/" + encodeURIComponent(model) + ":generateContent", {
    method: "POST",
    headers: { "content-type": "application/json", "x-goog-api-key": env.GEMINI_API_KEY },
    body: JSON.stringify({ contents: [{ role: "user", parts }], generationConfig: { responseMimeType: "application/json", temperature: 0.2 } }),
  });
  if (!r.ok) return { status: r.status, detail: await r.text() };
  const out = await r.json();
  const cand = out.candidates && out.candidates[0];
  const text = cand && cand.content && Array.isArray(cand.content.parts) ? cand.content.parts.map((p) => p.text || "").join("") : "";
  return { status: 200, text };
}

async function askAnthropic(env, prompt, image, mediaType) {
  const content = [];
  if (image) content.push({ type: "image", source: { type: "base64", media_type: mediaType, data: image } });
  content.push({ type: "text", text: prompt });
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "content-type": "application/json", "x-api-key": env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({ model: env.ANTHROPIC_MODEL || "claude-sonnet-5-5", max_tokens: 2000, messages: [{ role: "user", content }] }),
  });
  if (!r.ok) return { status: r.status, detail: await r.text() };
  const out = await r.json();
  return { status: 200, text: (out.content || []).filter((b) => b.type === "text").map((b) => b.text).join("") };
}

export async function onRequestPost({ request, env }) {
  if (!env.GEMINI_API_KEY && !env.ANTHROPIC_API_KEY) return json({ error: "Server is not configured yet." }, 500);

  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  if (!allowed(ip)) return json({ error: "Too many requests. Please wait a few minutes and try again." }, 429);

  if (env.FIREBASE_API_KEY) {
    const m = /^Bearer (.+)$/.exec(request.headers.get("Authorization") || "");
    if (!m || !(await validToken(env.FIREBASE_API_KEY, m[1]))) return json({ error: "Please sign in to analyse." }, 401);
  }

  const body = safeParse(await request.text()) || {};
  const image = body.image, mediaType = body.mediaType;
  const name = typeof body.name === "string" ? body.name.replace(/["\n\r]/g, " ").trim().slice(0, 200) : "";
  const hasPhoto = image != null && image !== "";

  if (!hasPhoto && !name) return json({ error: "Please add a photo or type the food name." }, 400);
  if (hasPhoto) {
    if (typeof image !== "string" || image.length < 100 || image.length > 4000000 || !/^[A-Za-z0-9+/=]+$/.test(image)) {
      return json({ error: "Please send a valid photo." }, 400);
    }
    if (!["image/jpeg", "image/png", "image/webp"].includes(mediaType)) return json({ error: "Unsupported image type." }, 400);
  }

  try {
    const prompt = buildPrompt(name, hasPhoto);
    const ask = env.GEMINI_API_KEY ? askGemini : askAnthropic;
    const r = await ask(env, prompt, hasPhoto ? image : null, mediaType);
    if (r.status === 429) return json({ error: "The free daily limit is used up for now. Please try again later." }, 429);
    if (r.status !== 200) {
      console.error("AI error", r.status, r.detail);
      return json({ error: "The analysis service is busy. Please try again." }, 502);
    }
    const start = r.text.indexOf("{"), end = r.text.lastIndexOf("}");
    const data = start >= 0 && end > start ? safeParse(r.text.slice(start, end + 1)) : null;
    if (!data) return json({ error: "The analysis came back unreadable. Please try again." }, 502);
    return json(data);
  } catch (e) {
    console.error(e);
    return json({ error: "The analysis failed. Please try again." }, 500);
  }
}

export async function onRequestGet() {
  return json({ error: "Use POST." }, 405);
}
