from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import unquote,urlparse
import json,re,zipfile,hashlib,subprocess
import imageio_ffmpeg
from PIL import Image

ROOT=Path(__file__).resolve().parents[1]
errors=[]
class Links(HTMLParser):
    def handle_starttag(self,tag,attrs):
        for k,v in attrs:
            if k in ['href','src','poster'] and v and not urlparse(v).scheme:
                target=ROOT/unquote(v.split('#')[0])
                if not target.exists():errors.append('Missing gallery asset: '+v)
Links().feed((ROOT/'index.html').read_text(encoding='utf8'))
for p in ROOT.glob('*.md'):
    for link in re.findall(r'\]\(([^)]+)\)',p.read_text(encoding='utf8')):
        if not urlparse(link).scheme and not (p.parent/unquote(link.split('#')[0])).exists():errors.append('Missing Markdown target: '+link)
for p in (ROOT/'social').glob('*.png'):
    expected=(1080,1080) if p.stem.endswith('square') else (1200,630)
    if Image.open(p).size!=expected:errors.append('Wrong social image size: '+p.name)
ff=imageio_ffmpeg.get_ffmpeg_exe()
for p in (ROOT/'video').glob('*.mp4'):
    r=subprocess.run([ff,'-hide_banner','-loglevel','error','-i',str(p),'-map','0:v','-map','0:a?','-f','null','-'],capture_output=True,text=True)
    if r.returncode or r.stderr.strip():errors.append('Media decode: '+p.name+' '+r.stderr)
receipt=json.loads((ROOT/'.build/deck/validation-final.json').read_text(encoding='utf8'))
deck=ROOT/'slides/deployz-sales-deck-final.pptx'
if hashlib.sha256(deck.read_bytes()).hexdigest()!=receipt['finalSha256']:errors.append('PPTX checksum differs from validated file')
with zipfile.ZipFile(ROOT/'deployz-marketing-assets.zip') as z:
    if z.testzip():errors.append('ZIP CRC check failed')
    if any('/.build/' in n or '/__pycache__/' in n for n in z.namelist()):errors.append('Private build files in ZIP')
    count=len(z.namelist())
for line in (ROOT/'checksums.sha256').read_text(encoding='utf8').splitlines():
    checksum,name=line.split('  ',1)
    if hashlib.sha256((ROOT/name).read_bytes()).hexdigest()!=checksum:errors.append('Checksum differs: '+name)
result={'gallery_links':'pass' if not any('gallery' in e for e in errors) else 'fail','social_dimensions':'pass' if not any('size' in e for e in errors) else 'fail','media_decode':'pass' if not any('Media' in e for e in errors) else 'fail','pptx_checksum':'pass' if not any('PPTX' in e for e in errors) else 'fail','zip_files':count,'errors':errors}
(ROOT/'.build/asset-validation.json').write_text(json.dumps(result,indent=2),encoding='utf8')
print(json.dumps(result,indent=2))
if errors:raise SystemExit(1)
