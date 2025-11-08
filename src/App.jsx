// App.jsx — KIDOOSE site with WhatsApp Dark iPhone Screenshot Clone (no phone frame)
// Tech: React 18, TailwindCSS, framer-motion, clsx

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

/* ---------------- Theme ---------------- */
const PAL = {
  nightTop: "#0E1624",
  nightMid: "#16253B",
  nightBot: "#1B2D4D",
  ink: "#12151B",
};

/* ---------------- Country & Dial Helpers (dash placeholders) ---------------- */
const COUNTRY_FORMATS = {
  US: { dial: "+1",   mask: "--- --- ----",  max: 10 },
  CA: { dial: "+1",   mask: "--- --- ----",  max: 10 },
  GB: { dial: "+44",  mask: "---- ------",   max: 10 },
  AU: { dial: "+61",  mask: "--- --- ---",   max: 9 },
  NZ: { dial: "+64",  mask: "--- --- ----",  max: 9 },
  IE: { dial: "+353", mask: "-- --- ----",   max: 9 },
  SG: { dial: "+65",  mask: "---- ----",     max: 8 },
  IN: { dial: "+91",  mask: "----- -----",   max: 10 },
  TR: { dial: "+90",  mask: "--- --- ----",  max: 10 },
  AE: { dial: "+971", mask: "-- --- ----",   max: 9 },
  SA: { dial: "+966", mask: "-- --- ----",   max: 9 },
  EG: { dial: "+20",  mask: "--- --- ----",  max: 9 },
  KW: { dial: "+965", mask: "--- ----",      max: 8 },
  QA: { dial: "+974", mask: "---- ----",     max: 8 },
  BH: { dial: "+973", mask: "---- ----",     max: 8 },
  OM: { dial: "+968", mask: "---- ----",     max: 8 },
  JO: { dial: "+962", mask: "-- ------",     max: 9 },
  LB: { dial: "+961", mask: "-- --- ---",    max: 8 },
  MA: { dial: "+212", mask: "-- --- ----",   max: 9 },
  DZ: { dial: "+213", mask: "-- --- ----",   max: 9 },
  DEFAULT: { dial: "+1", mask: "------------", max: 12 },
};

const isoToFlagEmoji = (iso2) =>
  iso2
    ? iso2.toUpperCase().replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt()))
    : "🌍";

/* ---------------- Intent from URL ---------------- */
const intentFromQuery = () => {
  const params = new URLSearchParams(window.location.search);
  const raw = (params.get("utm_term") || params.get("q") || "").toLowerCase();
  if (raw.includes("bedtime")) return "bedtime";
  if (raw.includes("activity") || raw.includes("activities") || raw.includes("kids activities")) return "activities";
  if (raw.includes("morning")) return "morning";
  return "default";
};

const COPY = {
  bedtime: {
    h1: "Bedtime stories that make nights easier — starting tonight.",
    sub: "Delivered on WhatsApp at 7pm in your timezone. No app. Cancel anytime.",
    primary: "See tonight’s sample",
    secondary: "Start free week",
  },
  activities: {
    h1: "2–5 minute morning play ideas using what you already have.",
    sub: "WhatsApp at 9am & 7pm. No app. Cancel anytime.",
    primary: "See today’s activity",
    secondary: "Start free week",
  },
  morning: {
    h1: "Quick, joyful morning sparks for calmer school runs.",
    sub: "We’ll WhatsApp you at 9am & 7pm. No app. Cancel anytime.",
    primary: "See a morning spark",
    secondary: "Start free week",
  },
  default: {
    h1: "Turn 7 minutes a day into rituals your child will remember.",
    sub: "Every morning: a play idea. Every night: a short calming story. On WhatsApp.",
    primary: "See today’s sample",
    secondary: "Start free week",
  },
};

