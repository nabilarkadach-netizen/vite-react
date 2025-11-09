import React, { useEffect, useRef, useState } from "react";

export default function Header() {
  return (
    <header className="bg-black/40 backdrop-blur-xl border-b border-white/10 py-4 flex justify-center">
      <div className="flex items-center select-none gap-1">
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
  const EYE = 26;                // 👁 eye height same as before
  const PUPIL = EYE * 0.63;      // cute big pupil ratio
  const GAP = 5;                 // spacing between the two eyes
  const LIMIT = 5;               // pupil travel distance

  const [blink, setBlink] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const leftWrap = useRef(null);
  const rightWrap = useRef(null);
  const leftPupil = useRef(null);
  const rightPupil = useRef(null);

  /* detect if device is mobile */
  useEffect(() => {
    setIsMobile(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  /* track mouse on desktop */
  useEffect(() => {
    if (isMobile) return;
    const handle = (e) => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, [isMobile]);

  /* blinking loop */
  useEffect(() => {
    const loop = () => {
      const delay = 5000 + Math.random() * 4000; // every 5–9s
      setTimeout(() => {
        setBlink(true);
        setTimeout(() => setBlink(false), 280);
        if (Math.random() < 0.15) { // occasional double blink
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

  /* mobile: random gaze movement */
  useEffect(() => {
    if (!isMobile) return;
    const positions = [
      { x: LIMIT * 0.8, y: LIMIT * 0.6 },  // bottom-right
      { x: 0, y: LIMIT * 0.6 },            // bottom-center
      { x: -LIMIT * 0.8, y: LIMIT * 0.6 }, // bottom-left
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

    // touch / scroll also triggers gaze change
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

  /* desktop: independent tracking */
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
    <div
      className="flex items-center justify-center"
      style={{ height: EYE, transform: "translateY(1px)" }}
    >
      <Eye size={EYE} pupil={PUPIL} wrapRef={leftWrap} pupilRef={leftPupil} blink={blink} />
      <div style={{ width: GAP }} />
      <Eye size={EYE} pupil={PUPIL} wrapRef={rightWrap} pupilRef={rightPupil} blink={blink} />
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
        boxShadow: "inset 0 -1px 1px rgba(0,0,0,0.08), 0 1px 2px rgba(255,180,130,0.12)",
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
        {/* glossy sparkle */}
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

      {/* eyelids */}
      <div
        className="absolute inset-0 rounded-full bg-gradient-to-b from-[#f0cbb5] to-[#d79e80]"
        style={{
          transform: blink ? "translateY(0%)" : "translateY(-100%)",
          transition: "transform 0.1s ease-in",
        }}
      />
      <div
        className="absolute inset-0 rounded-full bg-gradient-to-t from-[#f0cbb5] to-[#d79e80]"
        style={{
          transform: blink ? "translateY(0%)" : "translateY(100%)",
          transition: "transform 0.1s ease-in",
        }}
      />
    </div>
  );
}
