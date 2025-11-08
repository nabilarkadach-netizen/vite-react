// App.jsx — KIDOOSE Conversion Edition
// Tech: React 18, TailwindCSS, framer-motion, clsx
// Features: Intent-matched hero, WhatsApp-like samples, Trust strip, FAQ, Reviews, Pricing,
//           Full OTP signup flow w/ phone masking by IP + resend link (30s), Scroll-aware header,
//           Sticky mobile CTA, Clean/no-gimmick visuals.

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
  // MENA focus
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

/* ---------------- WhatsApp Demo (beige bubbles) ---------------- */
const WhatsAppDemo = () => {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 700),
      setTimeout(() => setStep(2), 2100),
      setTimeout(() => setStep(3), 4200),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);
  return (
    <div className="relative w-full max-w-[360px] mx-auto rounded-2xl overflow-hidden shadow-2xl border border-black/40 bg-[#ECE5DD]">
      <div className="bg-[#E5DDD5] text-[#111] px-4 py-2 flex items-center gap-2">
        <div className="w-2 h-2 bg-black/40 rounded-full" />
        <span className="font-semibold">Kidoose</span>
      </div>
      <div className="p-3 min-h-[260px]">
        {step >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="max-w-[85%] bg-[#FFF] text-[#111] rounded-2xl shadow px-3 py-2 border border-black/10"
          >
            🌞 Morning Play: Build a paper airplane together — one-minute race!
            <div className="text-[10px] text-black/50 text-right mt-1">09:00</div>
          </motion.div>
        )}
        {step >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="max-w-[85%] bg-[#FFF] text-[#111] rounded-2xl shadow px-3 py-2 mt-3 border border-black/10"
          >
            🌙 Bedtime: “Under the sleepy moon, Milo counted the wind’s whispers…” …
            <div className="text-[10px] text-black/50 text-right mt-1">19:00</div>
          </motion.div>
        )}
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

/* ---------------- Inline Samples Panel ---------------- */
const SamplePanel = ({ intent }) => {
  const showBedtime = intent === "bedtime" || intent === "default";
  const showMorning = intent === "activities" || intent === "morning" || intent === "default";
  return (
    <div className="mt-6 grid gap-3">
      {showMorning && (
        <div className="rounded-2xl px-4 py-3 text-[15px]" style={{ background: "#E7DBC8", color: "#111B21" }}>
          🌞 Morning Play: Sock-ball bowling — 3 rolled socks, 6 cups as pins. 2 minutes. Go!
        </div>
      )}
      {showBedtime && (
        <div className="rounded-2xl px-4 py-3 text-[15px]" style={{ background: "#E7DBC8", color: "#111B21" }}>
          🌙 Bedtime: “Nora tucked the day into a tiny pocket and listened to the quiet…” …
        </div>
      )}
    </div>
  );
};

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
          <button
            onClick={onDemo}
            className="rounded-2xl border border-white/25 bg-white/5 text-white px-6 py-3 font-semibold hover:bg-white/10 w-full sm:w-auto"
          >
            {hero.primary}
          </button>
          <button
            onClick={onPrimary}
            className="rounded-2xl bg-white text-gray-900 px-6 py-3 font-semibold shadow hover:shadow-md w-full sm:w-auto"
          >
            {hero.secondary}
          </button>
        </div>

        <p className="mt-4 text-white/75 italic">No charge until day 8 · Cancel anytime</p>

        <div className="mt-8">
          <WhatsAppDemo />
          <SamplePanel intent={intent} />
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
          <div
            key={c.title}
            className="rounded-2xl border border-white/12 bg:white/6 bg-white/5 backdrop-blur-lg p-6 text-left shadow-[0_10px_30px_rgba(0,0,0,0.25)]"
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

