// Daily calorie and BMI calculator. Runs fully in the browser.
// Energy: Mifflin-St Jeor equation x activity factor. BMI: cut-offs commonly used for Asian Indian adults.
function compute(o) {
  var bmr = 10 * o.weight + 6.25 * o.height - 5 * o.age + (o.sex === "m" ? 5 : -161);
  var maintain = Math.round(bmr * o.activity / 10) * 10;
  var m = o.height / 100, bmi = Math.round(o.weight / (m * m) * 10) / 10;
  var cat = bmi < 18.5 ? "Underweight" : bmi < 23 ? "Normal" : bmi < 25 ? "Overweight" : "Obese";
  var floor = o.sex === "m" ? 1500 : 1200;
  return {
    bmi: bmi, category: cat, maintain: maintain,
    lose: cat === "Underweight" ? null : Math.max(floor, maintain - 500),
    gain: maintain + 300,
    proteinLow: Math.round(o.weight * 0.8), proteinHigh: Math.round(o.weight * 1.0),
  };
}

if (typeof document !== "undefined") {
  (function () {
    var $ = function (id) { return document.getElementById(id); };
    var h = function (tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
    function kv(name, value, note) {
      var d = h("div", "kv"); d.appendChild(h("div", "", name)); d.appendChild(h("b", "", value));
      if (note) d.appendChild(h("span", "", note));
      return d;
    }
    $("calc").addEventListener("submit", function (ev) {
      ev.preventDefault();
      var o = { sex: $("sex").value, age: Number($("age").value), height: Number($("height").value), weight: Number($("weight").value), activity: Number($("activity").value) };
      var s = $("cstatus"); s.className = "status err";
      if (!(o.age >= 18 && o.age <= 80)) { s.textContent = "Enter an age between 18 and 80. This calculator is for adults."; return; }
      if (!(o.height >= 120 && o.height <= 220)) { s.textContent = "Enter your height in centimetres, between 120 and 220."; return; }
      if (!(o.weight >= 30 && o.weight <= 200)) { s.textContent = "Enter your weight in kilograms, between 30 and 200."; return; }
      s.textContent = ""; s.className = "status";
      var r = compute(o), box = $("cresult");
      box.textContent = "";
      box.appendChild(h("div", "label", "To stay at your current weight"));
      var big = h("div", "big", r.maintain.toLocaleString("en-IN")); big.appendChild(h("small", "", "kcal a day")); box.appendChild(big);
      var list = h("div");
      list.appendChild(kv("BMI", r.bmi + " · " + r.category, "Ranges for Asian Indian adults: normal is 18.5 to 22.9."));
      if (r.lose) list.appendChild(kv("For slow weight loss", "about " + r.lose.toLocaleString("en-IN") + " kcal", "Around 500 kcal below maintenance, never below a safe minimum."));
      else list.appendChild(kv("Weight loss", "not advised", "Your BMI is below the normal range. Speak to a doctor or dietitian before cutting calories."));
      list.appendChild(kv("For slow weight gain", "about " + r.gain.toLocaleString("en-IN") + " kcal", "Around 300 kcal above maintenance."));
      list.appendChild(kv("Protein", r.proteinLow + " to " + r.proteinHigh + " g a day", "About 0.8 to 1 g per kg of body weight for most healthy adults."));
      box.appendChild(list);
      box.appendChild(h("p", "fine", "These are estimates from a standard formula, not a medical assessment."));
    });
  })();
}
if (typeof module !== "undefined") module.exports = compute;
