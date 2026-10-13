/* ops-hub — Back-Office OS dashboard. No build, no deps. */
(function (root, factory) {
  if (typeof module !== "undefined" && module.exports) module.exports = factory();
  else root.OpsHubData = factory();
})(typeof self !== "undefined" ? self : this, function () {
  var PRODUCTS = [
    {
      slug: "invoicepilot-ai",
      name: "InvoicePilot",
      tagline: "Invoicing plus polite late-payment nudges.",
      price: 19,
      features: [
        "Invoice builder: client, line items, discount, tax → live professional preview → Print / Save-as-PDF",
        "Late-payment nudges drafted in 3 tones (Gentle / Firm / Final notice) with a reminder log",
        "Dashboard: outstanding / overdue / collected totals plus an aging list — 100% local"
      ]
    },
    {
      slug: "cashflow-ai",
      name: "CashFlow",
      tagline: "Cash-flow forecaster: see what's coming in and going out.",
      price: 19,
      features: [
        "13-week forecast from expected invoices in and bills out, with inflow/outflow bars and running balance",
        "Shortfall alerts flag weeks projected below $0, plus thin-cash warnings",
        "What-if late-payment simulator and CSV import — everything stays in the browser"
      ]
    },
    {
      slug: "hirewise-ai",
      name: "HireWise",
      tagline: "Hire on merit, not on gut.",
      price: 29,
      features: [
        "Job-post writer (3 tones) + red-flag checker for biased/clichéd language",
        "Resume screener with evidence-based fit score and gap-tailored interview questions",
        "Candidate pipeline board: Applied → Screening → Interview → Offer"
      ]
    },
    {
      slug: "onboardpilot-ai",
      name: "OnboardPilot",
      tagline: "Employee onboarding checklists and first-week plans.",
      price: 19,
      features: [
        "Role-based checklists across Day 1 / Week 1 / Day 30 — paperwork, training, culture, tools",
        "Per-hire progress tracking with completion %, overdue flags, and buddy assignment",
        "One-click welcome-message drafts; everything stored locally"
      ]
    },
    {
      slug: "shiftplan-ai",
      name: "ShiftPlan",
      tagline: "Shift scheduler for hourly teams.",
      price: 19,
      features: [
        "Weekly schedule grid (7 days × 3 shifts) with staff roster, availability, and max hours",
        "Coverage-gap detector: understaffed slots, double-booking, and overtime flags",
        "Shift templates plus a shift-swap board — all local, printable"
      ]
    },
    {
      slug: "sopforge-ai",
      name: "SOPForge",
      tagline: "Tribal knowledge becomes checklists.",
      price: 15,
      features: [
        "Plain-English description → numbered steps with owners, time estimates, watch-out tips",
        "Interactive checklist mode with progress + 5 starter templates",
        "SOP library: save, duplicate, edit — works offline"
      ]
    },
    {
      slug: "signpilot-ai",
      name: "SignPilot",
      tagline: "E-signature request flow for documents.",
      price: 15,
      features: [
        "3 document templates: Quote Approval, Change Order, Work Completion Sign-off",
        "Draw-to-sign canvas (mouse, touch, stylus) with an approval pipeline: draft → sent → signed",
        "Signed PDF export with a full timestamped audit trail — no per-envelope fees"
      ]
    },
    {
      slug: "bookpilot-ai",
      name: "BookPilot",
      tagline: "Booking pages and appointment scheduling for service businesses.",
      price: 15,
      features: [
        "Service menu with durations and prices; smart slot grid that blocks double-bookings",
        "Embeddable booking widget for your own website — no accounts, no monthly fee",
        "Owner dashboard: bookings board, day-before reminder nudges, no-show tracking"
      ]
    },
    {
      slug: "triagepilot-ai",
      name: "TriagePilot",
      tagline: "The inbox, sorted before coffee.",
      price: 24,
      features: [
        "Local classifier: Urgent / Needs reply / FYI / Spam with plain-language reasons",
        "One-click reply drafts in professional or friendly tone",
        "Daily digest bar; 100% in-browser, nothing leaves your device"
      ]
    },
    {
      slug: "bizbrain-ai",
      name: "BizBrain",
      tagline: "Business Q&A brain: ask questions over your own business data.",
      price: 29,
      features: [
        "Document vault: paste in SOPs, price lists, policies, FAQs — answers come with sources",
        "Ask in plain English; unanswered questions are logged as knowledge gaps, not hallucinated",
        "Auto-drafted FAQ from the most-mentioned topics — 100% local, works offline"
      ]
    }
  ];

  var FLOW = [
    {
      step: 1,
      title: "Money",
      text: "InvoicePilot bills clients and nudges the late ones; CashFlow shows what's coming in and going out so payroll never lands on an empty account."
    },
    {
      step: 2,
      title: "People",
      text: "HireWise writes fair job posts and screens on merit; OnboardPilot walks new hires through Day 1 to Day 30; ShiftPlan keeps the weekly schedule covered."
    },
    {
      step: 3,
      title: "Paperwork",
      text: "SOPForge turns how-you-do-things into checklists; SignPilot gets quotes and completions signed; BookPilot fills the appointment book; TriagePilot keeps the inbox sorted so nothing slips."
    },
    {
      step: 4,
      title: "Brain",
      text: "BizBrain holds every answer your team asks twice — policies, pricing, procedures — with sources, and logs the questions nobody has written down yet."
    }
  ];

  var BUNDLE = {
    name: "Back-Office OS",
    pitch: "$139/mo",
    perProductTotal: 203,
    savings: 64
  };

  function repoUrl(slug) {
    return "https://github.com/alexwboles/" + slug;
  }

  function bundlePrice() { return 139; }

  /* Groups mirror the four FLOW steps: Money, People, Paperwork, Brain. */
  var GROUPS = {
    "invoicepilot-ai": "Money",
    "cashflow-ai": "Money",
    "hirewise-ai": "People",
    "onboardpilot-ai": "People",
    "shiftplan-ai": "People",
    "sopforge-ai": "Paperwork",
    "signpilot-ai": "Paperwork",
    "bookpilot-ai": "Paperwork",
    "triagepilot-ai": "Paperwork",
    "bizbrain-ai": "Brain"
  };

  function groupOf(slug) { return GROUPS[slug] || "Other"; }

  function allGroups() {
    var out = [];
    ["Money", "People", "Paperwork", "Brain"].forEach(function (g) { out.push(g); });
    return out;
  }

  function getProduct(slug) {
    for (var i = 0; i < PRODUCTS.length; i++) {
      if (PRODUCTS[i].slug === slug) return PRODUCTS[i];
    }
    return null;
  }

  /* --- Second sweep: ROI + compare + presets ------------------------------------
   * hoursSaved: honest monthly time-savings estimate (hours) for a typical
   * small business owner actually using each product weekly.
   */
  var HOURS_SAVED = {
    "invoicepilot-ai": 8, "cashflow-ai": 4, "hirewise-ai": 6, "onboardpilot-ai": 5,
    "shiftplan-ai": 6, "sopforge-ai": 3, "signpilot-ai": 2, "bookpilot-ai": 4,
    "triagepilot-ai": 6, "bizbrain-ai": 5
  };

  function hoursSavedFor(slugs) {
    var sum = 0;
    (slugs || []).forEach(function (s) { sum += HOURS_SAVED[s] || 0; });
    return sum;
  }

  /* ROI: value of the hours saved at your hourly rate vs. the honest price
   * of those picks (bundle-aware via quotePlan).
   */
  function roiEstimate(hourlyCost, slugs) {
    var rate = Number(hourlyCost);
    if (!(rate > 0)) return { ok: false, reason: "Enter an hourly value above $0." };
    var picks = (slugs || []).filter(function (s) { return getProduct(s); });
    if (!picks.length) return { ok: false, reason: "Pick at least one product first." };
    var hours = hoursSavedFor(picks);
    var value = hours * rate;
    var quote = quotePlan(picks);
    var cost = quote.effective;
    var net = value - cost;
    return {
      ok: true, hours: hours, value: value, cost: cost, net: net,
      multiple: cost > 0 ? value / cost : 0,
      verdict: net >= 0
        ? "Worth it: ~$" + Math.round(value) + "/mo of your time back for $" + cost + "/mo — a " + multipleStr(value / cost) + " return."
        : "Not worth it at that rate: ~$" + Math.round(value) + "/mo of time saved vs $" + cost + "/mo cost."
    };
  }
  function multipleStr(m) {
    if (!isFinite(m)) return "∞×";
    return (Math.round(m * 10) / 10) + "×";
  }

  /* Side-by-side product comparison. */
  function compareProducts(slugA, slugB) {
    return { a: getProduct(slugA), b: getProduct(slugB) };
  }

  /* Business-type presets: a sensible starting bundle, one click. */
  var PRESETS = [
    { key: "freelancer", label: "Solo freelancer",
      desc: "Get paid, see cash, tame the inbox, get things signed — the one-person back office.",
      slugs: ["invoicepilot-ai", "cashflow-ai", "triagepilot-ai", "signpilot-ai"] },
    { key: "cafe", label: "Café / restaurant",
      desc: "Staff the floor, fill the tables, and make “how we do things here” a checklist.",
      slugs: ["shiftplan-ai", "bookpilot-ai", "sopforge-ai", "onboardpilot-ai", "cashflow-ai"] },
    { key: "homeservices", label: "Home services crew",
      desc: "Book the job, sign the work, bill the client, grow the team.",
      slugs: ["bookpilot-ai", "signpilot-ai", "invoicepilot-ai", "hirewise-ai", "onboardpilot-ai"] }
  ];
  function presetSlugs(key) {
    for (var i = 0; i < PRESETS.length; i++) {
      if (PRESETS[i].key === key) return PRESETS[i].slugs.slice();
    }
    return [];
  }

  /* --- Build-your-bundle quote ---------------------------------------------
   * Pick any subset; the quote tells you whether Back-Office OS ($139/mo)
   * beats buying your picks separately. Honest both ways.
   */
  function quotePlan(slugs) {
    var picks = [];
    var seen = {};
    (slugs || []).forEach(function (slug) {
      var p = getProduct(slug);
      if (p && !seen[slug]) { seen[slug] = true; picks.push(p); }
    });
    var separate = picks.reduce(function (sum, p) { return sum + p.price; }, 0);
    var price = bundlePrice();
    var bundleCheaper = separate > price;
    return {
      picks: picks.map(function (p) { return p.slug; }),
      count: picks.length,
      separate: separate,
      effective: bundleCheaper ? price : separate,
      bundleApplies: bundleCheaper,
      savings: bundleCheaper ? separate - price : 0,
      verdict: picks.length === 0
        ? "Pick at least one product to see your quote."
        : bundleCheaper
          ? "Take Back-Office OS — all ten for $139/mo beats your picks by $" + (separate - price) + "/mo."
          : "Buy your picks separately for $" + separate + "/mo — the bundle only wins when your picks total more than $139."
    };
  }

  /* --- Pain-point finder ----------------------------------------------------
   * Plain-English pains, each mapped to the products built to fix them.
   */
  var PAINS = [
    { key: "late-invoices", label: "Clients pay late", slugs: ["invoicepilot-ai", "cashflow-ai"] },
    { key: "cash-crunch", label: "Cash flow surprises", slugs: ["cashflow-ai", "invoicepilot-ai"] },
    { key: "hiring", label: "Hiring is chaos", slugs: ["hirewise-ai", "onboardpilot-ai"] },
    { key: "scheduling", label: "Shift scheduling scrambles", slugs: ["shiftplan-ai", "onboardpilot-ai"] },
    { key: "tribal-knowledge", label: "Knowledge lives in heads", slugs: ["sopforge-ai", "bizbrain-ai"] },
    { key: "inbox", label: "Inbox overload", slugs: ["triagepilot-ai", "bizbrain-ai"] },
    { key: "signing", label: "Chasing signatures", slugs: ["signpilot-ai", "bookpilot-ai"] },
    { key: "repeat-questions", label: "Same questions, twice", slugs: ["bizbrain-ai", "sopforge-ai"] }
  ];

  function recommend(painKey) {
    var pain = null;
    PAINS.forEach(function (p) { if (p.key === painKey) pain = p; });
    if (!pain) return { pain: null, products: [] };
    return {
      pain: pain,
      products: pain.slugs.map(getProduct).filter(Boolean)
    };
  }

  /* --- Search / filter ------------------------------------------------------ */
  function searchProducts(query, group) {
    var q = (query || "").trim().toLowerCase();
    return PRODUCTS.filter(function (p) {
      if (group && group !== "all" && groupOf(p.slug) !== group) return false;
      if (!q) return true;
      var hay = (p.name + " " + p.tagline + " " + p.features.join(" ")).toLowerCase();
      return hay.indexOf(q) !== -1;
    });
  }

  return {
    PRODUCTS: PRODUCTS, FLOW: FLOW, BUNDLE: BUNDLE, PAINS: PAINS, PRESETS: PRESETS,
    repoUrl: repoUrl, bundlePrice: bundlePrice, groupOf: groupOf,
    allGroups: allGroups, getProduct: getProduct, quotePlan: quotePlan,
    recommend: recommend, searchProducts: searchProducts,
    roiEstimate: roiEstimate, hoursSavedFor: hoursSavedFor,
    compareProducts: compareProducts, presetSlugs: presetSlugs
  };
});
