import React, { useEffect, useRef, useState } from "react";

export default function Header() {
  return (
    <header className="bg-black/40 backdrop-blur-xl border-b border-white/10 py-4 flex justify-center">
      <div className="flex items-center select-none gap-2">
        <span className="text-white font-extrabold text-3xl md:text-4xl">KID</span>
        <CuteEyes />
        <span className="text-white font-extrabold text-3xl md:text-4xl">SE</span>
      </div>
    </header>
  );
}

function CuteEyes() {
  const EYE = 26;
  const PUPIL = 10;
  const GAP = 6;
  const LIMIT = 6;
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const leftWrap = useRef(null);
  const rightWrap = useRef(null);
  const leftPupil = useRef(null);
  const rightPupil = useRef(null);

  // track mouse
  useEffect(() => {
    const handle = (e) => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, []);

  // pupil move
  useEffect(() => {
    let raf;
    const move = () => {
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
        pupil.style.transform = `translate(${nx}px, ${ny}px)`;
      };
      moveOne(leftWrap.current, leftPupil.current);
      moveOne(rightWrap.current, rightPupil.current);
      raf = requestAnimationFrame(move);
    };
    move();
    return () => cancelAnimationFrame(raf);
  }, [mouse]);

  return (
    <div className="flex items-center justify-center" style={{ height: EYE }}>
      <Eye size={EYE} pupil={PUPIL} pupilRef={leftPupil} wrapRef={leftWrap} />
      <div style={{ width: GAP }} />
      <Eye size={EYE} pupil={PUPIL} pupilRef={rightPupil} wrapRef={rightWrap} />
    </div>
  );
}

function Eye({ size, pupil, wrapRef, pupilRef }) {
  const [blink, setBlink] = useState(false);

  // random blinking loop
  useEffect(() => {
    const loop = () => {
      const delay = 2000 + Math.random() * 2000;
      setTimeout(() => {
        setBlink(true);
        setTimeout(() => setBlink(false), 150); // open after 150ms
        loop();
      }, delay);
    };
    loop();
  }, []);

  return (
    <div
      ref={wrapRef}
      className="relative rounded-full flex items-center justify-center overflow-hidden"
      style={{
        width: size,
        height: size,
        background:
          "radial-gradient(circle at 50% 55%, #fff 0%, #eee 85%, #ddd 100%)",
        boxShadow: "inset 0 -2px 2px rgba(0,0,0,0.1)",
      }}
    >
      {/* pupil */}
      <div
        ref={pupilRef}
        className="absolute rounded-full flex items-center justify-center"
        style={{
          width: pupil,
          height: pupil,
          background:
            "radial-gradient(circle at 40% 40%, #111 0%, #222 60%, #000 100%)",
        }}
      >
        <div
          className="absolute rounded-full"
          style={{
            width: pupil * 0.5,
            height: pupil * 0.5,
            right: pupil * -0.05,
            top: pupil * -0.05,
            background:
              "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.3) 60%, rgba(255,255,255,0) 100%)",
            filter: "blur(0.5px)",
          }}
        />
      </div>

      {/* eyelid */}
      <div
        className="absolute inset-0 rounded-full bg-[#e6d4be]"
        style={{
          transform: blink ? "translateY(0%)" : "translateY(-100%)",
          transition: "transform 0.12s ease-in-out",
        }}
      />
      <div
        className="absolute inset-0 rounded-full bg-[#e6d4be]"
        style={{
          transform: blink ? "translateY(0%)" : "translateY(100%)",
          transition: "transform 0.12s ease-in-out",
        }}
      />
    </div>
  );
}
