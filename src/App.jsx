import React, { useEffect, useRef, useState } from "react";

export default function Header() {
  return (
    <header className="bg-black/40 backdrop-blur-xl border-b border-white/10 py-4 flex justify-center">
      <div className="flex items-center select-none">
        <span className="text-white font-extrabold text-3xl md:text-4xl tracking-wide mr-[10px]">
          KID
        </span>
        <CuteEyes />
        <span className="text-white font-extrabold text-3xl md:text-4xl tracking-wide ml-[10px]">
          SE
        </span>
      </div>
    </header>
  );
}

/* -------------------- Eyes -------------------- */
function CuteEyes() {
  const EYE = 36;      // outer diameter (matches text)
  const PUPIL = 13;    // pupil size
  const GAP = 10;      // consistent spacing
  const LIMIT = 7;     // max pupil travel

  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const wrapRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const eyelidRefs = useRef([]);

  const isTouch =
    typeof window !== "undefined" &&
    ("ontouchstart" in window || navigator.maxTouchPoints > 0);

  /* Track mouse on desktop */
  useEffect(() => {
    if (isTouch) return;
    const handle = (e) => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, [isTouch]);

  /* Move pupils smoothly */
  useEffect(() => {
    const current = { x: 0, y: 0 };
    const idle = { x: 0, y: 0 };
    const SPEED = 0.25; // swift

    const move = () => {
      const wrap = wrapRef.current;
      if (!wrap) return;
      const rect = wrap.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      let tx = 0, ty = 0;
      if (!isTouch && mouse.x && mouse.y) {
        const dx = mouse.x - cx;
        const dy = mouse.y - cy;
        const len = Math.hypot(dx, dy) || 1;
        tx = (dx / len) * LIMIT;
        ty = (dy / len) * LIMIT;
      } else {
        // mobile idle wander
        tx = idle.x;
        ty = idle.y;
      }

      current.x += (tx - current.x) * SPEED;
      current.y += (ty - current.y) * SPEED;

      [leftRef.current, rightRef.current].forEach((el) => {
        if (el) el.style.transform = `translate(${current.x}px, ${current.y}px)`;
      });

      requestAnimationFrame(move);
    };
    move();

    if (isTouch) {
      const interval = setInterval(() => {
        idle.x = (Math.random() - 0.5) * LIMIT * 2;
        idle.y = Math.random() * 3; // mostly down
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [mouse, isTouch]);

  /* Blinking logic */
  useEffect(() => {
    const lids = eyelidRefs.current;
    const blink = (times = 1) => {
      for (let i = 0; i < times; i++) {
        setTimeout(() => {
          lids.forEach((lid) => {
            if (!lid) return;
            lid.style.transform = "scaleY(0.05)";
            lid.style.background = "#fff";
            setTimeout(() => {
              lid.style.transform = "scaleY(1)";
              lid.style.background = "transparent";
            }, 140);
          });
        }, i * 220);
      }
    };

    const loop = () => {
      blink(Math.random() > 0.8 ? 2 : 1);
      const delay = 2500 + Math.random() * 3000;
      setTimeout(loop, delay);
    };
    loop();
  }, []);

  return (
    <div
      ref={wrapRef}
      className="relative flex items-center justify-center"
      style={{ width: EYE * 2 + GAP, height: EYE }}
    >
      <Eye
        size={EYE}
        pupil={PUPIL}
        refPupil={leftRef}
        refLid={(el) => (eyelidRefs.current[0] = el)}
      />
      <div style={{ width: GAP }} />
      <Eye
        size={EYE}
        pupil={PUPIL}
        refPupil={rightRef}
        refLid={(el) => (eyelidRefs.current[1] = el)}
      />
    </div>
  );
}

/* -------------------- Single Eye -------------------- */
function Eye({ size, pupil, refPupil, refLid }) {
  return (
    <div
      className="relative rounded-full overflow-hidden bg-white flex items-center justify-center"
      style={{
        width: size,
        height: size,
        border: "2px solid rgba(255,255,255,0.7)",
        boxShadow: "inset 0 -2px 0 rgba(0,0,0,0.05)",
      }}
    >
      {/* Eyelid (blinks via transform scaleY) */}
      <div
        ref={refLid}
        className="absolute inset-0 origin-top transition-transform duration-150 ease-in-out"
        style={{ background: "transparent" }}
      />

      {/* Pupil */}
      <div
        ref={refPupil}
        className="absolute rounded-full"
        style={{
          width: pupil,
          height: pupil,
          background:
            "radial-gradient(circle at 35% 35%, #111 0%, #222 60%, #000 100%)",
        }}
      />

      {/* Shine highlight */}
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
