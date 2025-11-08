// App.jsx — KIDOOSE Cinematic Dusk (Full Site) + iPhone WhatsApp Dark Demo
// Requirements: React 18, TailwindCSS, framer-motion, clsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

/* ---------------- Theme ---------------- */
const PAL = {
  nightTop: "#0E1624",
  nightMid: "#16253B",
  nightBot: "#1B2D4D",
  auroraA: "#8BA7FF",
  auroraB: "#F5C16E",
  ink: "#12151B",
};

/* ---------------- Aurora Backdrop w/ subtle parallax ---------------- */
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
  return <div ref={ref} className="fixed inset-0 -z-50" aria-hidden />;
};

/* ---------------- Small confetti burst (for CTA) ---------------- */
const Confetti = ({ fire }) =>
  <AnimatePresence>
    {fire && (
      <motion.div
        className="pointer-events-none fixed inset-0 z-[60]"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1.4 }}
      >
        {[...Array(28)].map((_, i) => (
          <motion.span
            key={i}
            className="absolute w-2 h-2 rounded-sm"
            style={{
              left: "50%", top: "50%",
              background: i % 3 ? PAL.auroraA : PAL.auroraB
            }}
            initial={{ x: 0, y: 0, rotate: 0 }}
            animate={{
              x: (Math.random() - 0.5) * 500,
              y: (Math.random() - 0.7) * 600,
              rotate: Math.random() * 360
            }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        ))}
      </motion.div>
    )}
  </AnimatePresence>;

