// App.jsx — KIDOOSE Conversion Edition + Embedded WhatsApp Replica
// Tech: React 18, TailwindCSS, framer-motion, clsx
// Features: Animated aurora, WhatsApp Replica Demo, OTP Signup, Pricing, FAQ, Scroll Header

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

/* ---------------- Country & Dial Helpers ---------------- */
const COUNTRY_FORMATS = {
  US: { dial: "+1", mask: "--- --- ----", max: 10 },
  TR: { dial: "+90", mask: "--- --- ----", max: 10 },
  SA: { dial: "+966", mask: "-- --- ----", max: 9 },
  AE: { dial: "+971", mask: "-- --- ----", max: 9 },
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
  if (raw.includes("activity") || raw.includes("activities")) return "activities";
  if (raw.includes("morning")) return "morning";
  return "default";
};

/* ---------------- Hero Copy ---------------- */
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
  default: {
    h1: "Turn 7 minutes a day into rituals your child will remember.",
    sub: "Every morning: a play idea. Every night: a short calming story. On WhatsApp.",
    primary: "See today’s sample",
    secondary: "Start free week",
  },
};

/* ---------------- Hook: Detect Country ---------------- */
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
    let t = 0,
      raf;
    const tick = () => {
      t += 0.003;
      el.style.background = `
        radial-gradient(1200px 800px at ${15 + 5 * Math.sin(t)}% ${-10 + 6 * Math.cos(t * 0.8)}%, rgba(245,193,110,0.20), transparent 55%),
        radial-gradient(1100px 900px at ${85 + 4 * Math.cos(t * 0.7)}% ${110 + 5 * Math.sin(t)}%, rgba(139,167,255,0.22), transparent 58%),
        linear-gradient(180deg, ${PAL.nightTop}, ${PAL.nightMid} 50%, ${PAL.nightBot})
      `;
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, []);
  return <div ref={ref} className="fixed inset-0 -z-50" aria-hidden />;
};

/* ---------------- Logo ---------------- */
const KidooseLogo = () => (
  <div className="flex items-center gap-2 select-none">
    <span className="text-white font-extrabold text-xl md:text-2xl">KID</span>
    <motion.span
      className="w-4 h-4 rounded-full"
      style={{
        background: "radial-gradient(circle at 40% 35%, #FFEAA0, #FFA131 60%, #E27C00 100%)",
      }}
      animate={{ scale: [1, 1.12, 1] }}
      transition={{ duration: 1.8, repeat: Infinity }}
    />
    <motion.span
      className="w-4 h-4 rounded-full"
      style={{
        background: "radial-gradient(circle at 45% 40%, #EAF0FF, #83A3FF 60%, #5E7AFF 100%)",
      }}
      animate={{ scale: [1, 1.12, 1] }}
      transition={{ duration: 1.8, repeat: Infinity, delay: 0.3 }}
    />
    <span className="text-white font-extrabold text-xl md:text-2xl">OOSE</span>
  </div>
);

/* ---------------- Header ---------------- */
const Header = ({ onPrimary, onDemo, showButtons }) => (
  <header className="sticky top-0 z-40 bg-black/30 backdrop-blur-xl border-b border-white/10">
    <div className="mx-auto max-w-6xl px-6 py-3 flex items-center justify-between">
      <KidooseLogo />
      <AnimatePresence>
        {showButtons && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="hidden md:flex gap-3"
          >
            <button
              onClick={onDemo}
              className="rounded-2xl border border-white/25 bg-white/5 text-white px-4 py-2 font-semibold hover:bg-white/10"
            >
              Play sample
            </button>
            <button
              onClick={onPrimary}
              className="rounded-2xl bg-white text-gray-900 px-5 py-2 font-semibold hover:shadow-md"
            >
              Start Free Week
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </header>
);

/* ---------------- WhatsApp Replica ---------------- */
const Icon = {
  Plus: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="#007AFF" strokeWidth="2.2" strokeLinecap="round" className="w-5 h-5">
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  Camera: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="#007AFF" strokeWidth="2" strokeLinecap="round" className="w-5 h-5">
      <path d="M23 19a4 4 0 01-4 4H5a4 4 0 01-4-4V9a4 4 0 014-4h3l2-3h4l2 3h3a4 4 0 014 4v10z" />
      <circle cx="12" cy="14" r="4" />
    </svg>
  ),
  Mic: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="#007AFF" strokeWidth="2" strokeLinecap="round" className="w-5 h-5">
      <path d="M12 1a3 3 0 00-3 3v7a3 3 0 006 0V4a3 3 0 00-3-3z" />
      <path d="M19 10a7 7 0 01-14 0M12 17v6" />
    </svg>
  ),
  Send: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="#007AFF" strokeWidth="2" strokeLinecap="round" className="w-5 h-5">
      <path d="M22 2L11 13" />
      <path d="M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  ),
};

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

