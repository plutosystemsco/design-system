const root="/Users/claygendron/Git/Repos/design-system";
const { contrastRatio, deltaE, parseHex } = await import(root+"/scripts/contrast.ts");
const { deltaEUnder } = await import(root+"/tests/helpers/colour.ts");
const lin=(c:number)=>c<=0.04045?c/12.92:((c+0.055)/1.055)**2.4, gam=(c:number)=>c<=0.0031308?12.92*c:1.055*c**(1/2.4)-0.055;
function ok(hex:string){const {r,g,b}=parseHex(hex);const [R,G,B]=[r,g,b].map(x=>lin(x/255));const l=Math.cbrt(0.4122214708*R+0.5363325363*G+0.0514459929*B),m=Math.cbrt(0.2119034982*R+0.6806995451*G+0.1073969566*B),s=Math.cbrt(0.0883024619*R+0.2817188376*G+0.6299787005*B);const L=0.2104542553*l+0.793617785*m-0.0040720468*s,a=1.9779984951*l-2.428592205*m+0.4505937099*s,bb=0.0259040371*l+0.7827717662*m-0.808675766*s;return {L,C:Math.hypot(a,bb),h:Math.atan2(bb,a)};}
function from(L:number,C:number,h:number){const a=C*Math.cos(h),b=C*Math.sin(h);const l=(L+0.3963377774*a+0.2158037573*b)**3,m=(L-0.1055613458*a-0.0638541728*b)**3,s=(L-0.0894841775*a-1.291485548*b)**3;return [4.0767416621*l-3.3077115913*m+0.2309699292*s,-1.2684380046*l+2.6097574011*m-0.3413193965*s,-0.0041960863*l-0.7034186147*m+1.707614701*s];}
function hexAt(L:number,C:number,h:number){let c=C,rgb=from(L,c,h);while(!rgb.every(x=>x>=-1e-6&&x<=1+1e-6)&&c>0){c=Math.max(0,c-0.001);rgb=from(L,c,h);}return "#"+rgb.map(x=>Math.round(Math.min(1,Math.max(0,gam(Math.min(1,Math.max(0,x)))))*255).toString(16).padStart(2,"0")).join("").toUpperCase();}
const G=["#F3F0E8","#FFFFFF","#DCD7CA"];
function d45(src:string){const o=ok(src);for(let i=0;i<1000;i++){const h=hexAt(o.L-i*0.001,o.C,o.h);if(G.every(g=>contrastRatio(h,g)>=4.5))return h;}return "";}
const fill={red:d45("#C92035"),yellow:d45("#E2B000"),green:d45("#008058")};
console.log(fill, Object.fromEntries(Object.entries(fill).map(([k,v])=>[k,G.map(g=>contrastRatio(v,g))])));
const sets={"text-more (as derived)":["#1D2AB8","#99011F","#5E4701","#01553B","#505661"],"fill at 4.5":["#2D48D4",fill.red,fill.yellow,fill.green,"#505661"]};
for(const [n,cs] of Object.entries(sets)){for(const v of ["typical","deuteranopia","protanopia"]){let low={d:1e9,p:""};for(let i=0;i<5;i++)for(let j=i+1;j<5;j++){const d=v==="typical"?deltaE(cs[i],cs[j]):deltaEUnder(cs[i],cs[j],v);if(d<low.d)low={d,p:`${i+1}/${j+1}`};}console.log(n,v,low.p,low.d.toFixed(1));}}
console.log("blue on sunken", contrastRatio("#2D48D4","#DCD7CA"), "ink-soft on sunken", contrastRatio("#505661","#DCD7CA"));
