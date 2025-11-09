// App.jsx — KIDOOSE USA Edition (Cinematic build + CuteEyes Logo + LocalGreeting + Sample Mode + Scroll-to-Top Orb + Persistent Phone Memory)
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

/* ---------------- Persistent verified phone memory ---------------- */
const saveVerifiedPhone = (phone, flag) => {
  try {
    localStorage.setItem("kidoose_verified_phone", JSON.stringify({ phone, flag }));
  } catch {}
};
const getVerifiedPhone = () => {
  try {
    const data = JSON.parse(localStorage.getItem("kidoose_verified_phone"));
    return data && data.phone ? data : null;
  } catch {
    return null;
  }
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
  iso2
    ? iso2.toUpperCase().replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt()))
    : "🌍";

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
      el.style.filter = `brightness(${1 + 0.02 * Math.sin(t)})`;
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, []);
  return <div ref={ref} className="fixed inset-0 -z-50 overflow-hidden" aria-hidden />;
};

/* ---------------- Localized Greeting ---------------- */
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
    >
      {greeting}! It’s {timeString} in New York — tonight’s story is ready for you 🇺🇸
    </motion.div>
  );
};

/* ---------------- CuteEyes Logo ---------------- */
function KidooseLogo() {
  return (
    <div className="flex items-center select-none gap-1">
      <span className="text-white font-extrabold text-3xl md:text-4xl tracking-wide">KID</span>
      <CuteEyes />
      <span className="text-white font-extrabold text-3xl md:text-4xl tracking-wide">SE</span>
    </div>
  );
}

function CuteEyes() {
  const EYE = 26;
  const PUPIL = EYE * 0.63;
  const GAP = 5;
  const LIMIT = 5;

  const [blink, setBlink] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const leftWrap = useRef(null);
  const rightWrap = useRef(null);
  const leftPupil = useRef(null);
  const rightPupil = useRef(null);

  useEffect(() => setIsMobile(window.matchMedia("(pointer: coarse)").matches), []);

  useEffect(() => {
    if (isMobile) return;
    const handle = (e) => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, [isMobile]);

  useEffect(() => {
    const loop = () => {
      const delay = 5000 + Math.random() * 4000;
      setTimeout(() => {
        setBlink(true);
        setTimeout(() => setBlink(false), 280);
        if (Math.random() < 0.15) {
          setTimeout(() => {
            setBlink(true);
            setTimeout(() => setBlink(false), 280);
          }, 600);
        }
        loop();
      }, delay);
    };
    loop();
  }, []);

  useEffect(() => {
    if (!isMobile) return;
    const positions = [
      { x: LIMIT * 0.8, y: LIMIT * 0.6 },
      { x: 0, y: LIMIT * 0.6 },
      { x: -LIMIT * 0.8, y: LIMIT * 0.6 },
    ];
    const moveRandom = () => {
      const next = positions[Math.floor(Math.random() * positions.length)];
      [leftPupil.current, rightPupil.current].forEach((p) => {
        if (p) {
          p.style.transition = "transform 0.35s ease-in-out";
          p.style.transform = `translate(${next.x}px, ${next.y}px)`;
        }
      });
    };
    const loop = setInterval(moveRandom, 3000 + Math.random() * 1000);
    moveRandom();
    window.addEventListener("touchstart", moveRandom);
    window.addEventListener("scroll", moveRandom);
    return () => {
      clearInterval(loop);
      window.removeEventListener("touchstart", moveRandom);
      window.removeEventListener("scroll", moveRandom);
    };
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) return;
    const moveOne = (wrap, pupil) => {
      if (!wrap || !pupil) return;
      const rect = wrap.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = mouse.x - cx;
      const dy = mouse.y - cy;
      const len = Math.hypot(dx, dy) || 1;
      const nx = (dx / len) * LIMIT;
      const ny = (dy / len) * LIMIT;
      pupil.style.transition = "transform 0.09s linear";
      pupil.style.transform = `translate(${nx}px, ${ny}px)`;
    };
    moveOne(leftWrap.current, leftPupil.current);
    moveOne(rightWrap.current, rightPupil.current);
  }, [mouse, isMobile]);

  return (
    <div className="flex items-center justify-center" style={{ height: EYE, transform: "translateY(-1px)" }}>
      <Eye size={EYE} pupil={PUPIL} wrapRef={leftWrap} pupilRef={leftPupil} blink={blink} />
      <div style={{ width: GAP }} />
      <Eye size={EYE} pupil={PUPIL} wrapRef={rightWrap} pupilRef={rightPupil} blink={blink} />
    </div>
  );
}