/* ---------------- KIDOOSE Logo ---------------- */
const KidooseLogo = ({ centerOnMobile = false }) => (
  <div className={clsx("flex items-center gap-2 select-none", centerOnMobile && "justify-center w-full")}>
    <span className="text-white font-extrabold text-xl md:text-2xl tracking-wide">KID</span>
    <motion.span
      className="w-4 h-4 md:w-5 md:h-5 rounded-full"
      style={{
        background: "radial-gradient(circle at 40% 35%, #FFEAA0, #FFA131 60%, #E27C00 100%)",
        boxShadow: "0 0 14px rgba(255,161,49,0.45)",
      }}
      animate={{ scale: [1, 1.12, 1] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.span
      className="w-4 h-4 md:w-5 md:h-5 rounded-full"
      style={{
        background: "radial-gradient(circle at 45% 40%, #EAF0FF, #83A3FF 60%, #5E7AFF 100%)",
        boxShadow: "0 0 14px rgba(131,163,255,0.45)",
      }}
      animate={{ scale: [1, 1.12, 1] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
    />
    <span className="text-white font-extrabold text-xl md:text-2xl tracking-wide">OOSE</span>
  </div>
);

/* ---------------- Scroll-aware Header ---------------- */
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

/* =======================================================================
   IPHONE-STYLE WHATSAPP DARK REPLICA (as approved)
   Typing dots bottom-left → msg1 → dots → msg2; clean composer layout
======================================================================= */
/* Status Bar Icons */
const Clock = ({ time }) => (
  <span className="text-white text-[13px] font-[500] tracking-tight leading-none">{time}</span>
);
const SignalIcon = () => (
  <svg width="22" height="11" viewBox="0 0 22 11" className="text-white">
    {[7, 5, 3, 1, 0].map((y, i) => (
      <rect key={i} x={i * 5} y={y} width="2" height={11 - y} rx="0.5" fill="currentColor" />
    ))}
  </svg>
);
const WifiIcon = () => (
  <svg width="20" height="14" viewBox="0 0 20 14" fill="none" className="text-white">
    <path
      d="M10 12.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm-4-3.5a6 6 0 018 0M3 5a10 10 0 0114 0"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.9"
    />
  </svg>
);
const BatteryIcon = ({ level = 0.8 }) => (
  <svg width="27" height="13" viewBox="0 0 27 13" fill="none" className="text-white">
    <rect x="1" y="2" width="22" height="9" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <rect x="24" y="4" width="2" height="5" rx="1" fill="currentColor" />
    <rect x="2.5" y="3.5" width={20 * level} height="6" rx="1" fill="currentColor" opacity="0.9" />
  </svg>
);
/* Chat header/controls */
const Icon = {
  Back: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="#007AFF" strokeWidth="2.3" strokeLinecap="round" className="w-5 h-5"><path d="M15 18l-6-6 6-6"/></svg>
  ),
  Video: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="#007AFF" strokeWidth="2" strokeLinecap="round" className="w-5 h-5">
      <path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/>
    </svg>
  ),
  Phone: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="#007AFF" strokeWidth="2" strokeLinecap="round" className="w-5 h-5">
      <path d="M22 16.9v3a2 2 0 01-2.2 2 19.9 19.9 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.9 19.9 0 012.1 4a2 2 0 012-2h3a2 2 0 012 1.7c.1.9.4 1.9.7 2.8a2 2 0 01-.5 2.1L8.1 9.9a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.5c.9.3 1.9.6 2.8.7a2 2 0 011.7 2z"/>
    </svg>
  ),
  Plus: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="#007AFF" strokeWidth="2.2" strokeLinecap="round" className="w-5 h-5"><path d="M12 5v14M5 12h14"/></svg>
  ),
  Camera: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="#007AFF" strokeWidth="2" strokeLinecap="round" className="w-5 h-5">
      <path d="M23 19a4 4 0 01-4 4H5a4 4 0 01-4-4V9a4 4 0 014-4h3l2-3h4l2 3h3a4 4 0 014 4v10z"/><circle cx="12" cy="14" r="4"/>
    </svg>
  ),
  Mic: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="#007AFF" strokeWidth="2" strokeLinecap="round" className="w-5 h-5">
      <path d="M12 1a3 3 0 00-3 3v7a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10a7 7 0 01-14 0M12 17v6"/>
    </svg>
  ),
  Send: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="#007AFF" strokeWidth="2" strokeLinecap="round" className="w-5 h-5">
      <path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/>
    </svg>
  ),
};
/* Wallpaper */
const WALLPAPER = `url('data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
  <rect width="200" height="200" fill="rgba(13,20,25,1)"/>
  <g stroke="rgba(255,255,255,0.04)" stroke-width="2" fill="none">
    <path d="M20 40c8-8 24-8 32 0 8 8 8 24 0 32" />
    <circle cx="160" cy="60" r="12"/>
    <path d="M80 160l20-8 20 8-20 8z"/>
    <path d="M140 140c0 8 12 8 12 0s-12-8-12 0z"/>
    <path d="M32 120c10 0 10 14 0 14s-10-14 0-14z"/>
  </g>
</svg>`)}')`;
/* iOS time hook */
const useIosClock = () => {
  const format = () =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true }).replace(/^0/, "");
  const [time, setTime] = useState(format());
  useEffect(() => {
    const i = setInterval(() => setTime(format()), 60000);
    return () => clearInterval(i);
  }, []);
  return time;
};
/* WhatsApp Replica component */
const WhatsAppReplica = () => {
  const time = useIosClock();
  const [battery] = useState(0.82);

  // 0 typing, 1 msg1, 2 typing again, 3 msg2
  const [stage, setStage] = useState(0);
  useEffect(() => {
    const seq = [
      setTimeout(() => setStage(0), 400),
      setTimeout(() => setStage(1), 2100),
      setTimeout(() => setStage(2), 3800),
      setTimeout(() => setStage(3), 5600),
    ];
    return () => seq.forEach(clearTimeout);
  }, []);

  return (
    <div className="w-[360px] sm:w-[390px] bg-[#111B21] rounded-t-[28px] overflow-hidden shadow-2xl border border-black/40">
      {/* status bar */}
      <div className="flex justify-between items-center px-4 pt-2 pb-1 bg-black">
        <Clock time={time} />
        <div className="flex items-center gap-1.5"><SignalIcon/><WifiIcon/><BatteryIcon level={battery}/></div>
      </div>
      {/* header */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#202C33]">
        <div className="flex items-center gap-2">
          <Icon.Back />
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#385a64] to-[#1c2b30]" />
          <div className="leading-tight">
            <div className="text-[14px] font-semibold text-[#E9EDEF]">Kidoose</div>
            <div className="text-[12px] text-[#6BEB7A]">online</div>
          </div>
        </div>
        <div className="flex items-center gap-4"><Icon.Video/><Icon.Phone/></div>
      </div>
      {/* chat area */}
      <div className="relative min-h-[520px] px-3 py-3"
           style={{ backgroundImage: WALLPAPER, backgroundRepeat: "repeat", backgroundSize: "200px 200px" }}>
        {stage >= 1 && (
          <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}}
                      className="max-w-[82%] bg-[#202C33] text-[#E9EDEF] rounded-[18px] rounded-tl-[6px] px-3 py-2 mb-2">
            🌞 Morning Play: Build a paper airplane together — one-minute race!
            <div className="text-[10px] text-[#8696A0] text-right mt-1">08:59</div>
          </motion.div>
        )}
        {stage >= 3 && (
          <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}}
                      className="max-w-[82%] bg-[#202C33] text-[#E9EDEF] rounded-[18px] rounded-tl-[6px] px-3 py-2 mb-2">
            🌙 Bedtime: “Under the sleepy moon, Milo counted the wind’s whispers…”
            <div className="text-[10px] text-[#8696A0] text-right mt-1">19:00</div>
          </motion.div>
        )}
        {/* typing dots bottom-left above composer */}
        <AnimatePresence>
          {(stage === 0 || stage === 2) && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
                        className="absolute bottom-[58px] left-4 flex items-center gap-1">
              {[0,1,2].map(d=>(
                <motion.span key={d} className="w-[7px] h-[7px] rounded-full bg-[#AEB8BD]/90"
                             animate={{y:[0,-3,0],opacity:[0.6,1,0.6]}}
                             transition={{duration:0.9,repeat:Infinity,delay:d*0.15}}/>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* composer */}
      <div className="bg-[#202C33] px-3 py-[6px] flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <Icon.Plus />
          <div className="flex items-center bg-[#2A3942] rounded-full px-4 py-[8px] flex-1 text-[#E9EDEF] text-[14px]">Message</div>
          <Icon.Camera />
        </div>
        <div className="flex items-center gap-3 pl-2"><Icon.Mic/><Icon.Send/></div>
      </div>
    </div>
  );
};

/* ---------------- HERO ---------------- */
const Hero = ({ onPrimary, onDemo }) => (
  <section className="text-white text-center pt-16 md:pt-20 pb-10 px-6">
    <div className="max-w-4xl mx-auto">
      <p className="text-white/70 text-sm md:text-base">From two parents who wanted calmer days.</p>
      <h1 className="mt-2 text-4xl md:text-6xl font-extrabold leading-tight">
        Turn{" "}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8BA7FF] to-[#F5C16E]">
          7 minutes a day
        </span>{" "}
        into rituals your child will remember.
      </h1>
      <p className="mt-5 text-white/85 text-lg leading-relaxed">
        Every morning: a playful idea. Every night: a calming story.{" "}
        <span className="underline underline-offset-4">Delivered on WhatsApp</span> — no app to install.
      </p>

      <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
        <button
          onClick={onPrimary}
          className="rounded-2xl bg-white text-gray-900 px-6 py-3 font-semibold shadow hover:shadow-md w-full sm:w-auto"
        >
          Start your free week
        </button>
        <button
          onClick={onDemo}
          className="rounded-2xl border border-white/25 bg-white/5 text-white px-6 py-3 font-semibold hover:bg-white/10 w-full sm:w-auto"
        >
          Play sample
        </button>
      </div>

      <p className="mt-4 text-white/75 italic">No charge until day 8 · Cancel anytime</p>

      <div className="mt-8 grid place-items-center">
        <WhatsAppReplica />
      </div>
    </div>
  </section>
);

/* ---------------- HOW ---------------- */
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
          <div
            key={c.title}
            className="rounded-2xl border border-white/12 bg-white/6 backdrop-blur-lg p-6 text-left shadow-[0_10px_30px_rgba(0,0,0,0.25)]"
          >
            <div className="text-2xl">{c.icon}</div>
            <h3 className="mt-2 text-xl font-semibold text-white">{c.title}</h3>
            <p className="mt-2 text-white/80">{c.text}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ---------------- REVIEWS ---------------- */
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
            <motion.div
              key={r.name}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="rounded-2xl border border-white/12 bg-white/6 backdrop-blur-lg p-6 text-left text-white shadow-[0_10px_30px_rgba(0,0,0,0.25)]"
            >
              <p className="text-white/90 leading-relaxed">“{r.text}”</p>
              <p className="mt-4 text-white/70 text-sm">{r.name}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ---------------- PRICING ---------------- */
const Pricing = ({ onStart, fireConfetti }) => {
  const plans = useMemo(
    () => [
      {
        id: "starter",
        name: "Starter",
        tag: "Best for curious first-timers",
        price: "$4.99/mo",
        features: ["Morning game + bedtime story", "Short cozy replies", "Email or WhatsApp"],
        cta: "Try a week of joyful mornings 🌞",
      },
      {
        id: "family",
        name: "Family",
        tag: "Best for families with 1–2 kids",
        price: "$7.99/mo",
        features: ["Everything in Starter", "“Bad day?” extra support", "Weekly recap + sibling tweak"],
        cta: "Start calmer days tonight 🌙",
        popular: true,
      },
      {
        id: "premium",
        name: "Premium",
        tag: "Best for story lovers or siblings",
        price: "$11.99/mo",
        features: ["Everything in Family", "Calm audio stories", "Seasonal packs + name insert"],
        cta: "Make bedtime magical ✨",
      },
    ],
    []
  );

  return (
    <section id="pricing" className="py-20 md:py-24 text-center text-white">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-3xl md:text-4xl font-extrabold">Simple pricing</h2>
        <p className="mt-2 text-white/80">
          Choose calm mornings, connected evenings — and let us handle the rest.
        </p>

        <div className="mt-10 grid md:grid-cols-3 gap-7">
          {plans.map((p) => (
            <motion.div
              key={p.id}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className={clsx(
                "relative rounded-3xl border p-6 text-left sm:text-center shadow-[0_15px_40px_rgba(0,0,0,0.35)] transition duration-300 hover:shadow-[0_20px_60px_rgba(0,0,0,0.45)]",
                p.popular
                  ? "border-white/15 bg-gradient-to-br from-[#F5C16E]/90 via-[#D5C0F7]/70 to-[#8BA7FF]/90"
                  : "border-white/12 bg-white/6 backdrop-blur-lg"
              )}
              onClick={() => { fireConfetti(); onStart(p); }}
              role="button"
            >
              {p.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-black/70 text-white text-xs font-semibold px-3 py-1 border border-white/20">
                  ❤️ Most loved by parents
                </div>
              )}

              <div className="sm:text-center">
                <h3 className={clsx("text-2xl font-semibold", p.popular && "text-[#12151B]")}>{p.name}</h3>
                <p className={clsx("text-sm mt-1 italic", p.popular ? "text-[#12151B]/80" : "text-white/70")}>
                  {p.tag}
                </p>
                <div className={clsx("text-4xl font-extrabold mt-3", p.popular && "text-[#12151B]")}>
                  {p.price}
                </div>
              </div>

              <ul className={clsx("mt-4 space-y-2 text-left mx-auto max-w-[22rem]", p.popular ? "text-[#12151B]" : "text-white/90")}>
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2 items-start justify-start">
                    <span>✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <p className={clsx("mt-4 text-sm text-center", p.popular ? "text-[#12151B]/85" : "text-white/70")}>
                Less than a cup of coffee — for calmer mornings and sweeter nights.
              </p>

              <button
                onClick={(e) => { e.stopPropagation(); fireConfetti(); onStart(p); }}
                className={clsx(
                  "w-full mt-6 rounded-2xl py-3 font-semibold transition text-center",
                  p.popular ? "bg-[#12151B] text-white hover:bg-black" : "bg-white text-gray-900 hover:shadow-md"
                )}
              >
                {p.cta}
              </button>

              <p className={clsx("mt-3 text-xs text-center", p.popular ? "text-[#12151B]/75" : "text-white/70")}>
                🛡️ Cancel anytime · 💌 No app needed · ❤️ 97% stay after free week
              </p>
            </motion.div>
          ))}
        </div>

        <p className="mt-10 text-white/70 italic">
          Because sometimes, all it takes is 7 minutes to feel connected again.
        </p>
      </div>
    </section>
  );
};

