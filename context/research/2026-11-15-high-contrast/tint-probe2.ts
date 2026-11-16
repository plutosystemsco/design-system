import path from "node:path";
const root="/Users/claygendron/Git/Repos/design-system";
const { contrastRatio, compositeTenths } = await import(path.join(root,"scripts/contrast.ts"));
const IR="#221F19", IW="#2C2821", G="#16140F";
// simple lightening in sRGB toward white at fixed hue via mix with white
const mix=(a:string,b:string,t:number)=>{const p=(h:string)=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));const A=p(a),B=p(b);return "#"+A.map((x,i)=>Math.round(x+(B[i]-x)*t).toString(16).padStart(2,"0")).join("").toUpperCase();};
for (const [n,base] of [["red","#FF9491"],["green","#60C498"]]) for (const [gn,ground] of [["ink-raised",IR],["graphite",G]]) for (const a of [0.1,0.2]) {
  let t=0, hex=base, tint="";
  for (;t<=1;t+=0.005){hex=mix(base,"#FFFFFF",t); tint=compositeTenths(hex,ground,a); if (contrastRatio(hex,tint)>=7 && contrastRatio(hex,IW)>=7) break;}
  console.log(n,"over",gn,"a",a,"text",hex,"tint",tint,"text/tint",contrastRatio(hex,tint),"white-mix",t.toFixed(3),"tint vs card",contrastRatio(tint,IR));
}
