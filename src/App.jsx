// App.jsx — Full WhatsApp Replica (Dark iPhone Layout + Typing Flow + Polished Composer)
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ---------- Status Bar ---------- */
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
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.9"
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

/* ---------- Icons ---------- */
const Icon = {
  Back: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="#007AFF" strokeWidth="2.3" strokeLinecap="round" className="w-5 h-5">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  ),
  Video: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="#007AFF" strokeWidth="2" strokeLinecap="round" className="w-5 h-5">
      <path d="M23 7l-7 5 7 5V7z" />
      <rect x="1" y="5" width="15" height="14" rx="2" />
    </svg>
  ),
  Phone: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="#007AFF" strokeWidth="2" strokeLinecap="round" className="w-5 h-5">
      <path d="M22 16.9v3a2 2 0 01-2.2 2 19.9 19.9 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.9 19.9 0 012.1 4a2 2 0 012-2h3a2 2 0 012 1.7c.1.9.4 1.9.7 2.8a2 2 0 01-.5 2.1L8.1 9.9a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.5c.9.3 1.9.6 2.8.7a2 2 0 011.7 2z" />
    </svg>
  ),
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

/* ---------- Main ---------- */
export default function App() {
  const time = useIosClock();
  const [battery] = useState(0.82);

  const [stage, setStage] = useState(0); // 0 typing, 1 msg1, 2 typing again, 3 msg2
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
    <div className="min-h-screen grid place-items-center bg-[#0E1624] font-[system-ui] text-white">
      <div className="w-[360px] sm:w-[390px] bg-[#111B21] rounded-t-[28px] overflow-hidden shadow-2xl border border-black/40">
        {/* Top status bar */}
        <div className="flex justify-between items-center px-4 pt-2 pb-1 bg-black">
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
              🌞 Morning Play: Build a paper airplane together — one-minute race!
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
    </div>
  );
}
