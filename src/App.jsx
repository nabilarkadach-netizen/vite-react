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
  const [blink, setBlink] = useState(false);
  const leftWrap = useRef(null);
  const rightWrap = useRef(null);
  const leftPupil = useRef(null);
  const rightPupil = useRef(null);

  const [isMobile, setIsMobile] = useState(false);
  const [idleTarget, setIdleTarget] = useState({ x: 0, y: 0 });

  /* Detect mobile (no precise mouse) */
  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    setIsMobile(mq.matches);
  }, []);

  /* Track mouse for desktop */
  useEffect(() => {
    if (isMobile) return;
    const handle = (e) => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, [isMobile]);

  /* Idle gaze motion for mobile */
  useEffect(() => {
    if (!isMobile) return;

    const positions = [
      { x: LIMIT * 0.8, y: LIMIT * 0.6 }, // down-right
      { x: -LIMIT * 0.8, y: LIMIT * 0.6 }, // down-left
      { x: 0, y: LIMIT * 0.6 }, // down-center
    ];

    const loop = () => {
      const next = positions[Math.floor(Math.random() * positions.length)];
      setIdleTarget(next);
      const wait = 3000 + Math.random() * 3000; // 3–6 s between moves
      setTimeout(loop, wait);
    };
    loop();
  }, [isMobile]);

  /* Blink loop (less frequent, natural double blinks) */
  useEffect(() => {
    const loop = () => {
      const delay = 5000 + Math.random() * 3000; // 5–8 s between blinks
      setTimeout(() => {
        setBlink(true);
        setTimeout(() => setBlink(false), 300);
        if (Math.random() < 0.15) {
          setTimeout(() => {
            setBlink(true);
            setTimeout(() => setBlink(false), 300);
          }, 600);
        }
        loop();
      }, delay);
    };
    loop();
  }, []);

  /* Move pupils */
  useEffect(() => {
    let raf;
    const move = () => {
      const moveOne = (wrap, pupil) => {
        if (!wrap || !pupil) return;
        const rect = wrap.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        let nx = 0, ny = 0;
        if (isMobile) {
          nx = idleTarget.x;
          ny = idleTarget.y;
        } else {
          const dx = mouse.x - cx;
          const dy = mouse.y - cy;
          const len = Math.hypot(dx, dy) || 1;
          nx = (dx / len) * LIMIT;
          ny = (dy / len) * LIMIT;
        }

        pupil.style.transition = "transform 1.5s ease-in-out";
        pupil.style.transform = `translate(${nx}px, ${ny}px)`;
      };

      moveOne(leftWrap.current, leftPupil.current);
      moveOne(rightWrap.current, rightPupil.current);
      raf = requestAnimationFrame(move);
    };
    move();
    return () => cancelAnimationFrame(raf);
  }, [mouse, idleTarget, isMobile]);

  return (
    <div className="flex items-center justify-center" style={{ height: EYE }}>
      <Eye size={EYE} pupil={PUPIL} pupilRef={leftPupil} wrapRef={leftWrap} blink={blink} />
      <div style={{ width: GAP }} />
      <Eye size={EYE} pupil={PUPIL} pupilRef={rightPupil} wrapRef={rightWrap} blink={blink} />
    </div>
  );
}

/* -------------------- Eye Component -------------------- */
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
        {/* gloss */}
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

      {/* top eyelid */}
      <div
        className="absolute inset-0 rounded-full bg-gradient-to-b from-[#e4c6a3] to-[#d5b085]"
        style={{
          transform: blink ? "translateY(0%)" : "translateY(-100%)",
          transition: "transform 0.15s ease-in-out",
        }}
      >
        {blink && (
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-[2px]"
            style={{ marginBottom: "-2px" }}
          >
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="bg-black"
                style={{
                  width: 2,
                  height: 6,
                  transform: `rotate(${(i - 2) * 12}deg)`,
                  transformOrigin: "bottom center",
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* bottom eyelid */}
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
