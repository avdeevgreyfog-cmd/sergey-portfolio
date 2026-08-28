from pathlib import Path
import json, re, subprocess, sys

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / 'dist'
errors = []

required = [
    'index.html','works/index.html','lab/index.html',
    'work/raznye-ludi/index.html','work/b2b-engineering/index.html','work/design-light-store/index.html','work/r-kadry-demo/index.html',
    'demo/raznye-ludi/index.html','demo/b2b-engineering/index.html','demo/design-light-store/index.html','demo/r-kadry-demo/index.html',
    'assets/app.js','assets/data.js','styles.css','robots.txt','vercel.json'
]
for rel in required:
    if not (DIST / rel).exists(): errors.append(f'missing: {rel}')

for html in DIST.rglob('*.html'):
    text = html.read_text(encoding='utf-8')
    if 'Lorem ipsum' in text or 'TODO' in text or 'example.com' in text:
        errors.append(f'public placeholder in {html.relative_to(DIST)}')
    if '<title>' not in text or 'meta name="description"' not in text:
        errors.append(f'metadata missing in {html.relative_to(DIST)}')

css = (DIST/'styles.css').read_text(encoding='utf-8') if (DIST/'styles.css').exists() else ''
if 'prefers-reduced-motion' not in css: errors.append('reduced motion CSS missing')
if '@media(max-width:760px)' not in css: errors.append('mobile breakpoint missing')

app = (DIST/'assets/app.js').read_text(encoding='utf-8') if (DIST/'assets/app.js').exists() else ''
for marker in ['data-checkout-form','data-crm-calc','data-b2b-form','data-demo-form','data-product-open','data-request-status']:
    if marker not in app: errors.append(f'core interaction marker missing: {marker}')

try:
    cfg=json.loads((DIST/'vercel.json').read_text())
    if not cfg.get('headers'): errors.append('vercel demo noindex headers missing')
except Exception as e:
    errors.append(f'invalid vercel.json: {e}')

if errors:
    print('QA FAIL')
    for e in errors: print('-',e)
    sys.exit(1)
print('QA PASS')
print(f'checked {len(required)} required artifacts and {len(list(DIST.rglob("*.html")))} html pages')