/* ---------------- Hook: Detect Country Dial Code ---------------- */
const useCountryDialCode = () => {
  const [dialCode, setDialCode] = useState("+1");
  const [countryCode, setCountryCode] = useState("US");
  const [flag, setFlag] = useState("🇺🇸");

  useEffect(() => {
    let active = true;
    fetch("https://ipapi.co/json/")
      .then((r) => r.json())
      .then((data) => {
        if (!active) return;
        const iso = (data?.country_code || "US").toUpperCase();
        const fmt = COUNTRY_FORMATS[iso] || COUNTRY_FORMATS.DEFAULT;
        setCountryCode(iso);
        setDialCode(fmt.dial);
        setFlag(isoToFlagEmoji(iso.slice(0, 2)));
      })
      .catch(() => {
        setCountryCode("US");
        setDialCode("+1");
        setFlag("🇺🇸");
      });
    return () => {
      active = false;
    };
  }, []);

  return { dialCode, countryCode, flag };
};

/* ---------------- Animated Background ---------------- */
const Backdrop = () => {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    let t = 0, raf;
    const tick = () => {
      t += 0.003;
      el.style.background = `
        radial-gradient(1200px 800px at ${15 + 5 * Math.sin(t)}% ${-10 + 6 * Math.cos(t * 0.8)}%, rgba(245,193,110,0.20), transparent 55%),
        radial-gradient(1100px 900px at ${85 + 4 * Math.cos(t * 0.7)}% ${110 + 5 * Math.sin(t)}%, rgba(139,167,255,0.22), transparent 58%),
        linear-gradient(180deg, ${PAL.nightTop}, ${PAL.nightMid} 50%, ${PAL.nightBot})
      `;
      el.style.filter = `brightness(${1 + 0.02 * Math.sin(t)})`;
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, []);
  return <div ref={ref} className="fixed inset-0 -z-50 overflow-hidden" aria-hidden />;
};

/* ---------------- Logo ---------------- */
const KidooseLogo = ({ centerOnMobile = false }) => (
  <div className={clsx("flex items-center gap-2 select-none", centerOnMobile && "justify-center w-full")}>
    <span className="text-white font-extrabold text-xl md:text-2xl tracking-wide">KID</span>
    <span className="w-4 h-4 md:w-5 md:h-5 rounded-full" style={{background:"radial-gradient(circle at 40% 35%, #FFEAA0, #FFA131 60%, #E27C00 100%)",boxShadow:"0 0 14px rgba(255,161,49,0.45)"}} />
    <span className="w-4 h-4 md:w-5 md:h-5 rounded-full" style={{background:"radial-gradient(circle at 45% 40%, #EAF0FF, #83A3FF 60%, #5E7AFF 100%)",boxShadow:"0 0 14px rgba(131,163,255,0.45)"}} />
    <span className="text-white font-extrabold text-xl md:text-2xl tracking-wide">OOSE</span>
  </div>
);

