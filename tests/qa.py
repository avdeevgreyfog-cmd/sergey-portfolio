from pathlib import Path
import re, struct, sys
ROOT=Path(__file__).resolve().parents[1]; DIST=ROOT/'dist'
required=[
 'index.html','works/index.html','work/raznye-ludi/index.html','demo/raznye-ludi/index.html',
 'effects/index.html','effects/video-scroll/index.html','effects/scroll-story/index.html','effects/kinetic-type/index.html',
 'process/index.html','contact/index.html','404.html','robots.txt','sitemap.xml','og-image.png',
 'projects/raznye-ludi/assets/final_hero.mp4','projects/raznye-ludi/assets/scene_01.webp','assets/js/main.js'
]
errors=[]
for rel in required:
 p=DIST/rel
 if not p.exists(): errors.append(f'missing {rel}')
html_files=list(DIST.rglob('*.html'))
for p in html_files:
 text=p.read_text(encoding='utf-8',errors='ignore').lower()
 if '<title>' not in text or 'name="description"' not in text: errors.append(f'metadata missing: {p.relative_to(DIST)}')
 if 'vector engineering' in text or 'luma objects' in text or 'r-kadry' in text: errors.append(f'fake legacy project leaked: {p.relative_to(DIST)}')
home=(DIST/'index.html').read_text(encoding='utf-8')
for anchor in ['#work','#process','#contact']:
 if f'href="/sergey-portfolio/{anchor}' in home or f'href="{anchor}' in home: errors.append(f'anchor navigation leaked: {anchor}')
for route in ['/works/','/effects/','/process/','/contact/']:
 if f'/sergey-portfolio{route}' not in home: errors.append(f'homepage route missing: {route}')
works=(DIST/'works/index.html').read_text(encoding='utf-8')
if works.count('data-project-category=') != 1: errors.append('production works must contain exactly one published project')
if 'data-work-filters' in works: errors.append('filters should stay hidden with one meaningful category')
demo=(DIST/'demo/raznye-ludi/index.html').read_text(encoding='utf-8',errors='ignore')
if 'data-portfolio-safe-demo="true"' not in demo: errors.append('demo safety marker missing')
if 'kaspersky-labs.com' in demo: errors.append('external injected script leaked into demo')
if 'data-site-header' in demo or 'Сергей Авдеев — портфолио' in demo: errors.append('portfolio chrome leaked into demo')
if 'noindex,nofollow' not in demo.lower(): errors.append('demo must be noindex')
for route in ['video-scroll','scroll-story','kinetic-type']:
 text=(DIST/f'effects/{route}/index.html').read_text(encoding='utf-8')
 if 'noindex,nofollow' not in text.lower(): errors.append(f'effect detail must be noindex: {route}')
sitemap=(DIST/'sitemap.xml').read_text(encoding='utf-8')
for route in ['/','/works/','/work/raznye-ludi/','/effects/','/process/','/contact/']:
 if route not in sitemap: errors.append(f'sitemap missing {route}')
if '/demo/' in sitemap or '/effects/video-scroll/' in sitemap: errors.append('noindex routes leaked into sitemap')
og=DIST/'og-image.png'
if og.exists():
 data=og.read_bytes()
 if data[:8]!=b'\x89PNG\r\n\x1a\n': errors.append('OG image is not PNG')
 elif len(data)>=24:
  w,h=struct.unpack('>II',data[16:24])
  if (w,h)!=(1200,630): errors.append(f'OG dimensions {(w,h)} != (1200,630)')
if errors:
 print('STATIC QA FAIL'); [print(' -',e) for e in errors]; sys.exit(1)
print('STATIC QA PASS')
print(f'checked {len(required)} required artifacts, {len(html_files)} HTML pages, multipage IA, one real project and demo safety')
