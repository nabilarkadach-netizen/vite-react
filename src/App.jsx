// App.jsx — KIDOOSE USA Edition (Cinematic build + LocalGreeting + Sample Mode + Scroll-to-Top Orb + Persistent Phone Memory)
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
  // ... [rest unchanged]
  DEFAULT: { dial: "+1", mask: "____________", max: 12 },
};
const isoToFlagEmoji = (iso2) =>
  iso2 ? iso2.toUpperCase().replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt())) : "🌍";

/* ---------------- Hook: Detect Country Dial Code ---------------- */
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

/* ========================================================================== */
/* ======================  NEW  KIDOOSE  HEADER  ============================ */
/* ========================================================================== */
const Header = ({ onPrimary, onSample, showButtons }) => (
  <header className="sticky top-0 z-40 bg-black/30 backdrop-blur-xl border-b border-white/10">
    <div className="mx-auto max-w-6xl px-6 py-3 flex items-center justify-center md:justify-between">
      <KidooseEyesLogo />
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

/* ---- Animated Eyes Logo ---- */
function KidooseEyesLogo() {
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
    const move = (e) => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [isMobile]);
  useEffect(() => {
    const loop = () => {
      const delay = 5000 + Math.random() * 4000;
      setTimeout(() => {
        setBlink(true);
        setTimeout(() => setBlink(false), 280);
        if (Math.random() < 0.15)
          setTimeout(() => {
            setBlink(true);
            setTimeout(() => setBlink(false), 280);
          }, 600);
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
      const n = positions[Math.floor(Math.random() * positions.length)];
      [leftPupil.current, rightPupil.current].forEach((p) => {
        if (p) {
          p.style.transition = "transform 0.35s ease-in-out";
          p.style.transform = `translate(${n.x}px, ${n.y}px)`;
        }
      });
    };
    const loop = setInterval(moveRandom, 3000 + Math.random() * 1000);
    moveRandom();
    return () => clearInterval(loop);
  }, [isMobile]);
  useEffect(() => {
    if (isMobile) return;
    const move = (wrap, pupil) => {
      if (!wrap || !pupil) return;
      const r = wrap.getBoundingClientRect();
      const cx = r.left + r.width / 2,
        cy = r.top + r.height / 2;
      const dx = mouse.x - cx,
        dy = mouse.y - cy;
      const len = Math.hypot(dx, dy) || 1;
      const nx = (dx / len) * LIMIT,
        ny = (dy / len) * LIMIT;
      pupil.style.transition = "transform 0.09s linear";
      pupil.style.transform = `translate(${nx}px, ${ny}px)`;
    };
    move(leftWrap.current, leftPupil.current);
    move(rightWrap.current, rightPupil.current);
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
        boxShadow:
          "inset 0 -1px 1px rgba(0,0,0,0.08), 0 1px 2px rgba(255,180,130,0.12)",
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

/* ---------------- Sign Up Modal (masked phone + OTP + persistent memory) ---------------- */
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
  const [persisted, setPersisted] = useState(null);
  const popRef = useRef(null);

  useEffect(() => {
    const stored = getVerifiedPhone();
    if (mode === "trial" && stored?.phone) {
      setPhone(stored.phone);
      setVerified(true);
      setPersisted(stored);
    }
  }, [mode]);

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
      setPersisted(null);
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

  const formatLocal = (digits) => {
    let local = digits.startsWith(dialDigits) ? digits.slice(dialDigits.length) : digits;
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
    setTimeout(() => {
      setSending(false);
      setOtpSent(true);
      setResendTimer(30);
    }, 1000);
  };

  useEffect(() => {
    if (otpSent && !verified && otp.trim().length === 6) {
      setVerified(true);
      saveVerifiedPhone(phone, flag);
    }
  }, [otp, otpSent, verified, phone, flag]);

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
            >
              ✕
            </button>

            <h3 className="text-2xl md:text-3xl font-extrabold">
              {mode === "sample" ? "Get today’s WhatsApp sample ✨" : "Start your free week ✨"}
            </h3>
            <p className="text-white/85 mt-1">
              {mode === "sample"
                ? <>We’ll send a one-time sample message to WhatsApp {flag}.</>
                : <>No charge until your free week ends · Cancel anytime · Messages via WhatsApp {flag}</>}
            </p>

            {/* Phone input */}
            <div className="relative mt-5 w-full">
              <input
                type="tel"
                className="w-full rounded-xl bg-white/10 border border-white/25 px-4 py-3 text-white/95 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 pr-[7.6rem]"
                placeholder={`${fmt.dial} ${fmt.mask}`}
                inputMode="tel"
                value={phone}
                onChange={handlePhoneChange}
                disabled={verified || !!persisted}
              />
              <button
                className={clsx(
                  "absolute top-1/2 -translate-y-1/2 right-1.5 rounded-lg text-sm font-semibold transition px-3 py-1.5 min-w-[110px]",
                  verified || persisted
                    ? "bg-white text-[#12151B]"
                    : sending
                    ? "bg-[#12151B] text-white opacity-80"
                    : otpSent
                    ? "bg-white/15 text-white/60 cursor-not-allowed"
                    : isComplete
                    ? "bg-[#12151B] hover:bg-black text-white"
                    : "bg-white/15 text-white/60 cursor-not-allowed"
                )}
                disabled={verified || persisted || sending || otpSent || !isComplete}
                onClick={sendOtp}
              >
                {verified || persisted ? "Verified" : sending ? "Sending..." : otpSent ? "OTP Sent" : "Verify"}
              </button>
            </div>

            {/* OTP input */}
            <AnimatePresence>
              {otpSent && !verified && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-3">
                  <p className="text-white/80 text-sm">Check WhatsApp — we just sent your 6-digit code.</p>
                  <input
                    className="w-full mt-2 rounded-xl bg-white/10 border border-white/25 px-4 py-3 text-white/95 text-center tracking-widest"
                    placeholder="●●●●●●"
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  />
                  <button
                    disabled={resendTimer > 0}
                    onClick={sendOtp}
                    className={clsx(
                      "mt-2 text-xs underline underline-offset-4",
                      resendTimer > 0 ? "text-white/40 cursor-not-allowed" : "text-white/80 hover:text-white"
                    )}
                  >
                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend code"}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Trial or Sample sections */}
            {mode === "sample" && verified && (
              <div className="mt-4 rounded-xl border border-white/20 bg-white/10 p-4 text-center">
                <p className="font-semibold text-white/90">All set! We’ve sent today’s sample to your WhatsApp {flag}.</p>
                <button
                  className="mt-3 w-full rounded-2xl bg-white text-gray-900 py-3 font-semibold"
                  onClick={() => {
                    saveVerifiedPhone(phone, flag);
                    if (onSwitchToTrial) onSwitchToTrial();
                  }}
                >
                  Loved it? Start your free week
                </button>
              </div>
            )}

            {mode === "trial" && (
              <div className={clsx("mt-4 space-y-3", !verified && "blur-sm pointer-events-none opacity-60")}>
                <input
                  className="w-full rounded-xl bg-white/10 border border-white/25 px-4 py-3 text-white/95"
                  placeholder="Parent name"
                  value={parent}
                  onChange={(e) => setParent(e.target.value)}
                />
                <input
                  className="w-full rounded-xl bg-white/10 border border-white/25 px-4 py-3 text-white/95"
                  placeholder="Child name (optional)"
                  value={child}
                  onChange={(e) => setChild(e.target.value)}
                />

                {/* Plan dropdown */}
                <div ref={popRef} className="relative">
                  <button
                    onClick={() => setPlanOpen((v) => !v)}
                    className="w-full rounded-xl bg-white/10 border border-white/25 px-4 py-3 text-white/95 text-left"
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
                        className="absolute z-10 mt-2 w-full rounded-xl border border-white/20 bg-[rgba(20,25,35,0.92)] backdrop-blur-xl p-2"
                      >
                        {[{id:"starter",name:"Starter",price:"$4.99/mo"},{id:"family",name:"Family",price:"$7.99/mo"},{id:"premium",name:"Premium",price:"$11.99/mo"}].map((opt)=>(
                          <button
                            key={opt.id}
                            onClick={() => { setPlan(opt.id); setPlanOpen(false); }}
                            className="w-full flex items-center justify-between text-white/95 hover:bg-white/10 rounded-lg px-3 py-2"
                          >
                            <span>{opt.name}</span><span className="text-white/75">{opt.price}</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button className="w-full rounded-2xl bg-white text-gray-900 py-3 font-semibold">Get my free week</button>
                <p className="text-white/60 text-xs">By continuing, you agree to receive messages on WhatsApp. You can stop anytime.</p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* ---------------- App Root ---------------- */
export default function App() {
  const [showSignup, setShowSignup] = useState(false);
  const [chosenPlan, setChosenPlan] = useState(null);
  const [signupMode, setSignupMode] = useState("trial");
  const [showHeaderButtons, setShowHeaderButtons] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShowHeaderButtons(window.scrollY > window.innerHeight * 0.75);
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
          }, 100);
        }}
      />
    </div>
  );
}
