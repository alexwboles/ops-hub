# Redesign Audit — ops-hub ("The Ledger Desk")
Date: 2026-10-13 · Worker: batch-hubs

## Competitors researched
1. **Gusto** — calm small-business dashboard: simple nav, plain-language cards, payroll status at a glance, generous whitespace, friendly-but-professional.
2. **Rippling** — lean minimal interface, quickfire main menu (people / apps / tasks / reporting), central work area, unified-record thinking, tabular data.
3. **G2 business-software category pages** — faceted filters, spec comparison tables, honest pros/cons framing.

## Visual gaps (current state)
- Generic light theme with blue accents — same template voice as every other hub; nothing says "back office".
- Product cards are plain white boxes; prices are plain text, not ledger figures.
- The 4-group structure (Money / People / Paperwork / Brain) is only a dropdown filter — Rippling/Gusto would make it the primary navigation.
- Flow section ("money in, people on board…") is a vertical stack of boxes, not a process rail.
- ROI calculator and presets exist but look like loose form elements, not a console.

## Functional gaps (vs competitors)
- **No group-tab navigation.** The dropdown works, but a back-office desk wants the four groups as tabs (Rippling's quickfire menu). Tabs + dropdown synced = competitor-grade.
- Compare is A/B selects — fine — but the table is unstyled.
- Preset buttons have hover-only descriptions; the active preset isn't clearly shown.
- Bundle math is a text paragraph; a ledger readout (separate → bundle → savings) reads more honest.

## Flow gaps
- Pain finder ("what hurts?") → recommended cards highlight; the payoff is subtle.
- No "start here" guidance for a new business (presets partially cover this, but they're below the fold).

## Plan (this redesign)
1. **Identity: "The Ledger Desk"** — calm back-office command desk. Warm stone paper (#f4f3ef), ink (#1d1b16), one deep-green accent (#0f6e5a, money-calm). Tabular mono figures for every price. Sharp corners, ledger rules.
2. **Group tabs (new):** Money / People / Paperwork / Brain tabs synced with the group-filter select — the primary navigation, Rippling-style.
3. **Flow rail:** the 4-step "how it runs itself" as a horizontal process rail with step numbers.
4. **ROI console:** restyled as a desk calculator with a clear verdict readout.
5. **Ledger bundle card:** separate $203 → Back-Office OS $139 → you save $64, tabular.
6. Presets show the active state; compare table as a spec sheet.

## Preserved (must not regress)
- index.html IDs: pain-picks, pain-result, search, group-filter, result-count, pick-list, quote, preset-picks, roi-rate, roi-go, roi-result, cmp-a, cmp-b, cmp-table (+ cards, flow, preset-desc, build-bundle, bundle-math from app.js).
- Pain-point finder + recommend(); search + group filter; 10 product cards (group, name, tagline, features, price, repo link); 4-step flow; 3 presets; bundle builder + quotePlan; ROI estimator (roiEstimate); A/B compare (compareProducts); bundle math ($203 → $139, save $64).
