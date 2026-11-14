// Barcode lookup for packaged food, using the free Open Food Facts database.
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var h = function (tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
  var form = $("bcform");
  if (!form) return;
  var st = $("bcstatus"), stream = null, timer = null;
  var val = function (n, k) { var v = n ? Number(n[k]) : NaN; return isFinite(v) ? v : null; };
  var show = function (v, unit) { return v == null ? "not given" : (v < 10 ? Math.round(v * 10) / 10 : Math.round(v)) + " " + unit; };
  // Front-of-pack thresholds per 100 g for foods: [low up to, high above].
  var LEVELS = { sugars: [5, 22.5], fat: [3, 17.5], sat: [1.5, 5], salt: [0.3, 1.5] };
  function level(kind, v) { if (v == null) return null; var L = LEVELS[kind]; return v <= L[0] ? "Low" : v > L[1] ? "High" : "Medium"; }

  function lookup(code) {
    code = String(code || "").replace(/\D/g, "");
    if (code.length < 8 || code.length > 14) { st.className = "status err"; st.textContent = "Enter the 8 to 14 digit number printed under the barcode."; return; }
    $("bc").value = code;
    st.className = "status busy"; st.textContent = "Looking up the product.";
    var fields = "product_name,brands,quantity,serving_size,nutriments,nova_group,ingredients_text,allergens_tags";
    fetch("https://world.openfoodfacts.org/api/v2/product/" + code + ".json?fields=" + fields).then(function (res) {
      return res.json().catch(function () { return {}; });
    }).then(function (d) {
      var p = d && d.product;
      if (!p || d.status === 0 || !(p.product_name || p.nutriments)) { notFound(); return; }
      render(p); st.className = "status"; st.textContent = "Done.";
    }).catch(function () { st.className = "status err"; st.textContent = "Could not reach the product database. Check your internet and try again."; });
  }
  function notFound() {
    st.className = "status err"; st.textContent = "This product is not in the database yet.";
    var box = $("bcresult"); box.textContent = "";
    box.appendChild(h("div", "label", "Not found"));
    box.appendChild(h("p", "", "Take a photo of the nutrition table on the pack and use the photo analyser. It reads the label for you."));
    var a = h("a", "btn", "Open the photo analyser"); a.href = "/#tool"; box.appendChild(a);
  }
  function render(p) {
    var n = p.nutriments || {}, box = $("bcresult"); box.textContent = "";
    box.appendChild(h("h2", "", String(p.product_name || "Unnamed product")));
    var sub = [p.brands, p.quantity].filter(Boolean).join(" · ");
    if (sub) box.appendChild(h("p", "updated", sub));
    var kcal = val(n, "energy-kcal_100g");
    var big = h("div", "big", kcal == null ? "?" : String(Math.round(kcal))); big.appendChild(h("small", "", "kcal per 100 g")); box.appendChild(big);
    var salt = val(n, "salt_100g"); if (salt == null && val(n, "sodium_100g") != null) salt = val(n, "sodium_100g") * 2.5;
    var rows = [["Sugar", val(n, "sugars_100g"), "sugars"], ["Fat", val(n, "fat_100g"), "fat"], ["Saturated fat", val(n, "saturated-fat_100g"), "sat"], ["Salt", salt, "salt"],
                ["Protein", val(n, "proteins_100g")], ["Carbohydrate", val(n, "carbohydrates_100g")], ["Fibre", val(n, "fiber_100g")]];
    box.appendChild(h("div", "label", "Per 100 g"));
    var list = h("div");
    rows.forEach(function (r) {
      var d = h("div", "kv"); d.appendChild(h("div", "", r[0]));
      var b = h("b", "", show(r[1], "g")), lv = r[2] ? level(r[2], r[1]) : null;
      if (lv) { var f = h("span", "flag " + lv.toLowerCase(), lv); b.appendChild(document.createTextNode(" ")); b.appendChild(f); }
      d.appendChild(b); list.appendChild(d);
    });
    box.appendChild(list);
    var ks = val(n, "energy-kcal_serving");
    if (p.serving_size && ks != null) box.appendChild(h("p", "", "One serving (" + String(p.serving_size) + ") has about " + Math.round(ks) + " kcal."));
    var NOVA = { 1: "Unprocessed or minimally processed", 2: "Processed cooking ingredient", 3: "Processed food", 4: "Ultra-processed food" };
    if (NOVA[p.nova_group]) box.appendChild(h("div", "focusnote", "Processing level: " + NOVA[p.nova_group] + " (NOVA group " + p.nova_group + ")."));
    if (p.ingredients_text) { box.appendChild(h("div", "label", "Ingredients")); box.appendChild(h("p", "", String(p.ingredients_text).slice(0, 500))); }
    var al = (Array.isArray(p.allergens_tags) ? p.allergens_tags : []).map(function (x) { return String(x).replace(/^[a-z]{2}:/, "").replace(/-/g, " "); });
    if (al.length) box.appendChild(h("div", "allergy", "Allergens listed: " + al.join(", ")));
    box.appendChild(h("p", "fine", "Low, medium and high use common front-of-pack thresholds for foods. Data: Open Food Facts. Check the pack, because recipes change."));
  }

  form.addEventListener("submit", function (ev) { ev.preventDefault(); lookup($("bc").value); });

  // Camera scanning, where the browser can read barcodes (Chrome on Android and some desktops).
  function stop() { if (timer) { clearInterval(timer); timer = null; } if (stream) { stream.getTracks().forEach(function (t) { t.stop(); }); stream = null; } }
  if ("BarcodeDetector" in window && navigator.mediaDevices && navigator.mediaDevices.getUserMedia && $("bdlg").showModal) {
    var btn = $("bscan"); btn.hidden = false;
    btn.onclick = function () {
      var det;
      try { det = new window.BarcodeDetector({ formats: ["ean_13", "ean_8", "upc_a", "upc_e"] }); } catch (x) { btn.hidden = true; return; }
      navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } }, audio: false }).then(function (s) {
        stream = s; $("bvideo").srcObject = s; $("bdlg").showModal();
        timer = setInterval(function () {
          det.detect($("bvideo")).then(function (codes) {
            if (codes && codes[0] && codes[0].rawValue) { var c = codes[0].rawValue; $("bdlg").close(); lookup(c); }
          }).catch(function () {});
        }, 400);
      }).catch(function () { st.className = "status err"; st.textContent = "Camera permission was not given. Type the barcode number instead."; });
    };
    $("bclose").onclick = function () { $("bdlg").close(); };
    $("bdlg").addEventListener("close", stop);
  }
})();
