import React, { useEffect, useRef, useState } from "react";

export default function Header() {
  return (
    <header className="bg-black/40 backdrop-blur-xl border-b border-white/10 py-4 flex justify-center">
      <div className="flex items-center select-none">
        <span className="text-white font-extrabold text-3xl md:text-4xl tracking-wide mr-2">
          KID
        </span>
        <CuteEyes />
        <span className="text-white font-extrabold text-3xl md:text-4xl tracking-wide ml-2">
          SE
        </span>
      </div>
    </header>
  );
}

/* -------------------- Eyes -------------------- */
function CuteEyes() {
  const EYE = 30; // outer diameter
  const PUPIL = 12;
  const GAP = 8;
  const LIMIT = 6; // max pupil travel
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const wrapRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);

  // track mouse globally
  useEffect(() => {
    const handle = (e) => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, []);

  // update pupils relative to wrapper center
  useEffect(() => {
    const update = () => {
      if (!wrapRef.current) return;
      const rect = wrapRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = mouse.x - cx;
      const dy = mouse.y - cy;
      const len = Math.hypot(dx, dy) || 1;
      const nx = (dx / len) * LIMIT;
      const ny = (dy / len) * LIMIT;

      [leftRef.current, rightRef.current].forEach((el) => {
        if (el)
          el.style.transform = `translate(${nx}px, ${ny}px)`;
      });

      requestAnimationFrame(update);
    };
    update();
  }, [mouse]);

  return (
    <div
      ref={wrapRef}
      className="relative flex items-center justify-center"
      style={{ width: EYE * 2 + GAP, height: EYE }}
    >
      <Eye size={EYE} pupil={PUPIL} refPupil={leftRef} />
      <div style={{ width: GAP }} />
      <Eye size={EYE} pupil={PUPIL} refPupil={rightRef} />
      <style>{blinkCSS}</style>
    </div>
  );
}

function Eye({ size, pupil, refPupil }) {
  return (
    <div
      className="relative rounded-full overflow-hidden bg-white flex items-center justify-center"
      style={{
        width: size,
        height: size,
        boxShadow: "inset 0 -2px 0 rgba(0,0,0,0.05)",
      }}
    >
      <div className="absolute inset-0 origin-top animate-kid-blink bg-white/0 pointer-events-none" />
      <div
        ref={refPupil}
        className="absolute rounded-full will-change-transform"
        style={{
          width: pupil,
          height: pupil,
          background:
            "radial-gradient(circle at 35% 35%, #111 0%, #222 60%, #000 100%)",
        }}
      />
      <div
        className="absolute rounded-full bg-white"
        style={{
          width: 4,
          height: 4,
          left: "60%",
          top: "35%",
          filter: "blur(0.5px)",
        }}
      />
    </div>
  );
}

const blinkCSS = `
@keyframes kid-blink-frames {
  0%, 92%, 100% { transform: scaleY(1); background: rgba(255,255,255,0); }
  94% { transform: scaleY(0.05); background: rgba(255,255,255,1); }
  96% { transform: scaleY(1); background: rgba(255,255,255,0); }
}
.animate-kid-blink {
  animation: kid-blink-frames 4.6s cubic-bezier(.4,.0,.2,1) infinite;
}
`;
