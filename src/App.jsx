import React, { useEffect, useRef, useState } from "react";

export default function Header() {
  const GAP_PX = 6; // spacing between KID ↔ eyes ↔ SE

  return (
    <header className="bg-black/40 backdrop-blur-xl border-b border-white/10 py-4 flex justify-center">
      <div
        className="flex items-center select-none"
        style={{ columnGap: `${GAP_PX}px` }}
      >
        <span className="text-white font-extrabold text-3xl md:text-4xl tracking-wide">
          KID
        </span>
        <CuteEyes gap={GAP_PX} />
        <span className="text-white font-extrabold text-3xl md:text-4xl tracking-wide">
          SE
        </span>
      </div>
    </header>
  );
}

/* -------------------- Eyes -------------------- */
function CuteEyes({ gap }) {
  const EYE = 27;
  const PUPIL = Math.round(EYE * 0.38);
  const GAP = gap - 2;
  const LIMIT = Math.round(EYE * 0.2);

  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const leftWrap = useRef(null);
  const rightWrap = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);

  // Track mouse globally
  useEffect(() => {
    const handle = (e) => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, []);

  // Independent tracking for each eye
  useEffect(() => {
    const move = () => {
      const updateEye = (wrap, pupil) => {
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

      updateEye(leftWrap.current, leftRef.current);
      updateEye(rightWrap.current, rightRef.current);

      requestAnimationFrame(move);
    };
    move();
  }, [mouse, LIMIT]);

  return (
    <div className="relative flex items-center justify-center" style={{ height: EYE }}>
      <Eye size={EYE} pupil={PUPIL} wrapRef={leftWrap} refPupil={leftRef} />
      <div style={{ width: GAP }} />
      <Eye size={EYE} pupil={PUPIL} wrapRef={rightWrap} refPupil={rightRef} />
      <style>{blinkCSS}</style>
    </div>
  );
}

/* -------------------- Single Eye -------------------- */
function Eye({ size, pupil, wrapRef, refPupil }) {
  return (
    <div
      ref={wrapRef}
      className="relative rounded-full overflow-hidden flex items-center justify-center"
      style={{
        width: size,
        height: size,
        background:
          "radial-gradient(circle at 50% 55%, #FFFFFF 0%, #F2F2F2 85%, #E8E8E8 100%)",
        boxShadow:
          "inset 0 -2px 1px rgba(0,0,0,0.08), 0 2px 3px rgba(0,0,0,0.15)",
      }}
      aria-label="KIDOOSE eye"
    >
      {/* eyelid (blinking) */}
      <div className="absolute inset-0 origin-top animate-kid-blink bg-white/0 pointer-events-none" />

      {/* pupil (moves) */}
      <div
        ref={refPupil}
        className="absolute rounded-full will-change-transform flex items-center justify-center"
        style={{
          width: pupil,
          height: pupil,
          background:
            "radial-gradient(circle at 40% 40%, #111 0%, #222 60%, #000 100%)",
        }}
      >
        {/* glossy highlight — moves with pupil */}
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
    </div>
  );
}

/* -------------------- Blink Animation -------------------- */
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
