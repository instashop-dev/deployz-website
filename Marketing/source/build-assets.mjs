import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const require=createRequire(path.join(root,'.build','runner.cjs'));
const sharp=require('sharp');
const data=JSON.parse(await fs.readFile(path.join(root,'source/collateral.json'),'utf8'));
// Export only the reviewed product regions from private source captures.
for(const [src,dest,region] of [
 ['resources-full.jpg','live-resource-configuration.jpg',{left:70,top:370,width:840,height:425}],
 ['size-full.jpg','live-size-presets.jpg',{left:70,top:265,width:840,height:275}],
 ['add-full.jpg','live-add-application.jpg',{left:275,top:50,width:640,height:125}]
]){
 const input=path.join(root,'.build/captures',src);
 try{await fs.access(input);await sharp(input).extract(region).jpeg({quality:95}).toFile(path.join(root,'screenshots',dest));}catch(e){if(e.code!=='ENOENT')throw e;}
}
const repo=path.dirname(root);
const xml=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const fontDir=path.join(repo,'node_modules/@fontsource-variable/inter');
const fontSource=path.join(fontDir,'files/inter-latin-wght-normal.woff2');
await fs.copyFile(fontSource,path.join(root,'brand/inter-latin-variable.woff2'));
await fs.copyFile(path.join(fontDir,'LICENSE'),path.join(root,'brand/OFL.txt'));
const logo=await fs.readFile(path.join(repo,'public/deployz-icon-master.svg'),'utf8');
await fs.writeFile(path.join(root,'brand/deployz-symbol.svg'),logo);
await sharp(Buffer.from(logo)).resize(512,512).png().toFile(path.join(root,'brand/deployz-symbol-512.png'));
const logoUri='data:image/svg+xml;base64,'+Buffer.from(logo).toString('base64');
const font=await fs.readFile(fontSource);
const style=`<style>@font-face{font-family:Inter;src:url(data:font/woff2;base64,${font.toString('base64')})}text{font-family:Inter,Arial,sans-serif}</style>`;
const brand=(x,y,size=42)=>`<image href="${logoUri}" x="${x}" y="${y}" width="${size}" height="${size}"/><text x="${x+size+14}" y="${y+size*.82}" font-size="${size*.9}" font-weight="600" fill="#111111">deployz</text>`;
const wrap=(s,max)=>{let lines=[],l='';for(const w of s.split(' ')){if((l+' '+w).trim().length>max&&l){lines.push(l);l=w;}else l=(l+' '+w).trim();}if(l)lines.push(l);return lines;};
const text=(lines,x,y,size,color='#111111',weight=400,line=1.23)=>lines.map((s,i)=>`<text x="${x}" y="${y+i*size*line}" font-size="${size}" fill="${color}" font-weight="${weight}" letter-spacing="${weight>=600?-.025*size:0}">${xml(s)}</text>`).join('');
async function saveSvg(stem,svg){await fs.writeFile(stem+'.svg',svg);await sharp(Buffer.from(svg)).png().toFile(stem+'.png');}
const wordmark=`<svg xmlns="http://www.w3.org/2000/svg" width="500" height="100" viewBox="0 0 500 100">${style}${brand(0,12,76)}</svg>`;
await saveSvg(path.join(root,'brand/deployz-wordmark'),wordmark);
await fs.writeFile(path.join(root,'brand/tokens.json'),JSON.stringify({background:'#FFFFFF',foreground:'#111111',body:'#52525B',brand:'#2563EB',border:'#E4E4E7',font:'Inter',signup:'https://app.deployz.dev/sign-up',website:'https://deployz.dev',support:'help@deployz.dev'},null,2));
const diagrams=['how-it-works-flow','security-access','releases-deployments','aws-resources','custom-domain-paths'];
for(const name of diagrams){const from=path.join(repo,'../Deployz-docs/images/diagrams',name+'.svg');const dest=path.join(root,'diagrams',name);await fs.copyFile(from,dest+'.svg');await sharp(from,{density:192}).png().toFile(dest+'.png');}

