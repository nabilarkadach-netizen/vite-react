import React, { useRef } from "react";
import { useAnimationFrame } from "framer-motion";

export default function Header() {
  const parentRef = useRef(null);
  const childRef = useRef(null);

  const ORBIT_RADIUS = 10;
  const SPEED = 1;

  useAnimationFrame((t) => {
    const time = t / 1000;
    const angle = time * SPEED;

    const x = Math.cos(angle) * ORBIT_RADIUS;
    const y = Math.sin(angle) * ORBIT_RADIUS;

    if (childRef.current) {
      childRef.current.style.transform = `translate(${x}px, ${y}px)`;
    }
  });

  return (
    <header className="bg-black/40 backdrop-blur-xl border-b border-white/10 py-4 flex justify-center">
      <div className="flex items-center select-none">
        <span
          className="text-white font-extrabold text-3xl md:text-4xl tracking-wide mr-2"
        >
          KID
        </span>

        {/* Orbit cluster */}
        <div className="relative w-[70px] h-[36px] mx-2 flex items-center justify-center">
          {/* Parent orb */}
          <div
            ref={parentRef}
            className="rounded-full"
            style={{
              width: 30,
              height: 30,
              background:
                "radial-gradient(circle at 40% 35%, #FFEAA0 0%, #FFA131 60%, #E27C00 100%)",
            }}
          />
          {/* Child orb */}
          <div
            ref={childRef}
            className="absolute rounded-full"
            style={{
              width: 16,
              height: 16,
              background:
                "radial-gradient(circle at 45% 40%, #EAF0FF 0%, #83A3FF 60%, #5E7AFF 100%)",
            }}
          />
        </div>

        <span
          className="text-white font-extrabold text-3xl md:text-4xl tracking-wide ml-2"
        >
          SE
        </span>
      </div>
    </header>
  );
}
