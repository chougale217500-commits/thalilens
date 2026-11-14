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
 "notes": ["2 or 3 short, plain health observations about this meal"],
 "swaps": [{"instead_of": "an item or cooking habit in this meal", "try": "a lighter, realistic Indian alternative", "saves_kcal": 0}],
 "score": 0,
 "score_reason": "one short sentence explaining the score"
}
"total" covers all items together. "score" is a whole number from 1 to 10 for how balanced this is as an everyday meal: protein, fibre and vegetables raise it; deep-fried food, added sugar, refined flour and a lot of fat lower it. "swaps" holds at most 2 practical swaps that fit this meal, or an empty list if the meal is already light. If the photo shows the nutrition table or label of a packaged food instead of a dish, read the label: use the product name as the item, the serving size printed on the pack as the portion, and the printed values. If the input is not food, reply {"is_food": false, "reason": "what it is instead"}.`;

const LANGS = { hi: "Hindi (Devanagari script)", mr: "Marathi (Devanagari script)", gu: "Gujarati (Gujarati script)", bn: "Bengali (Bengali script)", ta: "Tamil (Tamil script)",
  te: "Telugu (Telugu script)", kn: "Kannada (Kannada script)", ml: "Malayalam (Malayalam script)", pa: "Punjabi (Gurmukhi script)" };

const FOCUS = {
  loss: "weight loss: calorie control and foods that keep you full",
  protein: "muscle gain: getting enough protein",
  sugar: "watching blood sugar: carbohydrate load and added sugar",
  heart: "heart health and blood pressure: salt, saturated fat and fried food",
};
const langLine = (lang, fields) => LANGS[lang] ? "\n\nWrite " + fields + " in " + LANGS[lang] + ". Keep the JSON keys in English." : "";

function askPrompt(meal, question, lang) {
  return "You are a nutrition guide who specialises in Indian food. A user analysed this meal:\n" + meal +
    "\n\nTheir question: \"" + question + "\"\n\nAnswer in 2 to 4 short, plain sentences using the meal details. Give general food information only. " +
    "Do not diagnose, do not mention medicines or doses, and say to check with a doctor or dietitian if the question is about a medical condition. " +
    "If the question is not about food, nutrition or this meal, say you can only help with food questions.\n\n" +
    "Reply with ONLY this JSON: {\"answer\": \"\"}" + langLine(lang, "the answer");
}

function recipePrompt(text, servings, lang) {
  return "You are a nutrition analyst who specialises in Indian food. Here is a home recipe that makes " + servings + " serving(s):\n" + text +
    "\n\nWork out the nutrition for ONE serving. Treat each ingredient as one item: its portion is the amount of that ingredient in one serving. " +
    "If an amount is missing, assume a typical amount for this recipe and say so in notes. Count cooking oil, ghee, butter and sugar.\n\n" +
    FORMAT.slice(FORMAT.indexOf("Reply with ONLY")) + "\nHere meal_name is the name of the dish, and every number is for one serving." +
    langLine(lang, "meal_name, every item name, portion, allergens, notes, swaps, score_reason and reason");
}

function menuPrompt(focus, lang) {
  return "You are a nutrition guide who specialises in Indian food. The photo shows a restaurant or canteen menu. Read the dish names on it." +
    (FOCUS[focus] ? " The user's focus is " + FOCUS[focus] + "." : "") +
    "\n\nReply with ONLY one JSON object in this shape:\n" +
    "{\n \"is_menu\": true,\n \"reason\": \"\",\n \"picks\": [{\"name\": \"dish exactly as written on the menu\", \"why\": \"one short reason\", \"approx_kcal\": 0}],\n" +
    " \"limit\": [{\"name\": \"\", \"why\": \"\", \"approx_kcal\": 0}],\n \"order_idea\": \"one balanced order for one person using dishes from this menu\",\n \"tip\": \"one practical tip for ordering here\"\n}\n" +
    "\"picks\" holds the 3 to 5 better choices on this menu and \"limit\" the 3 to 5 heaviest ones. approx_kcal is for one typical restaurant serving. " +
    "Use only dishes that are on the menu. If the photo is not a menu, reply {\"is_menu\": false, \"reason\": \"what it shows instead\"}." +
    langLine(lang, "why, order_idea, tip and reason");
}

function buildPrompt(name, hasPhoto, lang, focus) {
  const intro = hasPhoto
    ? "Look at the attached photo and identify every food and drink item visible." +
      (name ? ` The user says the food is: "${name}". Trust this for what the dish is, and use the photo to judge portion size and anything else visible.` : "")
    : `There is no photo. The user typed this food description: "${name}". Identify each food and drink item in it. Where no quantity is given, assume one typical serving.`;
  const hindi = LANGS[lang]
    ? "\n\nWrite meal_name, every item name, portion, ingredients, allergens, notes, swaps and reason in " + LANGS[lang] + ". Keep name_hindi in Hindi, and keep the JSON keys and the values of diet and confidence in English."
    : "";
  const focusLine = FOCUS[focus]
    ? "\n\nThe user's focus is " + FOCUS[focus] + ". Make the notes and swaps relevant to it, and add one more key, \"focus_note\": one or two plain sentences on how this meal fits that focus. Give food information only; do not mention medicines."
    : "";
  return "You are a nutrition analyst who specialises in Indian food. " + intro + "\n\n" + FORMAT + focusLine + hindi.replace("swaps and reason", "swaps, score_reason, focus_note and reason");
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

// Google retires model names often, so the function tries a list of names in order,
// and if none works it asks Google which models this key can use. The one that works is remembered.
const GEMINI_API = "https://generativelanguage.googleapis.com/v1beta/";
const GEMINI_MODELS = ["gemini-3.6-flash", "gemini-3.8-flash", "gemini-3.5-flash-lite", "gemini-2.5-flash"];
let goodModel = null;

// Newer Gemini models "think" before answering, which is the main cause of slow replies.
// This task does not need it, so each model is asked for the least thinking it allows.
function thinkingFor(model) {
  if (/^gemini-2\.5/.test(model)) return { thinkingBudget: 0 };
  if (/flash-lite/.test(model) || /^gemini-3\.6-flash/.test(model) || /^gemini-3-flash/.test(model)) return { thinkingLevel: "minimal" };
  return { thinkingLevel: "low" };
}

// Remembers the working model between requests, so later requests skip the names that failed.
const MODEL_KEY = "https://thali-lens.internal/good-model";
async function recallModel() {
  if (goodModel || typeof caches === "undefined") return;
  try { const r = await caches.default.match(MODEL_KEY); if (r) goodModel = (await r.text()) || null; } catch {}
}
async function rememberModel(model) {
  if (goodModel === model) return;
  goodModel = model;
  if (typeof caches === "undefined") return;
  try { await caches.default.put(MODEL_KEY, new Response(model, { headers: { "cache-control": "max-age=86400" } })); } catch {}
}

function googleError(status, body) {
  const j = safeParse(body);
  const e = (j && j.error) || {};
  return { status, code: String(e.status || ""), message: String(e.message || body || "").slice(0, 200) };
}
const isKeyProblem = (e) => e.status === 401 || /api.?key|credential|unauthenticated/i.test(e.code + " " + e.message);

async function geminiOnce(env, model, parts, lessThinking = true) {
  const generationConfig = { responseMimeType: "application/json", temperature: 0.2 };
  if (lessThinking) generationConfig.thinkingConfig = thinkingFor(model);
  const r = await fetch(GEMINI_API + "models/" + encodeURIComponent(model) + ":generateContent", {
    method: "POST",
    headers: { "content-type": "application/json", "x-goog-api-key": env.GEMINI_API_KEY },
    body: JSON.stringify({ contents: [{ role: "user", parts }], generationConfig }),
  });
  if (!r.ok) {
    const error = googleError(r.status, await r.text());
    // If this model does not accept the thinking setting, ask again without it.
    if (lessThinking && r.status === 400 && /think/i.test(error.message)) return geminiOnce(env, model, parts, false);
    return { error };
  }
  const out = await r.json();
  const cand = out.candidates && out.candidates[0];
  const text = cand && cand.content && Array.isArray(cand.content.parts) ? cand.content.parts.map((p) => p.text || "").join("") : "";
  return { text };
}

// Lists the models this key can use and returns the newest general Flash models first.
async function discoverModels(env) {
  try {
    const r = await fetch(GEMINI_API + "models?pageSize=200", { headers: { "x-goog-api-key": env.GEMINI_API_KEY } });
    if (!r.ok) return [];
    const j = await r.json();
    const version = (n) => { const m = /gemini-(\d+(?:\.\d+)?)/.exec(n); return m ? parseFloat(m[1]) : 0; };
    return (j.models || [])
      .filter((m) => (m.supportedGenerationMethods || []).includes("generateContent"))
      .map((m) => String(m.name || "").replace(/^models\//, ""))
      .filter((n) => /^gemini-.*flash/.test(n) && !/image|tts|live|audio|embedding|omni|preview|exp/.test(n))
      .sort((a, b) => version(b) - version(a) || a.length - b.length);
  } catch { return []; }
}

async function askGemini(env, prompt, image, mediaType) {
  const parts = [];
  if (image) parts.push({ inlineData: { mimeType: mediaType, data: image } });
  parts.push({ text: prompt });

  await recallModel();
  const tried = new Set();
  let last = null, limited = false;
  const attempt = async (model) => {
    if (!model || tried.has(model)) return null;
    tried.add(model);
    const r = await geminiOnce(env, model, parts);
    if (!r.error) { await rememberModel(model); return { status: 200, text: r.text }; }
    last = r.error;
    if (r.error.status === 429) limited = true;
    return null;
  };

  for (const model of [goodModel, env.GEMINI_MODEL, ...GEMINI_MODELS]) {
    const ok = await attempt(model);
    if (ok) return ok;
    if (last && isKeyProblem(last)) return { status: 401, detail: last };
  }
  for (const model of (await discoverModels(env)).slice(0, 3)) {
    const ok = await attempt(model);
    if (ok) return ok;
  }
  return { status: limited ? 429 : (last ? last.status : 502), detail: last };
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

const clean = (v, max) => (typeof v === "string" ? v.replace(/["\r]/g, " ").trim().slice(0, max) : "");

export async function onRequestPost({ request, env }) {
  if (!env.GEMINI_API_KEY && !env.ANTHROPIC_API_KEY) return json({ error: "Server is not configured yet." }, 500);

  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  if (!allowed(ip)) return json({ error: "Too many requests. Please wait a few minutes and try again." }, 429);

  if (env.FIREBASE_API_KEY) {
    const m = /^Bearer (.+)$/.exec(request.headers.get("Authorization") || "");
    if (!m || !(await validToken(env.FIREBASE_API_KEY, m[1]))) return json({ error: "Please sign in to analyse." }, 401);
  }

  const body = safeParse(await request.text()) || {};
  const mode = ["ask", "recipe", "menu"].includes(body.mode) ? body.mode : "analyse";
  const lang = typeof body.lang === "string" ? body.lang.slice(0, 2) : "en";
  const focus = typeof body.focus === "string" ? body.focus : "";
  const image = body.image, mediaType = body.mediaType;
  const hasPhoto = image != null && image !== "";

  if (hasPhoto) {
    if (typeof image !== "string" || image.length < 100 || image.length > 4000000 || !/^[A-Za-z0-9+/=]+$/.test(image)) {
      return json({ error: "Please send a valid photo." }, 400);
    }
    if (!["image/jpeg", "image/png", "image/webp"].includes(mediaType)) return json({ error: "Unsupported image type." }, 400);
  }

  let prompt, useImage = false;
  if (mode === "ask") {
    const question = clean(body.question, 300), meal = clean(body.meal, 1500);
    if (!question || !meal) return json({ error: "Please type a question about your meal." }, 400);
    prompt = askPrompt(meal, question, lang);
  } else if (mode === "recipe") {
    const text = clean(body.text, 2500), servings = Math.min(50, Math.max(1, Math.round(Number(body.servings)) || 1));
    if (text.length < 10) return json({ error: "Please paste the ingredients with amounts." }, 400);
    prompt = recipePrompt(text, servings, lang);
  } else if (mode === "menu") {
    if (!hasPhoto) return json({ error: "Please add a photo of the menu." }, 400);
    prompt = menuPrompt(focus, lang); useImage = true;
  } else {
    const name = clean(body.name, 200).replace(/\n/g, " ");
    if (!hasPhoto && !name) return json({ error: "Please add a photo or type the food name." }, 400);
    prompt = buildPrompt(name, hasPhoto, lang, focus); useImage = hasPhoto;
  }

  try {
    const ask = env.GEMINI_API_KEY ? askGemini : askAnthropic;
    const r = await ask(env, prompt, useImage ? image : null, mediaType);
    if (r.status === 429) return json({ error: "The free daily limit is used up for now. Please try again later." }, 429);
    if (r.status === 401) {
      console.error("AI key error", r.detail);
      return json({ error: "The AI key was not accepted. Site owner: check GEMINI_API_KEY in Cloudflare settings." }, 502);
    }
    if (r.status !== 200) {
      console.error("AI error", r.status, r.detail);
      const d = r.detail && typeof r.detail === "object" ? " (code " + r.detail.status + " " + r.detail.code + ")" : "";
      return json({ error: "The analysis service is busy. Please try again." + d }, 502);
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