function Eye({ size, pupil, wrapRef, pupilRef, blink }) {
  return (
    <div
      ref={wrapRef}
      className="relative rounded-full flex items-center justify-center overflow-hidden"
      style={{
        width: size,
        height: size,
        background: "radial-gradient(circle at 50% 55%, #fffdf8 0%, #f3f1ea 90%)",
        boxShadow: "inset 0 -1px 1px rgba(0,0,0,0.08), 0 1px 2px rgba(255,180,130,0.12)",
      }}
    >
      <div
        ref={pupilRef}
        className="absolute rounded-full flex items-center justify-center"
        style={{
          width: pupil,
          height: pupil,
          background: "radial-gradient(circle at 40% 40%, #111 0%, #222 60%, #000 100%)",
        }}
      >
        <div
          className="absolute rounded-full"
          style={{
            width: pupil * 0.5,
            height: pupil * 0.5,
            right: pupil * -0.1,
            top: pupil * -0.1,
            background:
              "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.3) 60%, rgba(255,255,255,0) 100%)",
            filter: "blur(0.5px)",
          }}
        />
      </div>
      <div
        className="absolute inset-0 rounded-full bg-gradient-to-b from-[#f0cbb5] to-[#d79e80]"
        style={{ transform: blink ? "translateY(0%)" : "translateY(-100%)", transition: "transform 0.12s ease-in" }}
      />
      <div
        className="absolute inset-0 rounded-full bg-gradient-to-t from-[#f0cbb5] to-[#d79e80]"
        style={{ transform: blink ? "translateY(0%)" : "translateY(100%)", transition: "transform 0.12s ease-in" }}
      />
    </div>
  );
}

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
/* ---------------- Hero ---------------- */
const Hero = ({ onPrimary, onSample }) => (
  <section id="hero-section" className="text-white text-center pt-16 md:pt-20 pb-24 md:pb-20 px-6">
    <div className="max-w-4xl mx-auto">
      <p className="text-white/70 text-sm md:text-base">From two parents who wanted calmer, happier days.</p>
      <h1 className="mt-2 text-4xl md:text-6xl font-extrabold leading-tight">
        Turn{" "}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8BA7FF] to-[#F5C16E]">
          7 minutes a day
        </span>{" "}
        into rituals your child will cherish.
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
          onClick={onSample}
          className="rounded-2xl border border-white/25 bg-white/5 text-white px-6 py-3 font-semibold hover:bg-white/10 w-full sm:w-auto"
        >
          Send me today’s sample
        </button>
      </div>

      <p className="mt-4 text-white/75 italic">No charge until your free week ends · Cancel anytime</p>

      {/* Trust strip + badges */}
      <div className="mt-5 flex flex-col items-center gap-1 text-white/70 text-sm">
        <div>Trusted by 1,200+ parents · 97% stay after the free week</div>
        <div className="flex items-center gap-3 opacity-90">
          <span className="px-2 py-0.5 rounded-full bg-white/10 border border-white/15">WhatsApp-first</span>
          <span className="px-2 py-0.5 rounded-full bg-white/10 border border-white/15">Cancel anytime</span>
          <span className="px-2 py-0.5 rounded-full bg-white/10 border border-white/15">Under 7 minutes/day</span>
        </div>
      </div>

      <div className="mt-10 flex justify-center pb-6 sm:pb-0">
        <WhatsAppDemo />
      </div>
    </div>
  </section>
);

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

              <div className="sm:text-center">
                <h3 className={clsx("text-2xl font-semibold", p.popular && "text-[#12151B]")}>{p.name}</h3>
                <p className={clsx("text-sm mt-1 italic", p.popular ? "text-[#12151B]/80" : "text-white/70")}>{p.tag}</p>
                <div className={clsx("text-4xl font-extrabold mt-3", p.popular && "text-[#12151B]")}>{p.price}</div>
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
    </div>
  </footer>
);

/* ---------------- Scroll-to-Top Gradient Orb ---------------- */
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
          background: "conic-gradient(from 160deg at 50% 50%, #EAF0FF, #83A3FF 35%, #5E7AFF 70%, #355BFF 100%)",
        }}
      >
        <motion.span className="inline-block" initial={false} whileTap={{ scale: 0.92 }} whileHover={{ scale: 1.06 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" className="mx-auto">
            <path d="M12 5l-7 7h14l-7-7z" fill="white" />
          </svg>
        </motion.span>
      </motion.button>
    )}
  </AnimatePresence>
);

/* ---------------- App Root ---------------- */
export default function App() {
  const [showSignup, setShowSignup] = useState(false);
  const [chosenPlan, setChosenPlan] = useState(null);
  const [signupMode, setSignupMode] = useState("trial");
  const [showHeaderButtons, setShowHeaderButtons] = useState(false);
  const [showTopOrb, setShowTopOrb] = useState(false);

  useEffect(() => {
    document.body.style.background = "transparent";
    document.body.style.fontFamily = "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto";

    const onScroll = () => {
      setShowHeaderButtons(window.scrollY > window.innerHeight * 0.75);
      const hero = document.getElementById("hero-section");
      const heroH = hero?.offsetHeight || 600;
      setShowTopOrb(window.scrollY > heroH * 0.8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
      <ScrollToTopOrb show={showTopOrb} />
    </div>
  );
}
