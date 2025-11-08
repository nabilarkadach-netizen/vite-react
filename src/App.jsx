// App.jsx — KIDOOSE USA Edition (Cinematic + Trust-tuned + Confetti Burst + Exit-Intent Sample)
// Requirements: React 18, Tailwind, framer-motion, clsx

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
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

/* ---------------- Country & Dial Helpers ---------------- */
const COUNTRY_FORMATS = {
  US: { dial: "+1", mask: "___ ___ ____", max: 10 },
  CA: { dial: "+1", mask: "___ ___ ____", max: 10 },
  GB: { dial: "+44", mask: "____ ______", max: 10 },
  AU: { dial: "+61", mask: "___ ___ ___", max: 9 },
  NZ: { dial: "+64", mask: "___ ___ ____", max: 9 },
  IE: { dial: "+353", mask: "__ ___ ____", max: 9 },
  SG: { dial: "+65", mask: "____ ____", max: 8 },
  IN: { dial: "+91", mask: "_____ _____", max: 10 },
  TR: { dial: "+90", mask: "___ ___ ____", max: 10 },
  AE: { dial: "+971", mask: "__ ___ ____", max: 9 },
  SA: { dial: "+966", mask: "__ ___ ____", max: 9 },
  EG: { dial: "+20", mask: "___ ___ ____", max: 9 },
  KW: { dial: "+965", mask: "___ ____", max: 8 },
  QA: { dial: "+974", mask: "____ ____", max: 8 },
  BH: { dial: "+973", mask: "____ ____", max: 8 },
  OM: { dial: "+968", mask: "____ ____", max: 8 },
  JO: { dial: "+962", mask: "__ ______", max: 9 },
  LB: { dial: "+961", mask: "__ ___ ___", max: 8 },
  MA: { dial: "+212", mask: "__ ___ ____", max: 9 },
  DZ: { dial: "+213", mask: "__ ___ ____", max: 9 },
  DEFAULT: { dial: "+1", mask: "____________", max: 12 },
};

const isoToFlagEmoji = (iso2) =>
  iso2 ? iso2.toUpperCase().replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt())) : "🌍";

