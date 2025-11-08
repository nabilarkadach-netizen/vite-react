import React from "react";
import { motion, useAnimationFrame } from "framer-motion";
import { useRef } from "react";

export default function Header() {
  const orangeRef = useRef(null);
  const blueRef = useRef(null);

  useAnimationFrame((t) => {
    const time = t / 1000;
    const cycle = (Math.sin(time * 0.8) + 1) / 2; // oscillates 0 → 1 → 0
    const distance = 22; // spacing between orbs

    // horizontal center swap positions
    const orangeX = -distance / 2 + cycle * distance;
    const blueX = distance / 2 - cycle * distance;

    // Update transforms + depth fade
    if (orangeRef.current) {
      orangeRef.current.style.transform = `translateX(${orangeX}px)`;
      orangeRef.current.style.opacity = 0.6 + 0.4 * (1 - Math.abs(cycle - 0.5) * 2);
    }
    if (blueRef.current) {
      blueRef.current.style.transform = `translateX(${blueX}px)`;
      blueRef.current.style.opacity = 0.6 + 0.4 * (1 - Math.abs(cycle - 0.5) * 2);
    }
  });

  return (
    <header className="bg-black/40 backdrop-blur-xl border-b border-white/10 py-4 flex justify-center">
      <div className="flex items-center gap-4 relative select-none">
        {/* Left text */}
        <span className="text-white font-extrabold text-3xl md:text-4xl tracking-wide">
          KID
        </span>

        {/* Orbit container */}
        <div className="relative flex items-center justify-center w-[70px] h-[36px]">
          {/* Orange orb */}
          <div
            ref={orangeRef}
            className="absolute w-7 h-7 rounded-full shadow-[0_0_15px_rgba(255,161,49,0.4)]"
            style={{
              background:
                "radial-gradient(circle at 40% 35%, #FFEAA0, #FFA131 60%, #E27C00 100%)",
            }}
          ></div>

          {/* Blue orb */}
          <div
            ref={blueRef}
            className="absolute w-7 h-7 rounded-full shadow-[0_0_15px_rgba(131,163,255,0.4)]"
            style={{
              background:
                "radial-gradient(circle at 45% 40%, #EAF0FF, #83A3FF 60%, #5E7AFF 100%)",
            }}
          ></div>
        </div>

        {/* Right text */}
        <span className="text-white font-extrabold text-3xl md:text-4xl tracking-wide">
          SE
        </span>
      </div>
    </header>
  );
}
