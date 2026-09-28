#!/usr/bin/env bash
# e2e.sh — logic flows for ops-hub (exercises the shared data module in Node)
set -u
PASS=0; FAIL=0
ok()  { PASS=$((PASS+1)); echo "PASS: $1"; }
bad() { FAIL=$((FAIL+1)); echo "FAIL: $1"; }

DIR="$(cd "$(dirname "$0")/.." && pwd)"

# Flow 1: product card data is render-complete
node -e "
const d = require('$DIR/js/data.js');
d.PRODUCTS.forEach(p => {
  if (!(p.name && p.tagline && p.features.length === 3 && typeof p.price === 'number')) { console.error('incomplete: ' + p.slug); process.exit(1); }
});
console.log('ok');
" >/dev/null && ok "flow1: all 10 products render-complete" || bad "flow1"

# Flow 2: bundle math narrative is consistent
node -e "
const d = require('$DIR/js/data.js');
const sum = d.PRODUCTS.reduce((a, p) => a + p.price, 0);
if (sum !== 203 || d.BUNDLE.perProductTotal !== 203) process.exit(1);
if (!d.BUNDLE.pitch.includes('139')) process.exit(1);
if (d.BUNDLE.savings !== 64 || d.BUNDLE.savings !== 203 - 139) process.exit(1);
console.log('ok');
" >/dev/null && ok "flow2: bundle math 203 vs pitch 139, savings 64 consistent" || bad "flow2"

# Flow 3: flow section tells the money -> people -> paperwork -> brain story in order
node -e "
const d = require('$DIR/js/data.js');
const titles = d.FLOW.map(s => s.title).join('|');
if (titles !== 'Money|People|Paperwork|Brain') { console.error(titles); process.exit(1); }
const text = d.FLOW.map(s => s.text).join(' ').toLowerCase();
if (!text.includes('invoice') || !text.includes('hire') || !text.includes('inbox') || !text.includes('brain')) process.exit(1);
console.log('ok');
" >/dev/null && ok "flow3: money-people-paperwork-brain story in order" || bad "flow3"

# Flow 4: repo links point at the real repos
node -e "
const d = require('$DIR/js/data.js');
const urls = d.PRODUCTS.map(p => d.repoUrl(p.slug));
if (!urls.every(u => u.startsWith('https://github.com/alexwboles/'))) process.exit(1);
if (new Set(urls).size !== 10) process.exit(1);
console.log('ok');
" >/dev/null && ok "flow4: 10 distinct real repo links" || bad "flow4"

# Flow 5: no fake cross-product claims (each product's features stay in its lane)
node -e "
const d = require('$DIR/js/data.js');
const bySlug = Object.fromEntries(d.PRODUCTS.map(p => [p.slug, p.features.join(' ').toLowerCase()]));
if (bySlug['sopforge-ai'].includes('resume') || bySlug['sopforge-ai'].includes('inbox')) process.exit(1);
if (bySlug['hirewise-ai'].includes('checklist') || bySlug['hirewise-ai'].includes('triage')) process.exit(1);
if (bySlug['triagepilot-ai'].includes('job post') || bySlug['triagepilot-ai'].includes('checklist')) process.exit(1);
if (bySlug['invoicepilot-ai'].includes('resume') || bySlug['invoicepilot-ai'].includes('shift')) process.exit(1);
if (bySlug['cashflow-ai'].includes('job post') || bySlug['cashflow-ai'].includes('signature')) process.exit(1);
if (bySlug['signpilot-ai'].includes('booking') || bySlug['signpilot-ai'].includes('inbox')) process.exit(1);
if (bySlug['bizbrain-ai'].includes('payroll') || bySlug['bizbrain-ai'].includes('booking')) process.exit(1);
console.log('ok');
" >/dev/null && ok "flow5: features stay in their lane (honest connections)" || bad "flow5"

# Flow 6: app.js renders without a DOM error (minimal DOM stub)
node -e "
const d = require('$DIR/js/data.js');
global.window = { OpsHubData: d };
const created = [];
global.document = {
  getElementById: (id) => ({ appendChild: (el) => created.push([id, el]), set textContent(v) { this._t = v; } }),
  createElement: (tag) => ({ tag, className: '', innerHTML: '', appendChild() {} }),
};
require('$DIR/js/app.js');
if (created.filter(c => c[0] === 'cards').length !== 10) { console.error('cards: ' + created.length); process.exit(1); }
if (created.filter(c => c[0] === 'flow').length !== 4) process.exit(1);
console.log('ok');
" >/dev/null && ok "flow6: app.js renders 10 cards + 4 flow steps" || bad "flow6"

echo "--- e2e: $PASS passed, $FAIL failed ---"
[ "$FAIL" -eq 0 ]
