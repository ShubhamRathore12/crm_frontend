"use client";

import { useEffect, useState } from "react";

export function SplashScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Show splash for 2 seconds exactly as requested
    const timer = setTimeout(() => setVisible(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#D9FF00] animate-fadeOut cursor-none pointer-events-none">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-black font-serif text-6xl md:text-8xl tracking-tighter animate-revealSplash">
          CRM
        </h1>
        <p className="text-black/60 font-mono text-sm tracking-[0.3em] uppercase animate-pulse">
          Loading CRM...
        </p>
      </div>
    </div>
  );
}
