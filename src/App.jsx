import React from "react";
import { useAnimationFrame } from "framer-motion";
import { useRef } from "react";

export default function Header() {
  const orangeRef = useRef(null);
  const blueRef = useRef(null);

  useAnimationFrame((t) => {
    const time = t / 1000;
    const angle = time * 1.2; // rotation speed
    const radius = 9; // how far they orbit apart

    // Circular (horizontal) orbit inside fixed O-space
    const orangeX = Math.sin(angle) * radius;
    const blueX = Math.sin(angle + Math.PI) * radius;

    const orangeDepth = Math.cos(angle);
    const blueDepth = Math.cos(angle + Math.PI);

    if (orangeRef.current) {
      orangeRef.current.style.transform = `translateX(${orangeX}px)`;
      orangeRef.current.style.opacity = orangeDepth > 0 ? 1 : 0.3; // fade when behind
      orangeRef.current.style.zIndex = orangeDepth > 0 ? 2 : 0;
    }

    if (blueRef.current) {
      blueRef.current.style.transform = `translateX(${blueX}px)`;
      blueRef.current.style.opacity = blueDepth > 0 ? 1 : 0.3;
      blueRef.current.style.zIndex = blueDepth > 0 ? 2 : 0;
    }
  });

  return (
    <header className="bg-black/40 backdrop-blur-xl border-b border-white/10 py-4 flex justify-center">
      <div className="flex items-center gap-2 select-none">
        <span className="text-white font-extrabold text-3xl md:text-4xl tracking-wide">
          KID
        </span>

        {/* Orbit container replacing OO */}
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
