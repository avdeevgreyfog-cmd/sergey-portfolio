from pathlib import Path
import sys
ROOT=Path(__file__).resolve().parents[1]; D=ROOT/'dist'; errors=[]
req=['index.html','works/index.html','work/raznye-ludi/index.html','work/operations-os/index.html','about/index.html','contact/index.html','services/index.html','process/index.html','demo/operations-os/index.html','404.html','robots.txt','sitemap.xml','assets/js/v7-main.js','assets/css/v7-base.css','assets/css/v7-pages.css','assets/css/v7-responsive.css']
for r in req:
 if not (D/r).exists(): errors.append('missing '+r)
checks={'index.html':['Код,','Сайты и веб-приложения','/sergey-portfolio/works/','/sergey-portfolio/about/'],'works/index.html':['data-work-filters','data-project-category="Сайты"','data-project-category="Системы"','Operations OS'],'work/raznye-ludi/index.html':['Рабочий интерфейс','Моя роль','raznye-ludi-ui.webp'],'work/operations-os/index.html':['Client → Request','Next.js · TypeScript · PostgreSQL','/demo/operations-os/'],'about/index.html':['Обо мне','Продуманные решения'],'contact/index.html':['Обсудить','data-contact-form','data-contact-result'],'services/index.html':['Что могу разработать'],'process/index.html':['Как проходит работа']}
for rel,needles in checks.items():
 p=D/rel
 if p.exists():
  text=p.read_text(encoding='utf-8')
  for n in needles:
   if n not in text: errors.append(f'{rel}: missing {n}')
for p in D.rglob('*.html'):
 t=p.read_text(encoding='utf-8',errors='ignore').lower()
 if '<title>' not in t or 'name="description"' not in t: errors.append(f'metadata missing: {p.relative_to(D)}')
for fake in ['50+','100% фокус','5+ лет']:
 for p in [D/'index.html',D/'about/index.html']:
  if p.exists() and fake.lower() in p.read_text(encoding='utf-8').lower(): errors.append('unverified claim leaked: '+fake)
if errors:
 print('V7 STATIC QA FAIL'); [print(' -',x) for x in errors]; sys.exit(1)
print('V7 STATIC QA PASS')