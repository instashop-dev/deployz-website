import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const runtime=process.env.DEPLOYZ_RUNTIME_ROOT;
if(!runtime)throw new Error('Set DEPLOYZ_RUNTIME_ROOT to the workspace dependency bundle.');
const modules=path.join(runtime,'node/node_modules');
process.env.RUNTIME_NODE_MODULES=modules;
const {Presentation,PresentationFile}=await import(pathToFileURL(path.join(modules,'@oai/artifact-tool/dist/artifact_tool.mjs')).href);
const skill='C:/Users/Relaince/.codex/plugins/cache/openai-primary-runtime/presentations/26.1112.11217/skills/presentations';
const {finalizePresentation}=await import(pathToFileURL(path.join(skill,'container_tools/artifact_tool_utils.mjs')).href);
const data=JSON.parse(await fs.readFile(path.join(root,'source/collateral.json'),'utf8'));
const build=path.join(root,'.build/deck');await fs.mkdir(build,{recursive:true});
const {FontLibrary}=await import(pathToFileURL(path.join(modules,'@oai/artifact-tool/node_modules/skia-canvas/lib/index.mjs')).href).catch(async()=>await import(pathToFileURL(path.join(modules,'skia-canvas/lib/index.mjs')).href));
FontLibrary.use('Inter',[path.join(root,'.build/Inter.ttf'),path.join(root,'.build/InterSemi.ttf')]);
const p=Presentation.create({slideSize:{width:1280,height:720}});
function box(s,txt,x,y,w,h,size=28,color='#111111',bold=false,name='text'){
 const a=s.shapes.add({geometry:'textbox',name,position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
 a.text=txt;a.text.style={typeface:'Inter',fontSize:size,color,bold};return a;
}
async function image(s,file,x,y,w,h,alt){const b=await fs.readFile(file);s.images.add({blob:b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength),contentType:file.endsWith('.jpg')?'image/jpeg':'image/png',alt,fit:'contain',position:{left:x,top:y,width:w,height:h}});}
for(const [i,a] of data.slides.entries()){
 const s=p.slides.add();s.background.fill='#FFFFFF';
 await image(s,path.join(root,'brand/deployz-symbol-512.png'),58,38,34,34,'Deployz symbol');
 box(s,'deployz',102,38,200,45,28,'#111111',true,'wordmark');
 box(s,String(i+1).padStart(2,'0'),1150,648,65,32,18,'#71717A',false,'page');
 if(a.type==='cover'){
  box(s,'Deploy into\ncustomer AWS',64,190,1100,220,78,'#111111',true,'title');
  box(s,a.body,69,455,1050,80,30,'#52525B',false,'body');
  box(s,'deployz.dev',69,610,800,45,25,'#2563EB',true,'site');
 }else if(a.type==='image'){
  box(s,a.title,64,115,1130,90,44,'#111111',true,'title');
  box(s,a.body,64,260,430,320,27,'#52525B',false,'body');
  const isLive=a.image.endsWith('.jpg');
  await image(s,path.join(root,isLive?'screenshots':'diagrams',a.image),535,220,680,390,isLive?'Cropped live resource configuration screen':'Labelled Deployz architecture illustration');
  box(s,isLive?'Live product capture. Sample app configuration.':'Architecture illustration',545,620,650,40,18,'#71717A',false,'caption');
 }else if(a.type==='pricing'){
  box(s,a.title,64,120,1130,85,44,'#111111',true,'title');
  box(s,'USD 49 / month',64,252,1130,100,66,'#111111',true,'base-price');
  box(s,'+ USD 19 per billable customer environment / month',68,370,1110,80,32,'#52525B',false,'environment-price');
  box(s,'Subscriptions start at USD 68/month, including one environment.',68,450,1110,42,23,'#111111',false,'subscription-minimum');
  box(s,'AWS infrastructure is billed separately.',68,500,1100,55,27,'#52525B',false,'aws-cost');
  box(s,'Free evaluation. No card or time limit. AWS charges apply.',68,584,1100,45,23,'#2563EB',false,'evaluation');
 }else if(a.type==='close'){
  box(s,a.title,64,130,1130,110,66,'#111111',true,'title');
  box(s,a.body,68,290,1100,230,32,'#52525B',false,'body');
  box(s,'Get Started Free',68,555,850,50,32,'#111111',true,'cta');
  box(s,'app.deployz.dev/sign-up',68,615,1000,40,25,'#2563EB',false,'signup');
 }else{
  box(s,a.title,64,130,1130,110,48,'#111111',true,'title');
  box(s,a.body,68,290,1100,310,a.type==='text'&&i===5?30:36,'#52525B',false,'body');
 }
 s.speakerNotes.text=a.note+'\nSources: Deployz-website/src/pages/index.astro; how-it-works.astro; security.astro; pricing.astro; src/lib/site.ts. Diagrams: Deployz-docs/images/diagrams. Source review date: 17 November 2026.';
 const png=await p.export({slide:s,format:'png',scale:1.5});await fs.writeFile(path.join(build,`slide-${String(i+1).padStart(2,'0')}.png`),new Uint8Array(await png.arrayBuffer()));
}
await fs.writeFile(path.join(build,'presentation.json'),JSON.stringify(p.toProto()));
const candidate=path.join(build,'candidate.pptx');await(await PresentationFile.exportPptx(p)).save(candidate);
const finalName=process.env.DEPLOYZ_DECK_OUTPUT || 'deployz-sales-deck-final.pptx';
const receiptName=process.env.DEPLOYZ_DECK_RECEIPT || 'validation-final.json';
const result=await finalizePresentation({workspaceDir:root,candidatePath:candidate,finalPath:path.join(root,'slides',finalName),pythonExecutable:path.join(runtime,'python/python.exe'),integrityValidatorPath:path.join(skill,'container_tools/inspect_presentation_package_integrity.py'),layoutValidatorPath:path.join(skill,'container_tools/inspect_presentation_layout_geometry.py'),layoutArgs:['--expected-slide-size-emu','12192000,6858000','--validate-bullet-geometry','--validate-heading-fit'],explicitTotalSlideCount:9,requiredNativeTableOwnerSlides:[],requiredNativeChartOwnerSlides:[],fontPolicy:{basis:'design',families:['Inter']},verifyArtifactToolImport:true,receiptPath:path.join(build,receiptName)});
console.log(JSON.stringify(result));
process.exitCode=0;
