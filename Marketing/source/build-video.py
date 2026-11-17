from pathlib import Path
import json, subprocess, wave, re, textwrap
import imageio_ffmpeg

ROOT=Path(__file__).resolve().parents[1]
DATA=json.loads((ROOT/'source/collateral.json').read_text(encoding='utf8'))
BUILD=ROOT/'.build/video'; BUILD.mkdir(parents=True,exist_ok=True)
FF=imageio_ffmpeg.get_ffmpeg_exe()
SPEED=1.08
def run(args):
    r=subprocess.run([FF,'-hide_banner','-loglevel','error','-y',*args],capture_output=True,text=True)
    if r.returncode: raise RuntimeError(r.stderr[-4000:])

def timecode(t,sep=','):
    ms=round(t*1000);sec,ms=divmod(ms,1000);mins,sec=divmod(sec,60);h,mins=divmod(mins,60)
    return f'{h:02}:{mins:02}:{sec:02}{sep}{ms:03}'

events=[];offset=0;segments=[];timings=[]
for i,a in enumerate(DATA['video']):
    wav=ROOT/'video'/f'voice-{i+1:02}.wav'
    with wave.open(str(wav)) as w: audio=w.getnframes()/w.getframerate()/SPEED
    duration=audio+1.1
    out=BUILD/f'segment-{i+1:02}.mp4';segments.append(out)
    run(['-loop','1','-framerate','24','-i',str(ROOT/'video'/f'scene-{i+1:02}.png'),'-i',str(wav),'-t',f'{duration:.4f}','-vf','format=yuv420p','-af',f'atempo={SPEED},apad','-c:v','libx264','-preset','fast','-tune','stillimage','-crf','21','-c:a','aac','-b:a','160k','-ar','48000','-ac','2',str(out)])
    sentences=re.split(r'(?<=[.!?])\s+',a['narration'])
    chunks=[]
    for s in sentences:
        words=s.split()
        for start in range(0,len(words),14):chunks.append(' '.join(words[start:start+14]))
    weight=sum(len(s.split()) for s in chunks);at=offset
    for s in chunks:
        d=audio*len(s.split())/weight;events.append((at,at+d,s));at+=d
    timings.append({'scene':i+1,'start':offset,'end':offset+duration,'label':a['label'],'title':' '.join(a['title'])})
    offset+=duration
    print(f'Encoded scene {i+1}/{len(DATA["video"])}',flush=True)

srt='\n\n'.join(f'{i+1}\n{timecode(a)} --> {timecode(b)}\n'+textwrap.fill(s,72) for i,(a,b,s) in enumerate(events))+'\n'
(ROOT/'video/deployz-walkthrough.srt').write_text(srt,encoding='utf8')
vtt='WEBVTT\n\n'+'\n\n'.join(f'{timecode(a,".")} --> {timecode(b,".")}\n'+textwrap.fill(s,72) for a,b,s in events)+'\n'
(ROOT/'video/deployz-walkthrough.vtt').write_text(vtt,encoding='utf8')
(ROOT/'video/transcript.md').write_text('# Deployz product walkthrough transcript\n\nNarration: local synthetic voice. This video uses a live product capture and labelled diagrams. It is not a recording of a new AWS installation.\n\n'+'\n\n'.join(f'## {i+1}. {" ".join(a["title"])}\n\n{a["narration"]}' for i,a in enumerate(DATA['video'])),encoding='utf8')
(BUILD/'concat.txt').write_text(''.join("file '"+p.as_posix()+"'\n" for p in segments),encoding='utf8')
run(['-f','concat','-safe','0','-i',str(BUILD/'concat.txt'),'-i',str(ROOT/'video/deployz-walkthrough.srt'),'-map','0:v','-map','0:a','-map','1:0','-c:v','copy','-c:a','copy','-c:s','mov_text','-metadata:s:s:0','language=eng','-movflags','+faststart',str(ROOT/'video/deployz-product-walkthrough.mp4')])
(ROOT/'video/chapters.json').write_text(json.dumps(timings,indent=2),encoding='utf8')

# A silent square clip for social feeds. The message is visible in each frame.
short=[]
for i,stem in enumerate(['01-customer-aws','02-readiness','03-approval','06-releases']):
    out=BUILD/f'short-{i}.mp4';short.append(out)
    run(['-loop','1','-framerate','24','-i',str(ROOT/'social'/f'{stem}-square.png'),'-t','7.5','-vf','format=yuv420p','-c:v','libx264','-preset','fast','-tune','stillimage','-crf','21',str(out)])
(BUILD/'short-concat.txt').write_text(''.join("file '"+p.as_posix()+"'\n" for p in short),encoding='utf8')
run(['-f','concat','-safe','0','-i',str(BUILD/'short-concat.txt'),'-c','copy','-movflags','+faststart',str(ROOT/'video/deployz-social-30s-square.mp4')])
run(['-ss','45','-i',str(ROOT/'video/deployz-product-walkthrough.mp4'),'-frames:v','1',str(BUILD/'walkthrough-check.png')])
print(f'Full video: {offset:.2f} seconds. Square clip: 30 seconds.',flush=True)
