import React from "react";
import { motion } from "framer-motion";

export default function HeaderLogo() {
  return (
    <header className="bg-black/40 backdrop-blur-xl border-b border-white/10 py-4 flex justify-center">
      <div className="flex items-center gap-2 select-none">
        {/* Left Text */}
        <span className="text-white font-extrabold text-3xl tracking-wide">KID</span>

        {/* Glowing Orbs — replace the "OO" */}
        <motion.span
          className="relative w-6 h-6 md:w-8 md:h-8 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 40% 35%, #FFEAA0, #FFA131 60%, #E27C00 100%)",
          }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.9, 1, 0.9] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="absolute inset-0 rounded-full blur-xl bg-[#FFA131]/40"></span>
        </motion.span>

        <motion.span
          className="relative w-6 h-6 md:w-8 md:h-8 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 45% 40%, #EAF0FF, #83A3FF 60%, #5E7AFF 100%)",
          }}
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.9, 1, 0.9] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
        >
          <span className="absolute inset-0 rounded-full blur-xl bg-[#83A3FF]/40"></span>
        </motion.span>

        {/* Right Text */}
        <span className="text-white font-extrabold text-3xl tracking-wide">SE</span>
      </div>
    </header>
  );
}
