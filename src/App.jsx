import React, { useRef } from "react";
import { useAnimationFrame } from "framer-motion";

export default function Header() {
  const orangeRef = useRef(null);
  const blueRef = useRef(null);
  const FRONT_RADIUS = 8; // orbit distance
  const SPEED = 1; // rotation speed

  useAnimationFrame((t) => {
    const time = t / 1000;
    const angle = time * SPEED; // continuous rotation in radians

    // Circular orbit positions (simulate 3D rotation on X–Z plane)
    const orangeX = Math.sin(angle) * FRONT_RADIUS;
    const orangeZ = Math.cos(angle); // depth
    const blueX = Math.sin(angle + Math.PI) * FRONT_RADIUS;
    const blueZ = Math.cos(angle + Math.PI);

    // Apply transforms and depth ordering
    if (orangeRef.current && blueRef.current) {
      orangeRef.current.style.transform = `translateX(${orangeX}px)`;
      blueRef.current.style.transform = `translateX(${blueX}px)`;

      // whichever has larger Z (closer to viewer) comes to front
      orangeRef.current.style.zIndex = orangeZ > blueZ ? 2 : 1;
      blueRef.current.style.zIndex = blueZ > orangeZ ? 2 : 1;
    }
  });

  return (
    <header className="bg-black/40 backdrop-blur-xl border-b border-white/10 py-4 flex justify-center">
      <div className="flex items-center gap-6 select-none">
        <span className="text-white font-extrabold text-3xl md:text-4xl tracking-wide">KID</span>

        {/* Orbs container – fixed width (equal spacing) */}
        <div className="relative flex items-center justify-center w-[56px] h-[36px]">
          {/* Orange orb */}
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

          {/* Blue orb */}
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
