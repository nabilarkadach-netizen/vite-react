import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";

export default function Header() {
  const GAP_PX = 6;
  return (
    <header className="bg-black/40 backdrop-blur-xl border-b border-white/10 py-4 flex justify-center">
      <div className="flex items-center select-none" style={{ columnGap: `${GAP_PX}px` }}>
        <span className="text-white font-extrabold text-3xl md:text-4xl tracking-wide">KID</span>
        <CuteEyes gap={GAP_PX} />
        <span className="text-white font-extrabold text-3xl md:text-4xl tracking-wide">SE</span>
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
  const leftPupil = useRef(null);
  const rightPupil = useRef(null);
  const leftAPI = useRef(null);
  const rightAPI = useRef(null);

  useEffect(() => {
    const handle = (e) => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, []);

  // pupil motion
  useEffect(() => {
    let raf;
    const move = () => {
      const moveEye = (wrap, pupil) => {
        if (!wrap || !pupil) return;
        const r = wrap.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = mouse.x - cx;
        const dy = mouse.y - cy;
        const len = Math.hypot(dx, dy) || 1;
        const nx = (dx / len) * LIMIT;
        const ny = (dy / len) * LIMIT;
        pupil.style.transform = `translate(${nx}px, ${ny}px)`;
      };
      moveEye(leftWrap.current, leftPupil.current);
      moveEye(rightWrap.current, rightPupil.current);
      raf = requestAnimationFrame(move);
    };
    move();
    return () => cancelAnimationFrame(raf);
  }, [mouse]);

  // random blink loop
  useEffect(() => {
    let t;
    const blinkLoop = () => {
      const delay = 1800 + Math.random() * 1500;
      t = setTimeout(() => {
        leftAPI.current?.blink();
        rightAPI.current?.blink();
        blinkLoop();
      }, delay);
    };
    blinkLoop();
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative flex items-center justify-center" style={{ height: EYE }}>
      <Eye size={EYE} pupil={PUPIL} wrapRef={leftWrap} pupilRef={leftPupil} apiRef={leftAPI} />
      <div style={{ width: GAP }} />
      <Eye size={EYE} pupil={PUPIL} wrapRef={rightWrap} pupilRef={rightPupil} apiRef={rightAPI} />
    </div>
  );
}

/* -------------------- Eye -------------------- */
const Eye = forwardRef(function Eye({ size, pupil, wrapRef, pupilRef, apiRef }, ref) {
  const lidRef = useRef(1);
  const [lidValue, setLidValue] = useState(1);

  // Smooth eyelid interpolator
  useEffect(() => {
    let raf;
    const animate = () => {
      setLidValue((v) => {
        const target = lidRef.current;
        const next = v + (target - v) * 0.25; // smooth lerp
        return Math.abs(next - target) < 0.001 ? target : next;
      });
      raf = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(raf);
  }, []);

  useImperativeHandle(apiRef, () => ({
    blink: () => {
      lidRef.current = 0.05; // close
      setTimeout(() => (lidRef.current = 1), 150); // open
    },
  }));

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
    >
      {/* eyelid */}
      <div
        className="absolute inset-0 origin-top pointer-events-none"
        style={{
          transform: `scaleY(${lidValue})`,
          background: lidValue < 0.99 ? "white" : "transparent",
        }}
      />
      {/* pupil */}
      <div
        ref={pupilRef}
        className="absolute rounded-full will-change-transform flex items-center justify-center"
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
    </div>
  );
});
