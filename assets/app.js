(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  // Hindi page: the same code runs with translated labels.
  var LANG = (document.documentElement.lang || "").slice(0, 2) === "hi" ? "hi" : "en";
  var HI = {"Example. Your own result appears here.": "उदाहरण। आपका अपना नतीजा यहाँ दिखेगा।", "Vegetarian": "शाकाहारी", "Vegan": "वीगन", "Contains egg": "अंडा शामिल", "Non-vegetarian": "मांसाहारी", " confidence": " भरोसा", "% of a 2,000 kcal day": "% (2,000 kcal के दिन का)", "Carbs": "कार्ब्स", "Protein": "प्रोटीन", "Fat": "फैट", "How much did you eat": "आपने कितना खाया", "Half": "आधा", "As shown": "जितना दिखा", "Double": "दुगना", "On the plate and what is in it": "थाली में क्या है और उसमें क्या पड़ा है", "about ": "लगभग ", "Full nutrition, with share of an approximate daily reference": "पूरा पोषण, और दिन की अनुमानित ज़रूरत का हिस्सा", "Energy": "ऊर्जा", "Carbohydrate": "कार्बोहाइड्रेट", "Fibre": "फाइबर", "Sugar": "शक्कर", "Saturated fat": "सैचुरेटेड फैट", "Cholesterol": "कोलेस्ट्रॉल", "Sodium": "सोडियम", "Calcium": "कैल्शियम", "Iron": "आयरन", "May contain: ": "इसमें हो सकता है: ", "Notes": "ध्यान दें", "Add to today's log": "आज की सूची में जोड़ें", "Added": "जोड़ दिया", "Share on WhatsApp": "WhatsApp पर भेजें", "Copy result": "नतीजा कॉपी करें", "Copied": "कॉपी हो गया", "Today's log": "आज की सूची", "Total so far, protein ": "अब तक कुल, प्रोटीन ", "Clear today's log": "आज की सूची मिटाएँ", "Saved only on this device. It starts fresh each day.": "सिर्फ़ इसी फ़ोन या कंप्यूटर में सेव होता है। हर दिन नई सूची शुरू होती है।", "Please choose an image file.": "कृपया कोई फ़ोटो चुनें।", "Photo ready. Press Analyse.": "फ़ोटो तैयार है। जाँचें दबाएँ।", "Working out the nutrition. This can take up to a minute.": "पोषण निकाला जा रहा है। इसमें एक मिनट तक लग सकता है।", "The analysis failed. Please try again.": "जाँच नहीं हो पाई। कृपया दोबारा कोशिश करें।", "Done. Adjust the portion if you ate more or less.": "हो गया। ज़्यादा या कम खाया हो तो मात्रा बदल लें।", "Please sign in first. Opening the sign-in page.": "पहले साइन इन करें। साइन इन पेज खुल रहा है।", "That file could not be read. Use a JPG or PNG photo.": "यह फ़ाइल नहीं खुल पाई। JPG या PNG फ़ोटो इस्तेमाल करें।", "Could not reach the server. Check your internet and try again.": "सर्वर से संपर्क नहीं हो पाया। इंटरनेट जाँचकर दोबारा कोशिश करें।", "No food found": "खाना नहीं मिला", ". Try another photo or name.": "। दूसरी फ़ोटो या नाम आज़माएँ।", "The free daily limit is used up for now. Please try again later.": "आज की मुफ़्त सीमा अभी पूरी हो गई है। कृपया बाद में कोशिश करें।", "Too many requests. Please wait a few minutes and try again.": "बहुत ज़्यादा अनुरोध हो गए। कुछ मिनट रुककर दोबारा कोशिश करें।", "Please sign in to analyse.": "जाँच के लिए कृपया साइन इन करें।", "Please add a photo or type the food name.": "कृपया फ़ोटो जोड़ें या खाने का नाम लिखें।", "The analysis service is busy. Please try again.": "सेवा अभी व्यस्त है। कृपया दोबारा कोशिश करें।", "Your food photo": "आपके खाने की फ़ोटो", "My meal": "मेरा खाना", "Your meal": "आपका खाना", "Item": "चीज़"};
  function t(s) { return LANG === "hi" && Object.prototype.hasOwnProperty.call(HI, s) ? HI[s] : s; }
  var HI2 = {"Oil or ghee used": "तेल या घी कितना पड़ा", "Less": "कम", "Normal": "सामान्य", "Extra": "ज़्यादा", "Lighter swaps": "हल्के विकल्प", "Listening. Say what you ate.": "सुन रहा हूँ। बताइए आपने क्या खाया।", "Could not hear you. Try again or type the name.": "आवाज़ नहीं सुनाई दी। दोबारा कोशिश करें या नाम लिखें।", "Microphone permission was not given. Type the name instead.": "माइक की अनुमति नहीं मिली। नाम लिख दें।", "Heard you. Press Analyse.": "सुन लिया। जाँचें दबाएँ।", "Change how much of this item you ate": "इस चीज़ की मात्रा बदलें", "Not eaten": "नहीं खाया"}; for (var hk in HI2) HI[hk] = HI2[hk];
  var HI3 = {"Balance score": "संतुलन स्कोर", "Ask about this meal": "इस खाने के बारे में पूछें", "Ask": "पूछें", "e.g. Is this fine for dinner?": "जैसे: क्या यह रात के खाने के लिए ठीक है?", "Thinking.": "सोच रहा हूँ।", "Could not get an answer. Please try again.": "जवाब नहीं मिल पाया। दोबारा कोशिश करें।", "Please type a question about your meal.": "कृपया अपने खाने के बारे में सवाल लिखें।", "Share image": "तस्वीर भेजें", "Image saved. Share it from your downloads or gallery.": "तस्वीर सेव हो गई। डाउनलोड या गैलरी से भेजें।", "Today": "आज", "Nothing logged yet. Analyse a meal and press Add to today's log.": "अभी कुछ नहीं जोड़ा। खाना जाँचें और \"आज की सूची में जोड़ें\" दबाएँ।", "Daily goal": "रोज़ का लक्ष्य", "Change goal": "लक्ष्य बदलें", "Calories (kcal)": "कैलोरी (kcal)", "Protein (g)": "प्रोटीन (g)", "Save goal": "लक्ष्य सेव करें", "Calories": "कैलोरी", "Last 7 days": "पिछले 7 दिन", " left": " बाकी", " over": " ज़्यादा", "Share my week": "मेरा हफ़्ता भेजें", "Not sure of your number? Use the daily calorie calculator.": "अपना आँकड़ा नहीं पता? रोज़ की कैलोरी कैलकुलेटर इस्तेमाल करें।", "Saved only on this device. The last 14 days are kept.": "सिर्फ़ इसी फ़ोन या कंप्यूटर में सेव होता है। पिछले 14 दिन रखे जाते हैं।"}; for (var hk3 in HI3) HI[hk3] = HI3[hk3];
  var h = function (tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = t(String(text)); return e; };

  // Shown until the first real analysis, clearly marked as an example.
  var EXAMPLE = {
    meal_name: "North Indian veg thali", meal_name_hindi: "शाकाहारी थाली", diet: "veg", score: 8, score_reason: "Dal, vegetables and whole wheat roti, with moderate fat.",
    items: [
      { name: "Phulka roti", name_hindi: "फुलका", portion: "2 medium", grams: 60, ingredients: ["whole wheat atta", "water", "salt"], calories: 150, protein_g: 5, carbs_g: 30, fat_g: 1 },
      { name: "Dal tadka", name_hindi: "दाल तड़का", portion: "1 katori", grams: 150, ingredients: ["toor dal", "tomato", "onion", "garlic", "ghee", "cumin", "turmeric", "red chilli"], calories: 180, protein_g: 9, carbs_g: 22, fat_g: 6 },
      { name: "Jeera rice", name_hindi: "जीरा राइस", portion: "1 katori", grams: 150, ingredients: ["basmati rice", "cumin", "oil", "salt"], calories: 210, protein_g: 4, carbs_g: 40, fat_g: 4 },
      { name: "Aloo gobi", name_hindi: "आलू गोभी", portion: "1 katori", grams: 120, ingredients: ["potato", "cauliflower", "onion", "tomato", "oil", "turmeric", "coriander"], calories: 140, protein_g: 3, carbs_g: 15, fat_g: 8 }
    ],
    total: { saturated_fat_g: 5, fiber_g: 13, sugar_g: 6, sodium_mg: 980, cholesterol_mg: 10, calcium_mg: 140, iron_mg: 6 },
    allergens: ["gluten (wheat)", "milk (ghee)"],
    swaps: [{ instead_of: "jeera rice", try: "plain steamed rice", saves_kcal: 15 }, { instead_of: "ghee on each phulka", try: "a light brush of ghee", saves_kcal: 60 }],
    notes: ["Good fibre from dal, atta and vegetables.", "Sodium is about half a day's limit in one meal.", "Add curd or paneer to raise protein."]
  };
  // Approximate daily reference for an adult on about 2,000 kcal.
  var REF = { calories: 2000, protein_g: 54, carbs_g: 300, fat_g: 67, saturated_fat_g: 22, fiber_g: 30, sugar_g: 50, sodium_mg: 2000, cholesterol_mg: 300, calcium_mg: 1000, iron_mg: 19 };

  if (LANG === "hi") EXAMPLE = {"meal_name": "उत्तर भारतीय शाकाहारी थाली", "meal_name_hindi": "", "diet": "veg", "score": 8, "score_reason": "दाल, सब्ज़ी और गेहूँ की रोटी है, और फैट सीमित है।", "items": [{"name": "फुलका रोटी", "portion": "2 मध्यम", "grams": 60, "ingredients": ["गेहूँ का आटा", "पानी", "नमक"], "calories": 150, "protein_g": 5, "carbs_g": 30, "fat_g": 1}, {"name": "दाल तड़का", "portion": "1 कटोरी", "grams": 150, "ingredients": ["तूर दाल", "टमाटर", "प्याज़", "लहसुन", "घी", "जीरा", "हल्दी", "लाल मिर्च"], "calories": 180, "protein_g": 9, "carbs_g": 22, "fat_g": 6}, {"name": "जीरा राइस", "portion": "1 कटोरी", "grams": 150, "ingredients": ["बासमती चावल", "जीरा", "तेल", "नमक"], "calories": 210, "protein_g": 4, "carbs_g": 40, "fat_g": 4}, {"name": "आलू गोभी", "portion": "1 कटोरी", "grams": 120, "ingredients": ["आलू", "फूलगोभी", "प्याज़", "टमाटर", "तेल", "हल्दी", "धनिया"], "calories": 140, "protein_g": 3, "carbs_g": 15, "fat_g": 8}], "total": {"saturated_fat_g": 5, "fiber_g": 13, "sugar_g": 6, "sodium_mg": 980, "cholesterol_mg": 10, "calcium_mg": 140, "iron_mg": 6}, "allergens": ["ग्लूटेन (गेहूँ)", "दूध (घी)"], "swaps": [{"instead_of": "जीरा राइस", "try": "सादे उबले चावल लें", "saves_kcal": 15}, {"instead_of": "हर फुलके पर घी", "try": "घी की हल्की परत लगाएँ", "saves_kcal": 60}], "notes": ["दाल, आटे और सब्ज़ियों से अच्छा फाइबर मिलता है।", "सोडियम एक ही खाने में दिन की सीमा का लगभग आधा है।", "प्रोटीन बढ़ाने के लिए दही या पनीर जोड़ें।"]};
  var file = null, url = null, data = EXAMPLE, isExample = true, mult = 1, busy = false, stream = null, qty = [], oil = 1, answer = null;
  function resLang() { var s = $("lang"); return s && s.value ? s.value : LANG; }
  var num = function (x) { var n = Number(x); return isFinite(n) && n > 0 ? n : 0; };
  var fmt = function (x) { var v = x * mult; return v < 10 ? String(Math.round(v * 10) / 10) : String(Math.round(v)); };
  function setStatus(text, kind) { var s = $("status"); s.textContent = t(String(text || "").replace(/ \(code [^)]*\)$/, "")) + ((/ \(code [^)]*\)$/.exec(String(text || "")) || [""])[0]); s.className = "status" + (kind ? " " + kind : ""); }

  function dishName() { return $("dish").value.replace(/["\n\r]/g, " ").trim().slice(0, 200); }
  function sync() { $("go").disabled = busy || (!file && !dishName()); }

  // Returns a sign-in token, null when sign-in is off or optional, or fails with "login" when sign-in is required.
  function authToken() {
    var A = window.thaliAuth;
    if (!A || !A.configured) return Promise.resolve(null);
    return A.ready.then(function () {
      if (A.user) return A.getToken();
      if (A.required) throw new Error("login");
      return null;
    });
  }

  function postJSON(body) {
    return authToken().then(function (tk) {
      var hd = { "Content-Type": "application/json" };
      if (tk) hd.Authorization = "Bearer " + tk;
      return fetch("/api/analyze", { method: "POST", headers: hd, body: JSON.stringify(body) });
    }).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (out) { if (!res.ok) throw new Error(out.error || "failed"); return out; });
    });
  }

  // Draws the result as a square picture that can be shared or saved.
  function shareImage(meal, tot, score) {
    var c = document.createElement("canvas"); c.width = 1080; c.height = 1080;
    var g = c.getContext("2d"), font = '"Hind", "Nirmala UI", "Noto Sans Devanagari", sans-serif';
    g.fillStyle = "#1A2125"; g.fillRect(0, 0, 1080, 1080);
    g.textAlign = "center"; g.fillStyle = "#FAFBFB"; g.font = "700 62px " + font;
    var words = String(meal).split(/\s+/), lines = [""];
    words.forEach(function (w) {
      var tryLine = (lines[lines.length - 1] + " " + w).trim();
      if (g.measureText(tryLine).width > 940 && lines[lines.length - 1]) lines.push(w); else lines[lines.length - 1] = tryLine;
    });
    lines.slice(0, 2).forEach(function (ln, i) { g.fillText(ln, 540, 120 + i * 76); });
    var eC = tot.carbs_g * 4, eP = tot.protein_g * 4, eF = tot.fat_g * 9, eT = eC + eP + eF || 1, a0 = -Math.PI / 2;
    [[eC, "#E2A400"], [eP, "#2E8B57"], [eF, "#C2482C"]].forEach(function (x) {
      var a1 = a0 + x[0] / eT * Math.PI * 2;
      g.beginPath(); g.arc(540, 520, 200, a0, a1); g.lineWidth = 54; g.strokeStyle = x[1]; g.stroke(); a0 = a1;
    });
    g.fillStyle = "#FAFBFB"; g.font = "700 124px " + font; g.fillText(fmt(tot.calories), 540, 545);
    g.fillStyle = "#C9D2D6"; g.font = "40px " + font; g.fillText("kcal", 540, 605);
    g.font = "44px " + font; g.fillStyle = "#FAFBFB";
    g.fillText(t("Protein") + " " + fmt(tot.protein_g) + " g   ·   " + t("Carbs") + " " + fmt(tot.carbs_g) + " g   ·   " + t("Fat") + " " + fmt(tot.fat_g) + " g", 540, 840);
    if (score >= 1 && score <= 10) { g.fillStyle = "#F0B429"; g.font = "700 46px " + font; g.fillText(t("Balance score") + " " + score + "/10", 540, 915); }
    g.fillStyle = "#97A4AB"; g.font = "36px " + font; g.fillText("Thali Lens  ·  " + location.host, 540, 1010);
    c.toBlob(function (blob) {
      if (!blob) return;
      var file2 = null;
      try { file2 = new File([blob], "thali-lens.png", { type: "image/png" }); } catch (x) {}
      if (file2 && navigator.canShare && navigator.canShare({ files: [file2] })) {
        navigator.share({ files: [file2], text: meal + " · " + location.origin + "/" }).catch(function () {});
      } else {
        var link = document.createElement("a");
        link.href = URL.createObjectURL(blob); link.download = "thali-lens.png";
        document.body.appendChild(link); link.click(); link.remove();
        setStatus("Image saved. Share it from your downloads or gallery.");
      }
    }, "image/png");
  }

  function setFile(f) {
    if (!f || !/^image\//.test(f.type)) { setStatus("Please choose an image file.", "err"); return; }
    file = f;
    if (url) URL.revokeObjectURL(url);
    url = URL.createObjectURL(f);
    var d = $("drop"), old = d.querySelector("img");
    if (old) old.remove();
    var img = h("img"); img.src = url; img.alt = t("Your food photo");
    d.appendChild(img); d.classList.add("has");
    sync();
    setStatus("Photo ready. Press Analyse.");
  }

  // Shrink the photo in the browser so uploads are small and fast.
  function shrink(f) {
    return new Promise(function (resolve, reject) {
      var img = new Image();
      img.onload = function () {
        var max = 1280, s = Math.min(1, max / Math.max(img.width, img.height));
        var c = document.createElement("canvas");
        c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        resolve(c.toDataURL("image/jpeg", 0.82).split(",")[1]);
      };
      img.onerror = function () { reject(new Error("unreadable")); };
      img.src = URL.createObjectURL(f);
    });
  }

  function analyse() {
    var name = dishName();
    if ((!file && !name) || busy) return;
    busy = true; $("go").disabled = true; $("result").classList.add("dim");
    setStatus("Working out the nutrition. This can take up to a minute.", "busy");
    var token = null;
    authToken().then(function (t) { token = t; return file ? shrink(file) : null; }).then(function (b64) {
      var body = { name: name, lang: resLang(), focus: ($("focus") && $("focus").value) || "" };
      if (b64) { body.image = b64; body.mediaType = "image/jpeg"; }
      var headers = { "Content-Type": "application/json" };
      if (token) headers.Authorization = "Bearer " + token;
      return fetch("/api/analyze", { method: "POST", headers: headers, body: JSON.stringify(body) });
    }).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (out) { return { ok: res.ok, status: res.status, out: out }; });
    }).then(function (r) {
      if (!r.ok) {
        setStatus(r.out.error || "The analysis failed. Please try again.", "err");
      } else if (r.out.is_food === false || !Array.isArray(r.out.items) || !r.out.items.length) {
        setStatus(t("No food found") + (r.out.reason ? " (" + String(r.out.reason) + ")" : "") + t(". Try another photo or name."), "err");
      } else {
        data = r.out; isExample = false; mult = 1; qty = []; oil = 1; answer = null; render();
        setStatus("Done. Adjust the portion if you ate more or less.");
      }
    }).catch(function (e) {
      if (e && e.message === "login") {
        try { sessionStorage.setItem("dish", name); } catch (x) {}
        setStatus("Please sign in first. Opening the sign-in page.");
        location.href = "/login.html";
        return;
      }
      setStatus(e && e.message === "unreadable" ? "That file could not be read. Use a JPG or PNG photo." : "Could not reach the server. Check your internet and try again.", "err");
    }).then(function () { busy = false; sync(); $("result").classList.remove("dim"); });
  }

  function render() {
    var r = $("result"); r.textContent = "";
    // Each item has its own quantity (for second helpings) and the plate has an oil level,
    // because a photo cannot show refills or how much fat went into the pan.
    var items = data.items.map(function (it, i) {
      var q = qty[i] == null ? 1 : qty[i];
      var f0 = num(it.fat_g), f1 = f0 * oil, c0 = num(it.calories), c1 = Math.max(0, c0 + (f1 - f0) * 9);
      return { name: String(it.name || "Item"), hi: String(it.name_hindi || ""), portion: String(it.portion || ""), grams: num(it.grams) * q,
        ing: Array.isArray(it.ingredients) ? it.ingredients.map(String) : [],
        cal: c1 * q, p: num(it.protein_g) * q, c: num(it.carbs_g) * q, f: f1 * q, q: q, base: c0 };
    });
    var sum = function (k) { return items.reduce(function (a, it) { return a + it[k]; }, 0); };
    var totals = data.total || {};
    var tot = { calories: sum("cal"), protein_g: sum("p"), carbs_g: sum("c"), fat_g: sum("f") };
    ["saturated_fat_g", "fiber_g", "sugar_g", "sodium_mg", "cholesterol_mg", "calcium_mg", "iron_mg"].forEach(function (k) { tot[k] = num(totals[k]); });
    var baseCal = items.reduce(function (a, it) { return a + it.base; }, 0), scale = baseCal ? tot.calories / baseCal : 1;
    ["saturated_fat_g", "fiber_g", "sugar_g", "sodium_mg", "cholesterol_mg", "calcium_mg", "iron_mg"].forEach(function (k) { tot[k] *= scale; });

    if (isExample) r.appendChild(h("div", "example", "Example. Your own result appears here."));

    var head = h("div", "head");
    var eC = tot.carbs_g * 4, eP = tot.protein_g * 4, eF = tot.fat_g * 9, eT = eC + eP + eF || 1;
    var a = eC / eT * 100, b = a + eP / eT * 100;
    var ring = h("div", "ring");
    ring.style.background = "conic-gradient(var(--carb) 0 " + a + "%, var(--prot) " + a + "% " + b + "%, var(--fat) " + b + "% 100%)";
    var inn = h("div", "in"); inn.appendChild(h("b", "", fmt(tot.calories))); inn.appendChild(h("span", "", "kcal"));
    ring.appendChild(inn);
    var title = h("div", "title");
    title.appendChild(h("h2", "", String(data.meal_name || "Your meal")));
    if (data.meal_name_hindi && LANG !== "hi" && data.meal_name_hindi !== data.meal_name) { var hi = h("div", "hi", String(data.meal_name_hindi)); hi.lang = "hi"; title.appendChild(hi); }
    var tags = h("div", "tags");
    var diet = String(data.diet || "").toLowerCase();
    if (diet) {
      var isVeg = diet === "veg" || diet === "vegan";
      var d = h("span", "diet " + (isVeg ? "veg" : "non"));
      d.appendChild(h("i"));
      d.appendChild(document.createTextNode(t(diet === "veg" ? "Vegetarian" : diet === "vegan" ? "Vegan" : diet === "egg" ? "Contains egg" : "Non-vegetarian")));
      tags.appendChild(d);
    }
    if (!isExample && data.confidence) tags.appendChild(h("span", "pill", String(data.confidence) + t(" confidence")));
    tags.appendChild(h("span", "pill", fmt(tot.calories / REF.calories * 100) + t("% of a 2,000 kcal day")));
    title.appendChild(tags);
    var lg = h("div", "legend");
    [["Carbs", tot.carbs_g, "--carb"], ["Protein", tot.protein_g, "--prot"], ["Fat", tot.fat_g, "--fat"]].forEach(function (x) {
      var s = h("span", "", t(x[0]) + " " + fmt(x[1]) + " g"); s.style.setProperty("--c", "var(" + x[2] + ")"); lg.appendChild(s);
    });
    title.appendChild(lg);
    head.appendChild(ring); head.appendChild(title); r.appendChild(head);

    var score = Math.round(num(data.score));
    if (score >= 1 && score <= 10) {
      var sl0 = h("div", "scoreline"); sl0.appendChild(h("b", "", score + "/10"));
      var sw = h("div"); sw.appendChild(h("div", "label", "Balance score"));
      if (data.score_reason) sw.appendChild(h("div", "", String(data.score_reason)));
      sl0.appendChild(sw); r.appendChild(sl0);
    }
    if (data.focus_note) r.appendChild(h("div", "focusnote", String(data.focus_note)));

    var sc = h("div", "scale");
    sc.appendChild(h("span", "label", "How much did you eat"));
    var seg = h("div", "seg");
    [[0.5, "Half"], [1, "As shown"], [1.5, "1.5×"], [2, "Double"]].forEach(function (x) {
      var bt = h("button", "", x[1]); bt.type = "button"; bt.setAttribute("aria-pressed", String(x[0] === mult));
      bt.onclick = function () { mult = x[0]; render(); };
      seg.appendChild(bt);
    });
    sc.appendChild(seg); r.appendChild(sc);

    var oc = h("div", "scale");
    oc.appendChild(h("span", "label", "Oil or ghee used"));
    var oseg = h("div", "seg");
    [[0.7, "Less"], [1, "Normal"], [1.4, "Extra"]].forEach(function (x) {
      var bt = h("button", "", x[1]); bt.type = "button"; bt.setAttribute("aria-pressed", String(x[0] === oil));
      bt.onclick = function () { oil = x[0]; render(); };
      oseg.appendChild(bt);
    });
    oc.appendChild(oseg); r.appendChild(oc);

    var sec = h("div", "items");
    sec.appendChild(h("div", "label", "On the plate and what is in it"));
    items.forEach(function (it, i) {
      var row = h("div", "item" + (it.q === 0 ? " off" : ""));
      var h3 = h("h3", "", it.name);
      if (it.hi && LANG !== "hi" && it.hi !== it.name) { var em = h("em", "", it.hi); em.lang = "hi"; h3.appendChild(em); }
      var por = [it.portion, it.grams ? t("about ") + fmt(it.grams) + " g" : ""].filter(Boolean).join(" · ");
      row.appendChild(h3); row.appendChild(h("div", "kcal", fmt(it.cal) + " kcal"));
      row.appendChild(h("div", "portion", mult === 1 ? por : por + " × " + mult));
      row.appendChild(h("div", "macro", "P " + fmt(it.p) + " · C " + fmt(it.c) + " · F " + fmt(it.f) + " g"));
      var st = h("div", "qty"); st.setAttribute("role", "group"); st.setAttribute("aria-label", t("Change how much of this item you ate"));
      var minus = h("button", "", "−"), plus = h("button", "", "+");
      minus.type = plus.type = "button"; minus.setAttribute("aria-label", "less"); plus.setAttribute("aria-label", "more");
      minus.disabled = it.q <= 0; plus.disabled = it.q >= 5;
      minus.onclick = function () { qty[i] = Math.max(0, it.q - 0.5); render(); };
      plus.onclick = function () { qty[i] = Math.min(5, it.q + 0.5); render(); };
      st.appendChild(minus); st.appendChild(h("span", "", it.q === 0 ? "Not eaten" : it.q + "×")); st.appendChild(plus);
      row.appendChild(st);
      if (it.ing.length) { var ch = h("div", "chips"); it.ing.forEach(function (x) { ch.appendChild(h("span", "", x)); }); row.appendChild(ch); }
      sec.appendChild(row);
    });
    r.appendChild(sec);

    var nut = h("div", "nut");
    nut.appendChild(h("div", "label", "Full nutrition, with share of an approximate daily reference"));
    [["Energy", "calories", "kcal"], ["Protein", "protein_g", "g", "--prot"], ["Carbohydrate", "carbs_g", "g", "--carb"],
     ["Fibre", "fiber_g", "g", "", 1], ["Sugar", "sugar_g", "g", "", 1], ["Fat", "fat_g", "g", "--fat"],
     ["Saturated fat", "saturated_fat_g", "g", "", 1], ["Cholesterol", "cholesterol_mg", "mg"],
     ["Sodium", "sodium_mg", "mg"], ["Calcium", "calcium_mg", "mg"], ["Iron", "iron_mg", "mg"]].forEach(function (x) {
      var pct = tot[x[1]] * mult / REF[x[1]] * 100;
      var row = h("div", "row" + (x[4] ? " sub" : ""));
      var bar = h("div", "rbar"), fill = h("i"); fill.style.width = Math.min(100, pct) + "%";
      if (x[3]) fill.style.setProperty("--c", "var(" + x[3] + ")");
      bar.appendChild(fill);
      row.appendChild(h("div", "n", x[0])); row.appendChild(h("div", "v", fmt(tot[x[1]]) + " " + x[2]));
      row.appendChild(bar); row.appendChild(h("div", "p", Math.round(pct) + "%"));
      nut.appendChild(row);
    });
    r.appendChild(nut);

    var al = Array.isArray(data.allergens) ? data.allergens.map(String).filter(Boolean) : [];
    if (al.length) r.appendChild(h("div", "allergy", t("May contain: ") + al.join(", ")));
    var notes = Array.isArray(data.notes) ? data.notes.map(String).filter(Boolean) : [];
    if (notes.length) {
      var box = h("div"); box.appendChild(h("div", "label", "Notes"));
      var ul = h("ul", "notes"); notes.forEach(function (n) { ul.appendChild(h("li", "", n)); }); box.appendChild(ul); r.appendChild(box);
    }

    var swaps = Array.isArray(data.swaps) ? data.swaps.filter(function (s) { return s && s.instead_of && s.try; }).slice(0, 3) : [];
    if (swaps.length) {
      var sb = h("div"); sb.appendChild(h("div", "label", "Lighter swaps"));
      var sl = h("ul", "notes");
      swaps.forEach(function (s) {
        var k = Math.round(num(s.saves_kcal));
        sl.appendChild(h("li", "", LANG === "hi"
          ? String(s.instead_of) + " की जगह " + String(s.try) + (k ? "। लगभग " + k + " kcal कम।" : "।")
          : "Instead of " + String(s.instead_of) + ", try " + String(s.try) + "." + (k ? " Saves about " + k + " kcal." : "")));
      });
      sb.appendChild(sl); r.appendChild(sb);
    }

    if (!isExample) {
      var meal = String(data.meal_name || t("My meal"));
      // The shared link opens the site with this dish already typed in.
      var link = location.origin + (LANG === "hi" ? "/hi/" : "/") + "?q=" + encodeURIComponent(meal);
      var text = LANG === "hi"
        ? meal + ": लगभग " + fmt(tot.calories) + " kcal (प्रोटीन " + fmt(tot.protein_g) + " g, कार्ब्स " + fmt(tot.carbs_g) + " g, फैट " + fmt(tot.fat_g) + " g)। Thali Lens से अपना खाना जाँचें: " + link
        : meal + ": about " + fmt(tot.calories) + " kcal (protein " + fmt(tot.protein_g) + " g, carbs " + fmt(tot.carbs_g) + " g, fat " + fmt(tot.fat_g) + " g). Check your own food with Thali Lens: " + link;
      var act = h("div", "actions");
      var add = h("button", "", "Add to today's log"); add.type = "button";
      add.onclick = function () {
        var l = readLog();
        l.e.push({ n: meal, k: tot.calories * mult, p: tot.protein_g * mult });
        saveLog(l); renderLog();
        add.textContent = t("Added"); add.disabled = true;
      };
      var wa = h("a", "wa", "Share on WhatsApp");
      wa.href = "https://wa.me/?text=" + encodeURIComponent(text); wa.target = "_blank"; wa.rel = "noopener";
      var cp = h("button", "", "Copy result"); cp.type = "button";
      cp.onclick = function () {
        var ok = function () { cp.textContent = t("Copied"); };
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(ok, function () { setStatus(text); });
        else setStatus(text);
      };
      var si = h("button", "", "Share image"); si.type = "button";
      si.onclick = function () { shareImage(meal, { calories: tot.calories, protein_g: tot.protein_g, carbs_g: tot.carbs_g, fat_g: tot.fat_g }, score); };
      act.appendChild(add); act.appendChild(wa); act.appendChild(si); act.appendChild(cp);
      r.appendChild(act);

      // Follow-up question about this meal.
      var af = h("form", "ask");
      var aLabel = h("label", "label", "Ask about this meal"); aLabel.htmlFor = "askq";
      var ai = h("input"); ai.id = "askq"; ai.type = "text"; ai.maxLength = 300; ai.autocomplete = "off"; ai.placeholder = t("e.g. Is this fine for dinner?");
      var ab = h("button", "", "Ask"); ab.type = "submit";
      var arow = h("span", "with-btn"); arow.appendChild(ai); arow.appendChild(ab);
      var ans = h("p", "answer"); ans.textContent = answer || ""; ans.hidden = !answer; ans.setAttribute("role", "status");
      af.appendChild(aLabel); af.appendChild(arow); af.appendChild(ans);
      af.onsubmit = function (ev) {
        ev.preventDefault();
        var qn = ai.value.trim();
        if (!qn) return;
        ab.disabled = true; ans.hidden = false; ans.textContent = t("Thinking.");
        var summary = meal + ". " + items.filter(function (it) { return it.q > 0; }).map(function (it) {
          return it.name + (it.portion ? " (" + it.portion + (it.q !== 1 ? " x " + it.q : "") + ")" : "") + ": " + fmt(it.cal) + " kcal";
        }).join("; ") + ". Total: " + fmt(tot.calories) + " kcal, protein " + fmt(tot.protein_g) + " g, carbohydrate " + fmt(tot.carbs_g) + " g, fat " + fmt(tot.fat_g) +
          " g, fibre " + fmt(tot.fiber_g) + " g, sugar " + fmt(tot.sugar_g) + " g, sodium " + fmt(tot.sodium_mg) + " mg.";
        postJSON({ mode: "ask", question: qn, meal: summary, lang: resLang() }).then(function (out) {
          answer = out && out.answer ? String(out.answer) : t("Could not get an answer. Please try again.");
          ans.textContent = answer;
        }).catch(function (e) {
          ans.textContent = e && e.message && e.message !== "login" && e.message !== "failed" ? t(e.message) : t("Could not get an answer. Please try again.");
        }).then(function () { ab.disabled = false; });
      };
      r.appendChild(af);
    }
  }

  // Today's log, daily goal and a 7-day history. Everything stays in this browser.
  function dayKey(d) { return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate(); }
  function today() { return dayKey(new Date()); }
  function readDays() {
    try { var m = JSON.parse(localStorage.getItem("thali-days") || "null"); if (m && typeof m === "object") return m; } catch (x) {}
    try { var o = JSON.parse(localStorage.getItem("thali-log") || "null"); if (o && o.d && Array.isArray(o.e)) { var first = {}; first[o.d] = o.e; return first; } } catch (x) {}
    return {};
  }
  function readLog() { var m = readDays(); return { d: today(), e: Array.isArray(m[today()]) ? m[today()] : [] }; }
  function saveLog(l) {
    var m = readDays(), keep = {};
    m[l.d] = l.e;
    for (var i = 0; i < 14; i++) { var k = dayKey(new Date(Date.now() - i * 864e5)); if (Array.isArray(m[k]) && m[k].length) keep[k] = m[k]; }
    try { localStorage.setItem("thali-days", JSON.stringify(keep)); } catch (x) {}
  }
  function readGoal() { try { var g = JSON.parse(localStorage.getItem("thali-goal") || "null"); if (g && g.k > 0) return g; } catch (x) {} return null; }
  function progress(label, value, goal, unit) {
    var d = h("div", "kvbar"), top = h("div", "kv2"), left = goal - value;
    top.appendChild(h("span", "", label));
    top.appendChild(h("b", "", Math.round(value) + " / " + Math.round(goal) + " " + unit));
    var bar = h("div", "rbar"), fill = h("i"); fill.style.width = Math.min(100, value / goal * 100) + "%";
    fill.style.setProperty("--c", left < 0 ? "var(--fat)" : "var(--prot)"); bar.appendChild(fill);
    d.appendChild(top); d.appendChild(bar);
    d.appendChild(h("div", "fine", Math.round(Math.abs(left)) + " " + unit + t(left < 0 ? " over" : " left")));
    return d;
  }
  function renderLog() {
    var box = $("log");
    if (!box) return;
    var l = readLog(), goal = readGoal(), days = readDays(), k = 0, p = 0;
    box.textContent = ""; box.hidden = false;
    box.appendChild(h("h2", "", "Today"));
    l.e.forEach(function (e) { k += num(e.k); p += num(e.p); });
    if (goal) { box.appendChild(progress("Calories", k, goal.k, "kcal")); if (goal.p > 0) box.appendChild(progress("Protein", p, goal.p, "g")); }
    if (l.e.length) {
      var ul = h("ul");
      l.e.forEach(function (e) { var li = h("li"); li.appendChild(h("span", "", String(e.n))); li.appendChild(h("span", "", Math.round(e.k) + " kcal")); ul.appendChild(li); });
      var li = h("li", "sum"); li.appendChild(h("span", "", t("Total so far, protein ") + Math.round(p) + " g")); li.appendChild(h("span", "", Math.round(k) + " kcal")); ul.appendChild(li);
      box.appendChild(ul);
    } else {
      box.appendChild(h("p", "fine", "Nothing logged yet. Analyse a meal and press Add to today's log."));
    }

    var week = [], most = goal ? goal.k : 0, withData = 0, sum = 0;
    for (var i = 6; i >= 0; i--) {
      var dt = new Date(Date.now() - i * 864e5), list = days[dayKey(dt)], v = 0;
      if (Array.isArray(list)) list.forEach(function (e) { v += num(e.k); });
      week.push({ v: v, day: dt.getDate() }); most = Math.max(most, v);
      if (v > 0) { withData++; sum += v; }
    }
    if (withData >= 2) {
      box.appendChild(h("div", "label", "Last 7 days"));
      var wk = h("div", "week"); wk.setAttribute("role", "img"); wk.setAttribute("aria-label", t("Last 7 days"));
      week.forEach(function (w) {
        var col = h("div", "col"), b = h("i"); b.style.height = (most ? Math.max(w.v ? 4 : 0, w.v / most * 100) : 0) + "%";
        if (goal && w.v > goal.k) b.style.background = "var(--fat)";
        var hold = h("div", "hold"); hold.appendChild(b);
        col.appendChild(h("small", "", w.v ? String(Math.round(w.v)) : "")); col.appendChild(hold); col.appendChild(h("span", "", String(w.day)));
        wk.appendChild(col);
      });
      box.appendChild(wk);
    }

    var det = h("details", "goal"); det.appendChild(h("summary", "", goal ? "Change goal" : "Daily goal"));
    var gf = h("form"), gk = h("input"), gp = h("input"), gs = h("button", "", "Save goal");
    gk.type = gp.type = "number"; gk.id = "goalk"; gp.id = "goalp"; gk.min = "800"; gk.max = "6000"; gp.min = "0"; gp.max = "400";
    gk.placeholder = "2000"; gp.placeholder = "60"; if (goal) { gk.value = goal.k; gp.value = goal.p || ""; }
    var lk = h("label", "", "Calories (kcal)"); lk.htmlFor = "goalk"; lk.appendChild(gk);
    var lp = h("label", "", "Protein (g)"); lp.htmlFor = "goalp"; lp.appendChild(gp);
    gs.type = "submit"; gf.appendChild(lk); gf.appendChild(lp); gf.appendChild(gs);
    gf.onsubmit = function (ev) {
      ev.preventDefault();
      var kk = Number(gk.value), pp = Number(gp.value) || 0;
      if (!(kk >= 800 && kk <= 6000)) { gk.focus(); return; }
      try { localStorage.setItem("thali-goal", JSON.stringify({ k: Math.round(kk), p: Math.min(400, Math.max(0, Math.round(pp))) })); } catch (x) {}
      renderLog();
    };
    det.appendChild(gf);
    var cl = h("a", "", "Not sure of your number? Use the daily calorie calculator."); cl.href = "/calorie-calculator.html"; det.appendChild(cl);
    if (!goal && !l.e.length) det.open = true;
    box.appendChild(det);

    var row = h("div", "actions");
    if (withData >= 2) {
      var ws = h("a", "wa", "Share my week");
      var wtext = LANG === "hi"
        ? "Thali Lens पर मेरा हफ़्ता: " + withData + " दिन, औसत " + Math.round(sum / withData) + " kcal रोज़। " + location.origin + "/hi/"
        : "My week on Thali Lens: " + withData + " days logged, average " + Math.round(sum / withData) + " kcal a day. " + location.origin + "/";
      ws.href = "https://wa.me/?text=" + encodeURIComponent(wtext); ws.target = "_blank"; ws.rel = "noopener"; row.appendChild(ws);
    }
    if (l.e.length) {
      var clr = h("button", "", "Clear today's log"); clr.type = "button";
      clr.onclick = function () { saveLog({ d: today(), e: [] }); renderLog(); };
      row.appendChild(clr);
    }
    if (row.children.length) box.appendChild(row);
    box.appendChild(h("p", "fine", "Saved only on this device. The last 14 days are kept."));
  }

  // Camera: live preview where the browser allows it, otherwise the phone's own camera app.
  function stopCam() { if (stream) { stream.getTracks().forEach(function (t) { t.stop(); }); stream = null; } }
  function openCam() {
    var dlg = $("camdlg");
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !dlg.showModal) { $("capture").click(); return; }
    navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } }, audio: false }).then(function (s) {
      stream = s; $("video").srcObject = s; dlg.showModal();
    }).catch(function () { $("capture").click(); });
  }
  function snap() {
    var v = $("video");
    if (!v.videoWidth) return;
    var c = document.createElement("canvas"); c.width = v.videoWidth; c.height = v.videoHeight;
    c.getContext("2d").drawImage(v, 0, 0);
    c.toBlob(function (blob) {
      if (blob) setFile(new File([blob], "camera.jpg", { type: "image/jpeg" }));
      $("camdlg").close();
    }, "image/jpeg", 0.9);
  }

  var drop = $("drop"), input = $("file"), cap = $("capture");
  var pick = function () { input.click(); };
  drop.onclick = pick; $("pick").onclick = pick;
  drop.onkeydown = function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(); } };
  input.onchange = function () { if (input.files[0]) setFile(input.files[0]); input.value = ""; };
  cap.onchange = function () { if (cap.files[0]) setFile(cap.files[0]); cap.value = ""; };
  ["dragenter", "dragover"].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add("over"); }); });
  ["dragleave", "drop"].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove("over"); }); });
  drop.addEventListener("drop", function (e) { var f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]; if (f) setFile(f); });
  window.addEventListener("dragover", function (e) { e.preventDefault(); });
  window.addEventListener("drop", function (e) { e.preventDefault(); });
  window.addEventListener("paste", function (e) {
    var fs = (e.clipboardData && e.clipboardData.files) || [];
    for (var i = 0; i < fs.length; i++) if (/^image\//.test(fs[i].type)) { setFile(fs[i]); break; }
  });
  $("go").onclick = analyse;
  $("dish").oninput = sync;
  $("try").onclick = function (e) { if (e.target.tagName === "BUTTON") { $("dish").value = e.target.textContent; sync(); $("dish").focus(); } };
  try { var q = new URLSearchParams(location.search).get("q"); if (q) { $("dish").value = q.slice(0, 200); sync(); } } catch (x) {}
  try { var saved = sessionStorage.getItem("dish"); if (saved) { $("dish").value = saved; sessionStorage.removeItem("dish"); sync(); } } catch (x) {}
  $("dish").onkeydown = function (e) { if (e.key === "Enter" && !$("go").disabled) analyse(); };
  $("cam").onclick = openCam;
  $("snap").onclick = snap;
  $("camclose").onclick = function () { $("camdlg").close(); };
  $("camdlg").addEventListener("close", stopCam);
  var focusSel = $("focus");
  if (focusSel) {
    try { var savedFocus = localStorage.getItem("thali-focus"); if (savedFocus && focusSel.querySelector('option[value="' + savedFocus + '"]')) focusSel.value = savedFocus; } catch (x) {}
    focusSel.onchange = function () { try { localStorage.setItem("thali-focus", focusSel.value); } catch (x) {} };
  }

  // Result language: the AI writes dish names, ingredients and notes in the chosen language.
  var langSel = $("lang");
  if (langSel) {
    try { var savedLang = localStorage.getItem("thali-lang"); if (savedLang && langSel.querySelector('option[value="' + savedLang + '"]')) langSel.value = savedLang; } catch (x) {}
    langSel.onchange = function () { try { localStorage.setItem("thali-lang", langSel.value); } catch (x) {} };
  }

  // Voice: say what you ate. Works in browsers that have speech recognition (Chrome, Edge, most Android phones).
  var Rec = window.SpeechRecognition || window.webkitSpeechRecognition, mic = $("mic");
  if (Rec && mic) {
    mic.hidden = false;
    var SPEECH = { en: "en-IN", hi: "hi-IN", mr: "mr-IN", gu: "gu-IN", bn: "bn-IN", ta: "ta-IN", te: "te-IN", kn: "kn-IN", ml: "ml-IN", pa: "pa-IN" };
    mic.onclick = function () {
      var rec;
      try { rec = new Rec(); } catch (x) { mic.hidden = true; return; }
      rec.lang = SPEECH[resLang()] || "en-IN"; rec.interimResults = false; rec.maxAlternatives = 1;
      mic.disabled = true; setStatus("Listening. Say what you ate.", "busy");
      rec.onresult = function (e) {
        var said = e.results && e.results[0] && e.results[0][0] ? e.results[0][0].transcript : "";
        if (said) { $("dish").value = said.slice(0, 200); sync(); setStatus("Heard you. Press Analyse."); }
      };
      rec.onerror = function (e) {
        setStatus(e && (e.error === "not-allowed" || e.error === "service-not-allowed") ? "Microphone permission was not given. Type the name instead." : "Could not hear you. Try again or type the name.", "err");
      };
      rec.onend = function () { mic.disabled = false; if ($("status").className.indexOf("busy") >= 0) setStatus("Could not hear you. Try again or type the name.", "err"); };
      try { rec.start(); } catch (x) { mic.disabled = false; }
    };
  }

  render();
  renderLog();
})();
