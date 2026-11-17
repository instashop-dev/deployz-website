from pathlib import Path
import os,json,csv,hashlib,zipfile,html

ROOT=Path(__file__).resolve().parents[1]
DATA=json.loads((ROOT/'source/collateral.json').read_text(encoding='utf8'))
def esc(s):return html.escape(str(s),quote=True)
docs=[('Product sheet','pdf/deployz-product-sheet.pdf','One-page overview'),('Sales deck','slides/deployz-sales-deck-final.pptx','Nine editable slides with speaker notes'),('Sales deck PDF','pdf/deployz-sales-deck.pdf','Visual export of the slides'),('Security brief','pdf/deployz-security-brief.pdf','Three pages for technical review'),('FAQ','pdf/deployz-faq.pdf','Fifteen questions and answers'),('Evaluation checklist','pdf/deployz-evaluation-checklist.pdf','Vendor test and customer installation'),('Brand guide','pdf/deployz-brand-guide.pdf','Logo, colors, typography, and image rules'),('Customer evidence worksheet','pdf/customer-evidence-worksheet.pdf','Internal collection form only')]
cards=''.join(f'<li><a href="{url}">{name}</a><p>{desc}</p></li>' for name,url,desc in docs)
social=''.join(f'<figure><a href="social/{a["id"]}-square.png"><img src="social/{a["id"]}-square.png" alt="{esc(a["alt"])}" loading="lazy" width="1080" height="1080"></a><figcaption>{esc(" ".join(a["title"]))}<br><a href="social/{a["id"]}-square.svg">Editable square</a> / <a href="social/{a["id"]}-landscape.png">Landscape PNG</a> / <a href="social/{a["id"]}-landscape.svg">Editable landscape</a></figcaption></figure>' for a in DATA['social'])
screens=''.join(f'<figure><a href="screenshots/{name}.jpg"><img src="screenshots/{name}.jpg" alt="{esc(label)}" loading="lazy"></a><figcaption>{label}. Live app capture, cropped to exclude account details.</figcaption></figure>' for name,label in [('live-resource-configuration','Resource configuration'),('live-size-presets','Size presets'),('live-add-application','Add application')])
page=f'''<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Deployz marketing assets</title><style>
@font-face{{font-family:Inter;src:url('brand/inter-latin-variable.woff2')}}*{{box-sizing:border-box}}body{{margin:0;background:#fff;color:#111;font:16px/1.6 Inter,Arial,sans-serif}}main{{max-width:1160px;margin:auto;padding:52px 28px 80px}}header{{margin-bottom:58px}}header img{{width:156px;height:auto}}h1{{font-size:48px;line-height:1.1;letter-spacing:-.035em;margin:38px 0 18px}}h2{{font-size:30px;line-height:1.2;margin:58px 0 22px}}p{{color:#52525b;max-width:760px}}a{{color:#2563eb;text-underline-offset:4px}}a:focus-visible{{outline:3px solid #2563eb;outline-offset:4px}}ul.documents{{list-style:none;padding:0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px 48px}}.documents li{{border-top:1px solid #e4e4e7;padding-top:15px}}.documents a{{font-size:20px;font-weight:600}}.documents p{{margin:6px 0}}.grid{{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:32px}}figure{{margin:0;min-width:0}}figure img{{max-width:100%;height:auto;border:1px solid #e4e4e7;display:block}}figcaption{{margin-top:12px;color:#52525b;font-size:14px}}video{{display:block;width:100%;background:#fafafa;border:1px solid #e4e4e7}}.short{{max-width:540px}}footer{{margin-top:70px;color:#71717a;font-size:14px}}@media(max-width:700px){{h1{{font-size:36px}}.grid,ul.documents{{grid-template-columns:1fr}}main{{padding:32px 20px}}}}
</style><main><header><img src="brand/deployz-wordmark.svg" alt="Deployz"><h1>Marketing assets</h1><p>Product copy, sales documents, visuals, and video. Prepared on 17 November 2026. Nothing in this pack has been published or sent.</p><p><a href="README.md">Read the usage guide</a> / <a href="07-claims-and-review.md">Check claims and limits</a> / <a href="campaign-tracker.csv">Campaign tracker</a></p></header>
<h2>Sales and technical material</h2><ul class="documents">{cards}</ul>
<h2>Product walkthrough</h2><p>About three minutes. Synthetic narration, one real configuration capture, and labelled illustrations. This video does not record a new live deployment.</p><video controls preload="metadata" poster="video/thumbnail.png"><source src="video/deployz-product-walkthrough.mp4" type="video/mp4"><track kind="captions" src="video/deployz-walkthrough.vtt" srclang="en" label="English">Your browser cannot play this video. <a href="video/deployz-product-walkthrough.mp4">Download the video</a>.</video><p><a href="video/transcript.md">Transcript</a> / <a href="video/deployz-walkthrough.srt">SRT captions</a> / <a href="video/thumbnail.png">Thumbnail</a></p>
<h2>Social video</h2><p>A silent 30-second square clip. The main message is visible on screen.</p><video class="short" controls preload="metadata" poster="social/01-customer-aws-square.png"><source src="video/deployz-social-30s-square.mp4" type="video/mp4"></video>
<h2>Social graphics</h2><p>Six topics in square and landscape sizes. <a href="social/captions-and-alt-text.md">Copy captions and alt text</a>.</p><div class="grid">{social}</div>
<h2>Live product captures</h2><p>These views show the actual app. They do not prove a completed customer installation. AWS figures are sample estimates.</p><div class="grid">{screens}</div>
<h2>Brand assets and editable copy</h2><p><a href="brand/deployz-symbol.svg">Master symbol</a> / <a href="brand/deployz-wordmark.svg">Wordmark</a> / <a href="brand/brand-guide.md">Brand rules</a> / <a href="02-messaging.md">Messages</a> / <a href="04-social-posts.md">Social copy</a> / <a href="05-email-drafts.md">Email drafts</a> / <a href="08-sales-guide.md">Sales guide</a></p>
<h2>Customer evidence</h2><p>No approved customer case study or testimonial was supplied. Use the <a href="09-customer-evidence-kit.md">interview and approval kit</a> to collect verified evidence. The worksheet is an internal form.</p>
<footer>Prices and product statements need a current check before external publication. This local gallery loads files from this folder and uses no analytics.</footer></main></html>'''
(ROOT/'index.html').write_text(page,encoding='utf8')

