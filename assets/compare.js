// Side-by-side comparison of two foods from the calorie chart.
(function () {
  var F = window.THALI_FOODS || [], a = document.getElementById("ca"), b = document.getElementById("cb"), out = document.getElementById("cresult2");
  if (!a || !b || !out || !F.length) return;
  var h = function (tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
  function draw() {
    var x = F[Number(a.value)], y = F[Number(b.value)];
    out.textContent = "";
    var head = h("div", "crow head"); head.appendChild(h("span"));
    [x, y].forEach(function (d) { var l = h("a", "", d.name); l.href = "/food/" + d.slug + ".html"; var c = h("div"); c.appendChild(l); c.appendChild(h("small", "", d.serving)); head.appendChild(c); });
    out.appendChild(head);
    [["Calories", "kcal", "kcal", "var(--accent)"], ["Protein", "p", "g", "var(--prot)"], ["Carbohydrate", "c", "g", "var(--carb)"], ["Fat", "f", "g", "var(--fat)"]].forEach(function (r) {
      var row = h("div", "crow"), max = Math.max(x[r[1]], y[r[1]]) || 1;
      row.appendChild(h("span", "label", r[0]));
      [x, y].forEach(function (d) {
        var c = h("div"), bar = h("div", "rbar"), fill = h("i"); fill.style.width = d[r[1]] / max * 100 + "%"; fill.style.setProperty("--c", r[3]); bar.appendChild(fill);
        c.appendChild(h("b", "", d[r[1]] + " " + r[2])); c.appendChild(bar); row.appendChild(c);
      });
      out.appendChild(row);
    });
    if (x === y) return;
    var hi = x.kcal >= y.kcal ? x : y, lo = hi === x ? y : x, pr = x.p >= y.p ? x : y, notes = h("ul", "notes");
    if (hi.kcal !== lo.kcal) notes.appendChild(h("li", "", hi.name + " has " + Math.round(hi.kcal - lo.kcal) + " kcal more per serving than " + lo.name.toLowerCase() + "."));
    if (x.p !== y.p) notes.appendChild(h("li", "", pr.name + " gives more protein per serving."));
    notes.appendChild(h("li", "", "Servings are different sizes. Open each food page for values per 100 g."));
    out.appendChild(notes);
  }
  a.onchange = b.onchange = draw;
  var quick = document.getElementById("cquick");
  if (quick) quick.onclick = function (e) {
    var t = e.target; if (t.tagName !== "BUTTON") return;
    F.forEach(function (d, i) { if (d.name === t.getAttribute("data-a")) a.value = i; if (d.name === t.getAttribute("data-b")) b.value = i; });
    draw(); a.scrollIntoView({ block: "center" });
  };
  draw();
})();
