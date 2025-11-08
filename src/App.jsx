// App.jsx — WhatsApp iPhone Dark Replica (everything included)
// Requirements: React 18, TailwindCSS, framer-motion (optional but used for subtle anims)

import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ---------------- iPhone Status Bar Icons (dynamic) ---------------- */
const Clock = ({ time }) => (
  <span className="text-white text-[13px] font-[500] tracking-tight leading-none">{time}</span>
);

const SignalIcon = () => (
  <svg width="22" height="11" viewBox="0 0 22 11" className="text-white">
    <rect x="0" y="7" width="2" height="4" rx="0.5" fill="currentColor" />
    <rect x="5" y="5" width="2" height="6" rx="0.5" fill="currentColor" />
    <rect x="10" y="3" width="2" height="8" rx="0.5" fill="currentColor" />
    <rect x="15" y="1" width="2" height="10" rx="0.5" fill="currentColor" />
    <rect x="20" y="0" width="2" height="11" rx="0.5" fill="currentColor" />
  </svg>
);

const WifiIcon = () => (
  <svg width="20" height="14" viewBox="0 0 20 14" fill="none" className="text-white">
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

const BatteryIcon = ({ level = 0.75 }) => (
  <svg width="27" height="13" viewBox="0 0 27 13" fill="none" className="text-white">
    <rect x="1" y="2" width="22" height="9" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <rect x="24" y="4" width="2" height="5" rx="1" fill="currentColor" />
    <rect x="2.5" y="3.5" width={Math.max(0.8, 20 * level)} height="6" rx="1" fill="currentColor" opacity="0.9" />
  </svg>
);

/* ---------------- WhatsApp Header Icons (Apple blue stroke) ---------------- */
const BackIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#007AFF" strokeWidth="2.3" strokeLinecap="round" className="w-5 h-5">
    <path d="M15 18l-6-6 6-6" />
  </svg>
);
const VideoIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#007AFF" strokeWidth="2" strokeLinecap="round" className="w-5 h-5">
    <path d="M23 7l-7 5 7 5V7z" />
    <rect x="1" y="5" width="15" height="14" rx="2" />
  </svg>
);
const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#007AFF" strokeWidth="2" strokeLinecap="round" className="w-5 h-5">
    <path d="M22 16.9v3a2 2 0 01-2.2 2 19.9 19.9 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.9 19.9 0 012.1 4a2 2 0 012-2h3a2 2 0 012 1.7c.1.9.4 1.9.7 2.8a2 2 0 01-.5 2.1L8.1 9.9a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.5c.9.3 1.9.6 2.8.7a2 2 0 011.7 2z" />
  </svg>
);

/* ---------------- Composer Icons (Apple blue stroke) ---------------- */
const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#007AFF" strokeWidth="2.2" strokeLinecap="round" className="w-5 h-5">
    <path d="M12 5v14M5 12h14" />
  </svg>
);
const CameraIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#007AFF" strokeWidth="2" strokeLinecap="round" className="w-5 h-5">
    <path d="M23 19a4 4 0 01-4 4H5a4 4 0 01-4-4V9a4 4 0 014-4h3l2-3h4l2 3h3a4 4 0 014 4v10z" />
    <circle cx="12" cy="14" r="4" />
  </svg>
);
const MicIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#007AFF" strokeWidth="2" strokeLinecap="round" className="w-5 h-5">
    <path d="M12 1a3 3 0 00-3 3v7a3 3 0 006 0V4a3 3 0 00-3-3z" />
    <path d="M19 10a7 7 0 01-14 0M12 17v6" />
  </svg>
);
const SendIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#007AFF" strokeWidth="2" strokeLinecap="round" className="w-5 h-5">
    <path d="M22 2L11 13" />
    <path d="M22 2l-7 20-4-9-9-4 20-7z" />
  </svg>
);

/* ---------------- Chat Decorations ---------------- */
// WhatsApp doodle wallpaper (tiny inline SVG tiled via data URL)
const WALLPAPER = `url('data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
  <rect width="200" height="200" fill="rgba(13,20,25,1)"/>
  <g stroke="rgba(255,255,255,0.04)" stroke-width="2" fill="none">
    <path d="M20 40c8-8 24-8 32 0 8 8 8 24 0 32" />
    <circle cx="160" cy="60" r="12"/>
    <path d="M80 160l20-8 20 8-20 8z"/>
    <path d="M140 140c0 8 12 8 12 0s-12-8-12 0z"/>
    <path d="M32 120c10 0 10 14 0 14s-10-14 0-14z"/>
    <path d="M50 70c14 0 14 20 0 20s-14-20 0-20z"/>
  </g>
</svg>
`)}')`;

// Outgoing read receipts (double blue check)
const ReadReceipts = () => (
  <svg width="22" height="14" viewBox="0 0 22 14" className="text-[#34B7F1]">
    <path d="M3 8l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M8 8l3 3 7-8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.9" />
  </svg>
);

// Sticker (vector, no external asset) — coffee-cup style
const StickerCoffee = () => (
  <svg width="120" height="120" viewBox="0 0 120 120">
    <defs>
      <filter id="s" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.35" />
      </filter>
    </defs>
    <g filter="url(#s)">
      <rect x="20" y="20" rx="20" ry="20" width="80" height="90" fill="#FFE2BD" stroke="#C29A6B" strokeWidth="3" />
      <rect x="28" y="35" rx="12" ry="12" width="64" height="60" fill="#FFF7EA" />
      <rect x="35" y="25" width="50" height="12" rx="6" fill="#7A4E2B" />
      <path d="M85 55c8 0 14 6 14 14s-6 14-14 14" fill="none" stroke="#C29A6B" strokeWidth="6"/>
      <circle cx="52" cy="65" r="6" fill="#6B4E3B"/>
      <circle cx="68" cy="65" r="6" fill="#6B4E3B"/>
      <path d="M48 82c8 6 16 6 24 0" stroke="#6B4E3B" strokeWidth="4" strokeLinecap="round" />
    </g>
  </svg>
);

