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

  return { PRODUCTS: PRODUCTS, FLOW: FLOW, BUNDLE: BUNDLE, repoUrl: repoUrl };
});
