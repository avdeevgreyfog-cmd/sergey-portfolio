from pathlib import Path
import contextlib, http.server, json, socketserver, threading, sys
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]; DIST=ROOT/'dist'; OUT=ROOT/'qa-screens'; REPORT=ROOT/'visual-report'; BASE='/sergey-portfolio'
OUT.mkdir(exist_ok=True); REPORT.mkdir(exist_ok=True)
class H(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*a): pass
 def translate_path(self,p):
  raw=p.split('?',1)[0]; raw=raw[len(BASE):] if raw.startswith(BASE) else raw; rel=raw.lstrip('/'); t=DIST/rel
  if raw.endswith('/') or t.is_dir(): t=t/'index.html'
  return str(t if t.exists() else DIST/'404.html')
@contextlib.contextmanager
def server():
 with socketserver.ThreadingTCPServer(('127.0.0.1',0),H) as s:
  th=threading.Thread(target=s.serve_forever,daemon=True); th.start()
  try: yield f'http://127.0.0.1:{s.server_address[1]}{BASE}'
  finally: s.shutdown(); th.join(timeout=2)

def main():
 findings=[]; shots=[]
 routes=[('home','/'),('case','/work/raznye-ludi/'),('demo','/demo/raznye-ludi/'),('material','/effects/digital-material/')]
 viewports=[(390,844),(834,1112),(1440,900),(1920,1080)]
 with server() as origin, sync_playwright() as p:
  browser=p.chromium.launch(headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
  for name,route in routes:
   for w,h in viewports if name in ('home','case') else [(390,844),(1440,900)]:
    page=browser.new_page(viewport={'width':w,'height':h},device_scale_factor=1)
    page.goto(origin+route,wait_until='networkidle'); page.wait_for_timeout(250)
    metrics=page.evaluate("""() => ({sw:document.documentElement.scrollWidth,cw:document.documentElement.clientWidth, h1:[...document.querySelectorAll('h1')].map(e=>{const r=e.getBoundingClientRect();return {w:r.width,h:r.height,left:r.left,right:r.right,top:r.top}}), broken:[...document.images].filter(i=>!i.complete||i.naturalWidth===0).map(i=>i.src)})""")
    if metrics['sw']>metrics['cw']+1: findings.append({'severity':'MAJOR','route':route,'viewport':w,'issue':f'horizontal overflow {metrics["sw"]}>{metrics["cw"]}'})
    if metrics['broken']: findings.append({'severity':'MAJOR','route':route,'viewport':w,'issue':f'broken media: {metrics["broken"][:3]}'})
    for box in metrics['h1']:
     if box['left']<-2 or box['right']>w+2: findings.append({'severity':'MAJOR','route':route,'viewport':w,'issue':'H1 clipping'})
    path=OUT/f'{name}-{w}.png'; page.screenshot(path=str(path),full_page=True); shots.append(str(path.relative_to(ROOT))); page.close()
  browser.close()
 report={'screenshots':shots,'findings':findings,'critical':sum(f['severity']=='CRITICAL' for f in findings),'major':sum(f['severity']=='MAJOR' for f in findings)}
 (REPORT/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
 print(json.dumps(report,ensure_ascii=False,indent=2))
 return 1 if report['critical'] or report['major'] else 0
if __name__=='__main__': sys.exit(main())
