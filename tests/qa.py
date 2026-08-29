from pathlib import Path
import struct, sys

ROOT=Path(__file__).resolve().parents[1]
DIST=ROOT/'dist'
errors=[]
required=[
 'index.html','work/raznye-ludi/index.html','demo/raznye-ludi/index.html',
 'effects/video-scroll/index.html','effects/scroll-story/index.html','effects/digital-material/index.html','effects/type-reveal/index.html',
 'assets/js/main.js','assets/css/base.css','assets/css/portfolio.css','assets/css/case.css','assets/css/effects.css',
 'favicon.svg','og-image.png','site.webmanifest','robots.txt','sitemap.xml','404.html',
 'projects/raznye-ludi/assets/final_hero.mp4','projects/raznye-ludi/assets/final_logo.png'
]
for rel in required:
 p=DIST/rel
 if not p.exists(): errors.append(f'missing: {rel}')

for i in range(1,12):
 p=DIST/'projects/raznye-ludi/assets'/f'scene_{i:02}.webp'
 if not p.exists(): errors.append(f'missing Raznye asset: {p.name}')

if (DIST/'projects/raznye-ludi/assets/final_hero.mp4').exists() and (DIST/'projects/raznye-ludi/assets/final_hero.mp4').stat().st_size < 1_000_000:
 errors.append('Raznye hero video is not a real imported media file')
og=DIST/'og-image.png'
if og.exists():
 data=og.read_bytes()
 if len(data) < 24 or data[:8] != b'\x89PNG\r\n\x1a\n':
  errors.append('OG image is not a valid PNG')
 else:
  width,height=struct.unpack('>II',data[16:24])
  if (width,height)!=(1200,630): errors.append(f'OG image dimensions must be 1200x630, got {width}x{height}')

for html in DIST.rglob('*.html'):
 text=html.read_text(encoding='utf-8',errors='replace')
 rel=html.relative_to(DIST)
 for banned in ['Lorem ipsum','example@email.com','example.com','Coming soon','VECTOR Engineering','LUMA Objects','Р-Кадры Demo']:
  if banned in text: errors.append(f'public stale/fake content in {rel}: {banned}')
 low=text.lower()
 if '<title>' not in low or 'name="description"' not in low: errors.append(f'metadata missing: {rel}')
 if rel.as_posix() not in ['demo/raznye-ludi/index.html'] and 'meta property="og:image"' not in text: errors.append(f'OG metadata missing: {rel}')

home=(DIST/'index.html').read_text(encoding='utf-8') if (DIST/'index.html').exists() else ''
for marker in ['Сайты и','веб-приложения','Что могу','Разные люди','Интерактив','Сергей Авдеев']:
 if marker not in home: errors.append(f'homepage marker missing: {marker}')
if '/works/' in home: errors.append('unneeded /works/ route linked from homepage')
if 'raw.githubusercontent.com' in home: errors.append('homepage leaks remote project media')

case=(DIST/'work/raznye-ludi/index.html').read_text(encoding='utf-8') if (DIST/'work/raznye-ludi/index.html').exists() else ''
for marker in ['Задача','Решение','Визуальный','Смотреть сайт']:
 if marker not in case: errors.append(f'case marker missing: {marker}')

demo=(DIST/'demo/raznye-ludi/index.html').read_text(encoding='utf-8',errors='replace') if (DIST/'demo/raznye-ludi/index.html').exists() else ''
for banned in ['kaspersky-labs.com','Portfolio Demo','Interactive Demo','data-viewport="mobile"','Desktop/Tablet/Mobile']:
 if banned in demo: errors.append(f'demo pollution: {banned}')
if 'noindex,nofollow' not in demo: errors.append('demo noindex missing')
if 'data-portfolio-safe-demo="true"' not in demo: errors.append('demo safe-mode marker missing')
if 'https://raw.githubusercontent.com' in demo: errors.append('demo uses remote GitHub media instead of deployed copy')
for asset in ['final_hero.mp4','scene_01.webp','scene_10.webp']:
 if f'/projects/raznye-ludi/assets/{asset}' not in demo: errors.append(f'demo asset rewrite missing: {asset}')

css='\n'.join(p.read_text(encoding='utf-8') for p in (DIST/'assets/css').glob('*.css')) if (DIST/'assets/css').exists() else ''
if 'prefers-reduced-motion' not in css: errors.append('reduced-motion CSS missing')
if ':focus-visible' not in css: errors.append('visible focus CSS missing')
if 'max-width:760px' not in css: errors.append('mobile composition breakpoint missing')

build=(ROOT/'scripts/build.mjs').read_text(encoding='utf-8')
if 'a566c822170ff8eb27e83e08937e5a37bbb8e8e5' not in build: errors.append('Raznye import is not pinned to approved source commit')
if 'kaspersky-labs' not in build: errors.append('portfolio-safe demo sanitization missing')

if errors:
 print('STATIC QA FAIL')
 for e in errors: print('-',e)
 sys.exit(1)
print('STATIC QA PASS')
print(f'checked {len(required)} required artifacts, {len(list(DIST.rglob("*.html")))} HTML pages, and pinned demo media')
