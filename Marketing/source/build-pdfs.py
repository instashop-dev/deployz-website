from pathlib import Path
import json, re
from xml.sax.saxutils import escape
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from fontTools.ttLib import TTFont as Font
from fontTools.varLib.instancer import instantiateVariableFont

ROOT=Path(__file__).resolve().parents[1]
DATA=json.loads((ROOT/'source/collateral.json').read_text(encoding='utf8'))
BUILD=ROOT/'.build'; BUILD.mkdir(exist_ok=True)
for name,weight in [('Inter',400),('InterSemi',600)]:
    f=Font(ROOT/'brand/inter-latin-variable.woff2')
    if 'fvar' in f: f=instantiateVariableFont(f,{'wght':weight},inplace=False)
    f.flavor=None; f.save(BUILD/(name+'.ttf'))
    pdfmetrics.registerFont(TTFont(name,str(BUILD/(name+'.ttf'))))

W,H=595.276,841.89
BLACK='#111111'; MUTED='#52525B'; BLUE='#2563EB'
def para(c,txt,x,y,w,size=10.3,color=MUTED,bold=False,leading=None):
    st=ParagraphStyle('p',fontName='InterSemi' if bold else 'Inter',fontSize=size,leading=leading or size*1.47,textColor=HexColor(color))
    p=Paragraph(escape(txt).replace('\n','<br/>'),st); _,h=p.wrap(w,H)
    p.drawOn(c,x,y-h); return y-h

def base(c,title,num,total,internal=False):
    c.setFillColor(HexColor(BLACK));c.setFont('InterSemi',18);c.drawString(44,H-50,'deployz')
    c.setFont('Inter',8);c.setFillColor(HexColor(MUTED));c.drawRightString(W-44,H-46,'Customer AWS deployments')
    y=para(c,title,44,H-91,W-88,25,BLACK,True,29)
    c.setFont('Inter',7.5);c.setFillColor(HexColor(MUTED));c.drawString(44,31,('Internal worksheet  |  ' if internal else '')+'17 November 2026  |  deployz.dev')
    c.drawRightString(W-44,31,f'{num} / {total}')
    return y-17

def section(c,title,body,y,size=10.3):
    y=para(c,title,44,y,W-88,12.2,BLACK,True)-6
    return para(c,body,44,y,W-88,size)-19

def output(name):
    p=ROOT/'pdf'/name;c=canvas.Canvas(str(p),pagesize=(W,H));c.setTitle(name.replace('-',' ').replace('.pdf',''));c.setAuthor('Deployz');return c

c=output('deployz-product-sheet.pdf');p=DATA['product'];y=base(c,p['title'],1,1)
y=para(c,p['intro'],44,y,W-88,11.3)-20
for title,body in p['sections']:y=section(c,title,body,y,9.5)
y=section(c,'Supported app architecture',p['fit'],y,9.5)
y=section(c,'Evaluation and pricing',p['price'],y,9.5)
y=para(c,p['boundary'],44,y,W-88,8.3)-16
y=para(c,'Get Started Free: app.deployz.dev/sign-up',44,y,W-88,11,BLUE,True)-5
y=para(c,'Technical details: deployz.dev/security/    Support: help@deployz.dev',44,y,W-88,8.3)
assert y>55,('product overflow',y)
c.linkURL('https://app.deployz.dev/sign-up',(44,y+14,W-44,y+33),relative=0)
c.save()

c=output('deployz-security-brief.pdf')
for i,p in enumerate(DATA['security']):
    y=base(c,p['title'],i+1,3);y=para(c,p['intro'],44,y,W-88,11)-24
    for title,body in p['sections']:y=section(c,title,body,y)
    y=para(c,'Source: deployz.dev/security/  |  Questions: help@deployz.dev',44,y,W-88,8.5,BLUE)
    assert y>55,('security overflow',i,y)
    c.showPage()
c.save()

c=output('deployz-faq.pdf')
for page in range(3):
    y=base(c,['Architecture and evaluation','Costs and data handling','Operations and removal'][page],page+1,3)
    for q,a in DATA['faq'][page*5:page*5+5]:y=section(c,q,a,y,9.7)
    y=para(c,'Full details: deployz.dev/how-it-works/  |  deployz.dev/pricing/  |  deployz.dev/security/',44,y,W-88,8.2,BLUE)
    assert y>55,('faq overflow',page,y)
    c.showPage()
c.save()

c=output('deployz-evaluation-checklist.pdf')
for i,p in enumerate(DATA['evaluation']):
    y=base(c,p['title'],i+1,2);y=para(c,p['intro'],44,y,W-88,11)-22
    for item in p['items']:
        c.setStrokeColor(HexColor('#A1A1AA'));c.setLineWidth(.7);c.rect(44,y-11,9,9)
        y=para(c,item,65,y,W-109,10)-14
    y=para(c,p['end'],44,y-7,W-88,9.2,BLACK)-16
    y=para(c,'Help: help@deployz.dev  |  Requirements: deployz.dev/how-it-works/#compatibility',44,y,W-88,8.5,BLUE)
    assert y>55,('checklist overflow',i,y)
    c.showPage()
c.save()

c=output('deployz-brand-guide.pdf');y=base(c,'Deployz brand asset guide',1,1)
y=para(c,'Use the supplied master symbol and website design system. Keep product statements clear and supported by source files.',44,y,W-88,11)-24
for title,body in [
('Logo','Use the original black symbol on white or a light neutral surface. Keep its proportions. Do not redraw, stretch, rotate, recolor, add shadows, or place it in a decorative tile. No approved inverse logo is supplied.'),
('Type','Use Inter. Use sentence case and direct headings. Use monospace only for technical values. Keep text readable on small screens.'),
('Color','White #FFFFFF. Main text #111111. Body text #52525B. Links and small emphasis #2563EB. Fine borders #E4E4E7. Keep the main canvas neutral.'),
('Images','Use live captures for product evidence. Keep illustrations labelled. Do not invent customer logos, review scores, certification badges, or results.'),
('File use','Use SVG for edits and PNG for publication. Use supplied alt text with social graphics. Keep the Inter font license with redistributed font files.'),
('Action and contact','Primary action: Get Started Free. Signup: app.deployz.dev/sign-up. Website: deployz.dev. Support: help@deployz.dev.')]:y=section(c,title,body,y)
assert y>55,('brand overflow',y);c.save()

c=output('customer-evidence-worksheet.pdf')
for page in range(2):
    y=base(c,['Customer case study record','Testimonial approval record'][page],page+1,2,True)
    intro='Collection form only. Complete fields with verified evidence. Do not publish an empty form or an unapproved customer story.' if page==0 else 'Record the exact customer statement and written approval. This form contains no approved testimonial.'
    y=para(c,intro,44,y,W-88,10.5)-22
    fields=[('Customer and interview date',2),('Requirement and application architecture',3),('Previous process and app changes',3),('Measured result and date range',3),('Evidence source and measurement method',3),('Limits and customer approval reference',2)] if page==0 else [('Exact quote for approval',5),('Approved name role and company',2),('Permitted channels and logo use',3),('Customer approval date and source',2),('Approved edits and restrictions',3)]
    for label,lines in fields:
        y=para(c,label,44,y,W-88,10,BLACK,True)-9
        for _ in range(lines):
            c.setStrokeColor(HexColor('#D4D4D8'));c.setLineWidth(.5);c.line(44,y,W-44,y);y-=17
        y-=12
    assert y>50,('evidence overflow',page,y)
    c.showPage()
c.save()

print('Created six PDFs. Page counts and visual review follow.')
