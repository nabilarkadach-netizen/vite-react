import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// ✅ Safe fallback for crypto
if (typeof globalThis.crypto === "undefined") {
  // Use dynamic import to avoid define-time syntax errors
  import("node:crypto").then((crypto) => {
    globalThis.crypto = crypto.webcrypto;
  });
}

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    rollupOptions: {
      external: [],
    },
  },
  server: {
    port: 5173,
  },
});
