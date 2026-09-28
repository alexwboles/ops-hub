/* Renders the ops-hub dashboard from OpsHubData. */
(function () {
  var d = window.OpsHubData;
  var grid = document.getElementById("cards");
  d.PRODUCTS.forEach(function (p) {
    var card = document.createElement("article");
    card.className = "card";
    var feats = p.features.map(function (f) { return "<li>" + f + "</li>"; }).join("");
    card.innerHTML =
      "<h3>" + p.name + "</h3>" +
      "<p class='tagline'>" + p.tagline + "</p>" +
      "<ul>" + feats + "</ul>" +
      "<div class='cardfoot'><span class='price'>$" + p.price + "/mo</span>" +
      "<a class='btn' href='" + d.repoUrl(p.slug) + "' target='_blank' rel='noopener'>View repo</a></div>";
    grid.appendChild(card);
  });

  var flow = document.getElementById("flow");
  d.FLOW.forEach(function (s) {
    var el = document.createElement("div");
    el.className = "flowstep";
    el.innerHTML = "<div class='stepnum'>" + s.step + "</div><h4>" + s.title + "</h4><p>" + s.text + "</p>";
    flow.appendChild(el);
  });

  var sum = d.PRODUCTS.reduce(function (a, p) { return a + p.price; }, 0);
  var savings = d.BUNDLE.savings ? " You save $" + d.BUNDLE.savings + "/mo." : "";
  document.getElementById("bundle-math").textContent =
    "Bought separately: $" + sum + "/mo. As \"" + d.BUNDLE.name + "\": " + d.BUNDLE.pitch + "." + savings;
})();
