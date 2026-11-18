"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Preloader() {
  const [count, setCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Check if already visited in this session
    if (sessionStorage.getItem("visited")) {
      setIsComplete(true);
      return;
    }

    const duration = 1600; // 1.6 seconds
    const interval = 20;
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      
      setCount(Math.floor(easeProgress * 100));

      if (currentStep >= steps) {
        clearInterval(timer);
        setTimeout(() => {
          setIsComplete(true);
          sessionStorage.setItem("visited", "true");
        }, 200);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#111] text-[#f5f5f5]"
        >
          <div className="text-sm tracking-widest uppercase mb-4 opacity-70">
            Opening up the work
          </div>
          <div className="text-6xl md:text-8xl font-medium tabular-nums tracking-tighter">
            {count.toString().padStart(3, "0")}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
