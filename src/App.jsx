import React, { useEffect, useRef, useState } from "react";

/**
 * Header — KIDOOSE "cute eyes" logo
 * - Two eyes replace the "OO"
 * - Pupils follow the mouse within a safe radius
 * - Gentle blink animation
 * - Mobile-safe: pupils center if no mouse (touch)
 */
export default function Header() {
  return (
    <header className="bg-black/40 backdrop-blur-xl border-b border-white/10 py-4 flex justify-center">
      <div className="flex items-center select-none">
        <span className="text-white font-extrabold text-3xl md:text-4xl tracking-wide mr-2">KID</span>
        <CuteEyes />
        <span className="text-white font-extrabold text-3xl md:text-4xl tracking-wide ml-2">SE</span>
      </div>
    </header>
  );
}

/* -------------------------- Eyes -------------------------- */

function CuteEyes() {
  // Tune these to fit your header scale
  const EYE_W = 30;           // eye outer diameter
  const PUPIL_W = 14;         // pupil diameter
  const GAP = 8;              // space between the two eyes
  const MAX_OFFSET = 6;       // how far the pupil can move inside the eye (px)
  const SMOOTHING = 0.18;     // lerp factor for buttery motion

  const leftRef = useRef(null);
  const rightRef = useRef(null);

  const [target, setTarget] = useState({ x: 0, y: 0 }); // desired offset for pupils
  const current = useRef({ x: 0, y: 0 });               // smoothed offset

  // Track mouse position relative to the eyes container
  const wrapRef = useRef(null);

  useEffect(() => {
    const onMove = (e) => {
      if (!wrapRef.current) return;
      const rect = wrapRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;

      // Normalize direction and clamp to MAX_OFFSET
      const len = Math.hypot(dx, dy) || 1;
      const nx = (dx / len) * MAX_OFFSET;
      const ny = (dy / len) * MAX_OFFSET;

      setTarget({ x: nx, y: ny });
    };

    const onLeave = () => setTarget({ x: 0, y: 0 });

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  // Smoothly approach target (little easing so it feels alive)
  useEffect(() => {
    let raf;
    const tick = () => {
      current.current.x += (target.x - current.current.x) * SMOOTHING;
      current.current.y += (target.y - current.current.y) * SMOOTHING;

      const tx = current.current.x.toFixed(2);
      const ty = current.current.y.toFixed(2);

      if (leftRef.current) {
        leftRef.current.style.transform = `translate(${tx}px, ${ty}px)`;
      }
      if (rightRef.current) {
        rightRef.current.style.transform = `translate(${tx}px, ${ty}px)`;
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [SMOOTHING]);

  // Blink (CSS keyframes)
  return (
    <div
      ref={wrapRef}
      className="relative flex items-center justify-center"
      style={{ width: EYE_W * 2 + GAP, height: EYE_W }}
      aria-label="KIDOOSE eyes logo"
    >
      <Eye eyeSize={EYE_W} pupilSize={PUPIL_W} pupilRef={leftRef} />
      <div style={{ width: GAP }} />
      <Eye eyeSize={EYE_W} pupilSize={PUPIL_W} pupilRef={rightRef} />
      <style>{blinkCSS}</style>
    </div>
  );
}

function Eye({ eyeSize, pupilSize, pupilRef }) {
  const border = Math.max(2, Math.round(eyeSize * 0.08));
  return (
    <div
      className="relative rounded-full overflow-hidden bg-white"
      style={{
        width: eyeSize,
        height: eyeSize,
        boxShadow: "inset 0 -2px 0 rgba(0,0,0,0.06)",
        border: `${border}px solid rgba(255,255,255,0.85)`,
      }}
    >
      {/* eyelid (blink) */}
      <div className="absolute inset-0 origin-top animate-kid-blink bg-white/0 pointer-events-none" />
      {/* pupil */}
      <div
        ref={pupilRef}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: pupilSize,
          height: pupilSize,
          background:
            "radial-gradient(circle at 35% 35%, #111 0%, #222 60%, #000 100%)",
          boxShadow: "0 0 6px rgba(0,0,0,0.35)",
        }}
      />
      {/* tiny highlight */}
      <div
        className="absolute rounded-full"
        style={{
          width: Math.max(3, pupilSize * 0.22),
          height: Math.max(3, pupilSize * 0.22),
          background: "rgba(255,255,255,0.85)",
          left: "55%",
          top: "35%",
          transform: "translate(-50%,-50%)",
          filter: "blur(0.3px)",
          pointerEvents: "none",
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