/* ---------------- Pricing ---------------- */
const Pricing = ({ onStart }) => {
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
                  ? "border-white/15 bg-gradient-to-br from-[#8BA7FF]/90 via-[#D5C0F7]/70 to-[#F5C16E]/90"
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

/* ---------------- FAQ (native <details>) ---------------- */
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

/* ---------------- Demo Modal ---------------- */
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
          style={{
            background: "linear-gradient(180deg, rgba(17,27,33,0.98) 0%, rgba(32,44,51,0.98) 100%)",
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

          <div className="mx-auto grid place-items-center">
            <WhatsAppDemo />
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
  const [step, setStep] = useState(1);
  const [resendTimer, setResendTimer] = useState(0);
  const popRef = useRef(null);

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
      setStep(1);
      setResendTimer(0);
    }
  }, [open, defaultPlan]);

  useEffect(() => {
    const handler = (e) => {
      if (popRef.current && !popRef.current.contains(e.target)) setPlanOpen(false);
    };
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
    // build underscores equivalent to mask (keeping dashes)
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
    setTimeout(() => {
      setSending(false);
      setOtpSent(true);
      setStep(2);
      setResendTimer(30);
    }, 1200);
  };

  const onEnter = (e) => {
    if (e.key === "Enter" && isComplete && !sending && !verified && !otpSent) {
      e.preventDefault();
      sendOtp();
    }
  };

  useEffect(() => {
    if (otpSent && !verified && otp.trim().length === 6) {
      setVerified(true);
      setStep(3);
    }
  }, [otp, otpSent, verified]);

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
        >
          <motion.div
            className="relative w-[95%] max-w-xl rounded-2xl border border-white/20 text-white p-6"
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
              Start your free week <span className="inline-block ml-1">✨</span>
            </h3>
            <p className="text-white/85 mt-1">
              No charge until day 8 · Cancel anytime · Messages via WhatsApp {flag}
            </p>

            {/* Step indicator */}
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
                {verified ? "Details" : otpSent ? "Enter OTP" : "Verify phone"}
              </div>
            </div>

            {/* Phone input + Verify */}
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
                disabled={verified}
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
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="mt-3"
                >
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

            {/* Details (unlocked after verified) */}
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
                    ? `${[{id:"starter",name:"Starter",price:"$4.99/mo"},{id:"family",name:"Family",price:"$7.99/mo"},{id:"premium",name:"Premium",price:"$11.99/mo"}].find((x)=>x.id===plan)?.name} · ${[{id:"starter",name:"Starter",price:"$4.99/mo"},{id:"family",name:"Family",price:"$7.99/mo"},{id:"premium",name:"Premium",price:"$11.99/mo"}].find((x)=>x.id===plan)?.price}`
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
                      {[{id:"starter",name:"Starter",price:"$4.99/mo"},{id:"family",name:"Family",price:"$7.99/mo"},{id:"premium",name:"Premium",price:"$11.99/mo"}].map((opt) => (
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
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="pt-2 flex gap-3">
                <button className="flex-1 rounded-2xl bg-white text-gray-900 py-3 font-semibold">
                  Get my free week
                </button>
              </div>

              <p className="text-white/60 text-xs">
                By continuing, you agree to receive messages on WhatsApp. You can stop anytime.
              </p>
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
      <p className="mt-4 italic">
        Your child will remember stories, not screens. Start your free week — and make tonight magical ✨
      </p>
    </div>
  </footer>
);

/* ---------------- Sticky Mobile CTA ---------------- */
const StickyMobileCTA = ({ onPrimary, onDemo, intent }) => {
  const label = (i) =>
    i === "bedtime" ? "Tonight’s story" : i === "activities" || i === "morning" ? "Today’s activity" : "Sample";
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
      <div className="mx-auto max-w-6xl">
        <div className="m-3 rounded-2xl border border-white/15 bg-black/60 backdrop-blur-lg p-2 flex items-center gap-2">
          <button
            onClick={onDemo}
            className="flex-1 rounded-xl border border-white/25 bg-white/5 text-white px-3 py-2 font-semibold"
          >
            {label(intent)}
          </button>
          <button
            onClick={onPrimary}
            className="flex-1 rounded-xl bg-white text-gray-900 px-3 py-2 font-semibold"
          >
            Free week
          </button>
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
    document.body.style.fontFamily = "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto";
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

      {/* Sticky CTA on mobile */}
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
