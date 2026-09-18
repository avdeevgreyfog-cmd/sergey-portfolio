from pathlib import Path
import sys
ROOT=Path(__file__).resolve().parents[1]; D=ROOT/'dist'; errors=[]
req=['index.html','works/index.html','work/raznye-ludi/index.html','work/operations-os/index.html','about/index.html','contact/index.html','services/index.html','process/index.html','demo/operations-os/index.html','404.html','robots.txt','sitemap.xml','assets/js/v7-main.js','assets/css/v7-base.css','assets/css/v7-pages.css','assets/css/v7-responsive.css','assets/css/portfolio.css','assets/img/orbital-sculpture.webp']
for r in req:
 if not (D/r).exists(): errors.append('missing '+r)
checks={'index.html':['Проектирую','Собираю продукт','data-home-v10','homeWorksGate','/sergey-portfolio/works/','/sergey-portfolio/about/'],'works/index.html':['data-work-filters','data-project-category="Сайты"','data-project-category="Системы"','Operations OS'],'work/raznye-ludi/index.html':['Рабочий интерфейс','Моя роль','raznye-ludi-ui.webp'],'work/operations-os/index.html':['Client → Request','Next.js · TypeScript · PostgreSQL','/demo/operations-os/'],'about/index.html':['Обо мне','Продуманные решения'],'contact/index.html':['Обсудить','data-contact-form','data-contact-result'],'services/index.html':['Что могу разработать'],'process/index.html':['Как проходит работа']}
for rel,needles in checks.items():
 p=D/rel
 if p.exists():
  text=p.read_text(encoding='utf-8')
  for n in needles:
   if n not in text: errors.append(f'{rel}: missing {n}')
home=(D/'index.html').read_text(encoding='utf-8') if (D/'index.html').exists() else ''
for leaked in ['raznye-ludi-ui.webp','Избранная работа','Operations OS</h2>']:
 if leaked in home: errors.append('homepage project preview leaked: '+leaked)
for p in D.rglob('*.html'):
 rel=str(p.relative_to(D)).replace('\\','/')
 if rel=='demo/operations-os-phase22/index.html': continue
 t=p.read_text(encoding='utf-8',errors='ignore').lower()
 if '<title>' not in t or 'name="description"' not in t: errors.append(f'metadata missing: {rel}')
for fake in ['50+','100% фокус','5+ лет']:
 for p in [D/'index.html',D/'about/index.html']:
  if p.exists() and fake.lower() in p.read_text(encoding='utf-8').lower(): errors.append('unverified claim leaked: '+fake)
if errors:
 print('V10 STATIC QA FAIL'); [print(' -',x) for x in errors]; sys.exit(1)
print('V10 STATIC QA PASS')
