import React from "react";
import { motion } from "framer-motion";

export default function Header() {
  return (
    <header className="bg-black/40 backdrop-blur-xl border-b border-white/10 py-4 flex justify-center">
      <div className="flex items-center gap-2 relative select-none">
        {/* --- Left text --- */}
        <span className="text-white font-extrabold text-3xl md:text-4xl tracking-wide">KID</span>

        {/* --- Container for glowing orbs + bridge --- */}
        <div className="relative flex items-center justify-center gap-3 mx-1">
          {/* Left (orange) orb */}
          <motion.span
            className="relative w-7 h-7 md:w-9 md:h-9 rounded-full"
            style={{
              background:
                "radial-gradient(circle at 40% 35%, #FFEAA0, #FFA131 60%, #E27C00 100%)",
            }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.9, 1, 0.9] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="absolute inset-0 rounded-full blur-2xl bg-[#FFA131]/40"></span>
          </motion.span>

          {/* Bridge of light between orbs */}
          <motion.div
            className="absolute left-1/2 top-1/2 w-16 h-[2px] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                "linear-gradient(90deg, rgba(255,161,49,0) 0%, rgba(255,161,49,0.6) 50%, rgba(131,163,255,0) 100%)",
            }}
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Right (blue) orb */}
          <motion.span
            className="relative w-7 h-7 md:w-9 md:h-9 rounded-full"
            style={{
              background:
                "radial-gradient(circle at 45% 40%, #EAF0FF, #83A3FF 60%, #5E7AFF 100%)",
            }}
            animate={{ scale: [1.1, 1, 1.1], opacity: [0.9, 1, 0.9] }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.8,
            }}
          >
            <span className="absolute inset-0 rounded-full blur-2xl bg-[#83A3FF]/40"></span>
          </motion.span>
        </div>

        {/* --- Right text --- */}
        <span className="text-white font-extrabold text-3xl md:text-4xl tracking-wide">SE</span>
      </div>
    </header>
  );
}
