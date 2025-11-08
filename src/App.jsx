import React from "react";
import { motion } from "framer-motion";

export default function Header() {
  return (
    <header className="bg-black/40 backdrop-blur-xl border-b border-white/10 py-4 flex justify-center">
      <div className="flex items-center select-none">
        <span className="text-white font-extrabold text-3xl md:text-4xl tracking-wide mr-2">
          KID
        </span>

        {/* Aurora Ribbon Container */}
        <div className="relative w-[70px] h-[36px] mx-2 overflow-hidden rounded-full">
          <motion.div
            className="absolute inset-0"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%"],
            }}
            transition={{
              repeat: Infinity,
              repeatType: "mirror",
              duration: 8,
              ease: "linear",
            }}
            style={{
              backgroundImage:
                "linear-gradient(90deg, #FFA131, #F5C16E, #83A3FF, #5E7AFF)",
              backgroundSize: "200% 100%",
              filter: "blur(6px)",
              opacity: 0.9,
            }}
          />
        </div>

        <span className="text-white font-extrabold text-3xl md:text-4xl tracking-wide ml-2">
          SE
        </span>
      </div>
    </header>
  );
}