const WhatsAppReplica = () => {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    const seq = [
      setTimeout(() => setStage(0), 500),
      setTimeout(() => setStage(1), 2000),
      setTimeout(() => setStage(2), 4000),
      setTimeout(() => setStage(3), 6000),
    ];
    return () => seq.forEach(clearTimeout);
  }, []);
  return (
    <div className="relative w-[360px] sm:w-[390px] bg-[#111B21] rounded-3xl overflow-hidden shadow-2xl border border-black/40 mx-auto">
      <div className="flex items-center justify-between px-3 py-2 bg-[#202C33]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#385a64] to-[#1c2b30]" />
          <div className="leading-tight">
            <div className="text-[14px] font-semibold text-[#E9EDEF]">Kidoose</div>
            <div className="text-[12px] text-[#6BEB7A]">online</div>
          </div>
        </div>
      </div>
      <div
        className="relative min-h-[360px] px-3 py-3"
        style={{ backgroundImage: WALLPAPER, backgroundRepeat: "repeat", backgroundSize: "200px 200px" }}
      >
        {stage >= 1 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-[82%] bg-[#202C33] text-[#E9EDEF] rounded-[18px] rounded-tl-[6px] px-3 py-2 mb-2"
          >
            🌞 Morning Play: Build a paper airplane together — one-minute race!
            <div className="text-[10px] text-[#8696A0] text-right mt-1">09:00</div>
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
        <AnimatePresence>
          {(stage === 0 || stage === 2) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-[58px] left-4 flex items-center gap-1"
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

        {/* Embedded WhatsApp Replica */}
        <div className="mt-10 flex justify-center">
          <WhatsAppReplica />
        </div>
      </div>
    </section>
  );
};

/* ---------------- TrustStrip ---------------- */
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

/* ---------------- Footer ---------------- */
const Footer = () => (
  <footer className="py-10 border-t border-white/10 text-center text-white/80 text-sm bg-black/20">
    <div className="max-w-6xl mx-auto px-6">
      <p>© {new Date().getFullYear()} KIDOOSE · All rights reserved</p>
    </div>
  </footer>
);

/* ---------------- App Root ---------------- */
export default function App() {
  const [showHeaderButtons, setShowHeaderButtons] = useState(false);
  const [intent, setIntent] = useState("default");

  useEffect(() => {
    setIntent(intentFromQuery());
       const onScroll = () => setShowHeaderButtons(window.scrollY > window.innerHeight * 0.75);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="text-white min-h-screen font-[Inter,sans-serif]">
      <Backdrop />
      <Header
        onPrimary={() => {
          window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
        }}
        onDemo={() => {
          const el = document.querySelector("#hero-demo");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
        showButtons={showHeaderButtons}
      />

      <main>
        <Hero
          intent={intent}
          onPrimary={() => {
            window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
          }}
          onDemo={() => {
            const el = document.querySelector("#hero-demo");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
        />

        <TrustStrip />

        {/* Placeholder “How it Works” */}
        <section className="py-20 text-center text-white/85">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-extrabold">How Kidoose fits into your day</h2>
            <p className="mt-3 text-white/70">
              Simple, joyful moments — timed to your rhythm.
            </p>
            <div className="mt-10 grid md:grid-cols-3 gap-6">
              {[
                { icon: "🌞", title: "Morning Spark", text: "2–5 minute play prompts using what you already have." },
                { icon: "🌙", title: "Bedtime Story", text: "Short, calming stories that help kids wind down." },
                { icon: "💬", title: "On WhatsApp", text: "No new app. Two small nudges a day — that’s all." },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg text-left"
                >
                  <div className="text-2xl">{item.icon}</div>
                  <h3 className="mt-2 text-xl font-semibold">{item.title}</h3>
                  <p className="mt-2 text-white/75">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Simple Pricing */}
        <section id="pricing" className="py-20 text-center text-white">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-extrabold">Simple pricing</h2>
            <p className="mt-2 text-white/75">
              Choose calm mornings and connected evenings — and let us handle the rest.
            </p>
            <div className="mt-10 grid md:grid-cols-3 gap-7">
              {[
                {
                  name: "Starter",
                  price: "$4.99/mo",
                  features: ["Morning game + bedtime story", "Email or WhatsApp"],
                },
                {
                  name: "Family",
                  price: "$7.99/mo",
                  features: [
                    "Everything in Starter",
                    "‘Bad day?’ extra support",
                    "Weekly recap + sibling tweaks",
                  ],
                  highlight: true,
                },
                {
                  name: "Premium",
                  price: "$11.99/mo",
                  features: [
                    "Everything in Family",
                    "Calm audio stories",
                    "Name personalization + seasonal packs",
                  ],
                },
              ].map((p) => (
                <motion.div
                  key={p.name}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className={clsx(
                    "relative rounded-3xl border p-6 text-left sm:text-center shadow-[0_15px_40px_rgba(0,0,0,0.35)] transition duration-300",
                    p.highlight
                      ? "border-white/15 bg-gradient-to-br from-[#8BA7FF]/90 via-[#D5C0F7]/70 to-[#F5C16E]/90 text-[#12151B]"
                      : "border-white/12 bg-white/5 backdrop-blur-lg"
                  )}
                >
                  {p.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs px-3 py-1 rounded-full border border-white/20">
                      ❤️ Most loved by parents
                    </div>
                  )}
                  <h3 className="text-2xl font-semibold">{p.name}</h3>
                  <div className="text-4xl font-extrabold mt-2">{p.price}</div>
                  <ul className="mt-4 space-y-2 text-left mx-auto max-w-[20rem]">
                    {p.features.map((f) => (
                      <li key={f}>✓ {f}</li>
                    ))}
                  </ul>
                  <button className="w-full mt-6 rounded-2xl bg-white text-gray-900 py-3 font-semibold hover:shadow-md">
                    Start Free Week
                  </button>
                </motion.div>
              ))}
            </div>
            <p className="mt-10 text-white/70 italic">
              Because sometimes, 7 minutes a day is all it takes to feel connected again.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

