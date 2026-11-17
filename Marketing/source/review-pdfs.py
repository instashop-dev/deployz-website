from pathlib import Path
import subprocess,json
from pypdf import PdfReader
from reportlab.pdfgen import canvas

ROOT=Path(__file__).resolve().parents[1]
BUILD=ROOT/'.build/review';BUILD.mkdir(exist_ok=True)

# A visual PDF export. Use the PPTX for editable and selectable slide text.
slides=sorted((ROOT/'.build/deck').glob('slide-*.png'))
if slides:
    c=canvas.Canvas(str(ROOT/'pdf/deployz-sales-deck.pdf'),pagesize=(960,540))
    c.setTitle('Deployz sales presentation');c.setAuthor('Deployz')
    for s in slides:c.drawImage(str(s),0,0,width=960,height=540);c.showPage()
    c.save()

report=[]
for p in sorted((ROOT/'pdf').glob('*.pdf')):
    r=PdfReader(p);dest=BUILD/p.stem;dest.mkdir(exist_ok=True)
    result=subprocess.run(['pdftoppm','-scale-to','1400','-png',str(p),str(dest/'page')],capture_output=True,text=True)
    if result.returncode:raise RuntimeError(result.stderr)
    report.append({'file':p.name,'pages':len(r.pages),'bytes':p.stat().st_size,'text_characters':sum(len(x.extract_text() or '') for x in r.pages),'rendered':True})
(BUILD/'pdf-checks.json').write_text(json.dumps(report,indent=2),encoding='utf8')
print(json.dumps(report,indent=2))
