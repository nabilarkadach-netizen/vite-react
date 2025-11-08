import React, { useRef } from "react";
import { motion, useAnimationFrame } from "framer-motion";

export default function Header() {
  const sparkRef = useRef(null);
  const SPEED = 0.5; // slower spark

  useAnimationFrame((t) => {
    const time = t / 1000;
    const x = Math.sin(time * SPEED) * 16; // oscillate spark path
    if (sparkRef.current) {
      sparkRef.current.style.transform = `translateX(${x}px)`;
    }
  });

  return (
    <header className="bg-black/40 backdrop-blur-xl border-b border-white/10 py-4 flex justify-center">
      <div className="flex items-center select-none">
        <span className="text-white font-extrabold text-3xl md:text-4xl tracking-wide mr-2">
          KID
        </span>

        {/* Orbs with spark */}
        <div className="relative flex items-center justify-center w-[70px] h-[36px] mx-2">
          <div
            className="rounded-full"
            style={{
              width: 28,
              height: 28,
              background:
                "radial-gradient(circle at 40% 35%, #FFEAA0 0%, #FFA131 60%, #E27C00 100%)",
            }}
          />
          <div
            className="rounded-full ml-2"
            style={{
              width: 28,
              height: 28,
              background:
                "radial-gradient(circle at 45% 40%, #EAF0FF 0%, #83A3FF 60%, #5E7AFF 100%)",
            }}
          />

          {/* Spark animation */}
          <motion.div
            ref={sparkRef}
            className="absolute top-[14px] left-[18px] w-[8px] h-[8px] rounded-full bg-white shadow-[0_0_8px_2px_rgba(255,255,255,0.8)]"
          />
        </div>

        <span className="text-white font-extrabold text-3xl md:text-4xl tracking-wide ml-2">
          SE
        </span>
      </div>
    </header>
  );
}
