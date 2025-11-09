import React, { useEffect, useRef, useState } from "react";

export default function Header() {
  return (
    <header className="bg-black/40 backdrop-blur-xl border-b border-white/10 py-4 flex justify-center">
      <div className="flex items-center select-none gap-2">
        <span className="text-white font-extrabold text-3xl md:text-4xl tracking-wide">
          KID
        </span>
        <CuteEyes />
        <span className="text-white font-extrabold text-3xl md:text-4xl tracking-wide">
          SE
        </span>
      </div>
    </header>
  );
}

/* -------------------- Animated Cute Eyes -------------------- */
function CuteEyes() {
  const EYE = 38;                // 👁 same as logo text height
  const PUPIL = EYE * 0.6;       // proportionally large for cute style
  const GAP = 5;                 // even spacing between eyes
  const LIMIT = 6;               // pupil movement range

  const [blink, setBlink] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const leftWrap = useRef(null);
  const rightWrap = useRef(null);
  const leftPupil = useRef(null);
  const rightPupil = useRef(null);

  /* Detect if device is mobile */
  useEffect(() => {
    setIsMobile(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  /* Fast mouse-follow on desktop */
  useEffect(() => {
    if (isMobile) return;
    const handle = (e) => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, [isMobile]);

  /* Random blinking for both eyes */
  useEffect(() => {
    const blinkLoop = () => {
      const delay = 5000 + Math.random() * 3000; // every 5–8s
      setTimeout(() => {
        setBlink(true);
        setTimeout(() => setBlink(false), 280);
        if (Math.random() < 0.15) {               // occasional double blink
          setTimeout(() => {
            setBlink(true);
            setTimeout(() => setBlink(false), 280);
          }, 600);
        }
        blinkLoop();
      }, delay);
    };
    blinkLoop();
  }, []);

  /* Mobile: independent random gaze + reactive on touch */
  useEffect(() => {
    if (!isMobile) return;

    const positions = [
      { x: LIMIT * 0.9, y: LIMIT * 0.6 },  // bottom-right
      { x: 0, y: LIMIT * 0.6 },            // bottom-center
      { x: -LIMIT * 0.9, y: LIMIT * 0.6 }, // bottom-left
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

    const loop = setInterval(moveRandom, 2500 + Math.random() * 500);
    moveRandom();

    // 👆 React when user touches / scrolls
    const touch = (e) => {
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      const y = e.touches ? e.touches[0].clientY : e.clientY;
      [leftWrap.current, rightWrap.current].forEach((wrap, i) => {
        if (!wrap) return;
        const rect = wrap.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = x - cx, dy = y - cy;
        const len = Math.hypot(dx, dy) || 1;
        const nx = (dx / len) * LIMIT;
        const ny = (dy / len) * LIMIT;
        const pupil = i === 0 ? leftPupil.current : rightPupil.current;
        if (pupil) {
          pupil.style.transition = "transform 0.25s ease-out";
          pupil.style.transform = `translate(${nx}px, ${ny}px)`;
        }
      });
    };

    window.addEventListener("touchstart", touch);
    window.addEventListener("scroll", moveRandom);
    return () => {
      clearInterval(loop);
      window.removeEventListener("touchstart", touch);
      window.removeEventListener("scroll", moveRandom);
    };
  }, [isMobile]);

  /* Desktop: follow mouse */
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
    <div
      className="flex items-center justify-center"
      style={{ height: EYE, transform: "translateY(1px)" }}
    >
      <Eye size={EYE} pupil={PUPIL} pupilRef={leftPupil} wrapRef={leftWrap} blink={blink} />
      <div style={{ width: GAP }} />
      <Eye size={EYE} pupil={PUPIL} pupilRef={rightPupil} wrapRef={rightWrap} blink={blink} />
    </div>
  );
}

/* -------------------- Single Eye -------------------- */
function Eye({ size, pupil, wrapRef, pupilRef, blink }) {
  return (
    <div
      ref={wrapRef}
      className="relative rounded-full flex items-center justify-center overflow-hidden"
      style={{
        width: size,
        height: size,
        background:
          "radial-gradient(circle at 50% 55%, #fffdf8 0%, #f3f1ea 90%)",
        boxShadow: "inset 0 -2px 2px rgba(0,0,0,0.1), 0 2px 3px rgba(255,180,130,0.15)",
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
        {/* glossy sparkle that moves with pupil */}
        <div
          className="absolute rounded-full"
          style={{
            width: pupil * 0.55,
            height: pupil * 0.55,
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
        className="absolute inset-0 rounded-full bg-gradient-to-b from-[#f0cbb5] to-[#d79e80]"
        style={{
          transform: blink ? "translateY(0%)" : "translateY(-100%)",
          transition: "transform 0.1s ease-in 0.05s",
        }}
      />
      <div
        className="absolute inset-0 rounded-full bg-gradient-to-t from-[#f0cbb5] to-[#d79e80]"
        style={{
          transform: blink ? "translateY(0%)" : "translateY(100%)",
          transition: "transform 0.1s ease-in 0.05s",
        }}
      />
    </div>
  );
}
