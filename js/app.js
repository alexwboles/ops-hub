/* Renders the ops-hub dashboard from OpsHubData, plus the pain-point
   finder, search/group filter, and build-your-bundle quote. */
(function () {
  var d = window.OpsHubData;

  function recommendedSlugs() { return window.__opsRecommended || null; }

  /* Defensive event binding: the node e2e harness loads this file with a
   * minimal fake DOM, so never assume addEventListener exists. */
  function on(elm, evt, fn) {
    if (elm && typeof elm.addEventListener === "function") elm.addEventListener(evt, fn);
  }

  function checkedSlugs() {
    if (typeof document.querySelectorAll !== "function") return [];
    var boxes = document.querySelectorAll("#pick-list input[type=checkbox]:checked");
    return Array.prototype.map.call(boxes, function (b) { return b.value; });
  }

  function cardMatchesFilter(p) {
    var searchEl = document.getElementById("search");
    var groupEl = document.getElementById("group-filter");
    var q = searchEl && typeof searchEl.value === "string" ? searchEl.value : "";
    var g = groupEl && typeof groupEl.value === "string" ? groupEl.value : "all";
    return d.searchProducts(q, g).indexOf(p) !== -1;
  }

  function renderCards() {
    var grid = document.getElementById("cards");
    grid.innerHTML = "";
    var rec = recommendedSlugs();
    var shown = 0;
    d.PRODUCTS.forEach(function (p) {
      if (!cardMatchesFilter(p)) return;
      shown++;
      var card = document.createElement("article");
      card.className = "card" + (rec && rec.indexOf(p.slug) !== -1 ? " recommended" : "");
      var feats = p.features.map(function (f) { return "<li>" + f + "</li>"; }).join("");
      card.innerHTML =
        "<div class='group'>" + d.groupOf(p.slug) + "</div>" +
        "<h3>" + p.name + "</h3>" +
        "<p class='tagline'>" + p.tagline + "</p>" +
        "<ul>" + feats + "</ul>" +
        "<div class='cardfoot'><span class='price'>$" + p.price + "/mo</span>" +
        "<a class='btn' href='" + d.repoUrl(p.slug) + "' target='_blank' rel='noopener'>View repo</a></div>";
      grid.appendChild(card);
    });
    document.getElementById("result-count").textContent =
      shown === d.PRODUCTS.length
        ? "Showing all " + shown + " products."
        : "Showing " + shown + " of " + d.PRODUCTS.length + " products.";
  }

  /* --- pain-point finder ------------------------------------------------ */
  function renderPains() {
    var wrap = document.getElementById("pain-picks");
    d.PAINS.forEach(function (pain) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "pick-btn";
      b.textContent = pain.label;
      on(b, "click", function () { pickPain(pain.key); });
      wrap.appendChild(b);
    });
  }

  function pickPain(key) {
    var res = d.recommend(key);
    window.__opsRecommended = res.products.map(function (p) { return p.slug; });
    var btns = document.querySelectorAll("#pain-picks .pick-btn");
    Array.prototype.forEach.call(btns, function (b) {
      b.classList.toggle("active", b.textContent === res.pain.label);
    });
    document.getElementById("pain-result").textContent =
      "For \"" + res.pain.label.toLowerCase() + "\": start with " +
      res.products.map(function (p) { return p.name; }).join(" and ") + ".";
    renderCards();
  }

  /* --- search + group filter -------------------------------------------- */
  function renderFilters() {
    var sel = document.getElementById("group-filter");
    d.allGroups().forEach(function (g) {
      var o = document.createElement("option");
      o.value = g;
      o.textContent = g;
      sel.appendChild(o);
    });
    on(document.getElementById("search"), "input", renderCards);
    on(sel, "change", renderCards);
  }

  /* --- build-your-bundle quote ------------------------------------------- */
  function renderBuilder() {
    var list = document.getElementById("pick-list");
    d.PRODUCTS.forEach(function (p) {
      var label = document.createElement("label");
      label.className = "pick";
      var box = document.createElement("input");
      box.type = "checkbox";
      box.value = p.slug;
      box.checked = true;
      on(box, "change", renderQuote);
      label.appendChild(box);
      var nm = document.createElement("span");
      nm.className = "pick-name";
      nm.textContent = p.name;
      label.appendChild(nm);
      var pr = document.createElement("span");
      pr.className = "pick-price";
      pr.textContent = "$" + p.price + "/mo";
      label.appendChild(pr);
      list.appendChild(label);
    });
    renderQuote();
  }

  function renderQuote() {
    var q = d.quotePlan(checkedSlugs());
    var box = document.getElementById("quote");
    box.innerHTML = "";
    var line1 = document.createElement("div");
    line1.className = "quote-line";
    line1.textContent = q.count + " picked · separately $" + q.separate + "/mo";
    box.appendChild(line1);
    if (q.count > 0) {
      var line2 = document.createElement("div");
      line2.className = "quote-line";
      line2.textContent = "Back-Office OS (all ten): $" + d.bundlePrice() + "/mo";
      box.appendChild(line2);
      var v = document.createElement("p");
      v.className = "quote-verdict" + (q.bundleApplies ? " bundle-wins" : "");
      v.textContent = q.verdict;
      box.appendChild(v);
    } else {
      var e = document.createElement("p");
      e.className = "quote-verdict";
      e.textContent = q.verdict;
      box.appendChild(e);
    }
  }

  /* --- existing: flow + bundle ------------------------------------------- */
  function renderFlow() {
    var flow = document.getElementById("flow");
    d.FLOW.forEach(function (s) {
      var el = document.createElement("div");
      el.className = "flowstep";
      el.innerHTML = "<div class='stepnum'>" + s.step + "</div><h4>" + s.title + "</h4><p>" + s.text + "</p>";
      flow.appendChild(el);
    });
  }

  function renderBundle() {
    var sum = d.PRODUCTS.reduce(function (a, p) { return a + p.price; }, 0);
    var savings = d.BUNDLE.savings ? " You save $" + d.BUNDLE.savings + "/mo." : "";
    document.getElementById("bundle-math").textContent =
      "Bought separately: $" + sum + "/mo. As \"" + d.BUNDLE.name + "\": " + d.BUNDLE.pitch + "." + savings;
  }

  /* --- second sweep: presets, ROI calculator, product compare --------------- */
  function renderPresets() {
    var wrap = document.getElementById("preset-picks");
    d.PRESETS.forEach(function (pr) {
      var b = document.createElement("button");
      b.className = "pick-btn";
      b.textContent = pr.label;
      b.title = pr.desc;
      on(b, "click", function () { applyPreset(pr); });
      wrap.appendChild(b);
    });
    var desc = document.createElement("p");
    desc.className = "preset-desc";
    desc.id = "preset-desc";
    if (wrap.parentNode) wrap.parentNode.appendChild(desc);
    on(wrap, "mouseover", function (e) {
      var btn = e.target && e.target.classList && e.target.classList.contains("pick-btn") ? e.target : null;
      if (btn) {
        var pr = d.PRESETS.filter(function (p) { return p.label === btn.textContent; })[0];
        if (pr) desc.textContent = pr.label + ": " + pr.desc;
      }
    });
  }

  function applyPreset(pr) {
    var boxes = document.querySelectorAll("#pick-list input[type=checkbox]");
    Array.prototype.forEach.call(boxes, function (box) {
      box.checked = pr.slugs.indexOf(box.value) !== -1;
    });
    renderQuote();
    document.getElementById("preset-desc").textContent =
      pr.label + " loaded: " + pr.slugs.length + " products checked below — adjust freely.";
    document.getElementById("build-bundle").scrollIntoView({ behavior: "smooth" });
  }

  function renderRoi() {
    var box = document.getElementById("roi-result");
    var btn = document.getElementById("roi-go");
    on(btn, "click", function () {
      var rate = document.getElementById("roi-rate").value;
      var r = d.roiEstimate(rate, checkedSlugs());
      box.innerHTML = "";
      var p = document.createElement("p");
      p.className = "roi-line";
      if (!r.ok) {
        p.textContent = r.reason;
      } else {
        p.textContent = "~" + r.hours + " hours/mo saved ≈ $" + Math.round(r.value) +
          "/mo of your time. Picks cost $" + r.cost + "/mo. Net: " +
          (r.net >= 0 ? "+$" : "−$") + Math.abs(Math.round(r.net)) + "/mo. " + r.verdict;
        p.className += r.net >= 0 ? " roi-good" : " roi-bad";
      }
      box.appendChild(p);
    });
  }

  function optionList(select, current) {
    d.PRODUCTS.forEach(function (p) {
      var o = document.createElement("option");
      o.value = p.slug;
      o.textContent = p.name + " ($" + p.price + "/mo)";
      if (p.slug === current) o.selected = true;
      select.appendChild(o);
    });
  }

  function renderCompare() {
    var aSel = document.getElementById("cmp-a");
    var bSel = document.getElementById("cmp-b");
    optionList(aSel, "invoicepilot-ai");
    optionList(bSel, "triagepilot-ai");
    function draw() {
      var res = d.compareProducts(aSel.value, bSel.value);
      var box = document.getElementById("cmp-table");
      box.innerHTML = "";
      if (!res.a || !res.b) return;
      var tbl = document.createElement("table");
      tbl.className = "cmp-table";
      function row(label, a, b) {
        var tr = document.createElement("tr");
        var th = document.createElement("th"); th.textContent = label; tr.appendChild(th);
        [a, b].forEach(function (v) {
          var td = document.createElement("td");
          if (Array.isArray(v)) {
            var ul = document.createElement("ul");
            v.forEach(function (f) { var li = document.createElement("li"); li.textContent = f; ul.appendChild(li); });
            td.appendChild(ul);
          } else td.textContent = v;
          tr.appendChild(td);
        });
        tbl.appendChild(tr);
      }
      row("Product", res.a.name, res.b.name);
      row("Tagline", res.a.tagline, res.b.tagline);
      row("Price", "$" + res.a.price + "/mo", "$" + res.b.price + "/mo");
      row("Group", d.groupOf(res.a.slug), d.groupOf(res.b.slug));
      row("Key features", res.a.features, res.b.features);
      box.appendChild(tbl);
    }
    on(aSel, "change", draw);
    on(bSel, "change", draw);
    draw();
  }

  /* Scripts load at the end of <body>, so the DOM is ready now — no
   * DOMContentLoaded needed (also keeps the node fake-DOM harness happy). */
  (function init() {
    renderPains();
    renderFilters();
    renderCards();
    renderFlow();
    renderPresets();
    renderBuilder();
    renderRoi();
    renderCompare();
    renderBundle();
  })();
})();
