(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var h = function (tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };

  // Shown until the first real analysis, clearly marked as an example.
  var EXAMPLE = {
    meal_name: "North Indian veg thali", meal_name_hindi: "शाकाहारी थाली", diet: "veg",
    items: [
      { name: "Phulka roti", name_hindi: "फुलका", portion: "2 medium", grams: 60, ingredients: ["whole wheat atta", "water", "salt"], calories: 150, protein_g: 5, carbs_g: 30, fat_g: 1 },
      { name: "Dal tadka", name_hindi: "दाल तड़का", portion: "1 katori", grams: 150, ingredients: ["toor dal", "tomato", "onion", "garlic", "ghee", "cumin", "turmeric", "red chilli"], calories: 180, protein_g: 9, carbs_g: 22, fat_g: 6 },
      { name: "Jeera rice", name_hindi: "जीरा राइस", portion: "1 katori", grams: 150, ingredients: ["basmati rice", "cumin", "oil", "salt"], calories: 210, protein_g: 4, carbs_g: 40, fat_g: 4 },
      { name: "Aloo gobi", name_hindi: "आलू गोभी", portion: "1 katori", grams: 120, ingredients: ["potato", "cauliflower", "onion", "tomato", "oil", "turmeric", "coriander"], calories: 140, protein_g: 3, carbs_g: 15, fat_g: 8 }
    ],
    total: { saturated_fat_g: 5, fiber_g: 13, sugar_g: 6, sodium_mg: 980, cholesterol_mg: 10, calcium_mg: 140, iron_mg: 6 },
    allergens: ["gluten (wheat)", "milk (ghee)"],
    notes: ["Good fibre from dal, atta and vegetables.", "Sodium is about half a day's limit in one meal.", "Add curd or paneer to raise protein."]
  };
  // Approximate daily reference for an adult on about 2,000 kcal.
  var REF = { calories: 2000, protein_g: 54, carbs_g: 300, fat_g: 67, saturated_fat_g: 22, fiber_g: 30, sugar_g: 50, sodium_mg: 2000, cholesterol_mg: 300, calcium_mg: 1000, iron_mg: 19 };

  var file = null, url = null, data = EXAMPLE, isExample = true, mult = 1, busy = false, stream = null;
  var num = function (x) { var n = Number(x); return isFinite(n) && n > 0 ? n : 0; };
  var fmt = function (x) { var v = x * mult; return v < 10 ? String(Math.round(v * 10) / 10) : String(Math.round(v)); };
  function setStatus(text, kind) { var s = $("status"); s.textContent = text || ""; s.className = "status" + (kind ? " " + kind : ""); }

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

  function setFile(f) {
    if (!f || !/^image\//.test(f.type)) { setStatus("Please choose an image file.", "err"); return; }
    file = f;
    if (url) URL.revokeObjectURL(url);
    url = URL.createObjectURL(f);
    var d = $("drop"), old = d.querySelector("img");
    if (old) old.remove();
    var img = h("img"); img.src = url; img.alt = "Your food photo";
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
      var body = { name: name };
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
        setStatus("No food found" + (r.out.reason ? " (" + String(r.out.reason) + ")" : "") + ". Try another photo or name.", "err");
      } else {
        data = r.out; isExample = false; mult = 1; render();
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
    var items = data.items.map(function (it) {
      return { name: String(it.name || "Item"), hi: String(it.name_hindi || ""), portion: String(it.portion || ""), grams: num(it.grams),
        ing: Array.isArray(it.ingredients) ? it.ingredients.map(String) : [],
        cal: num(it.calories), p: num(it.protein_g), c: num(it.carbs_g), f: num(it.fat_g) };
    });
    var sum = function (k) { return items.reduce(function (a, it) { return a + it[k]; }, 0); };
    var t = data.total || {};
    var tot = { calories: sum("cal"), protein_g: sum("p"), carbs_g: sum("c"), fat_g: sum("f") };
    ["saturated_fat_g", "fiber_g", "sugar_g", "sodium_mg", "cholesterol_mg", "calcium_mg", "iron_mg"].forEach(function (k) { tot[k] = num(t[k]); });

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
    if (data.meal_name_hindi) { var hi = h("div", "hi", String(data.meal_name_hindi)); hi.lang = "hi"; title.appendChild(hi); }
    var tags = h("div", "tags");
    var diet = String(data.diet || "").toLowerCase();
    if (diet) {
      var isVeg = diet === "veg" || diet === "vegan";
      var d = h("span", "diet " + (isVeg ? "veg" : "non"));
      d.appendChild(h("i"));
      d.appendChild(document.createTextNode(diet === "veg" ? "Vegetarian" : diet === "vegan" ? "Vegan" : diet === "egg" ? "Contains egg" : "Non-vegetarian"));
      tags.appendChild(d);
    }
    if (!isExample && data.confidence) tags.appendChild(h("span", "pill", String(data.confidence) + " confidence"));
    tags.appendChild(h("span", "pill", fmt(tot.calories / REF.calories * 100) + "% of a 2,000 kcal day"));
    title.appendChild(tags);
    var lg = h("div", "legend");
    [["Carbs", tot.carbs_g, "--carb"], ["Protein", tot.protein_g, "--prot"], ["Fat", tot.fat_g, "--fat"]].forEach(function (x) {
      var s = h("span", "", x[0] + " " + fmt(x[1]) + " g"); s.style.setProperty("--c", "var(" + x[2] + ")"); lg.appendChild(s);
    });
    title.appendChild(lg);
    head.appendChild(ring); head.appendChild(title); r.appendChild(head);

    var sc = h("div", "scale");
    sc.appendChild(h("span", "label", "How much did you eat"));
    var seg = h("div", "seg");
    [[0.5, "Half"], [1, "As shown"], [1.5, "1.5×"], [2, "Double"]].forEach(function (x) {
      var bt = h("button", "", x[1]); bt.type = "button"; bt.setAttribute("aria-pressed", String(x[0] === mult));
      bt.onclick = function () { mult = x[0]; render(); };
      seg.appendChild(bt);
    });
    sc.appendChild(seg); r.appendChild(sc);

    var sec = h("div", "items");
    sec.appendChild(h("div", "label", "On the plate and what is in it"));
    items.forEach(function (it) {
      var row = h("div", "item");
      var h3 = h("h3", "", it.name);
      if (it.hi) { var em = h("em", "", it.hi); em.lang = "hi"; h3.appendChild(em); }
      var por = [it.portion, it.grams ? "about " + fmt(it.grams) + " g" : ""].filter(Boolean).join(" · ");
      row.appendChild(h3); row.appendChild(h("div", "kcal", fmt(it.cal) + " kcal"));
      row.appendChild(h("div", "portion", mult === 1 ? por : por + " × " + mult));
      row.appendChild(h("div", "macro", "P " + fmt(it.p) + " · C " + fmt(it.c) + " · F " + fmt(it.f) + " g"));
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
    if (al.length) r.appendChild(h("div", "allergy", "May contain: " + al.join(", ")));
    var notes = Array.isArray(data.notes) ? data.notes.map(String).filter(Boolean) : [];
    if (notes.length) {
      var box = h("div"); box.appendChild(h("div", "label", "Notes"));
      var ul = h("ul", "notes"); notes.forEach(function (n) { ul.appendChild(h("li", "", n)); }); box.appendChild(ul); r.appendChild(box);
    }

    if (!isExample) {
      var meal = String(data.meal_name || "My meal");
      var text = meal + ": about " + fmt(tot.calories) + " kcal (protein " + fmt(tot.protein_g) + " g, carbs " + fmt(tot.carbs_g) + " g, fat " + fmt(tot.fat_g) +
        " g). Estimated with Thali Lens " + location.origin + "/";
      var act = h("div", "actions");
      var add = h("button", "", "Add to today's log"); add.type = "button";
      add.onclick = function () {
        var l = readLog();
        l.e.push({ n: meal, k: tot.calories * mult, p: tot.protein_g * mult });
        saveLog(l); renderLog();
        add.textContent = "Added"; add.disabled = true;
      };
      var wa = h("a", "wa", "Share on WhatsApp");
      wa.href = "https://wa.me/?text=" + encodeURIComponent(text); wa.target = "_blank"; wa.rel = "noopener";
      var cp = h("button", "", "Copy result"); cp.type = "button";
      cp.onclick = function () {
        var ok = function () { cp.textContent = "Copied"; };
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(ok, function () { setStatus(text); });
        else setStatus(text);
      };
      act.appendChild(add); act.appendChild(wa); act.appendChild(cp);
      r.appendChild(act);
    }
  }

  // Daily log, kept only in this browser.
  function today() { var d = new Date(); return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate(); }
  function readLog() {
    try { var l = JSON.parse(localStorage.getItem("thali-log") || "null"); if (l && l.d === today() && Array.isArray(l.e)) return l; } catch (x) {}
    return { d: today(), e: [] };
  }
  function saveLog(l) { try { localStorage.setItem("thali-log", JSON.stringify(l)); } catch (x) {} }
  function renderLog() {
    var box = $("log"), l = readLog();
    box.textContent = "";
    box.hidden = !l.e.length;
    if (!l.e.length) return;
    box.appendChild(h("h2", "", "Today's log"));
    var ul = h("ul"), k = 0, p = 0;
    l.e.forEach(function (e) {
      var li = h("li"); li.appendChild(h("span", "", String(e.n))); li.appendChild(h("span", "", Math.round(e.k) + " kcal")); ul.appendChild(li);
      k += num(e.k); p += num(e.p);
    });
    var li = h("li", "sum"); li.appendChild(h("span", "", "Total so far, protein " + Math.round(p) + " g")); li.appendChild(h("span", "", Math.round(k) + " kcal")); ul.appendChild(li);
    box.appendChild(ul);
    var clr = h("button", "quiet", "Clear today's log"); clr.type = "button";
    clr.onclick = function () { saveLog({ d: today(), e: [] }); renderLog(); };
    box.appendChild(clr);
    box.appendChild(h("p", "fine", "Saved only on this device. It starts fresh each day."));
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
  try { var saved = sessionStorage.getItem("dish"); if (saved) { $("dish").value = saved; sessionStorage.removeItem("dish"); sync(); } } catch (x) {}
  $("dish").onkeydown = function (e) { if (e.key === "Enter" && !$("go").disabled) analyse(); };
  $("cam").onclick = openCam;
  $("snap").onclick = snap;
  $("camclose").onclick = function () { $("camdlg").close(); };
  $("camdlg").addEventListener("close", stopCam);
  render();
  renderLog();
})();