/* ---------------- Header (scroll-aware) ---------------- */
const Header = ({ onPrimary, onDemo, showButtons }) => (
  <header className="sticky top-0 z-40 bg-black/30 backdrop-blur-xl border-b border-white/10">
    <div className="mx-auto max-w-6xl px-6 py-3 flex items-center justify-center md:justify-between">
      <KidooseLogo />
      <AnimatePresence>
        {showButtons && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="hidden md:flex items-center gap-3"
          >
            <button
              onClick={onDemo}
              className="rounded-2xl border border-white/25 bg-white/5 text-white px-4 py-2 font-semibold hover:bg-white/10"
            >
              Play sample
            </button>
            <button
              onClick={onPrimary}
              className="rounded-2xl bg-white text-gray-900 px-5 py-2 font-semibold shadow hover:shadow-md"
            >
              Start Free Week
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </header>
);

/* ===========================================================
   WHATSAPP DARK iPHONE SCREENSHOT (no phone frame, top-rounded)
   =========================================================== */

const WA = {
  bgTop: "#0B141A",
  bg: "#111B21",
  header: "#202C33",
  incoming: "#202C33", // iOS dark incoming
  meta: "#8696A0",
  name: "#E9EDEF",
  online: "#6BEB7A",
  icon: "#AEBAC1",
  input: "#202C33",
  inputFill: "#2A3942",
};

// light wallpaper SVG tile (subtle)
const WALLPAPER = encodeURIComponent(`
<svg xmlns='http://www.w3.org/2000/svg' width='512' height='512' viewBox='0 0 512 512'>
  <g fill='none' stroke='white' stroke-opacity='0.06' stroke-width='2'>
    <path d='M30 80c20-20 60-20 80 0s20 60 0 80-60 20-80 0-20-60 0-80z'/>
    <circle cx='256' cy='256' r='40'/>
    <path d='M420 110c18-18 48-18 66 0s18 48 0 66-48 18-66 0-18-48 0-66z'/>
    <path d='M140 420c24-24 64-24 88 0s24 64 0 88-64 24-88 0-24-64 0-88z'/>
  </g>
</svg>`);

// Icons (inline, iOS-like)
const Icon = {
  Back: (p)=>(<svg width="22" height="22" viewBox="0 0 24 24" {...p}><path d="M15.5 19.5L8 12l7.5-7.5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  Video: (p)=>(<svg width="20" height="20" viewBox="0 0 24 24" {...p}><path d="M15 8l5-3v14l-5-3v2H3V6h12v2z" fill="currentColor"/></svg>),
  Phone: (p)=>(<svg width="20" height="20" viewBox="0 0 24 24" {...p}><path d="M6.6 10.8c1.7 3.4 3.9 5.6 7.2 7.2l2.4-2.4c.3-.3.7-.4 1.1-.2 1.2.4 2.5.6 3.7.6.6 0 1 .4 1 1V21c0 .6-.4 1-1 1C10.8 22 2 13.2 2 3c0-.6.4-1 1-1h3c.6 0 1 .4 1 1 0 1.2.2 2.5.6 3.7.1.4 0 .8-.3 1.1L6.6 10.8z" fill="currentColor"/></svg>),
  Attach: (p)=>(<svg width="20" height="20" viewBox="0 0 24 24" {...p}><path d="M7 13.5V7a5 5 0 0 1 10 0v8a3.5 3.5 0 1 1-7 0V8a2 2 0 0 1 4 0v7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/></svg>),
  Camera: (p)=>(<svg width="20" height="20" viewBox="0 0 24 24" {...p}><path d="M9 5l1.5-2h3L15 5h4a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4zm3 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10z" fill="currentColor"/></svg>),
  Mic: (p)=>(<svg width="20" height="20" viewBox="0 0 24 24" {...p}><path d="M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm-7-3h2a5 5 0 0 0 10 0h2a7 7 0 0 1-6 6.9V21h-2v-2.1A7 7 0 0 1 5 12z" fill="currentColor"/></svg>),
  Send: (p)=>(<svg width="22" height="22" viewBox="0 0 24 24" {...p}><path d="M3 20l18-8L3 4l3 7-3 9zm3-9.8l9.7 1.8-9.7 1.8 1.7-3.6z" fill="currentColor"/></svg>),
};

// Single-direction chat (Kidoose only)
const WhatsAppScreenshot = () => {
  const messages = [
    { text: "🌞 Morning Play: Build a paper airplane — one-minute race!", time: "08:59" },
    { text: "🌙 Bedtime: “Under the sleepy moon, Milo counted the wind’s whispers…”", time: "19:00" },
  ];

  return (
    <div
      className="mx-auto w-[360px] sm:w-[390px] rounded-t-[28px] overflow-hidden shadow-2xl"
      style={{
        background: `linear-gradient(180deg, ${WA.bgTop}, ${WA.bg}),
          url("data:image/svg+xml,${WALLPAPER}")`,
        backgroundRepeat: "repeat",
        backgroundSize: "512px 512px",
      }}
    >
      {/* Header */}
      <div className="h-12" style={{ background: WA.header, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="h-12 flex items-center gap-2 px-3 text-white select-none">
          <span className="text-[${WA.icon}] text-white/70"><Icon.Back color={WA.icon} /></span>
          <div className="w-7 h-7 rounded-full bg-[#2A3942] border border-white/10" />
          <div className="flex-1 leading-tight">
            <div className="text-[14px] font-semibold" style={{ color: WA.name }}>Kidoose</div>
            <div className="text-[11px]" style={{ color: WA.online }}>online</div>
          </div>
          <span style={{ color: WA.icon }}><Icon.Video color={WA.icon} /></span>
          <span className="ml-2" style={{ color: WA.icon }}><Icon.Phone color={WA.icon} /></span>
        </div>
      </div>

      {/* Messages (incoming only) */}
      <div className="px-2 py-3 space-y-2" style={{ minHeight: 380 }}>
        {messages.map((m, i) => (
          <div key={i} className="w-full flex items-start">
            <div
              className="max-w-[84%] px-[10px] py-[7px] rounded-[18px] rounded-tl-[6px] border border-black/25"
              style={{ background: WA.incoming }}
            >
              <div className="text-[14px] leading-[1.35] text-white/95">{m.text}</div>
              <div className="text-right text-[10px] mt-1" style={{ color: WA.meta }}>{m.time}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Composer */}
      <div className="px-3 py-2" style={{ background: WA.input, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-2 text-white/80">
          <span style={{ color: WA.icon }}><Icon.Attach color={WA.icon} /></span>
          <div
            className="flex-1 rounded-full px-4 py-2 text-[14px]"
            style={{ background: WA.inputFill, color: "#AEBAC1", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            Message
          </div>
          <span style={{ color: WA.icon }}><Icon.Camera color={WA.icon} /></span>
          <span style={{ color: WA.icon }}><Icon.Mic color={WA.icon} /></span>
          <span style={{ color: WA.icon }}><Icon.Send color={WA.icon} /></span>
        </div>
      </div>
    </div>
  );
};

/* ---------------- Trust Strip ---------------- */
const TrustStrip = () => (
  <section className="py-6 md:py-8">
    <div className="mx-auto max-w-6xl px-6 text-white/85">
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          "Built by two parents after our own bedtime battles.",
          "WhatsApp only · No new app · Cancel anytime.",
          "97% stay after the free week.",
        ].map((t) => (
          <div key={t} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
            ✓ {t}
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ---------------- Hero ---------------- */
const Hero = ({ onPrimary, onDemo, intent }) => {
  const hero = COPY[intent] || COPY.default;
  return (
    <section className="text-white text-center pt-16 md:pt-20 pb-10 px-6">
      <div className="max-w-4xl mx-auto">
        <p className="text-white/70 text-sm md:text-base">From two parents who wanted calmer days.</p>
        <h1 className="mt-2 text-4xl md:text-6xl font-extrabold leading-tight">{hero.h1}</h1>
        <p className="mt-5 text-white/85 text-lg leading-relaxed">{hero.sub}</p>

        <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <button onClick={onDemo} className="rounded-2xl border border-white/25 bg-white/5 text-white px-6 py-3 font-semibold hover:bg-white/10 w-full sm:w-auto">
            {hero.primary}
          </button>
          <button onClick={onPrimary} className="rounded-2xl bg-white text-gray-900 px-6 py-3 font-semibold shadow hover:shadow-md w-full sm:w-auto">
            {hero.secondary}
          </button>
        </div>

        <p className="mt-4 text-white/75 italic">No charge until day 8 · Cancel anytime</p>

        <div className="mt-8">
          {/* WhatsApp Dark Screenshot (no frame) */}
          <WhatsAppScreenshot />
        </div>
      </div>
    </section>
  );
};

/* ---------------- How ---------------- */
const How = () => (
  <section id="how" className="py-16 md:py-20">
    <div className="mx-auto max-w-6xl px-6 text-center text-white">
      <h2 className="text-3xl md:text-4xl font-extrabold">How Kidoose fits into your day</h2>
      <p className="mt-3 text-white/80">Clear, simple moments — timed to your rhythm.</p>
      <div className="mt-10 grid md:grid-cols-3 gap-6">
        {[
          { icon: "🌞", title: "Morning Spark", text: "2–5 minute play prompts using what you already have at home." },
          { icon: "🌙", title: "Bedtime Story", text: "Gentle, short stories that help kids wind down and love bedtime." },
          { icon: "💬", title: "On WhatsApp", text: "No new app. Two small nudges at the right time, every day." },
        ].map((c) => (
          <div key={c.title} className="rounded-2xl border border-white/12 bg-white/5 backdrop-blur-lg p-6 text-left shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
            <div className="text-2xl">{c.icon}</div>
            <h3 className="mt-2 text-xl font-semibold text-white">{c.title}</h3>
            <p className="mt-2 text-white/80">{c.text}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ---------------- Reviews ---------------- */
const Reviews = () => {
  const items = [
    { name: "Sara A. — mom of a 5-yr-old", text: "Kidoose turned chaos into a sweet ritual. My son actually asks for bedtime now!" },
    { name: "Omar K. — dad of twins", text: "Those tiny morning prompts are gold. Zero prep, big smiles before school." },
    { name: "Mina & Ali — parents of 3 & 7", text: "Two messages a day, huge impact. Less screens, more connection." },
  ];
  return (
    <section id="reviews" className="py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-6 text-center text-white">
        <h2 className="text-3xl md:text-4xl font-extrabold">Parents are loving Kidoose</h2>
        <p className="mt-3 text-white/80">Real voices. Real routines transformed.</p>
        <div className="mt-10 grid md:grid-cols-3 gap-6">
          {items.map((r, i) => (
            <motion.div key={r.name} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.5, delay: i * 0.08 }} className="rounded-2xl border border-white/12 bg-white/6 backdrop-blur-lg p-6 text-left text-white shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
              <p className="text-white/90 leading-relaxed">“{r.text}”</p>
              <p className="mt-4 text-white/70 text-sm">{r.name}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ---------------- Pricing ---------------- */
const Pricing = ({ onStart }) => {
  const plans = useMemo(() => [
    { id:"starter", name:"Starter", tag:"Best for curious first-timers", price:"$4.99/mo", features:["Morning game + bedtime story","Short cozy replies","Email or WhatsApp"], cta:"Try a week of joyful mornings 🌞" },
    { id:"family", name:"Family", tag:"Best for families with 1–2 kids", price:"$7.99/mo", features:["Everything in Starter","“Bad day?” extra support","Weekly recap + sibling tweak"], cta:"Start calmer days tonight 🌙", popular:true },
    { id:"premium", name:"Premium", tag:"Best for story lovers or siblings", price:"$11.99/mo", features:["Everything in Family","Calm audio stories","Seasonal packs + name insert"], cta:"Make bedtime magical ✨" },
  ],[]);

  return (
    <section id="pricing" className="py-20 md:py-24 text-center text-white">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-3xl md:text-4xl font-extrabold">Simple pricing</h2>
        <p className="mt-2 text-white/80">Choose calm mornings, connected evenings — and let us handle the rest.</p>

        <div className="mt-10 grid md:grid-cols-3 gap-7">
          {plans.map((p) => (
            <motion.div key={p.id} whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 200, damping: 15 }} className={clsx("relative rounded-3xl border p-6 text-left sm:text-center shadow-[0_15px_40px_rgba(0,0,0,0.35)] transition duration-300 hover:shadow-[0_20px_60px_rgba(0,0,0,0.45)]", p.popular ? "border-white/15 bg-gradient-to-br from-[#8BA7FF]/90 via-[#D5C0F7]/70 to-[#F5C16E]/90" : "border-white/12 bg-white/6 backdrop-blur-lg")} onClick={() => onStart(p)} role="button">
              {p.popular && (<div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-black/70 text-white text-xs font-semibold px-3 py-1 border border-white/20">❤️ Most loved by parents</div>)}
              <div className="sm:text-center">
                <h3 className={clsx("text-2xl font-semibold", p.popular && "text-[#12151B]")}>{p.name}</h3>
                <p className={clsx("text-sm mt-1 italic", p.popular ? "text-[#12151B]/80" : "text-white/70")}>{p.tag}</p>
                <div className={clsx("text-4xl font-extrabold mt-3", p.popular && "text-[#12151B]")}>{p.price}</div>
              </div>
              <ul className={clsx("mt-4 space-y-2 text-left mx-auto max-w-[22rem]", p.popular ? "text-[#12151B]" : "text-white/90")}>
                {p.features.map((f) => (<li key={f} className="flex gap-2 items-start justify-start"><span>✓</span><span>{f}</span></li>))}
              </ul>
              <p className={clsx("mt-4 text-sm text-center", p.popular ? "text-[#12151B]/85" : "text-white/70")}>Less than a cup of coffee — for calmer mornings and sweeter nights.</p>
              <button onClick={(e) => { e.stopPropagation(); onStart(p); }} className={clsx("w-full mt-6 rounded-2xl py-3 font-semibold transition text-center", p.popular ? "bg-[#12151B] text-white hover:bg-black" : "bg-white text-gray-900 hover:shadow-md")}>{p.cta}</button>
              <p className={clsx("mt-3 text-xs text-center", p.popular ? "text-[#12151B]/75" : "text-white/70")}>🛡️ Cancel anytime · 💌 No app needed · ❤️ 97% stay after free week</p>
            </motion.div>
          ))}
        </div>

        <p className="mt-10 text-white/70 italic">Because sometimes, all it takes is 7 minutes to feel connected again.</p>
      </div>
    </section>
  );
};

/* ---------------- FAQ ---------------- */
const QA = [
  ["What do I get daily?", "Two WhatsApp messages: a tiny morning play idea and a short calming bedtime story."],
  ["When do you send?", "Default 9am & 7pm local time (you can adjust after you start)."],
  ["How do I cancel?", "Reply STOP any time or use the toggle in the first message."],
  ["Is this for multiple kids?", "Yes. Family/Premium include sibling tweaks and gentle variations."],
  ["Do I need an app?", "No. We use WhatsApp only — simple and familiar."],
  ["Privacy?", "Messages are for parents, not the child. We keep it minimal and respectful."],
];

const FAQ = () => (
  <section className="py-12 text-white">
    <div className="max-w-3xl mx-auto px-6">
      <h3 className="text-2xl font-extrabold mb-4">Common questions</h3>
      <div className="space-y-2">
        {QA.map(([q, a]) => (
          <details key={q} className="group rounded-xl border border-white/15 bg-white/5 p-4">
            <summary className="cursor-pointer font-semibold">{q}</summary>
            <p className="mt-2 text-white/80">{a}</p>
          </details>
        ))}
      </div>
    </div>
  </section>
);

/* ---------------- Demo Modal (reuses screenshot) ---------------- */
const DemoModal = ({ open, onClose, onStart }) => (
  <AnimatePresence>
    {open && (
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          className="relative w-full max-w-[90vw] sm:max-w-[420px] md:max-w-[520px] rounded-3xl border border-white/12 p-4 md:p-6 text-white"
          style={{ background: "linear-gradient(180deg, rgba(17,27,33,0.98) 0%, rgba(32,44,51,0.98) 100%)" }}
          initial={{ scale: 0.98, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.98, opacity: 0 }}
        >
          <button
            onClick={onClose}
            className="absolute right-3 top-3 w-9 h-9 rounded-full bg-black/40 border border-white/20 grid place-items-center hover:bg-black/55"
            aria-label="Close"
          >
            ✕
          </button>

          <div className="mx-auto grid place-items-center">
            <WhatsAppScreenshot />
          </div>

          <div className="mt-4 md:mt-6 flex justify-center">
            <button
              onClick={onStart}
              className="rounded-2xl bg-white text-[#12151B] px-6 py-3 font-semibold shadow hover:shadow-md"
            >
              Start my free trial
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

/* ---------------- Signup (masked phone + OTP + resend link) ---------------- */
const SignUpModal = ({ open, onClose, defaultPlan }) => {
  const { dialCode, countryCode, flag } = useCountryDialCode();

  const fmtBase = COUNTRY_FORMATS[countryCode] || COUNTRY_FORMATS.DEFAULT;
  theFmt: {
  }
  const fmt = { dial: fmtBase.dial || dialCode || "+1", mask: fmtBase.mask, max: fmtBase.max };
  const dialDigits = fmt.dial.replace(/\D/g, "");

  const [phone, setPhone] = useState("");
  const [parent, setParent] = useState("");
  const [child, setChild] = useState("");
  const [planOpen, setPlanOpen] = useState(false);
  const [plan, setPlan] = useState(defaultPlan?.id ?? "");
  const [sending, setSending] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [verified, setVerified] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const popRef = useRef(null);

  useEffect(() => {
    if (!open) {
      setPhone(""); setParent(""); setChild(""); setPlanOpen(false);
      setPlan(defaultPlan?.id ?? ""); setSending(false); setOtpSent(false);
      setOtp(""); setVerified(false); setResendTimer(0);
    }
  }, [open, defaultPlan]);

  useEffect(() => {
    const handler = (e) => { if (popRef.current && !popRef.current.contains(e.target)) setPlanOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (!otpSent || resendTimer <= 0) return;
    const id = setInterval(() => setResendTimer((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [otpSent, resendTimer]);

  const formatLocal = (allDigits) => {
    let local = allDigits.startsWith(dialDigits) ? allDigits.slice(dialDigits.length) : allDigits;
    local = local.slice(0, fmt.max);
    let out = fmt.mask.replace(/[0-9]/g, "_");
    for (const d of local) out = out.replace("_", d);
    return out.split("_")[0].trim();
  };

  const handlePhoneChange = (e) => {
    const digits = e.target.value.replace(/\D/g, "");
    const local = formatLocal(digits);
    setPhone(`${fmt.dial} ${local}`);
  };

  const currentLocalDigits = (() => {
    const digits = phone.replace(/\D/g, "");
    return digits.startsWith(dialDigits) ? digits.slice(dialDigits.length) : digits;
  })();
  const isComplete = currentLocalDigits.length === fmt.max;

  const sendOtp = () => {
    if (!isComplete || sending || verified || otpSent) return;
    setSending(true);
    setOtp("");
    setTimeout(() => { setSending(false); setOtpSent(true); }, 1200);
  };

  useEffect(() => {
    if (otpSent && !verified && otp.trim().length === 6) setVerified(true);
  }, [otp, otpSent, verified]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md px-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
          <motion.div className="relative w-[95%] max-w-xl rounded-2xl border border-white/20 text-white p-6" style={{ background: "linear-gradient(180deg, rgba(17,27,33,0.96) 0%, rgba(32,44,51,0.96) 100%)" }} initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.98, opacity: 0 }}>
            <button onClick={onClose} className="absolute right-3 top-3 w-9 h-9 rounded-full bg-black/40 border border-white/20 grid place-items-center hover:bg-black/55" aria-label="Close">✕</button>

            <h3 className="text-2xl md:text-3xl font-extrabold">Start your free week ✨</h3>
            <p className="text-white/85 mt-1">No charge until day 8 · Cancel anytime · Messages via WhatsApp {flag}</p>

            <div className="relative mt-5 w-full">
              <input
                type="tel"
                className="w-full rounded-xl bg-white/10 border border-white/25 px-4 py-3 text-white/95 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 pr-[7.6rem]"
                placeholder={`${fmt.dial} ${fmt.mask}`}
                inputMode="tel"
                value={phone}
                onChange={handlePhoneChange}
                disabled={verified}
              />
              <button
                className={clsx(
                  "absolute top-1/2 -translate-y-1/2 right-1.5 rounded-lg text-sm font-semibold transition px-3 py-1.5 min-w-[110px] flex items-center justify-center",
                  verified
                    ? "bg-white text-[#12151B] cursor-default"
                    : otpSent
                    ? "bg-white/15 text-white/60 cursor-not-allowed"
                    : isComplete
                    ? "bg-[#12151B] hover:bg-black text-white"
                    : "bg-white/15 text-white/60 cursor-not-allowed"
                )}
                disabled={verified || otpSent || !isComplete}
                onClick={() => (!verified && !otpSent ? sendOtp() : null)}
              >
                {verified ? "Verified" : otpSent ? "OTP Sent" : "Verify"}
              </button>
            </div>

            {otpSent && !verified && (
              <div className="mt-3">
                <input
                  className="w-full rounded-xl bg-white/10 border border-white/25 px-4 py-3 text-white/95 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 tracking-widest text-center"
                  placeholder="●●●●●●"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                />
              </div>
            )}

            <div className={clsx("mt-4 space-y-3 transition duration-500", !verified && "blur-sm pointer-events-none opacity-60")}>
              <input className="w-full rounded-xl bg-white/10 border border-white/25 px-4 py-3 text-white/95 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30" placeholder="Parent name" value={parent} onChange={(e)=>setParent(e.target.value)} />
              <input className="w-full rounded-xl bg-white/10 border border-white/25 px-4 py-3 text-white/95 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30" placeholder="Child name (optional)" value={child} onChange={(e)=>setChild(e.target.value)} />
              <div className="pt-2 flex gap-3">
                <button className="flex-1 rounded-2xl bg-white text-gray-900 py-3 font-semibold">Get my free week</button>
              </div>
              <p className="text-white/60 text-xs">By continuing, you agree to receive messages on WhatsApp. You can stop anytime.</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* ---------------- Footer ---------------- */
const Footer = () => (
  <footer className="py-10 border-t border-white/10 text-center text-white/80 text-sm bg-black/20">
    <div className="max-w-6xl mx-auto px-6">
      <p>© {new Date().getFullYear()} KIDOOSE · All rights reserved</p>
      <p className="mt-2">📧 hello@kidoose.com · 📞 +1 (555) 123-4567</p>
      <p className="mt-4 italic">Your child will remember stories, not screens. Start your free week — and make tonight magical ✨</p>
    </div>
  </footer>
);

/* ---------------- Sticky Mobile CTA ---------------- */
const StickyMobileCTA = ({ onPrimary, onDemo, intent }) => {
  const label = (i) => i === "bedtime" ? "Tonight’s story" : i === "activities" || i === "morning" ? "Today’s activity" : "Sample";
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
      <div className="mx-auto max-w-6xl">
        <div className="m-3 rounded-2xl border border-white/15 bg-black/60 backdrop-blur-lg p-2 flex items-center gap-2">
          <button onClick={onDemo} className="flex-1 rounded-xl border border-white/25 bg-white/5 text-white px-3 py-2 font-semibold">{label(intent)}</button>
          <button onClick={onPrimary} className="flex-1 rounded-xl bg-white text-gray-900 px-3 py-2 font-semibold">Free week</button>
        </div>
      </div>
    </div>
  );
};

/* ---------------- App Root ---------------- */
export default function App() {
  const [showSignup, setShowSignup] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [chosenPlan, setChosenPlan] = useState(null);
  const [showHeaderButtons, setShowHeaderButtons] = useState(false);
  const [intent, setIntent] = useState("default");

  useEffect(() => {
    document.body.style.background = "transparent";
    document.body.style.fontFamily =
      '-apple-system, "SF Pro Text", Inter, ui-sans-serif, system-ui, Segoe UI, Roboto';
    setIntent(intentFromQuery());
    const onScroll = () => setShowHeaderButtons(window.scrollY > window.innerHeight * 0.75);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="text-white min-h-screen">
      <Backdrop />
      <Header
        onPrimary={() => setShowSignup(true)}
        onDemo={() => setShowDemo(true)}
        showButtons={showHeaderButtons}
      />

      <main>
        <Hero
          intent={intent}
          onPrimary={() => {
            setChosenPlan(null);
            setShowSignup(true);
          }}
          onDemo={() => setShowDemo(true)}
        />
        <TrustStrip />
        <How />
        <Reviews />
        <FAQ />
        <Pricing
          onStart={(p) => {
            setChosenPlan(p);
            setShowSignup(true);
          }}
        />
      </main>

      <Footer />

      <StickyMobileCTA
        intent={intent}
        onPrimary={() => setShowSignup(true)}
        onDemo={() => setShowDemo(true)}
      />

      {/* Modals */}
      <SignUpModal
        open={showSignup}
        onClose={() => setShowSignup(false)}
        defaultPlan={chosenPlan}
      />
      <DemoModal
        open={showDemo}
        onClose={() => setShowDemo(false)}
        onStart={() => {
          setChosenPlan(null);
          setShowDemo(false);
          setShowSignup(true);
        }}
      />
    </div>
  );
}
