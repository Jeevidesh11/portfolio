"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { profile } from "@/content/profile";

export function Story() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeYear, setActiveYear] = useState(profile.timeline[0].year);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  // Update active year based on scroll position
  useEffect(() => {
    return scrollYProgress.onChange((latest) => {
      const index = Math.min(
        Math.floor(latest * profile.timeline.length),
        profile.timeline.length - 1
      );
      if (index >= 0) {
        setActiveYear(profile.timeline[index].year);
      }
    });
  }, [scrollYProgress]);

  return (
    <section id="story" ref={containerRef} className="py-32 px-6 md:px-12 max-w-7xl mx-auto relative">
      <div className="mb-32">
        <p className="text-sm tracking-widest uppercase mb-4 opacity-70">
          My story
        </p>
        <h2 className="text-4xl md:text-6xl font-medium tracking-tight">
          Let's go back in time.
        </h2>
      </div>

      <div className="flex flex-col md:flex-row gap-12 md:gap-24 relative">
        {/* Sticky Year Display */}
        <div className="md:w-1/3 relative">
          <div className="sticky top-1/2 -translate-y-1/2 h-40 overflow-hidden">
            <motion.div
              className="text-8xl md:text-9xl font-medium tracking-tighter tabular-nums"
              key={activeYear}
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              transition={{ duration: 0.5, ease: "circOut" }}
            >
              {activeYear}
            </motion.div>
          </div>
        </div>

        {/* Timeline Items */}
        <div className="md:w-2/3 space-y-32 pb-32">
          {profile.timeline.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ margin: "-20% 0px -20% 0px" }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <div className="text-sm font-mono opacity-50">
                0{index + 1} / 0{profile.timeline.length}
              </div>
              <div className="text-sm tracking-widest uppercase opacity-70">
                {item.period}
              </div>
              <h3 className="text-3xl md:text-4xl font-medium">
                {item.role}
              </h3>
              <div className="text-xl opacity-80">
                {item.company}
              </div>
              <div className="text-sm opacity-60">
                {item.location}
              </div>
              <p className="text-lg leading-relaxed max-w-xl pt-4">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
