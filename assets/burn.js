// Calories burned = MET x body weight (kg) x hours. MET values are standard approximations.
function burned(met, kg, minutes) { return Math.round(met * kg * minutes / 60); }

if (typeof document !== "undefined") {
  (function () {
    var $ = function (id) { return document.getElementById(id); };
    var h = function (tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
    var FOODS = [["phulka roti", 75], ["cup of sweet chai", 90], ["gulab jamun", 150], ["katori of rice", 195], ["samosa", 250], ["plate of chicken biryani", 480]];
    function kv(name, value) { var d = h("div", "kv"); d.appendChild(h("div", "", name)); d.appendChild(h("b", "", value)); return d; }
    $("burn").addEventListener("submit", function (ev) {
      ev.preventDefault();
      var met = Number($("act").value), kg = Number($("bw").value), mins = Number($("mins").value);
      var s = $("bstatus"); s.className = "status err";
      if (!(kg >= 30 && kg <= 200)) { s.textContent = "Enter your weight in kilograms, between 30 and 200."; return; }
      if (!(mins >= 1 && mins <= 600)) { s.textContent = "Enter the time in minutes, between 1 and 600."; return; }
      s.textContent = ""; s.className = "status";
      var kcal = burned(met, kg, mins), box = $("bresult");
      box.textContent = "";
      box.appendChild(h("div", "label", "Calories used"));
      var big = h("div", "big", kcal.toLocaleString("en-IN")); big.appendChild(h("small", "", "kcal")); box.appendChild(big);
      var list = h("div");
      list.appendChild(h("div", "label", "Roughly the same as"));
      FOODS.forEach(function (f) {
        var x = kcal / f[1];
        if (x >= 0.5) list.appendChild(kv(f[0], (x < 10 ? Math.round(x * 10) / 10 : Math.round(x)) + " x"));
      });
      if (list.children.length === 1) list.appendChild(h("p", "fine", "Less than half a phulka roti."));
      box.appendChild(list);
      box.appendChild(h("p", "fine", "An estimate from standard activity values, your weight and the time."));
    });
  })();
}
if (typeof module !== "undefined") module.exports = burned;
