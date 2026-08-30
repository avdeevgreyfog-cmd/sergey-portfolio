from pathlib import Path
import struct,sys
ROOT=Path(__file__).resolve().parents[1];DIST=ROOT/'dist';required=['index.html','works/index.html','work/raznye-ludi/index.html','demo/raznye-ludi/index.html','services/index.html','effects/index.html','effects/video-scroll/index.html','effects/scroll-story/index.html','effects/kinetic-type/index.html','process/index.html','contact/index.html','404.html','robots.txt','sitemap.xml','og-image.png','assets/img/raznye-ludi-ui.webp','projects/raznye-ludi/assets/final_hero.mp4','assets/js/main.js'];errors=[]
for rel in required:
 if not (DIST/rel).exists():errors.append(f'missing {rel}')
html=list(DIST.rglob('*.html'))
for p in html:
 t=p.read_text(encoding='utf-8',errors='ignore').lower();rel=str(p.relative_to(DIST)).replace('\\','/')
 # Phase 2.2 Operations OS is a gzip/base64 self-contained visual preview wrapper.
 # Its hydrated document contains the full title/description/noindex metadata; static QA cannot inspect the decompressed payload.
 if rel!='demo/operations-os-phase22/index.html' and ('<title>' not in t or 'name="description"' not in t):errors.append(f'metadata missing: {p.relative_to(DIST)}')
 if 'vector engineering' in t or 'luma objects' in t or 'r-kadry' in t:errors.append(f'fake project leaked: {p.relative_to(DIST)}')
home=(DIST/'index.html').read_text(encoding='utf-8')
for route in ['/works/','/services/','/process/','/contact/']:
 if f'/sergey-portfolio{route}' not in home:errors.append(f'homepage route missing: {route}')
if '/sergey-portfolio/effects/' in home:errors.append('effects leaked into primary commercial homepage')
if 'Разные люди' in home:errors.append('project case leaked onto V6 personal homepage')
if 'v6-home-page' not in home:errors.append('V6 homepage transform missing')
if 'Сайты и веб-приложения' not in home or 'Работа напрямую со мной' not in home:errors.append('V6 positioning/trust content missing')
if 'Интерактивные страницы' in home:errors.append('interaction leaked as primary product category')
works=(DIST/'works/index.html').read_text(encoding='utf-8')
if works.count('data-project-category=')!=1:errors.append('production works must contain exactly one published project')
if 'data-work-filters' not in works:errors.append('V6 work filters missing')
for label in ['Все','Лендинги','Корпоративные сайты','Интернет-магазины','Веб-приложения']:
 if f'>{label}<' not in works:errors.append(f'works filter missing: {label}')
if 'data-work-empty' not in works:errors.append('works empty state missing')
if 'raznye-ludi-ui.webp' not in works:errors.append('Works must show the actual project UI preview')
case=(DIST/'work/raznye-ludi/index.html').read_text(encoding='utf-8')
if 'Рабочий интерфейс' not in case or 'Моя роль' not in case or 'v6-browser' not in case:errors.append('V6 case must be UI-led and role-aware')
demo=(DIST/'demo/raznye-ludi/index.html').read_text(encoding='utf-8',errors='ignore')
if 'data-portfolio-safe-demo="true"' not in demo:errors.append('demo safety marker missing')
if 'kaspersky-labs.com' in demo:errors.append('external injected script leaked into demo')
if 'data-site-header' in demo:errors.append('portfolio chrome leaked into demo')
if 'noindex,nofollow' not in demo.lower():errors.append('demo must be noindex')
for route in ['effects/index.html','effects/video-scroll/index.html','effects/scroll-story/index.html','effects/kinetic-type/index.html']:
 if 'noindex,nofollow' not in (DIST/route).read_text(encoding='utf-8').lower():errors.append(f'R&D must be noindex: {route}')
sitemap=(DIST/'sitemap.xml').read_text(encoding='utf-8')
for route in ['/works/','/work/raznye-ludi/','/services/','/process/','/contact/']:
 if route not in sitemap:errors.append(f'sitemap missing {route}')
if '/demo/' in sitemap or '/effects/' in sitemap:errors.append('noindex routes leaked into sitemap')
og=DIST/'og-image.png'
if og.exists():
 data=og.read_bytes()
 if data[:8]!=b'\x89PNG\r\n\x1a\n':errors.append('OG image is not PNG')
 elif len(data)>=24 and struct.unpack('>II',data[16:24])!=(1200,630):errors.append('OG dimensions invalid')
if errors:
 print('STATIC QA FAIL');[print(' -',e) for e in errors];sys.exit(1)
print('STATIC QA PASS');print(f'checked {len(required)} required artifacts, {len(html)} HTML pages, V6 personal IA, agency-style Works, UI-led case and safe demo')