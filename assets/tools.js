// Recipe nutrition calculator and restaurant menu scanner.
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var h = function (tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
  var num = function (x) { var n = Number(x); return isFinite(n) && n > 0 ? n : 0; };
  var show = function (x) { return x < 10 ? String(Math.round(x * 10) / 10) : String(Math.round(x)); };

  function token() {
    var A = window.thaliAuth;
    if (!A || !A.configured) return Promise.resolve(null);
    return A.ready.then(function () { if (A.user) return A.getToken(); if (A.required) throw new Error("login"); return null; });
  }
  function post(body) {
    return token().then(function (tk) {
      var hd = { "Content-Type": "application/json" };
      if (tk) hd.Authorization = "Bearer " + tk;
      return fetch("/api/analyze", { method: "POST", headers: hd, body: JSON.stringify(body) });
    }).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (out) { if (!res.ok) throw new Error(out.error || "The request failed. Please try again."); return out; });
    });
  }
  function fail(statusEl, e) {
    if (e && e.message === "login") { statusEl.textContent = "Please sign in first. Opening the sign-in page."; location.href = "/login.html"; return; }
    statusEl.className = "status err";
    statusEl.textContent = e && e.message && e.message.indexOf("fetch") < 0 ? e.message : "Could not reach the server. Check your internet and try again.";
  }
  function kv(name, value) { var d = h("div", "kv"); d.appendChild(h("div", "", name)); d.appendChild(h("b", "", value)); return d; }
  function list(title, arr) {
    var box = h("div"); box.appendChild(h("div", "label", title));
    var ul = h("ul", "notes"); arr.forEach(function (x) { ul.appendChild(h("li", "", x)); }); box.appendChild(ul); return box;
  }

  // ---- recipe
  var rf = $("recipeform");
  if (rf) rf.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var text = $("rtext").value.trim(), servings = Number($("rserv").value), st = $("rstatus"), btn = rf.querySelector("button");
    st.className = "status err";
    if (text.length < 10) { st.textContent = "Paste the ingredients with their amounts, one per line."; return; }
    if (!(servings >= 1 && servings <= 50)) { st.textContent = "Enter the number of servings, between 1 and 50."; return; }
    st.className = "status busy"; st.textContent = "Working out the nutrition. This can take up to a minute."; btn.disabled = true;
    post({ mode: "recipe", text: text, servings: servings }).then(function (d) {
      var items = Array.isArray(d.items) ? d.items : [];
      if (d.is_food === false || !items.length) { st.className = "status err"; st.textContent = "That does not look like a recipe. Paste the ingredients with amounts."; return; }
      var tot = { k: 0, p: 0, c: 0, f: 0 };
      items.forEach(function (it) { tot.k += num(it.calories); tot.p += num(it.protein_g); tot.c += num(it.carbs_g); tot.f += num(it.fat_g); });
      var box = $("rresult"); box.textContent = "";
      box.appendChild(h("h2", "", String(d.meal_name || "Your recipe")));
      box.appendChild(h("div", "label", "One serving, of " + servings));
      var big = h("div", "big", show(tot.k)); big.appendChild(h("small", "", "kcal")); box.appendChild(big);
      var facts = h("div");
      facts.appendChild(kv("Protein", show(tot.p) + " g")); facts.appendChild(kv("Carbohydrate", show(tot.c) + " g")); facts.appendChild(kv("Fat", show(tot.f) + " g"));
      var t2 = d.total || {};
      if (num(t2.fiber_g)) facts.appendChild(kv("Fibre", show(num(t2.fiber_g)) + " g"));
      if (num(t2.sodium_mg)) facts.appendChild(kv("Sodium", show(num(t2.sodium_mg)) + " mg"));
      var sc = Math.round(num(d.score));
      if (sc >= 1 && sc <= 10) facts.appendChild(kv("Balance score", sc + "/10"));
      box.appendChild(facts);
      box.appendChild(h("div", "label", "Where it comes from, per serving"));
      var wrap = h("div", "tablewrap"), tb = h("table", "t"), body = h("tbody");
      items.slice().sort(function (a, b) { return num(b.calories) - num(a.calories); }).forEach(function (it) {
        var tr = h("tr"), th = h("th", "", String(it.name || "Ingredient")); th.scope = "row";
        tr.appendChild(th); tr.appendChild(h("td", "", String(it.portion || ""))); tr.appendChild(h("td", "", show(num(it.calories)) + " kcal")); body.appendChild(tr);
      });
      tb.appendChild(body); wrap.appendChild(tb); box.appendChild(wrap);
      var notes = (Array.isArray(d.notes) ? d.notes : []).map(String).filter(Boolean);
      if (notes.length) box.appendChild(list("Notes", notes));
      var swaps = (Array.isArray(d.swaps) ? d.swaps : []).filter(function (s) { return s && s.instead_of && s.try; }).map(function (s) {
        var k = Math.round(num(s.saves_kcal)); return "Instead of " + s.instead_of + ", try " + s.try + "." + (k ? " Saves about " + k + " kcal." : "");
      });
      if (swaps.length) box.appendChild(list("Lighter swaps", swaps));
      box.appendChild(h("p", "fine", "Estimated from typical values for each ingredient."));
      st.className = "status"; st.textContent = "Done.";
    }).catch(function (e) { fail(st, e); }).then(function () { btn.disabled = false; });
  });

  // ---- menu
  var mf = $("menuform");
  if (mf) {
    var file = null;
    var setFile = function (f) {
      if (!f || !/^image\//.test(f.type)) return;
      file = f; var img = $("mpreview"); img.src = URL.createObjectURL(f); img.hidden = false; $("mgo").disabled = false;
      $("mstatus").className = "status"; $("mstatus").textContent = "Photo ready. Press Scan menu.";
    };
    $("mpick").onclick = function () { $("mfile").click(); };
    $("mcam").onclick = function () { $("mcap").click(); };
    $("mfile").onchange = function () { setFile(this.files[0]); this.value = ""; };
    $("mcap").onchange = function () { setFile(this.files[0]); this.value = ""; };
    var shrink = function (f) {
      return new Promise(function (resolve, reject) {
        var img = new Image();
        img.onload = function () {
          var s = Math.min(1, 1600 / Math.max(img.width, img.height)), c = document.createElement("canvas");
          c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
          c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
          resolve(c.toDataURL("image/jpeg", 0.85).split(",")[1]);
        };
        img.onerror = function () { reject(new Error("That file could not be read. Use a JPG or PNG photo.")); };
        img.src = URL.createObjectURL(f);
      });
    };
    mf.addEventListener("submit", function (ev) {
      ev.preventDefault();
      if (!file) return;
      var st = $("mstatus"), btn = $("mgo");
      st.className = "status busy"; st.textContent = "Reading the menu. This can take up to a minute."; btn.disabled = true;
      shrink(file).then(function (b64) { return post({ mode: "menu", image: b64, mediaType: "image/jpeg", focus: $("mfocus").value }); }).then(function (d) {
        var picks = Array.isArray(d.picks) ? d.picks : [], limit = Array.isArray(d.limit) ? d.limit : [];
        if (d.is_menu === false || (!picks.length && !limit.length)) {
          st.className = "status err"; st.textContent = "No menu found in this photo" + (d.reason ? " (" + String(d.reason) + ")" : "") + ". Try a clearer photo."; return;
        }
        var box = $("mresult"); box.textContent = "";
        var section = function (title, arr, cls) {
          if (!arr.length) return;
          box.appendChild(h("div", "label", title));
          var wrap = h("div", "picks " + cls);
          arr.slice(0, 6).forEach(function (x) {
            var row = h("div", "item"), k = Math.round(num(x.approx_kcal));
            row.appendChild(h("h3", "", String(x.name || ""))); row.appendChild(h("div", "kcal", k ? "about " + k + " kcal" : ""));
            row.appendChild(h("div", "portion", String(x.why || ""))); row.appendChild(h("div"));
            wrap.appendChild(row);
          });
          box.appendChild(wrap);
        };
        section("Better picks", picks, "good"); section("Heaviest on this menu", limit, "heavy");
        if (d.order_idea) { box.appendChild(h("div", "label", "A balanced order for one")); box.appendChild(h("p", "", String(d.order_idea))); }
        if (d.tip) box.appendChild(h("div", "focusnote", String(d.tip)));
        box.appendChild(h("p", "fine", "Based on dish names only. Recipes differ between restaurants."));
        st.className = "status"; st.textContent = "Done.";
      }).catch(function (e) { fail(st, e); }).then(function () { btn.disabled = false; });
    });
  }
})();