/* ---------------- FAQ ---------------- */
const FAQ = () => {
  const q = [
    ["What ages is Kidoose for?", "Roughly 2–9. Activities are simple; stories are calm and short."],
    ["When do I get messages?", "Morning Spark around 9am; Bedtime Story around 7pm (you can adjust later)."],
    ["Can I cancel anytime?", "Yes — the free week is truly free. Cancel with one click."],
  ];
  return (
    <section id="faq" className="py-16 md:py-20">
      <div className="mx-auto max-w-4xl px-6 text-white">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center">Questions, answered</h2>
        <div className="mt-8 space-y-4">
          {q.map(([h, a]) => (
            <details key={h} className="rounded-2xl border border-white/12 bg-white/5 p-4">
              <summary className="cursor-pointer text-lg font-semibold">{h}</summary>
              <p className="mt-2 text-white/80">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ---------------- FOOTER ---------------- */
const Footer = () => (
  <footer className="py-10 border-t border-white/10 text-center text-white/80 text-sm bg-black/20">
    <div className="max-w-6xl mx-auto px-6">
      <p>© {new Date().getFullYear()} KIDOOSE · All rights reserved</p>
      <p className="mt-2">📧 hello@kidoose.com · 📞 +1 (555) 123-4567</p>
      <p className="mt-4 italic">
        Your child will remember stories, not screens. Start your free week — and make tonight magical ✨
      </p>
    </div>
  </footer>
);

/* ---------------- Sticky Mobile CTA ---------------- */
const StickyMobileCTA = ({ onPrimary, onDemo }) => (
  <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
    <div className="mx-auto max-w-6xl">
      <div className="m-3 rounded-2xl border border-white/15 bg-black/60 backdrop-blur-lg p-2 flex items-center gap-2">
        <button onClick={onDemo} className="flex-1 rounded-xl border border-white/25 bg-white/5 text-white px-3 py-2 font-semibold">
          Sample
        </button>
        <button onClick={onPrimary} className="flex-1 rounded-xl bg-white text-gray-900 px-3 py-2 font-semibold">
          Free week
        </button>
      </div>
    </div>
  </div>
);

/* ---------------- Simple Signup Modal (name + phone) ---------------- */
const SignUpModal = ({ open, onClose, defaultPlan }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [sending, setSending] = useState(false);
  const [fired, setFired] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setFired(true);
      setTimeout(onClose, 1200);
    }, 1000);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-md px-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            className="relative w-full max-w-lg rounded-3xl border border-white/12 p-6 text-white"
            style={{ background: "linear-gradient(180deg, rgba(17,27,33,0.98) 0%, rgba(32,44,51,0.98) 100%)" }}
            initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.98, opacity: 0 }}
          >
            <button onClick={onClose} className="absolute right-3 top-3 w-9 h-9 rounded-full bg-black/40 border border-white/20 grid place-items-center hover:bg-black/55">✕</button>
            <h3 className="text-2xl md:text-3xl font-extrabold">Start your free week ✨</h3>
            <p className="text-white/85 mt-1">No charge until day 8 · Cancel anytime</p>

            <form onSubmit={submit} className="mt-4 space-y-3">
              <input className="w-full rounded-xl bg-white/10 border border-white/25 px-4 py-3 text-white/95 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
                     placeholder="Parent name" value={name} onChange={(e)=>setName(e.target.value)} />
              <input className="w-full rounded-xl bg-white/10 border border-white/25 px-4 py-3 text-white/95 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
                     placeholder="WhatsApp phone (+1 555…)" value={phone} onChange={(e)=>setPhone(e.target.value)} />
              <div className="pt-2 flex gap-3">
                <button disabled={sending} className="flex-1 rounded-2xl bg-white text-gray-900 py-3 font-semibold">
                  {sending ? "Creating…" : "Get my free week"}
                </button>
              </div>
              {fired && <div className="text-emerald-300 text-sm">🎉 You’re in! We’ll text you shortly.</div>}
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* ---------------- Demo Modal (shows WhatsAppReplica) ---------------- */
const DemoModal = ({ open, onClose, onStart }) => (
  <AnimatePresence>
    {open && (
      <motion.div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-md px-4"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  onMouseDown={(e)=>{ if(e.target===e.currentTarget) onClose(); }}>
        <motion.div className="relative w-full max-w-[420px] md:max-w-[520px] rounded-3xl border border-white/12 p-4 md:p-6 text-white"
                    style={{ background: "linear-gradient(180deg, rgba(17,27,33,0.98) 0%, rgba(32,44,51,0.98) 100%)" }}
                    initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.98, opacity: 0 }}>
          <button onClick={onClose} className="absolute right-3 top-3 w-9 h-9 rounded-full bg-black/40 border border-white/20 grid place-items-center hover:bg-black/55">✕</button>
          <div className="mx-auto grid place-items-center"><WhatsAppReplica/></div>
          <div className="mt-4 md:mt-6 flex justify-center">
            <button onClick={onStart} className="rounded-2xl bg-white text-[#12151B] px-6 py-3 font-semibold shadow hover:shadow-md">
              Start my free trial
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

/* ---------------- ROOT APP ---------------- */
export default function App() {
  const [showSignup, setShowSignup] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [chosenPlan, setChosenPlan] = useState(null);
  const [showHeaderButtons, setShowHeaderButtons] = useState(false);
  const [confetti, setConfetti] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowHeaderButtons(window.scrollY > window.innerHeight * 0.75);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const fireConfetti = () => {
    setConfetti(true);
    setTimeout(()=>setConfetti(false), 1400);
  };

  return (
    <div className="text-white min-h-screen">
      <Backdrop />
      <Confetti fire={confetti}/>
      <Header onPrimary={()=>setShowSignup(true)} onDemo={()=>setShowDemo(true)} showButtons={showHeaderButtons} />

      <main>
        <Hero onPrimary={()=>setShowSignup(true)} onDemo={()=>setShowDemo(true)} />
        <How />
        <Reviews />
        <Pricing
          onStart={(p)=>{ setChosenPlan(p); setShowSignup(true); }}
          fireConfetti={fireConfetti}
        />
        <FAQ />
      </main>

      <Footer />

      {/* Mobile sticky CTA */}
      <StickyMobileCTA onPrimary={()=>setShowSignup(true)} onDemo={()=>setShowDemo(true)} />

      {/* Modals */}
      <SignUpModal open={showSignup} onClose={()=>setShowSignup(false)} defaultPlan={chosenPlan}/>
      <DemoModal
        open={showDemo}
        onClose={()=>setShowDemo(false)}
        onStart={()=>{
          setChosenPlan(null);
          setShowDemo(false);
          setShowSignup(true);
          fireConfetti();
        }}
      />
    </div>
  );
}
