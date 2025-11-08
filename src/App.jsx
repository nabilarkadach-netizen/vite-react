// App.jsx — KIDOOSE Cinematic Build (Full Site + 3D iPhone, Cropped Hero, Zero-Jitter WhatsApp)
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import clsx from "clsx";

/* ---------------- Site Palette ---------------- */
const PAL = {
  nightTop: "#0E1624",
  nightMid: "#16253B",
  nightBot: "#1B2D4D",
  ink: "#12151B",
};

/* ---------------- WhatsApp Dark Palette ---------------- */
const WP = {
  bg: "#0B141A",
  header: "#202C33",
  bubbleIn: "#202C33",
  text: "#E9EDEF",
  time: "#8696A0",
  tickGray: "#8A8F95",
  tickBlue: "#53BDEB",
};

/* ---------------- Country Formats etc. (unchanged) ---------------- */
const COUNTRY_FORMATS = { US:{dial:"+1",mask:"--- --- ----",max:10},DEFAULT:{dial:"+1",mask:"------------",max:12} };
const isoToFlagEmoji = iso => iso ? iso.toUpperCase().replace(/./g,c=>String.fromCodePoint(127397+c.charCodeAt())) : "🌍";
const intentFromQuery = () => {
  const p = new URLSearchParams(window.location.search);
  const raw=(p.get("utm_term")||p.get("q")||"").toLowerCase();
  if(raw.includes("bedtime"))return"bedtime";
  if(raw.includes("activity")||raw.includes("activities")||raw.includes("morning"))return"activities";
  return"default";
};
const COPY={
  default:{
    h1:"Turn 7 minutes a day into rituals your child will remember.",
    sub:"Every morning: a play idea. Every night: a short calming story. On WhatsApp.",
    primary:"See today’s sample",secondary:"Start free week"
  }
};

/* ---------------- Country Hook ---------------- */
const useCountryDialCode=()=>{const[dial,setDial]=useState("+1");const[c,setC]=useState("US");const[f,setF]=useState("🇺🇸");
useEffect(()=>{fetch("https://ipapi.co/json/").then(r=>r.json()).then(d=>{const iso=(d?.country_code||"US").toUpperCase();
const fmt=COUNTRY_FORMATS[iso]||COUNTRY_FORMATS.DEFAULT;setC(iso);setDial(fmt.dial);setF(isoToFlagEmoji(iso));}).catch(()=>{});
},[]);return{dial,countryCode:c,flag:f};};

/* ---------------- Backdrop ---------------- */
const Backdrop=()=>{const ref=useRef(null);useEffect(()=>{const el=ref.current;let t=0,raf;const tick=()=>{t+=0.003;
el.style.background=`radial-gradient(1200px 800px at ${15+5*Math.sin(t)}% ${-10+6*Math.cos(t*0.8)}%, rgba(245,193,110,0.20), transparent 55%),radial-gradient(1100px 900px at ${85+4*Math.cos(t*0.7)}% ${110+5*Math.sin(t)}%, rgba(139,167,255,0.22), transparent 58%),linear-gradient(180deg, ${PAL.nightTop}, ${PAL.nightMid} 50%, ${PAL.nightBot})`;
raf=requestAnimationFrame(tick);};tick();return()=>cancelAnimationFrame(raf);},[]);return<div ref={ref} className="fixed inset-0 -z-50" />;};

/* ---------------- iPhone Frame ---------------- */
const IPhoneFrame=({children})=>{
const tiltX=useMotionValue(0),tiltY=useMotionValue(0);
const rX=useTransform(tiltY,[-30,30],[2,-2]),rY=useTransform(tiltX,[-30,30],[-3,3]);
return(<motion.div className="relative mx-auto w-[360px] sm:w-[390px]" style={{perspective:900}}
onMouseMove={e=>{const r=e.currentTarget.getBoundingClientRect();tiltX.set(((e.clientX-r.left)/r.width)*60-30);tiltY.set(((e.clientY-r.top)/r.height)*60-30);}}
onMouseLeave={()=>{tiltX.set(0);tiltY.set(0);}}>
<motion.div style={{rotateX:rX,rotateY:rY}} className="relative rounded-[42px] shadow-[0_35px_80px_rgba(0,0,0,0.55)] transform-gpu">
<div className="relative rounded-[42px] p-[10px]" style={{background:"linear-gradient(180deg,#5A6167,#2E3338 45%,#1C2024)"}}>
<div className="absolute right-[-3px] top-[110px] w-[4px] h-[38px] rounded-r-md bg-[#586066]" />
<div className="absolute right-[-3px] top-[162px] w-[4px] h-[58px] rounded-r-md bg-[#586066]" />
<div className="absolute left-[-3px] top-[140px] w-[4px] h-[60px] rounded-l-md bg-[#586066]" />
<div className="relative h-[840px] rounded-[32px] overflow-hidden" style={{background:WP.bg}}>
<div className="absolute left-1/2 -translate-x-1/2 top-0 h-8 w-44 bg-black/90 rounded-b-2xl z-20" />
<div className="absolute left-1/2 -translate-x-1/2 top-[6px] h-[3px] w-[56px] rounded-full bg-white/10 z-20" />
<div className="absolute inset-0 opacity-[0.07]" style={{backgroundImage:`radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)`,backgroundSize:"22px 22px"}}/>
<motion.div className="absolute inset-0 pointer-events-none" style={{background:"linear-gradient(120deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 35%, rgba(255,255,255,0.10) 60%, rgba(255,255,255,0) 100%)",mixBlendMode:"overlay",opacity:0.06}}
animate={{backgroundPosition:["-40% -40%","140% 140%"]}} transition={{duration:12,repeat:Infinity,ease:"linear"}}/>
<div className="relative z-10 h-full">{children}</div>
</div></div></motion.div></motion.div>);
};

