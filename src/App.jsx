import React, { useEffect, useRef, useState } from "react";

export default function Header() {
  return (
    <header className="bg-black/40 backdrop-blur-xl border-b border-white/10 py-4 flex justify-center">
      <div className="flex items-center select-none">
        <span className="text-white font-extrabold text-3xl md:text-4xl tracking-wide mr-[10px]">
          KID
        </span>
        <KidooseEyesLogo />
        <span className="text-white font-extrabold text-3xl md:text-4xl tracking-wide ml-[10px]">
          SE
        </span>
      </div>
    </header>
  );
}

/* ----------------- 👁️ KIDOOSE Eyes Logo ----------------- */
function KidooseEyesLogo() {
  const EYE = 38; // match text height
  const PUPIL = 16;
  const GAP = 10; // equal gap for eyes and text
  const LIMIT = 6;
  const SPEED = 0.2; // lower = faster tracking

  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const wrapRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const lidsRef = useRef([]);

  const isTouch =
    typeof window !== "undefined" &&
    ("ontouchstart" in window || navigator.maxTouchPoints > 0);

  /* 🖱️ Track mouse movement */
  useEffect(() => {
    if (isTouch) return;
    const handle = (e) => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, [isTouch]);

  /* 🎯 Move pupils */
  useEffect(() => {
    const pos = { x: 0, y: 0 };
    const idle = { x: 0, y: 0 };

    const tick = () => {
      const wrap = wrapRef.current;
      if (wrap) {
        const rect = wrap.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        let tx = 0, ty = 0;

        if (!isTouch) {
          const dx = mouse.x - cx;
          const dy = mouse.y - cy;
          const len = Math.hypot(dx, dy) || 1;
          tx = (dx / len) * LIMIT;
          ty = (dy / len) * LIMIT;

          // cross eyes slightly when cursor in between
          const midL = rect.left + rect.width / 3;
          const midR = rect.right - rect.width / 3;
          if (mouse.x > midL && mouse.x < midR) tx *= 1.2;
        } else {
          // idle wandering on mobile
          tx = idle.x;
          ty = idle.y;
        }

        pos.x += (tx - pos.x) * SPEED;
        pos.y += (ty - pos.y) * SPEED;

        [leftRef.current, rightRef.current].forEach((el) => {
          if (el) el.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
        });
      }
      requestAnimationFrame(tick);
    };
    tick();

    // mobile idle movement
    if (isTouch) {
      const interval = setInterval(() => {
        idle.x = (Math.random() - 0.5) * LIMIT * 2;
        idle.y = Math.random() * 2; // mostly down
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [mouse, isTouch]);

  /* 😴 Blink animation */
  useEffect(() => {
    const lids = lidsRef.current;
    const blink = (times = 1) => {
      for (let i = 0; i < times; i++) {
        setTimeout(() => {
          lids.forEach((lid) => {
            if (!lid) return;
            lid.style.transform = "scaleY(0.1)";
            setTimeout(() => {
              lid.style.transform = "scaleY(1)";
            }, 120);
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
        refLid={(el) => (lidsRef.current[0] = el)}
      />
      <div style={{ width: GAP }} />
      <Eye
        size={EYE}
        pupil={PUPIL}
        refPupil={rightRef}
        refLid={(el) => (lidsRef.current[1] = el)}
      />
    </div>
  );
}

/* ----------------- Eye Component ----------------- */
function Eye({ size, pupil, refPupil, refLid }) {
  return (
    <div
      className="relative rounded-full overflow-hidden bg-[#FEFEFE] flex items-center justify-center"
      style={{
        width: size,
        height: size,
        border: "2px solid rgba(255,255,255,0.6)",
        boxShadow: "inset 0 -2px 0 rgba(0,0,0,0.05)",
      }}
    >
      {/* eyelid */}
      <div
        ref={refLid}
        className="absolute inset-0 bg-[#FEFEFE] origin-top transition-transform duration-150 ease-in-out"
      />

      {/* pupil */}
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

      {/* highlight */}
      <div
        className="absolute rounded-full bg-white"
        style={{
          width: 4,
          height: 4,
          left: "58%",
          top: "35%",
          filter: "blur(0.5px)",
        }}
      />
    </div>
  );
}
