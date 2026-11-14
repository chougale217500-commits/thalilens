// Filters the calorie chart as you type.
(function () {
  var input = document.getElementById("foodsearch"), count = document.getElementById("foodcount");
  if (!input) return;
  var rows = Array.prototype.slice.call(document.querySelectorAll("table tbody tr"));
  input.addEventListener("input", function () {
    var q = input.value.trim().toLowerCase(), shown = 0;
    rows.forEach(function (r) { var hit = !q || r.textContent.toLowerCase().indexOf(q) >= 0; r.hidden = !hit; if (hit) shown++; });
    count.textContent = !q ? "" : shown ? shown + " of " + rows.length + " foods shown." : "No match in the chart. Try the photo analyser on the home page for this food.";
  });
})();