/* ---------------- Helper: iOS 12-hour clock ---------------- */
const useIosClock = () => {
  const format = () =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true }).replace(/^0/, "");
  const [time, setTime] = useState(format());
  useEffect(() => {
    const i = setInterval(() => setTime(format()), 60 * 1000);
    return () => clearInterval(i);
  }, []);
  return time;
};

/* ---------------- Main App ---------------- */
export default function App() {
  const time = useIosClock();
  const [battery] = useState(0.78);

  // typing flow & staged reveal
  const [stage, setStage] = useState(0); // 0 typing1, 1 msg1, 2 typing2, 3 msg2, 4 sticker
  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 1200); // show msg1
    const t2 = setTimeout(() => setStage(2), 2400); // typing again
    const t3 = setTimeout(() => setStage(3), 3800); // show msg2
    const t4 = setTimeout(() => setStage(4), 5200); // show sticker
    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, []);

  return (
    <div className="min-h-screen w-full grid place-items-center bg-[#0E1624] text-white font-[system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial]">
      {/* Chat viewport (rounded top, not bottom — like screenshot) */}
      <div className="w-[360px] sm:w-[390px] bg-[#111B21] rounded-t-[28px] overflow-hidden shadow-2xl border border-black/40">
        {/* iPhone Status Bar */}
        <div className="flex items-center justify-between px-4 pt-2 pb-1 bg-black">
          <Clock time={time} />
          <div className="flex items-center gap-1.5">
            <SignalIcon />
            <WifiIcon />
            <BatteryIcon level={battery} />
          </div>
        </div>

        {/* WhatsApp Chat Header */}
        <div className="flex items-center justify-between px-3 py-2 bg-[#202C33]">
          <div className="flex items-center gap-2">
            <BackIcon />
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#385a64] to-[#1c2b30] border border-black/20" />
            <div className="leading-tight">
              <div className="text-[14px] font-semibold text-[#E9EDEF]">Kidoose</div>
              <div className="text-[12px] text-[#6BEB7A]">online</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <VideoIcon />
            <PhoneIcon />
          </div>
        </div>

        {/* Messages area */}
        <div
          className="min-h-[520px] px-3 py-3"
          style={{ backgroundImage: WALLPAPER, backgroundRepeat: "repeat", backgroundSize: "200px 200px" }}
        >
          {/* Typing bubble (stage 0 & 2) */}
          <AnimatePresence>
            {(stage === 0 || stage === 2) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="max-w-[82%] bg-[#1F2C33] text-[#E9EDEF] rounded-[18px] rounded-tl-[6px] px-3 py-2 mb-2 w-fit"
              >
                <div className="flex items-center gap-1">
                  <span className="sr-only">typing…</span>
                  {[0, 1, 2].map((d) => (
                    <motion.span
                      key={d}
                      className="w-2 h-2 rounded-full bg-[#AEB8BD]/80"
                      animate={{ y: [0, -3, 0], opacity: [0.6, 1, 0.6] }}
                      transition={{ duration: 0.9, repeat: Infinity, delay: d * 0.15 }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Message 1 (incoming) */}
          <AnimatePresence>
            {stage >= 1 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-[82%] bg-[#202C33] text-[#E9EDEF] rounded-[18px] rounded-tl-[6px] px-3 py-2 mb-2 leading-snug"
              >
                🌞 Morning Play: Build a paper airplane together — one-minute race!
                <div className="text-[10px] text-[#8696A0] text-right mt-1">08:59</div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Message 2 (incoming) */}
          <AnimatePresence>
            {stage >= 3 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-[82%] bg-[#202C33] text-[#E9EDEF] rounded-[18px] rounded-tl-[6px] px-3 py-2 mb-2 leading-snug"
              >
                🌙 Bedtime: “Under the sleepy moon, Milo counted the wind’s whispers…”
                <div className="text-[10px] text-[#8696A0] text-right mt-1">19:00</div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Optional outgoing example (kept hidden by default; flip showOutgoing to true if ever needed) */}
          {false && (
            <div className="flex justify-end">
              <div className="max-w-[78%] bg-[#005C4B] text-white rounded-[18px] rounded-tr-[6px] px-3 py-2 mb-2">
                But it looks nice
                <div className="flex items-center justify-end gap-1 mt-1">
                  <span className="text-[10px] text-white/80">12:07</span>
                  <ReadReceipts />
                </div>
              </div>
            </div>
          )}

          {/* Sticker message (incoming, no bubble) */}
          <AnimatePresence>
            {stage >= 4 && (
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-end gap-2 mb-1"
              >
                <StickerCoffee />
                <span className="text-[10px] text-[#8696A0] mb-1">19:02</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Composer */}
        <div className="bg-[#202C33] px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <PlusIcon />
            <div className="rounded-full bg-[#2A3942] text-[#E9EDEF] text-[14px] px-4 py-2 w-[230px] sm:w-[260px]">
              Message
            </div>
            <CameraIcon />
          </div>
          <div className="flex items-center gap-3">
            <MicIcon />
            <SendIcon />
          </div>
        </div>
      </div>
    </div>
  );
}
