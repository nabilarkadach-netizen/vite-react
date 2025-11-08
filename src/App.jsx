import React from "react";
import { motion, useAnimationFrame } from "framer-motion";
import { useRef } from "react";

export default function Header() {
  const refOrange = useRef(null);
  const refBlue = useRef(null);
  const refBridge = useRef(null);

  // Orbit animation logic (using requestAnimationFrame)
  useAnimationFrame((t) => {
    const time = t / 1000; // seconds
    const radius = 14; // distance of orbit in px
    const speed = 0.8; // speed multiplier

    // circular motion (orange and blue opposite phases)
    const orangeX = Math.sin(time * speed) * radius;
    const orangeY = Math.cos(time * speed) * 4;
    const blueX = Math.sin(time * speed + Math.PI) * radius;
    const blueY = Math.cos(time * speed + Math.PI) * 4;

    // Update transforms
    if (refOrange.current) {
      refOrange.current.style.transform = `translateX(${orangeX}px) translateY(${orangeY}px)`;
      refOrange.current.style.zIndex = orangeY > blueY ? 1 : 0;
    }
    if (refBlue.current) {
      refBlue.current.style.transform = `translateX(${blueX}px) translateY(${blueY}px)`;
      refBlue.current.style.zIndex = blueY > orangeY ? 1 : 0;
    }

    // Bridge follows midpoint
    if (refBridge.current) {
      const midX = (orangeX + blueX) / 2;
      const midY = (orangeY + blueY) / 2;
      refBridge.current.style.transform = `translateX(${midX}px) translateY(${midY}px)`;
    }
  });

  return (
    <header className="bg-black/40 backdrop-blur-xl border-b border-white/10 py-4 flex justify-center">
      <div className="flex items-center gap-2 relative select-none">
        {/* Left text */}
        <span className="text-white font-extrabold text-3xl md:text-4xl tracking-wide">
          KID
        </span>

        {/* Orbit container */}
        <div className="relative w-[80px] h-[40px] flex items-center justify-center">
          {/* Bridge of light */}
          <motion.div
            ref={refBridge}
            className="absolute top-1/2 left-1/2 w-16 h-[2px] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                "linear-gradient(90deg, rgba(255,161,49,0) 0%, rgba(255,161,49,0.6) 50%, rgba(131,163,255,0) 100%)",
              opacity: 0.7,
            }}
          />

          {/* Orange orb */}
          <div
            ref={refOrange}
            className="absolute w-8 h-8 rounded-full shadow-[0_0_25px_rgba(255,161,49,0.5)]"
            style={{
              background:
                "radial-gradient(circle at 40% 35%, #FFEAA0, #FFA131 60%, #E27C00 100%)",
            }}
          ></div>

          {/* Blue orb */}
          <div
            ref={refBlue}
            className="absolute w-8 h-8 rounded-full shadow-[0_0_25px_rgba(131,163,255,0.5)]"
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