let captions='# Social graphics and alt text\n\nUse PNG for publication and SVG for edits. Square files are 1080 x 1080. Landscape files are 1200 x 630. These graphics use product statements, not customer results.\n\n';
for(let i=0;i<data.social.length;i++){
 const a=data.social[i];
 for(const [suffix,w,h] of [['square',1080,1080],['landscape',1200,630]]){
  const sq=suffix==='square',left=sq?76:72,ts=sq?68:58;
  const titleY=sq?315:240;
  const bodyY=sq?570:420;
  const titleSize=a.id==='04-pricing'?(sq?57:51):ts;
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${style}<rect width="${w}" height="${h}" fill="#FFFFFF"/>${brand(left,62,sq?46:40)}${text(a.title,left,titleY,titleSize,'#111111',600)}${text(wrap(a.body,sq?48:76),left,bodyY,sq?29:27,'#52525B',400,1.4)}<text x="${left}" y="${h-(sq?180:112)}" font-size="${sq?23:21}" fill="#52525B">${xml(a.foot)}</text><text x="${left}" y="${h-68}" font-size="${sq?28:24}" font-weight="600" fill="#2563EB">deployz.dev</text><text x="${w-left}" y="${h-68}" text-anchor="end" font-size="${sq?22:20}" fill="#52525B">Get Started Free</text></svg>`;
  await saveSvg(path.join(root,'social',a.id+'-'+suffix),svg);
 }
 captions+=`## ${i+1}. ${a.id}\n\nCaption: ${a.title.join(' ')}. ${a.body} ${a.foot}\n\nLink: https://deployz.dev/?utm_source=linkedin&utm_medium=organic_social&utm_campaign=customer_aws_01&utm_content=${a.id}\n\nAlt text: ${a.alt}\n\n`;
}
await fs.writeFile(path.join(root,'social/captions-and-alt-text.md'),captions);

// Video frames use flat typography and existing product images. Illustrations stay labelled.
for(let i=0;i<data.video.length;i++){
 const a=data.video[i],has=!!a.image;
 let image='';
 if(has){const folder=a.image.endsWith('.jpg')?'screenshots':'diagrams';const bytes=await fs.readFile(path.join(root,folder,a.image));const info=await sharp(bytes).metadata();let iw=1050,ih=680;const scale=Math.min(iw/info.width,ih/info.height);iw=info.width*scale;ih=info.height*scale;image=`<image href="data:image/${a.image.endsWith('.jpg')?'jpeg':'png'};base64,${bytes.toString('base64')}" x="${800+(1050-iw)/2}" y="${190+(680-ih)/2}" width="${iw}" height="${ih}"/>`;}
 const size=has?66:100;
 const foot=i===0?'Live configuration capture and labelled illustrations':i===7?'No card or time limit. AWS charges apply.':a.label==='Live product capture'?'Sample app configuration. AWS estimates are not a quote.':'Product process. See deployz.dev for support limits.';
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">${style}<rect width="1920" height="1080" fill="#FFFFFF"/>${brand(95,64,54)}${text([a.label],95,220,28,'#2563EB',500)}${text(a.title,95,has?380:425,size,'#111111',600)}${image}${text(wrap(foot,has?45:90),95,has?650:760,has?26:30,'#52525B',400,1.4)}<text x="95" y="990" font-size="26" fill="#52525B">deployz.dev</text><text x="1820" y="990" text-anchor="end" font-size="25" fill="#52525B">${i+1} / ${data.video.length}</text></svg>`;
 await saveSvg(path.join(root,'video',`scene-${String(i+1).padStart(2,'0')}`),svg);
}
const thumb=`<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">${style}<rect width="1920" height="1080" fill="white"/>${brand(110,90,65)}${text(['Deploy into','customer AWS'],110,470,135,'#111111',600)}${text(['Product walkthrough'],110,860,44,'#2563EB',500)}<text x="1800" y="990" text-anchor="end" font-size="34" fill="#52525B">deployz.dev</text></svg>`;
await saveSvg(path.join(root,'video/thumbnail'),thumb);
await fs.writeFile(path.join(root,'diagrams/README.md'),'# Architecture illustrations\n\nThese files are copies of existing Deployz documentation illustrations. They are not app screenshots or customer results. The source SVG files remain editable. PNG files are exports at twice the source resolution. Source: Deployz-docs/images/diagrams.\n');
console.log('Created brand exports, 12 social graphics in SVG and PNG, five diagrams, and video scenes.');
