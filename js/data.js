/* ops-hub — Back-Office OS dashboard. No build, no deps. */
(function (root, factory) {
  if (typeof module !== "undefined" && module.exports) module.exports = factory();
  else root.OpsHubData = factory();
})(typeof self !== "undefined" ? self : this, function () {
  var PRODUCTS = [
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
      slug: "triagepilot-ai",
      name: "TriagePilot",
      tagline: "The inbox, sorted before coffee.",
      price: 24,
      features: [
        "Local classifier: Urgent / Needs reply / FYI / Spam with plain-language reasons",
        "One-click reply drafts in professional or friendly tone",
        "Daily digest bar; 100% in-browser, nothing leaves your device"
      ]
    }
  ];

  var FLOW = [
    {
      step: 1,
      title: "Hire",
      text: "HireWise helps you write a fair, appealing job post and screen applicants on evidence instead of gut feel."
    },
    {
      step: 2,
      title: "Train",
      text: "SOPForge turns 'how we do things here' into checklists your new hire follows from day one — no more tribal knowledge."
    },
    {
      step: 3,
      title: "Focus",
      text: "TriagePilot keeps the owner's inbox sorted and drafted, so you manage the system instead of drowning in email."
    }
  ];

  var BUNDLE = {
    name: "Back-Office OS",
    pitch: "$49/mo",
    perProductTotal: 68
  };

  function repoUrl(slug) {
    return "https://github.com/alexwboles/" + slug;
  }

  return { PRODUCTS: PRODUCTS, FLOW: FLOW, BUNDLE: BUNDLE, repoUrl: repoUrl };
});
