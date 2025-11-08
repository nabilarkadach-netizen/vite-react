import React, { useRef } from "react";
import { useAnimationFrame } from "framer-motion";

export default function Header() {
  const orangeRef = useRef(null);
  const blueRef = useRef(null);

  useAnimationFrame((t) => {
    const time = t / 1000;
    const angle = time * 1.2; // speed
    const radius = 9; // distance between orbs

    // Orb positions (horizontal orbit)
    const orangeX = Math.sin(angle) * radius;
    const blueX = Math.sin(angle + Math.PI) * radius;

    // Depth (decides which one is in front)
    const orangeFront = Math.cos(angle) > 0;
    const blueFront = Math.cos(angle + Math.PI) > 0;

    // Update transforms + depth
    if (orangeRef.current && blueRef.current) {
      orangeRef.current.style.transform = `translateX(${orangeX}px)`;
      blueRef.current.style.transform = `translateX(${blueX}px)`;

      // Z-index control for front/back illusion
      orangeRef.current.style.zIndex = orangeFront ? 2 : 0;
      blueRef.current.style.zIndex = blueFront ? 2 : 0;

      // No opacity blending — just show/hide
      orangeRef.current.style.visibility = orangeFront ? "visible" : "hidden";
      blueRef.current.style.visibility = blueFront ? "visible" : "hidden";
    }
  });

  return (
    <header className="bg-black/40 backdrop-blur-xl border-b border-white/10 py-4 flex justify-center">
      <div className="flex items-center gap-2 select-none">
        <span className="text-white font-extrabold text-3xl md:text-4xl tracking-wide">
          KID
        </span>

        {/* Orbit container replacing the two O's */}
        <div className="relative w-[56px] h-[36px] flex items-center justify-center">
          {/* Orange orb */}
          <div
            ref={orangeRef}
            className="absolute w-7 h-7 rounded-full shadow-[0_0_12px_rgba(255,161,49,0.4)]"
            style={{
              background:
                "radial-gradient(circle at 40% 35%, #FFEAA0, #FFA131 60%, #E27C00 100%)",
            }}
          ></div>

          {/* Blue orb */}
          <div
            ref={blueRef}
            className="absolute w-7 h-7 rounded-full shadow-[0_0_12px_rgba(131,163,255,0.4)]"
            style={{
              background:
                "radial-gradient(circle at 45% 40%, #EAF0FF, #83A3FF 60%, #5E7AFF 100%)",
            }}
          ></div>
        </div>

        <span className="text-white font-extrabold text-3xl md:text-4xl tracking-wide">
          SE
        </span>
      </div>
    </header>
  );
}
