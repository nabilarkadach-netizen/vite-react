import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";

export default function Header() {
  const GAP_PX = 6; // uniform spacing between letters and eyes

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

/* -------------------- Eyes (independent tracking + random blinking) -------------------- */
function CuteEyes({ gap }) {
  const EYE = 27;
  const PUPIL = Math.round(EYE * 0.38);
  const GAP = gap - 2;                  // slightly tighter between eyes
  const LIMIT = Math.round(EYE * 0.2);  // max pupil travel

  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const leftWrap = useRef(null);
  const rightWrap = useRef(null);
  const leftPupil = useRef(null);
  const rightPupil = useRef(null);

  // APIs to trigger blinks inside each Eye
  const leftAPI = useRef(null);
  const rightAPI = useRef(null);

  // Track mouse globally
  useEffect(() => {
    const handle = (e) => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, []);

  // Independent tracking per eye
  useEffect(() => {
    let raf;
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

      updateEye(leftWrap.current, leftPupil.current);
      updateEye(rightWrap.current, rightPupil.current);

      raf = requestAnimationFrame(move);
    };
    move();
    return () => cancelAnimationFrame(raf);
  }, [mouse, LIMIT]);

  // Random blinking scheduler (natural feel)
  useEffect(() => {
    let t1, t2, t3;

    const rand = (min, max) => Math.random() * (max - min) + min;

    const schedule = () => {
      // Next blink in 1.8s–3.2s
      t1 = setTimeout(() => {
        const r = Math.random();

        // 0–0.75: both eyes blink together (most common)
        if (r < 0.75) {
          leftAPI.current?.blink();
          rightAPI.current?.blink();
        }
        // 0.75–0.9: single-eye blink (left or right)
        else if (r < 0.9) {
          (Math.random() < 0.5 ? leftAPI : rightAPI).current?.blink();
        }
        // 0.9–1: double-blink (both, twice)
        else {
          leftAPI.current?.blink();
          rightAPI.current?.blink();
          t2 = setTimeout(() => {
            leftAPI.current?.blink();
            rightAPI.current?.blink();
          }, 160); // short delay between the two blinks
        }

        // schedule next cycle
        schedule();
      }, rand(1800, 3200));

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    };

    const cleanup = schedule();
    return cleanup;
  }, []);

  return (
    <div className="relative flex items-center justify-center" style={{ height: EYE }}>
      <Eye
        size={EYE}
        pupil={PUPIL}
        wrapRef={leftWrap}
        pupilRef={leftPupil}
        apiRef={leftAPI}
      />
      <div style={{ width: GAP }} />
      <Eye
        size={EYE}
        pupil={PUPIL}
        wrapRef={rightWrap}
        pupilRef={rightPupil}
        apiRef={rightAPI}
      />
    </div>
  );
}

/* -------------------- Single Eye -------------------- */
const Eye = forwardRef(function EyeComponent(
  { size, pupil, wrapRef, pupilRef, apiRef },
) {
  const lidRef = useRef(null);
  const [lidScale, setLidScale] = useState(1);

  // expose a blink() method to parent
  useImperativeHandle(apiRef, () => ({
    blink: () => {
      // close
      setLidScale(0.06);
      // reopen shortly after (natural fast blink)
      setTimeout(() => setLidScale(1), 120);
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
      aria-label="KIDOOSE eye"
    >
      {/* Eyelid (animated by scaleY) */}
      <div
        ref={lidRef}
        className="absolute inset-0 origin-top pointer-events-none"
        style={{
          transform: `scaleY(${lidScale})`,
          transition: "transform 120ms cubic-bezier(.4,0,.2,1)",
          background: lidScale < 1 ? "rgba(255,255,255,1)" : "transparent",
        }}
      />

      {/* Pupil (moves) with glossy highlight attached */}
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
