#!/usr/bin/env bash
# smoke.sh — static checks for ops-hub
set -u
PASS=0; FAIL=0
ok()  { PASS=$((PASS+1)); echo "PASS: $1"; }
bad() { FAIL=$((FAIL+1)); echo "FAIL: $1"; }

DIR="$(cd "$(dirname "$0")/.." && pwd)"

# 1-5: required files exist
for f in index.html README.md css/style.css js/data.js js/app.js test/smoke.sh test/e2e.sh; do
  [ -f "$DIR/$f" ] && ok "file exists: $f" || bad "missing file: $f"
done

# 6-7: JS syntax
node --check "$DIR/js/data.js" && ok "data.js syntax" || bad "data.js syntax"
node --check "$DIR/js/app.js" && ok "app.js syntax" || bad "app.js syntax"

# 8: data assertions via node
node -e "
const d = require('$DIR/js/data.js');
const assert = (c, m) => { if (!c) { console.error('FAIL: ' + m); process.exit(1); } };
assert(d.PRODUCTS.length === 10, 'exactly 10 products');
assert(d.PRODUCTS.every(p => p.slug && p.name && p.tagline && p.price > 0), 'products have slug/name/tagline/price');
assert(d.PRODUCTS.every(p => Array.isArray(p.features) && p.features.length === 3), '3 features each');
const slugs = d.PRODUCTS.map(p => p.slug).sort().join(',');
assert(slugs === 'bizbrain-ai,bookpilot-ai,cashflow-ai,hirewise-ai,invoicepilot-ai,onboardpilot-ai,shiftplan-ai,signpilot-ai,sopforge-ai,triagepilot-ai', 'expected slugs: ' + slugs);
assert(d.PRODUCTS.every(p => d.repoUrl(p.slug) === 'https://github.com/alexwboles/' + p.slug), 'repo URLs well-formed');
const sum = d.PRODUCTS.reduce((a, p) => a + p.price, 0);
assert(sum === 203, 'bundle math 15+29+24+19+19+19+19+15+29+15=203, got ' + sum);
assert(d.BUNDLE.perProductTotal === sum, 'BUNDLE.perProductTotal matches');
assert(d.BUNDLE.pitch.includes('139'), 'BUNDLE.pitch is the bundle price');
assert(d.BUNDLE.savings === 64, 'BUNDLE.savings 203-139=64, got ' + d.BUNDLE.savings);
assert(d.FLOW.length === 4 && d.FLOW.every(s => s.step && s.title && s.text), 'flow has 4 steps');
console.log('PASS: data assertions (10 inner checks)');
" && PASS=$((PASS+1)) || { FAIL=$((FAIL+1)); }

# 9: html references assets
grep -q 'css/style.css' "$DIR/index.html" && grep -q 'js/data.js' "$DIR/index.html" && grep -q 'js/app.js' "$DIR/index.html" \
  && ok "index.html references all assets" || bad "index.html asset refs"

# 10: README mentions all 10 products
ALL_OK=1
for s in bizbrain-ai bookpilot-ai cashflow-ai hirewise-ai invoicepilot-ai onboardpilot-ai shiftplan-ai signpilot-ai sopforge-ai triagepilot-ai; do
  grep -q "$s" "$DIR/README.md" || ALL_OK=0
done
[ "$ALL_OK" -eq 1 ] && ok "README covers all 10 products" || bad "README product coverage"

# new interactive sections present
for id in pain-picks pain-result search group-filter result-count pick-list quote preset-picks roi-rate roi-go roi-result cmp-a cmp-b cmp-table; do
  grep -q "id=\"$id\"" "$DIR/index.html" && ok "index.html has #$id" || bad "index.html missing #$id"
done

# 11: second-sweep logic — presets, ROI, compare
node -e "
const d = require('$DIR/js/data.js');
// presets
if (d.PRESETS.length !== 3) process.exit(1);
d.PRESETS.forEach(p => {
  const slugs = d.presetSlugs(p.key);
  if (slugs.length < 3) process.exit(1);
  slugs.forEach(s => { if (!d.getProduct(s)) process.exit(1); });
});
if (d.presetSlugs('nope').length !== 0) process.exit(1);
// ROI
const all = d.PRODUCTS.map(p => p.slug);
const r = d.roiEstimate(50, all);
if (!r.ok) process.exit(1);
const expectedHours = d.hoursSavedFor(all);
if (r.hours !== expectedHours || r.value !== expectedHours * 50) process.exit(1);
if (r.cost !== d.quotePlan(all).effective) process.exit(1);
if (!r.verdict.includes('Worth it')) process.exit(1);
const bad1 = d.roiEstimate(0, all);
if (bad1.ok) process.exit(1);
const bad2 = d.roiEstimate(50, []);
if (bad2.ok) process.exit(1);
const cheap = d.roiEstimate(5, ['signpilot-ai']);
if (!cheap.ok || cheap.value !== 2 * 5) process.exit(1);
// compare
const c = d.compareProducts('invoicepilot-ai', 'cashflow-ai');
if (!c.a || !c.b || c.a.slug !== 'invoicepilot-ai' || c.b.slug !== 'cashflow-ai') process.exit(1);
if (c.a.price !== 19 || c.b.price !== 19) process.exit(1);
const cn = d.compareProducts('invoicepilot-ai', 'nope');
if (cn.b) process.exit(1);
console.log('ok');
" >/dev/null && ok "flow10: roiEstimate + compareProducts + presetSlugs" || bad "flow10"

echo "--- smoke: $PASS passed, $FAIL failed ---"
[ "$FAIL" -eq 0 ]
