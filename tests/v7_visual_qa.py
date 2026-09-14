from pathlib import Path
import contextlib,http.server,socketserver,threading,json,sys
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]; D=ROOT/'dist'; O=ROOT/'qa-screens'; R=ROOT/'visual-report'; O.mkdir(exist_ok=True);R.mkdir(exist_ok=True);BASE='/sergey-portfolio'
class H(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
 def translate_path(self,p):
  raw=p.split('?',1)[0];raw=raw[len(BASE):] if raw.startswith(BASE) else raw;t=D/raw.lstrip('/')
  if raw.endswith('/') or t.is_dir():t=t/'index.html'
  return str(t if t.exists() else D/'404.html')
@contextlib.contextmanager
def server():
 with socketserver.ThreadingTCPServer(('127.0.0.1',0),H) as s:
  th=threading.Thread(target=s.serve_forever,daemon=True);th.start()
  try:yield f'http://127.0.0.1:{s.server_address[1]}{BASE}'
  finally:s.shutdown();th.join(timeout=2)
def settle(page):
 page.evaluate("""() => {document.querySelectorAll('[data-reveal]').forEach(e=>{e.classList.add('is-visible');e.style.transition='none';e.style.opacity='1';e.style.transform='none'});document.querySelectorAll('img').forEach(i=>i.loading='eager')}""")
 try:page.wait_for_function("() => [...document.images].every(i=>i.complete)",timeout=8000)
 except Exception:pass
 page.wait_for_timeout(180)
findings=[];shots=[]
with server() as origin,sync_playwright() as p:
 b=p.chromium.launch(headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for name,route in [('home','/'),('works','/works/'),('raznye','/work/raznye-ludi/'),('ops','/work/operations-os/'),('about','/about/'),('contact','/contact/')]:
  for w,h in [(390,844),(1440,900)]:
   page=b.new_page(viewport={'width':w,'height':h});page.goto(origin+route,wait_until='domcontentloaded');settle(page);sw=page.evaluate('document.documentElement.scrollWidth');cw=page.evaluate('document.documentElement.clientWidth')
   if sw>cw+1:findings.append({'route':route,'viewport':w,'issue':f'overflow {sw}>{cw}'})
   f=O/f'{name}-{w}.png';page.screenshot(path=str(f),full_page=True);shots.append(str(f.relative_to(ROOT)));page.close()
 b.close()
report={'screenshots':shots,'findings':findings};(R/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8');print(json.dumps(report,ensure_ascii=False,indent=2));sys.exit(1 if findings else 0)