def files():
    for folder,dirs,names in os.walk(ROOT):
        dirs[:]=[d for d in dirs if d not in ['.build','__pycache__']]
        for name in names:
            p=Path(folder)/name
            if name.endswith('.zip') or name in ['.gitignore','asset-inventory.csv','checksums.sha256']:continue
            yield p
paths=sorted(files())
text_extensions={'.md','.txt','.json','.mjs','.py','.ps1','.svg','.html','.vtt','.srt','.csv'}
for p in paths:
    if p.suffix in text_extensions or p.name=='.gitattributes':
        text=p.read_text(encoding='utf8').replace('\r\n','\n')
        if p.suffix=='.svg':text='\n'.join(line.rstrip() for line in text.splitlines())+'\n'
        p.write_bytes((text.rstrip('\n')+'\n').encode('utf8'))
with (ROOT/'asset-inventory.csv').open('w',newline='',encoding='utf8') as f:
    w=csv.writer(f,lineterminator='\n');w.writerow(['file','bytes','type','status'])
    for p in paths:
        rel=p.relative_to(ROOT).as_posix()
        status='Internal collection form' if 'evidence' in rel or 'worksheet' in rel else 'Prepared for review'
        w.writerow([rel,p.stat().st_size,p.suffix.lstrip('.'),status])
(ROOT/'checksums.sha256').write_text(''.join(hashlib.sha256(p.read_bytes()).hexdigest()+'  '+p.relative_to(ROOT).as_posix()+'\n' for p in paths),encoding='utf8',newline='\n')
paths+= [ROOT/'asset-inventory.csv',ROOT/'checksums.sha256']
with zipfile.ZipFile(ROOT/'deployz-marketing-assets.zip','w',zipfile.ZIP_DEFLATED) as z:
    for p in paths:z.write(p,'Deployz-Marketing/'+p.relative_to(ROOT).as_posix())
print(f'Packaged {len(paths)} files. Private build files are excluded.')
