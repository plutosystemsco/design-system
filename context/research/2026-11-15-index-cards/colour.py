import math,sys
def hx(h): h=h.lstrip('#'); return [int(h[i:i+2],16)/255 for i in (0,2,4)]
def lin(c): return c/12.92 if c<=0.04045 else ((c+0.055)/1.055)**2.4
def Y(h): r,g,b=map(lin,hx(h)); return 0.2126*r+0.7152*g+0.0722*b
def cr(a,b): ya,yb=sorted([Y(a),Y(b)]); return (yb+0.05)/(ya+0.05)
def xyz(h):
    r,g,b=map(lin,hx(h))
    return (0.4124*r+0.3576*g+0.1805*b, 0.2126*r+0.7152*g+0.0722*b, 0.0193*r+0.1192*g+0.9505*b)
def lab(h):
    x,y,z=xyz(h); xn,yn,zn=0.95047,1,1.08883
    f=lambda t: t**(1/3) if t>0.008856 else 7.787*t+16/116
    fx,fy,fz=f(x/xn),f(y/yn),f(z/zn)
    return (116*fy-16,500*(fx-fy),200*(fy-fz))
def de2000(a,b):
    L1,a1,b1=lab(a);L2,a2,b2=lab(b)
    C1=math.hypot(a1,b1);C2=math.hypot(a2,b2);Cb=(C1+C2)/2
    G=0.5*(1-math.sqrt(Cb**7/(Cb**7+25**7)))
    a1p=(1+G)*a1;a2p=(1+G)*a2
    C1p=math.hypot(a1p,b1);C2p=math.hypot(a2p,b2)
    h1p=math.degrees(math.atan2(b1,a1p))%360;h2p=math.degrees(math.atan2(b2,a2p))%360
    dL=L2-L1;dC=C2p-C1p
    dh=h2p-h1p
    if C1p*C2p==0: dh=0
    elif dh>180: dh-=360
    elif dh<-180: dh+=360
    dH=2*math.sqrt(C1p*C2p)*math.sin(math.radians(dh/2))
    Lb=(L1+L2)/2;Cbp=(C1p+C2p)/2
    if C1p*C2p==0: hb=h1p+h2p
    elif abs(h1p-h2p)<=180: hb=(h1p+h2p)/2
    elif h1p+h2p<360: hb=(h1p+h2p+360)/2
    else: hb=(h1p+h2p-360)/2
    T=1-0.17*math.cos(math.radians(hb-30))+0.24*math.cos(math.radians(2*hb))+0.32*math.cos(math.radians(3*hb+6))-0.20*math.cos(math.radians(4*hb-63))
    dth=30*math.exp(-((hb-275)/25)**2)
    Rc=2*math.sqrt(Cbp**7/(Cbp**7+25**7))
    Sl=1+0.015*(Lb-50)**2/math.sqrt(20+(Lb-50)**2);Sc=1+0.045*Cbp;Sh=1+0.015*Cbp*T
    Rt=-math.sin(math.radians(2*dth))*Rc
    return math.sqrt((dL/Sl)**2+(dC/Sc)**2+(dH/Sh)**2+Rt*(dC/Sc)*(dH/Sh))
def oklab(h):
    r,g,b=map(lin,hx(h))
    l=0.4122214708*r+0.5363325363*g+0.0514459929*b
    m=0.2119034982*r+0.6806995451*g+0.1073969566*b
    s=0.0883024619*r+0.2817188376*g+0.6299787005*b
    l,m,s=[v**(1/3) for v in (l,m,s)]
    L=0.2104542553*l+0.7936177850*m-0.0040720468*s
    A=1.9779984951*l-2.4285922050*m+0.4505937099*s
    B=0.0259040371*l+0.7827717662*m-0.8086757660*s
    return L,math.hypot(A,B),math.degrees(math.atan2(B,A))%360
def fromoklch(L,C,H):
    A=C*math.cos(math.radians(H));B=C*math.sin(math.radians(H))
    l=(L+0.3963377774*A+0.2158037573*B)**3
    m=(L-0.1055613458*A-0.0638541728*B)**3
    s=(L-0.0894841775*A-1.2914855480*B)**3
    r=4.0767416621*l-3.3077115913*m+0.2309699292*s
    g=-1.2684380046*l+2.6097574011*m-0.3413193965*s
    b=-0.0041960863*l-0.7034186147*m+1.7076147010*s
    enc=lambda c: 12.92*c if c<=0.0031308 else 1.055*c**(1/2.4)-0.055
    return '#'+''.join('%02X'%round(max(0,min(1,enc(v)))*255) for v in (r,g,b))
