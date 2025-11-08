import React, { useRef } from "react";
import { useAnimationFrame } from "framer-motion";

export default function Header() {
  const orangeRef = useRef(null);
  const blueRef = useRef(null);

  /* tuning knobs */
  const RADIUS = 8;      // orbit radius (depth illusion)
  const OFFSET = 12;     // half of the fixed gap between orbs
  const SPEED  = 1;      // rotation speed (radians/sec)
  const SWITCH_LOW = 0.42;
  const SWITCH_HIGH = 0.58;

  const front = useRef("orange"); // remember who’s in front

  useAnimationFrame((t) => {
    const time = t / 1000;
    const angle = time * SPEED;
    const s = (Math.sin(angle) + 1) / 2;

    /* circular motion, each path offset left/right */
    const orangeX = Math.sin(angle) * RADIUS - OFFSET;
    const orangeZ = Math.cos(angle);
    const blueX   = Math.sin(angle + Math.PI) * RADIUS + OFFSET;
    const blueZ   = Math.cos(angle + Math.PI);

    /* hysteresis to avoid jump */
    if (s <= SWITCH_LOW)  front.current = "orange";
    if (s >= SWITCH_HIGH) front.current = "blue";

    if (orangeRef.current && blueRef.current) {
      orangeRef.current.style.transform = `translateX(${orangeX}px)`;
      blueRef.current.style.transform   = `translateX(${blueX}px)`;

      orangeRef.current.style.zIndex = front.current === "orange" ? 2 : 1;
      blueRef.current.style.zIndex   = front.current === "blue" ? 2 : 1;
    }
  });

  return (
    <header className="bg-black/40 backdrop-blur-xl border-b border-white/10 py-4 flex justify-center">
      <div className="flex items-center gap-6 select-none">
        <span className="text-white font-extrabold text-3xl md:text-4xl tracking-wide">KID</span>

        {/* Container width ensures even spacing like real "OO" */}
        <div className="relative flex items-center justify-center w-[68px] h-[36px]">
          {/* orange orb */}
          <div
            ref={orangeRef}
            className="absolute rounded-full will-change-transform"
            style={{
              width: 28,
              height: 28,
              background:
                "radial-gradient(circle at 40% 35%, #FFEAA0 0%, #FFA131 60%, #E27C00 100%)",
            }}
          />
          {/* blue orb */}
          <div
            ref={blueRef}
            className="absolute rounded-full will-change-transform"
            style={{
              width: 28,
              height: 28,
              background:
                "radial-gradient(circle at 45% 40%, #EAF0FF 0%, #83A3FF 60%, #5E7AFF 100%)",
            }}
          />
        </div>

        <span className="text-white font-extrabold text-3xl md:text-4xl tracking-wide">SE</span>
      </div>
    </header>
  );
}