/* ---------------- Hook: Detect Country Dial Code (locked to USA for launch) ---------------- */
const useCountryDialCode = () => {
  const [dialCode, setDialCode] = useState("+1");
  const [countryCode, setCountryCode] = useState("US");
  const [flag, setFlag] = useState("🇺🇸");

  useEffect(() => {
    let active = true;
    fetch("https://ipapi.co/json/")
      .then((r) => r.json())
      .then(() => {
        if (!active) return;
        setCountryCode("US");
        setDialCode("+1");
        setFlag("🇺🇸");
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

/* ---------------- Animated Backdrop (cinematic, lightweight) ---------------- */
const Backdrop = () => {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    let t = 0,
      raf;
    const tick = () => {
      t += 0.003;
      el.style.background = `
        radial-gradient(1100px 800px at ${15 + 5 * Math.sin(t)}% ${-8 + 6 * Math.cos(t * 0.8)}%, rgba(245,193,110,0.18), transparent 55%),
        radial-gradient(1000px 900px at ${85 + 4 * Math.cos(t * 0.7)}% ${110 + 5 * Math.sin(t)}%, rgba(139,167,255,0.2), transparent 58%),
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

/* ---------------- Localized Greeting (U.S. Parents Focus) ---------------- */
const LocalGreeting = () => {
  const [timeString, setTimeString] = useState("");
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const options = { hour: "numeric", minute: "2-digit", hour12: true, timeZone: "America/New_York" };
      const formatted = new Intl.DateTimeFormat("en-US", options).format(new Date());
      setTimeString(formatted);

      const hourStr = new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        hour12: false,
        timeZone: "America/New_York",
      }).format(new Date());
      const hour = parseInt(hourStr, 10);
      if (hour < 12) setGreeting("Good morning");
      else if (hour < 18) setGreeting("Good afternoon");
      else setGreeting("Good evening");
    };
    updateTime();
    const id = setInterval(updateTime, 60000);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center text-white/80 text-sm md:text-base pt-4"
      aria-live="polite"
    >
      {greeting}! It’s {timeString} in New York — tonight’s story is ready for you 🇺🇸
    </motion.div>
  );
};

/* ---------------- Logo ---------------- */
const KidooseLogo = () => (
  <div className="flex items-center gap-2 select-none">
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

/* ---------------- Header (scroll-aware) ---------------- */
const Header = ({ onPrimary, onSample, showButtons }) => (
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
              onClick={onSample}
              className="rounded-2xl border border-white/25 bg-white/5 text-white px-4 py-2 font-semibold hover:bg-white/10"
            >
              Send sample
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

/* ========================================================================== */
/* =================== WhatsApp Replica (scripted demo) ===================== */
/* ========================================================================== */

/* ---------- Status Bar ---------- */
const Clock = ({ time }) => (
  <span className="text-white text-[13px] font-[500] tracking-tight leading-none">{time}</span>
);
const SignalIcon = () => (
  <svg width="22" height="11" viewBox="0 0 22 11" className="text-white" aria-hidden>
    {[7, 5, 3, 1, 0].map((y, i) => (
      <rect key={i} x={i * 5} y={y} width="2" height={11 - y} rx="0.5" fill="currentColor" />
    ))}
  </svg>
);
const WifiIcon = () => (
  <svg width="20" height="14" viewBox="0 0 20 14" fill="none" className="text-white" aria-hidden>
    <path
      d="M10 12.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm-4-3.5a6 6 0 018 0M3 5a10 10 0 0114 0"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.9"
    />
  </svg>
);
const BatteryIcon = ({ level = 0.8 }) => (
  <svg width="27" height="13" viewBox="0 0 27 13" fill="none" className="text-white" aria-hidden>
    <rect x="1" y="2" width="22" height="9" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <rect x="24" y="4" width="2" height="5" rx="1" fill="currentColor" />
    <rect x="2.5" y="3.5" width={20 * level} height="6" rx="1" fill="currentColor" opacity="0.9" />
  </svg>
);

/* ---------- Icons ---------- */
const Icon = {
  Back: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="#007AFF" strokeWidth="2.3" strokeLinecap="round" className="w-5 h-5" aria-hidden>
      <path d="M15 18l-6-6 6-6" />
    </svg>
  ),
  Video: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="#007AFF" strokeWidth="2" strokeLinecap="round" className="w-5 h-5" aria-hidden>
      <path d="M23 7l-7 5 7 5V7z" />
      <rect x="1" y="5" width="15" height="14" rx="2" />
    </svg>
  ),
  Phone: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="#007AFF" strokeWidth="2" strokeLinecap="round" className="w-5 h-5" aria-hidden>
      <path d="M22 16.9v3a2 2 0 01-2.2 2 19.9 19.9 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.9 19.9 0 012.1 4a2 2 0 012-2h3a2 2 0 012 1.7c.1.9.4 1.9.7 2.8a2 2 0 01-.5 2.1L8.1 9.9a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.5c.9.3 1.9.6 2.8.7a2 2 0 011.7 2z" />
    </svg>
  ),
  Plus: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="#007AFF" strokeWidth="2.2" strokeLinecap="round" className="w-5 h-5" aria-hidden>
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  Camera: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="#007AFF" strokeWidth="2" strokeLinecap="round" className="w-5 h-5" aria-hidden>
      <path d="M23 19a4 4 0 01-4 4H5a4 4 0 01-4-4V9a4 4 0 014-4h3l2-3h4l2 3h3a4 4 0 014 4v10z" />
      <circle cx="12" cy="14" r="4" />
    </svg>
  ),
  Mic: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="#007AFF" strokeWidth="2" strokeLinecap="round" className="w-5 h-5" aria-hidden>
      <path d="M12 1a3 3 0 00-3 3v7a3 3 0 006 0V4a3 3 0 00-3-3z" />
      <path d="M19 10a7 7 0 01-14 0M12 17v6" />
    </svg>
  ),
  Send: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="#007AFF" strokeWidth="2" strokeLinecap="round" className="w-5 h-5" aria-hidden>
      <path d="M22 2L11 13" />
      <path d="M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  ),
};

/* ---------- Wallpaper ---------- */
const WALLPAPER = `url('data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
  <rect width="200" height="200" fill="rgba(13,20,25,1)"/>
  <g stroke="rgba(255,255,255,0.04)" stroke-width="2" fill="none">
    <path d="M20 40c8-8 24-8 32 0 8 8 8 24 0 32" />
    <circle cx="160" cy="60" r="12"/>
    <path d="M80 160l20-8 20 8-20 8z"/>
    <path d="M140 140c0 8 12 8 12 0s-12-8-12 0z"/>
  </g>
</svg>`)}')`;

/* ---------- iOS-like clock ---------- */
const useIosClock = () => {
  const format = () =>
    new Date()
      .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })
      .replace(/^0/, "");
  const [time, setTime] = useState(format());
  useEffect(() => {
    const i = setInterval(() => setTime(format()), 60000);
    return () => clearInterval(i);
  }, []);
  return time;
};

/* ---------- Confetti Burst (lightweight, framer-motion only) ---------- */
const ConfettiBurst = ({ trigger }) => {
  const [seed, setSeed] = useState(0);
  useEffect(() => {
    if (trigger) {
      setSeed((s) => s + 1);
    }
  }, [trigger]);
  const pieces = useMemo(() => Array.from({ length: 24 }, (_, i) => i), [seed]);

  return (
    <AnimatePresence>
      {trigger && (
        <motion.div
          key={`confetti-${seed}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="pointer-events-none absolute inset-0 overflow-hidden"
          aria-hidden
        >
          {pieces.map((i) => {
            const x = 50 + (Math.random() * 40 - 20);
            const rot = Math.random() * 180 - 90;
            const dur = 0.9 + Math.random() * 0.5;
            const delay = Math.random() * 0.1;
            const size = 6 + Math.random() * 6;
            const colors = ["#83A3FF", "#F5C16E", "#EAF0FF", "#5E7AFF", "#FFA131"];
            const bg = colors[i % colors.length];
            return (
              <motion.span
                key={i}
                className="absolute rounded"
                style={{ width: size, height: size, background: bg, left: `${x}%`, top: "40%" }}
                initial={{ y: 0, opacity: 1, rotate: 0 }}
                animate={{ y: 180 + Math.random() * 120, opacity: 0, rotate: rot }}
                transition={{ duration: dur, ease: "ease-out", delay }}
              />
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* ---------- WhatsAppDemo (typing → msg1 → typing → msg2) ---------- */
const WhatsAppDemo = () => {
  const time = useIosClock();
  const [battery] = useState(0.82);
  const [stage, setStage] = useState(0); // 0 typing, 1 msg1, 2 typing again, 3 msg2

  useEffect(() => {
    const seq = [
      setTimeout(() => setStage(0), 600),
      setTimeout(() => setStage(1), 2100),
      setTimeout(() => setStage(2), 4200),
      setTimeout(() => setStage(3), 6400),
    ];
    return () => seq.forEach(clearTimeout);
  }, []);

  return (
    <div className="relative w-full max-w-[390px] mx-auto scale-95 sm:scale-100 rounded-2xl overflow-hidden shadow-2xl border border-black/40 bg-[#111B21]">
      {/* Top status bar */}
      <div className="bg-black flex justify-between items-center px-4 pt-2 pb-1">
        <Clock time={time} />
        <div className="flex items-center gap-1.5">
          <SignalIcon />
          <WifiIcon />
          <BatteryIcon level={battery} />
        </div>
      </div>

      {/* Chat header */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#202C33]">
        <div className="flex items-center gap-2">
          <Icon.Back />
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#385a64] to-[#1c2b30]" />
          <div className="leading-tight">
            <div className="text-[14px] font-semibold text-[#E9EDEF]">Kidoose</div>
            <div className="text-[12px] text-[#6BEB7A]">online</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Icon.Video />
          <Icon.Phone />
        </div>
      </div>

      {/* Chat area */}
      <div
        className="relative min-h-[520px] px-3 py-3"
        style={{ backgroundImage: WALLPAPER, backgroundRepeat: "repeat", backgroundSize: "200px 200px" }}
      >
        {stage >= 1 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-[82%] bg-[#202C33] text-[#E9EDEF] rounded-[18px] rounded-tl-[6px] px-3 py-2 mb-2"
          >
            🌞 Morning Spark: Build a paper airplane together — one-minute race!
            <div className="text-[10px] text-[#8696A0] text-right mt-1">08:59</div>
          </motion.div>
        )}
        {stage >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-[82%] bg-[#202C33] text-[#E9EDEF] rounded-[18px] rounded-tl-[6px] px-3 py-2 mb-2"
          >
            🌙 Bedtime: “Under the sleepy moon, Milo counted the wind’s whispers…”
            <div className="text-[10px] text-[#8696A0] text-right mt-1">19:00</div>
          </motion.div>
        )}

        {/* Typing indicator — bottom-left, above composer */}
        <AnimatePresence>
          {(stage === 0 || stage === 2) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-[58px] left-4 flex items-center gap-1"
              aria-live="polite"
            >
              {[0, 1, 2].map((d) => (
                <motion.span
                  key={d}
                  className="w-[7px] h-[7px] rounded-full bg-[#AEB8BD]/90"
                  animate={{ y: [0, -3, 0], opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 0.9, repeat: Infinity, delay: d * 0.15 }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Composer */}
      <div className="bg-[#202C33] px-3 py-[6px] flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <Icon.Plus />
          <div className="flex items-center bg-[#2A3942] rounded-full px-4 py-[8px] flex-1 text-[#E9EDEF] text-[14px]">
            Message
          </div>
          <Icon.Camera />
        </div>
        <div className="flex items-center gap-3 pl-2">
          <Icon.Mic />
          <Icon.Send />
        </div>
      </div>
    </div>
  );
};

/* ========================================================================== */
/* ======================== Rest of the Kidoose site ======================== */
/* ========================================================================== */

/* ---------------- Hero (with subtle parallax) ---------------- */
const Hero = ({ onPrimary, onSample }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -20]);

  return (
    <section ref={ref} id="hero-section" className="text-white text-center pt-16 md:pt-20 pb-24 md:pb-20 px-6">
      <motion.div style={{ y }} className="max-w-4xl mx-auto">
        <p className="text-white/70 text-sm md:text-base">From two parents who wanted calmer, happier days.</p>
        <h1 className="mt-2 text-4xl md:text-6xl font-extrabold leading-tight">
          Turn{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8BA7FF] to-[#F5C16E]">
            7 minutes a day
          </span>{" "}
          into rituals your child will cherish.
        </h1>
        <p className="mt-4 text-white/85 text-lg leading-relaxed">
          Created by two parents in Portland who wanted calmer evenings with their kids.
        </p>
        <p className="mt-2 text-white/85 text-lg leading-relaxed">
          Every morning: a playful spark. Every night: a calming story.{" "}
          <span className="underline underline-offset-4">Delivered on WhatsApp</span> — no app to install.
        </p>

        <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <motion.button
            onClick={onPrimary}
            whileTap={{ scale: 0.98 }}
            className="group rounded-2xl bg-white text-gray-900 px-6 py-3 font-semibold shadow hover:shadow-md w-full sm:w-auto relative overflow-hidden"
          >
            <span className="relative z-10">Start your free week</span>
            <motion.span
              aria-hidden
              className="absolute inset-0 opacity-0 group-hover:opacity-100"
              initial={false}
              animate={{}}
              transition={{ duration: 0.3 }}
              style={{
                background:
                  "radial-gradient(650px 150px at 50% 0%, rgba(139,167,255,0.25), transparent 60%), radial-gradient(650px 150px at 50% 100%, rgba(245,193,110,0.25), transparent 60%)",
              }}
            />
          </motion.button>
          <button
            onClick={onSample}
            className="rounded-2xl border border-white/25 bg-white/5 text-white px-6 py-3 font-semibold hover:bg-white/10 w-full sm:w-auto"
          >
            Send me today’s sample
          </button>
        </div>

        <p className="mt-4 text-white/75 italic">Start free — we’ll only charge if you decide to stay. Cancel anytime.</p>

        {/* Trust strip + badges */}
        <div className="mt-5 flex flex-col items-center gap-1 text-white/70 text-sm">
          <div>Trusted by 1,200+ U.S. parents · 97% stay after the free week</div>
          <div className="flex items-center gap-3 opacity-90">
            <span className="px-2 py-0.5 rounded-full bg-white/10 border border-white/15">WhatsApp-first</span>
            <span className="px-2 py-0.5 rounded-full bg-white/10 border border-white/15">Cancel anytime</span>
            <span className="px-2 py-0.5 rounded-full bg-white/10 border border-white/15">Under 7 minutes/day</span>
          </div>
        </div>

        <div className="mt-10 flex justify-center pb-6 sm:pb-0">
          <WhatsAppDemo />
        </div>
      </motion.div>
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
        ].map((c, i) => (
          <motion.div
            key={c.title}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.45, delay: i * 0.05 }}
            className="rounded-2xl border border-white/12 bg-white/6 backdrop-blur-lg p-6 text-left shadow-[0_10px_30px_rgba(0,0,0,0.25)]"
          >
            <div className="text-2xl">{c.icon}</div>
            <h3 className="mt-2 text-xl font-semibold text-white">{c.title}</h3>
            <p className="mt-2 text-white/80">{c.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

/* ---------------- Reviews ---------------- */
const Reviews = () => {
  const items = [
    { name: "Sara — mom of a 5-year-old (Portland)", text: "Kidoose turned chaos into a sweet ritual. My son actually asks for bedtime now!" },
    { name: "Omar — dad of twins (Austin)", text: "Those tiny morning prompts are gold. Zero prep, big smiles before school." },
    { name: "Mina & Ali — parents of 3 & 7 (NJ)", text: "Two messages a day, huge impact. Less screens, more connection." },
  ];
  return (
    <section id="reviews" className="py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-6 text-center text-white">
        <h2 className="text-3xl md:text-4xl font-extrabold">Here’s what parents say after their first week</h2>
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
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-white/10 border border-white/15" />
                <p className="text-white/80 text-sm">{r.name}</p>
              </div>
              <p className="text-white/90 leading-relaxed">“{r.text}”</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ---------------- Pricing (centered head/CTA, left-aligned bullets, navy text for $7.99) ---------------- */
const Pricing = ({ onStart }) => {
  const plans = useMemo(
    () => [
      {
        id: "starter",
        name: "Starter",
        tag: "Best for curious first-timers",
        price: "$4.99/mo",
        features: ["🌞 Morning game + 🌙 bedtime story", "Short cozy replies", "Email or WhatsApp"],
        cta: "Experience your first calm mornings — free",
      },
      {
        id: "family",
        name: "Family",
        tag: "Best for families with 1–2 kids",
        price: "$7.99/mo",
        features: ["Everything in Starter", "“Bad day?” extra support", "Weekly recap + sibling tweak"],
        cta: "Start calmer days tonight",
        popular: true,
      },
      {
        id: "premium",
        name: "Premium",
        tag: "For story lovers / siblings",
        price: "$11.99/mo",
        features: ["Everything in Family", "Calm audio stories", "Seasonal packs + name insert"],
        cta: "Tuck them in with magic",
      },
    ],
    []
  );

  return (
    <section id="pricing" className="py-20 md:py-24 text-center text-white">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-3xl md:text-4xl font-extrabold">Simple pricing</h2>
        <p className="mt-2 text-white/80">Choose calm mornings, connected evenings — and let us handle the rest.</p>

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
              onClick={() => onStart(p)}
              role="button"
            >
              {p.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-black/70 text-white text-xs font-semibold px-3 py-1 border border-white/20">
                  ❤️ Most loved by parents
                </div>
              )}

              {/* Centered name/tag/price */}
              <div className="sm:text-center">
                <h3 className={clsx("text-2xl font-semibold", p.popular && "text-[#12151B]")}>{p.name}</h3>
                <p className={clsx("text-sm mt-1 italic", p.popular ? "text-[#12151B]/80" : "text-white/70")}>{p.tag}</p>
                <div
                  className={clsx(
                    "text-4xl font-extrabold mt-3",
                    p.popular ? "text-[#12151B]" : "text-white",
                  )}
                >
                  {p.price}
                </div>
              </div>

              {/* Left-aligned bullets */}
              <ul className={clsx("mt-4 space-y-2 text-left mx-auto max-w-[22rem]", p.popular ? "text-[#12151B]" : "text-white/90")}>
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2 items-start justify-start">
                    <span aria-hidden>—</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <p className={clsx("mt-4 text-sm text-center", p.popular ? "text-[#12151B]/85" : "text-white/70")}>
                Less than a cup of coffee — for calmer mornings and sweeter nights.
              </p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onStart(p);
                }}
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

              {/* Testimonial micro-badge on Family plan */}
              {p.id === "family" && (
                <div className="mt-3 text-xs text-center italic opacity-90">
                  “This is the one we use!” — Jess, NY mom
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <p className="mt-10 text-white/70 italic">Because sometimes, all it takes is 7 minutes to feel connected again.</p>
      </div>
    </section>
  );
};

/* ---------------- Footer ---------------- */
const Footer = () => (
  <footer className="py-10 border-t border-white/10 text-center text-white/80 text-sm bg-black/20">
    <div className="max-w-6xl mx-auto px-6">
      <p>© {new Date().getFullYear()} KIDOOSE · All rights reserved</p>
      <p className="mt-2">📧 hello@kidoose.com · 📞 +1 (555) 123-4567</p>
      <p className="mt-4 italic">Your child will remember stories, not screens. Start your free week — and make tonight magical ✨</p>
      <p className="mt-2 text-white/60">Founded by two storytelling parents who believe in calm, connection, and wonder.</p>
    </div>
  </footer>
);

/* ---------------- Sign Up Modal (masked phone, OTP flow, confetti, 30s resend timer, sample/trial modes) ---------------- */
const SignUpModal = ({ open, onClose, defaultPlan, mode = "trial", onSwitchToTrial }) => {
  const { dialCode, countryCode, flag } = useCountryDialCode();

  const fmtBase = COUNTRY_FORMATS[countryCode] || COUNTRY_FORMATS.US;
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
  const [statusMsg, setStatusMsg] = useState("");
  const popRef = useRef(null);

  // reset on close
  useEffect(() => {
    if (!open) {
      setPhone("");
      setParent("");
      setChild("");
      setPlanOpen(false);
      setPlan(defaultPlan?.id ?? "");
      setSending(false);
      setOtpSent(false);
      setOtp("");
      setVerified(false);
      setResendTimer(0);
      setStatusMsg("");
    }
  }, [open, defaultPlan]);

  // click outside plan popup
  useEffect(() => {
    const handler = (e) => {
      if (popRef.current && !popRef.current.contains(e.target)) setPlanOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // resend countdown
  useEffect(() => {
    if (!otpSent || resendTimer <= 0) return;
    const id = setInterval(() => setResendTimer((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [otpSent, resendTimer]);

  // formatting helpers
  const formatLocal = (allDigits) => {
    let local = allDigits.startsWith(dialDigits) ? allDigits.slice(dialDigits.length) : allDigits;
    local = local.slice(0, fmt.max);
    let out = fmt.mask;
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
    setStatusMsg("Sending code…");
    setTimeout(() => {
      setSending(false);
      setOtpSent(true);
      setResendTimer(30); // start countdown
      setStatusMsg("Code sent. Check WhatsApp.");
    }, 900);
  };

  const onEnter = (e) => {
    if (e.key === "Enter" && isComplete && !sending && !verified && !otpSent) {
      e.preventDefault();
      sendOtp();
    }
  };

  // auto-verify at 6 digits
  useEffect(() => {
    if (otpSent && !verified && otp.trim().length === 6) {
      setVerified(true);
      setStatusMsg("Verified. Welcome!");
    }
  }, [otp, otpSent, verified]);

  const planList = [
    { id: "starter", name: "Starter", price: "$4.99/mo" },
    { id: "family", name: "Family", price: "$7.99/mo" },
    { id: "premium", name: "Premium", price: "$11.99/mo" },
  ];

  return (
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
          aria-modal="true"
          role="dialog"
        >
          <motion.div
            className="relative w-[95%] max-w-xl rounded-2xl border border-white/20 text-white p-6 overflow-hidden"
            style={{
              background: "linear-gradient(180deg, rgba(17,27,33,0.96) 0%, rgba(32,44,51,0.96) 100%)",
            }}
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

            <h3 className="text-2xl md:text-3xl font-extrabold">
              {mode === "sample" ? "Get today’s WhatsApp sample ✨" : "Start your free week ✨"}
            </h3>
            <p className="text-white/85 mt-1">
              {mode === "sample" ? (
                <>We’ll send a one-time sample message to WhatsApp {flag}.</>
              ) : (
                <>Start free — cancel anytime. Messages via WhatsApp {flag}.</>
              )}
            </p>

            {/* Step indicator + subtitles */}
            <div className="mt-3 flex items-center gap-2 text-xs text-white/70">
              {[1, 2, 3].map((n) => (
                <div key={n} className="flex items-center gap-2">
                  <div
                    className={clsx(
                      "w-6 h-6 grid place-items-center rounded-full border",
                      (n <= (verified ? 3 : otpSent ? 2 : 1)) ? "bg-white text-[#12151B] border-white" : "border-white/30"
                    )}
                  >
                    {n}
                  </div>
                  {n < 3 && <div className="w-6 h-[1px] bg-white/30" />}
                </div>
              ))}
              <div className="ml-2 text-white/70">
                {verified ? (mode === "sample" ? "Success" : "Details") : otpSent ? "Enter OTP" : "Verify phone"}
              </div>
            </div>
            <div className="sr-only" aria-live="polite">{statusMsg}</div>

            {/* Phone input with verify button */}
            <div className="relative mt-5 w-full">
              <input
                id="phone-input"
                type="tel"
                className={clsx(
                  "w-full rounded-xl bg-white/10 border border-white/25 px-4 py-3 text-white/95 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 pr-[7.6rem]",
                  (verified || otpSent) && "opacity-95"
                )}
                placeholder={`${fmt.dial} ${fmt.mask}`}
                inputMode="tel"
                value={phone}
                onChange={(e) => {
                  handlePhoneChange(e);
                  const digits = e.target.value.replace(/\D/g, "");
                  const localDigits = digits.startsWith(dialDigits) ? digits.slice(dialDigits.length) : digits;
                  if (localDigits.length === fmt.max && !sending && !verified && !otpSent) {
                    sendOtp();
                  }
                }}
                onKeyDown={onEnter}
                disabled={verified} // editable until verified
                aria-label="Phone number"
              />

              <button
                className={clsx(
                  "absolute top-1/2 -translate-y-1/2 right-1.5 rounded-lg text-sm font-semibold transition px-3 py-1.5 min-w-[110px] flex items-center justify-center",
                  verified
                    ? "bg-white text-[#12151B] cursor-default"
                    : sending
                    ? "bg-[#12151B] text-white opacity-80"
                    : otpSent
                    ? "bg-white/15 text-white/60 cursor-not-allowed"
                    : isComplete
                    ? "bg-[#12151B] hover:bg-black text-white"
                    : "bg-white/15 text-white/60 cursor-not-allowed"
                )}
                disabled={verified || sending || otpSent || !isComplete}
                onClick={() => (!verified && !otpSent ? sendOtp() : null)}
                aria-label="Verify phone"
              >
                {verified ? (
                  "Verified"
                ) : sending ? (
                  <motion.svg
                    className="w-4 h-4 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    aria-hidden
                  >
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
                    <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </motion.svg>
                ) : otpSent ? (
                  "OTP Sent"
                ) : (
                  "Verify"
                )}
              </button>
            </div>

            {/* OTP block */}
            <AnimatePresence>
              {otpSent && !verified && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} className="mt-3">
                  <p className="text-white/80 text-sm">Check WhatsApp — we just sent your 6-digit code.</p>
                  <div className="mt-2 flex flex-col gap-2">
                    <input
                      className="w-full rounded-xl bg-white/10 border border-white/25 px-4 py-3 text-white/95 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 tracking-widest text-center"
                      placeholder="●●●●●●"
                      inputMode="numeric"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                      aria-label="OTP code"
                    />

                    <button
                      type="button"
                      disabled={resendTimer > 0}
                      onClick={() => {
                        setOtp("");
                        setOtpSent(false);
                        setTimeout(() => {
                          setSending(true);
                          setTimeout(() => {
                            setSending(false);
                            setOtpSent(true);
                            setResendTimer(30);
                            setStatusMsg("Code re-sent.");
                          }, 800);
                        }, 10);
                      }}
                      className={clsx(
                        "text-xs underline underline-offset-4 self-center",
                        resendTimer > 0 ? "text-white/40 cursor-not-allowed" : "text-white/80 hover:text-white"
                      )}
                    >
                      {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Didn't get the code? Resend"}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Confetti (on verify) */}
            <ConfettiBurst trigger={verified} />

            {/* SAMPLE MODE → Success block (skip plan) */}
            {mode === "sample" && verified && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 rounded-xl border border-white/20 bg-white/10 p-4 relative overflow-hidden"
              >
                <motion.div
                  className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-30"
                  style={{ background: "radial-gradient(closest-side, #83A3FF, transparent)" }}
                  animate={{ scale: [1, 1.15, 1], opacity: [0.25, 0.35, 0.25] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                />
                <div className="text-white/90 font-semibold">All set!</div>
                <div className="text-white/75 text-sm mt-1">Check WhatsApp — your first little moment is waiting 🌙</div>
                <button
                  className="mt-3 w-full rounded-2xl bg-white text-gray-900 py-3 font-semibold"
                  onClick={() => {
                    if (onSwitchToTrial) onSwitchToTrial();
                  }}
                >
                  Loved it? Start your free week
                </button>
              </motion.div>
            )}

            {/* TRIAL MODE → Details + Plan (unlocked after verified) */}
            {mode === "trial" && (
              <div className={clsx("mt-4 space-y-3 transition duration-500", !verified && "blur-sm pointer-events-none opacity-60")}>
                <input
                  className="w-full rounded-xl bg-white/10 border border-white/25 px-4 py-3 text-white/95 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
                  placeholder="Parent name"
                  value={parent}
                  onChange={(e) => setParent(e.target.value)}
                  aria-label="Parent name"
                />
                <input
                  className="w-full rounded-xl bg-white/10 border border-white/25 px-4 py-3 text-white/95 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
                  placeholder="Child name (optional)"
                  value={child}
                  onChange={(e) => setChild(e.target.value)}
                  aria-label="Child name"
                />

                {/* Plan select */}
                <div ref={popRef} className="relative">
                  <button
                    onClick={() => setPlanOpen((v) => !v)}
                    className="w-full rounded-xl bg-white/10 border border-white/25 px-4 py-3 text-white/95 text-left"
                    aria-haspopup="listbox"
                    aria-expanded={planOpen}
                  >
                    {plan
                      ? `${[{ id: "starter", name: "Starter", price: "$4.99/mo" }, { id: "family", name: "Family", price: "$7.99/mo" }, { id: "premium", name: "Premium", price: "$11.99/mo" }].find((x) => x.id === plan)?.name} · ${[{ id: "starter", name: "Starter", price: "$4.99/mo" }, { id: "family", name: "Family", price: "$7.99/mo" }, { id: "premium", name: "Premium", price: "$11.99/mo" }].find((x) => x.id === plan)?.price}`
                      : "Select plan"}
                  </button>

                  <AnimatePresence>
                    {planOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        className="absolute z-10 mt-2 w-full rounded-xl border border-white/20 bg-[rgba(20,25,35,0.92)] backdrop-blur-xl p-2 shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
                        role="listbox"
                      >
                        {[{ id: "starter", name: "Starter", price: "$4.99/mo" }, { id: "family", name: "Family", price: "$7.99/mo" }, { id: "premium", name: "Premium", price: "$11.99/mo" }].map(
                          (opt) => (
                            <button
                              key={opt.id}
                              onClick={() => {
                                setPlan(opt.id);
                                setPlanOpen(false);
                              }}
                              className="w-full flex items-center justify-between gap-3 text-white/95 hover:bg-white/10 rounded-lg px-3 py-2"
                              role="option"
                              aria-selected={plan === opt.id}
                            >
                              <span>{opt.name}</span>
                              <span className="text-white/75">{opt.price}</span>
                            </button>
                          )
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="pt-2 flex gap-3">
                  <button className="flex-1 rounded-2xl bg-white text-gray-900 py-3 font-semibold">Get my free week</button>
                </div>

                <p className="text-white/60 text-xs">By continuing, you agree to receive messages on WhatsApp. You can stop anytime.</p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* ---------------- Scroll-to-Top Gradient Orb (mobile only) ---------------- */
const ScrollToTopOrb = ({ show }) => (
  <AnimatePresence>
    {show && (
      <motion.button
        key="orb"
        initial={{ opacity: 0, y: 24, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Go to top"
        className="md:hidden fixed bottom-5 right-5 z-50 rounded-full w-14 h-14 shadow-[0_8px_28px_rgba(0,0,0,0.45)] ring-1 ring-white/20 backdrop-blur-xl"
        style={{
          background:
            "conic-gradient(from 160deg at 50% 50%, #EAF0FF, #83A3FF 35%, #5E7AFF 70%, #355BFF 100%)",
        }}
      >
        <motion.span className="inline-block" initial={false} whileTap={{ scale: 0.92 }} whileHover={{ scale: 1.06 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" className="mx-auto" aria-hidden>
            <path d="M12 5l-7 7h14l-7-7z" fill="white" />
          </svg>
        </motion.span>
      </motion.button>
    )}
  </AnimatePresence>
);

/* ---------------- Sticky Social-Proof Chip (shows briefly on scroll) ---------------- */
const SocialProofChip = ({ show }) => (
  <AnimatePresence>
    {show && (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 16 }}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 px-4 py-2 rounded-full text-sm text-white/90 bg-black/40 border border-white/20 backdrop-blur-md"
      >
        ❤️ Trusted by 1,200+ U.S. parents
      </motion.div>
    )}
  </AnimatePresence>
);

/* ---------------- Exit Intent Offer (desktop only, once) ---------------- */
const ExitIntent = ({ open, onClose, onSample }) => (
  <AnimatePresence>
    {open && (
      <motion.div
        className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/50 backdrop-blur-sm px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        role="dialog"
        aria-modal="true"
      >
        <motion.div
          initial={{ y: -12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -12, opacity: 0 }}
          className="w-full max-w-xl rounded-2xl border border-white/20 bg-[rgba(20,25,35,0.96)] text-white p-5 shadow-xl"
        >
          <div className="flex items-start gap-3">
            <div className="text-2xl">🌙</div>
            <div className="flex-1">
              <h4 className="text-lg font-semibold">Still thinking it over?</h4>
              <p className="text-white/80 mt-1">
                Try a free sample on WhatsApp — no signup needed. See how your child feels tonight.
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={onSample}
                  className="rounded-xl bg-white text-gray-900 px-4 py-2 font-semibold"
                >
                  Send me a free sample
                </button>
                <button
                  onClick={onClose}
                  className="rounded-xl border border-white/25 px-4 py-2 text-white/90 hover:bg-white/10"
                >
                  Not now
                </button>
              </div>
            </div>
            <button
              onClick={onClose}
              className="ml-2 w-9 h-9 rounded-full bg-black/30 border border-white/20 grid place-items-center"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

/* ---------------- App Root ---------------- */
export default function App() {
  const [showSignup, setShowSignup] = useState(false);
  const [chosenPlan, setChosenPlan] = useState(null);
  const [signupMode, setSignupMode] = useState("trial"); // "trial" | "sample"
  const [showHeaderButtons, setShowHeaderButtons] = useState(false);
  const [showTopOrb, setShowTopOrb] = useState(false);
  const [chipVisible, setChipVisible] = useState(false);
  const [exitOnceShown, setExitOnceShown] = useState(false);
  const [exitOpen, setExitOpen] = useState(false);

  useEffect(() => {
    document.body.style.background = "transparent";
    document.body.style.fontFamily = "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto";

    const onScroll = () => {
      setShowHeaderButtons(window.scrollY > window.innerHeight * 0.75);
      const hero = document.getElementById("hero-section");
      const heroH = hero?.offsetHeight || 600;
      setShowTopOrb(window.scrollY > heroH * 0.8);

      // show social proof chip briefly after first meaningful scroll
      if (window.scrollY > 140 && !chipVisible) {
        setChipVisible(true);
        setTimeout(() => setChipVisible(false), 2400);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [chipVisible]);

  // desktop exit-intent (once)
  useEffect(() => {
    const handler = (e) => {
      const isDesktop = window.innerWidth >= 1024;
      if (!isDesktop || exitOnceShown || showSignup) return;
      if (!e.relatedTarget && e.clientY <= 0) {
        setExitOpen(true);
        setExitOnceShown(true);
      }
    };
    document.addEventListener("mouseout", handler);
    return () => document.removeEventListener("mouseout", handler);
  }, [exitOnceShown, showSignup]);

  return (
    <div className="text-white min-h-screen">
      <Backdrop />
      <Header
        onPrimary={() => {
          setSignupMode("trial");
          setShowSignup(true);
        }}
        onSample={() => {
          setSignupMode("sample");
          setShowSignup(true);
        }}
        showButtons={showHeaderButtons}
      />

      <main>
        <LocalGreeting />
        <Hero
          onPrimary={() => {
            setChosenPlan(null);
            setSignupMode("trial");
            setShowSignup(true);
          }}
          onSample={() => {
            setChosenPlan(null);
            setSignupMode("sample");
            setShowSignup(true);
          }}
        />
        <How />
        <Reviews />
        <Pricing
          onStart={(p) => {
            setChosenPlan(p);
            setSignupMode("trial");
            setShowSignup(true);
          }}
        />
      </main>

      <Footer />

      {/* Sticky social-proof chip */}
      <SocialProofChip show={chipVisible} />

      {/* Scroll-to-Top Orb (mobile) */}
      <ScrollToTopOrb show={showTopOrb} />

      {/* SignUp Modal — supports both modes */}
      <SignUpModal
        open={showSignup}
        onClose={() => setShowSignup(false)}
        defaultPlan={chosenPlan}
        mode={signupMode}
        onSwitchToTrial={() => {
          setShowSignup(false);
          setTimeout(() => {
            setSignupMode("trial");
            setShowSignup(true);
          }, 80);
        }}
      />

      {/* Exit intent sample prompt */}
      <ExitIntent
        open={exitOpen}
        onClose={() => setExitOpen(false)}
        onSample={() => {
          setExitOpen(false);
          setSignupMode("sample");
          setShowSignup(true);
        }}
      />
    </div>
  );
}
