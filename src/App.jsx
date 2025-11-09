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
  const PUPIL = 20; // 🍼 larger, baby-style pupil
  const GAP = 6;
  const LIMIT = 6;

  const [blink, setBlink] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const leftWrap = useRef(null);
  const rightWrap = useRef(null);
  const leftPupil = useRef(null);
  const rightPupil = useRef(null);

  /* Detect mobile */
  useEffect(() => {
    setIsMobile(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  /* Desktop – follows mouse fast */
  useEffect(() => {
    if (isMobile) return;
    const handle = (e) => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, [isMobile]);

  /* Blink loop (works for all devices) */
  useEffect(() => {
    const blinkLoop = () => {
      const delay = 5000 + Math.random() * 3000; // 5–8 s
      setTimeout(() => {
        setBlink(true);
        setTimeout(() => setBlink(false), 280);
        if (Math.random() < 0.15) {
          setTimeout(() => {
            setBlink(true);
            setTimeout(() => setBlink(false), 280);
          }, 500);
        }
        blinkLoop();
      }, delay);
    };
    blinkLoop();
  }, []);

  /* Mobile – independent JS animation (no state lag) */
  useEffect(() => {
    if (!isMobile) return;

    const positions = [
      { x: LIMIT * 0.9, y: LIMIT * 0.6 }, // bottom-right
      { x: -LIMIT * 0.9, y: LIMIT * 0.6 }, // bottom-left
      { x: 0, y: LIMIT * 0.6 }, // bottom-center
    ];

    const moveRandom = () => {
      const next = positions[Math.floor(Math.random() * positions.length)];
      [leftPupil.current, rightPupil.current].forEach((p) => {
        if (p) {
          p.style.transition = "transform 0.4s ease-in-out";
          p.style.transform = `translate(${next.x}px, ${next.y}px)`;
        }
      });
    };

    const loop = setInterval(moveRandom, 2500 + Math.random() * 500); // every 2–3 s
    moveRandom(); // initial
    return () => clearInterval(loop);
  }, [isMobile]);

  /* Desktop – fast responsive tracking */
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

      pupil.style.transition = "transform 0.1s linear";
      pupil.style.transform = `translate(${nx}px, ${ny}px)`;
    };

    moveOne(leftWrap.current, leftPupil.current);
    moveOne(rightWrap.current, rightPupil.current);
  }, [mouse, isMobile]);

  return (
    <div className="flex items-center justify-center" style={{ height: EYE }}>
      <Eye size={EYE} pupil={PUPIL} pupilRef={leftPupil} wrapRef={leftWrap} blink={blink} />
      <div style={{ width: GAP }} />
      <Eye size={EYE} pupil={PUPIL} pupilRef={rightPupil} wrapRef={rightWrap} blink={blink} />
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
        {/* gloss follows pupil */}
        <div
          className="absolute rounded-full"
          style={{
            width: pupil * 0.6,
            height: pupil * 0.6,
            right: pupil * -0.05,
            top: pupil * -0.05,
            background:
              "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.3) 60%, rgba(255,255,255,0) 100%)",
            filter: "blur(0.5px)",
          }}
        />
      </div>

      {/* eyelids */}
      <div
        className="absolute inset-0 rounded-full bg-gradient-to-b from-[#e4c6a3] to-[#d5b085]"
        style={{
          transform: blink ? "translateY(0%)" : "translateY(-100%)",
          transition: "transform 0.15s ease-in-out",
        }}
      />
      <div
        className="absolute inset-0 rounded-full bg-gradient-to-t from-[#e4c6a3] to-[#d5b085]"
        style={{
          transform: blink ? "translateY(0%)" : "translateY(100%)",
          transition: "transform 0.15s ease-in-out",
        }}
      />
    </div>
  );
}
