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

echo "--- smoke: $PASS passed, $FAIL failed ---"
[ "$FAIL" -eq 0 ]