/* ---------------- WhatsApp Chat ---------------- */
const WhatsAppDarkChat=()=>{const[phase,setPhase]=useState("typing1"),[b1,setB1]=useState(false),[b2,setB2]=useState(false);
useEffect(()=>{const t=[setTimeout(()=>setPhase("msg1"),1300),setTimeout(()=>setB1(true),2400),setTimeout(()=>setPhase("typing2"),3000),setTimeout(()=>setPhase("msg2"),5000),setTimeout(()=>setB2(true),6200)];return()=>t.forEach(clearTimeout);},[]);
const Typing=({visible})=><div className="px-3 py-2 ml-2 mt-2 inline-flex items-center gap-2 rounded-2xl" style={{background:WP.bubbleIn,opacity:visible?1:0,height:visible?28:0,overflow:"hidden"}}><div className="flex items-center gap-1">{[0,1,2].map(i=><motion.span key={i} className="w-2 h-2 rounded-full bg-white/70" animate={{opacity:[0.4,1,0.4]}} transition={{duration:1,repeat:Infinity,delay:i*0.15}}/>)}</div><span className="text-[12px] text-white/70">Kidoose is typing…</span></div>;
const BubbleIn=({children,time="9:02 AM",blue})=><motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.2}} className="w-full flex items-start"><div className="ml-2 mt-2 max-w-[85%] px-3.5 py-2.5 rounded-[18px] rounded-tl-[6px] text-left" style={{background:WP.bubbleIn}}><div className="text-[15px]" style={{color:WP.text}}>{children}</div><div className="mt-1.5 flex justify-end items-center gap-1"><span className="text-[11px]" style={{color:WP.time}}>{time}</span></div></div></motion.div>;
return(<IPhoneFrame>
<div style={{background:WP.header}} className="h-[52px] flex items-center px-3 border-b border-black/40 text-left text-white/80">Kidoose online</div>
<div className="px-2 pb-[68px] pt-2 h-[700px] overflow-y-auto text-left">
<Typing visible={phase==="typing1"||phase==="typing2"} />
{(phase==="msg1"||phase==="typing2"||phase==="msg2")&&<BubbleIn blue={b1}>🌞 <strong>Morning Play</strong>: Roll two socks into a soft ball and play a mini toss game together. Count five catches, then high-five and pick a silly team name. 2–3 minutes, big smiles before school.</BubbleIn>}
{phase==="msg2"&&<BubbleIn time="7:00 PM" blue={b2}>🌙 <strong>Bedtime</strong>: “Under the sleepy moon, Milo whispered to the stars…”</BubbleIn>}
</div>
<div className="absolute bottom-0 left-0 right-0 px-2 py-2 border-t border-black/40 text-left" style={{background:WP.header}}>Message</div>
</IPhoneFrame>);
};

/* ---------------- Hero ---------------- */
const Hero=({onPrimary,onDemo,intent})=>{
const hero=COPY[intent]||COPY.default;
return(
<section className="text-white text-center pt-16 md:pt-20 pb-10 px-6">
<div className="max-w-4xl mx-auto">
<p className="text-white/70 text-sm md:text-base">From two parents who wanted calmer days.</p>
<h1 className="mt-2 text-4xl md:text-6xl font-extrabold leading-tight">{hero.h1}</h1>
<p className="mt-5 text-white/85 text-lg leading-relaxed">{hero.sub}</p>
<div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
<button onClick={onDemo} className="rounded-2xl border border-white/25 bg-white/5 text-white px-6 py-3 font-semibold hover:bg-white/10 w-full sm:w-auto">{hero.primary}</button>
<button onClick={onPrimary} className="rounded-2xl bg-white text-gray-900 px-6 py-3 font-semibold shadow hover:shadow-md w-full sm:w-auto">{hero.secondary}</button>
</div>
<p className="mt-4 text-white/75 italic">No charge until day 8 · Cancel anytime</p>

{/* Cropped Phone Emerging Effect */}
<div className="relative overflow-hidden h-[720px] md:h-[760px] mt-8 fade-mask">
  <div className="absolute bottom-[-200px] left-1/2 -translate-x-1/2 scale-[1.05]" style={{transformStyle:"preserve-3d",perspective:"1200px"}}>
    <motion.div style={{rotateX:3,rotateY:-3}} className="relative z-10">
      <WhatsAppDarkChat/>
    </motion.div>
  </div>
  <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[260px]" style={{background:"linear-gradient(to bottom, rgba(14,22,36,0) 0%, rgba(14,22,36,0.85) 65%, rgba(14,22,36,1) 100%)"}}/>
</div>

<p className="mt-6 text-white/70">Because bedtime shouldn’t be a battle — and mornings deserve laughter, not rushing.</p>
</div>
</section>);
};

/* ---------------- Footer ---------------- */
const Footer=()=>(
<footer className="py-10 border-t border-white/10 text-center text-white/80 text-sm bg-black/20">
<p>© {new Date().getFullYear()} KIDOOSE · All rights reserved</p>
</footer>);

/* ---------------- Root ---------------- */
export default function App(){
const[showSignup,setShowSignup]=useState(false),[showDemo,setShowDemo]=useState(false);
const[intent,setIntent]=useState("default");
useEffect(()=>{setIntent(intentFromQuery());},[]);
return(<div className="text-white min-h-screen"><Backdrop/>
<Hero intent={intent} onPrimary={()=>setShowSignup(true)} onDemo={()=>setShowDemo(true)}/>
<Footer/></div>);
}
