"""Release checks for the editorial preview, preserving original V6 checks separately."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
from PIL import Image
import sys
root=Path(__file__).resolve().parents[1]/'dist'
errors=[]
routes=['','projects','works','work/raznye-ludi','services','process','contact','effects','effects/kinetic-type','effects/scroll-story','effects/video-scroll','demo/raznye-ludi','demo/operations-os']
class Parse(HTMLParser):
 def __init__(self):super().__init__();self.refs=[];self.ids=set();self.h1=0;self.meta=False;self.images=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='h1':self.h1+=1
  if 'id' in a:self.ids.add(a['id'])
  if tag=='meta' and a.get('name')=='description':self.meta=True
  if tag in ['a','link'] and a.get('href'):self.refs.append(a['href'])
  if tag in ['img','script','source'] and a.get('src'):self.refs.append(a['src'])
  if tag=='img':self.images.append(a)
for r in routes:
 file=root/r/'index.html'
 if not file.exists():errors.append(f'Missing route {r}');continue
 txt=file.read_text();p=Parse();p.feed(txt)
 if p.h1!=1 and r!='demo/operations-os':errors.append(f'{r}: expected single h1, got {p.h1}')
 if not p.meta:errors.append(f'{r}: description missing')
 if r.startswith('demo'):continue
 base=''
 import re
 m=re.search('name="app-base" content="([^"]*)"',txt)
 if m:base=m[1]
 for ref in p.refs:
  u=urlsplit(ref)
  if u.scheme or u.netloc:continue
  if not u.path:
   if u.fragment and u.fragment not in p.ids:errors.append(f'{r}: missing anchor {ref}')
   continue
  rel=unquote(u.path)
  if base and rel.startswith(base+'/'):rel=rel[len(base):]
  target=root/rel.lstrip('/') if rel.startswith('/') else file.parent/rel
  if target.is_dir():target=target/'index.html'
  if not target.is_file():errors.append(f'{r}: missing local resource {ref}')
 for im in p.images:
  if 'alt' not in im:errors.append(f'{r}: image missing alt')
 for word in ['FitLife','BrewMind','LUME','+98%','85+']:
  if word in txt:errors.append(f'{r}: unverified content {word}')
for p in (root/'assets/img').glob('*.webp'):
 try:
  with Image.open(p) as im:im.load()
 except Exception as e:errors.append(f'Invalid image: {p.name}: {e}')
for p in ['projects','works']:
 txt=(root/p/'index.html').read_text()
 if 'data-work-filters' in txt:errors.append('Empty categories returned')
 if 'Эксперимент' not in txt:errors.append('Missing experiment labels')
contact=(root/'contact/index.html').read_text()
if 'Эта форма не отправляет сообщения' not in contact:errors.append('Contact must disclose missing delivery')
if errors:
 print('\n'.join(errors));sys.exit(1)
print(f'PASS: {len(routes)} routes, local links/assets, headings, metadata, image decoding, content provenance and contact disclosure.')

# Imported demo styles must stay local after rewriting upstream asset paths.
demo=(root / "demo/raznye-ludi/index.html").read_text()
assert 'href="/assets/css/demo-repairs.css"' in demo
assert '//projects/' not in demo
