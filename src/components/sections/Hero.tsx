"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { profile } from "@/content/profile";

const abilities = profile.doors.flatMap((door) => door.points);

export function Hero() {
  const [cardOpen, setCardOpen] = useState(false);

  return (
    <section id="top" className="relative min-h-screen overflow-hidden">
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 pb-16 pt-28 md:px-12 md:pt-24">
        <div className="max-w-xl">
          <p className="mb-7 flex items-center gap-2 text-[13px] text-[var(--foreground)]/70">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--foreground)]" />
            {profile.headline}
          </p>

          <h1 className="text-[2.7rem] font-medium leading-[0.96] tracking-tight sm:text-6xl lg:text-7xl">
            Hi, I&apos;m {profile.firstName}.
          </h1>
          <p className="mt-1 text-[2.7rem] font-medium leading-[0.96] tracking-tight text-[var(--foreground)]/40 sm:text-6xl lg:text-7xl">
            I am a
          </p>

          <Notepad />

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#contact"
              className="inline-flex items-center gap-3 rounded-full bg-[var(--foreground)] py-1.5 pl-5 pr-1.5 text-sm font-medium text-[var(--background)]"
            >
              Hire me
              <span className="grid h-8 w-8 place-items-center rounded-full bg-[var(--background)] text-[var(--foreground)]">
                <ArrowRight size={15} />
              </span>
            </a>
            <a
              href="#work"
              className="rounded-full border border-[var(--foreground)]/25 px-5 py-2.5 text-sm font-medium text-[var(--foreground)]/90 transition-colors hover:border-[var(--foreground)]/60"
            >
              See my work
            </a>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-0 right-10 z-0 h-[90%] w-[min(500px,46%)] md:right-20">
        <Image
          src="/images/jeevidesh.png"
          alt={profile.name}
          fill
          priority
          className="object-contain object-bottom object-right"
        />
      </div>

      <div className="absolute bottom-[12%] right-4 z-20 flex w-[min(300px,46%)] flex-col items-end md:bottom-[16%] md:right-16">
        <AnimatePresence>
          {cardOpen && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="mb-3 w-full rounded-2xl bg-[#161616]/92 p-4 text-white shadow-2xl backdrop-blur-md"
            >
              <p className="text-[11px] uppercase tracking-[0.16em] text-white/55">Ability card</p>
              <ul className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5">
                {abilities.map((item) => (
                  <li key={item} className="text-[12px] leading-snug text-white/90">
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          type="button"
          onClick={() => setCardOpen((open) => !open)}
          aria-expanded={cardOpen}
          className="mr-6 rounded-full bg-[#1a1a1a]/75 px-4 py-2 text-[13px] text-white shadow-lg backdrop-blur-sm md:mr-14"
        >
          My ability card
        </button>
      </div>
    </section>
  );
}

function Notepad() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % profile.roles.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const total = String(profile.roles.length).padStart(2, "0");
  const current = String(index + 1).padStart(2, "0");

  return (
    <div className="relative mt-8 w-[min(100%,460px)]" style={{ perspective: "900px" }}>
      <div className="absolute inset-x-3 top-3 h-[90%] rounded-2xl bg-[#eceae6]" />
      <div className="absolute inset-x-1.5 top-1.5 h-[95%] rounded-2xl bg-[#f7f6f4]" />
      <div className="absolute -top-3 left-5 right-5 z-20 flex justify-between">
        {Array.from({ length: 11 }).map((_, ring) => (
          <span
            key={ring}
            className="block h-6 w-[15px] rounded-full border-[2.5px] border-[#d0d0d0] bg-transparent shadow-[inset_0_0_0_1px_rgba(255,255,255,0.35)]"
          />
        ))}
      </div>
      <div className="relative z-10 min-h-[124px] overflow-hidden rounded-[18px] bg-white px-6 pb-8 pt-8 text-[#171717] shadow-[0_22px_50px_rgba(0,0,0,0.35)]">
        <AnimatePresence mode="wait">
          <motion.p
            key={profile.roles[index]}
            initial={{ rotateX: -80, opacity: 0 }}
            animate={{ rotateX: 0, opacity: 1 }}
            exit={{ rotateX: 75, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "top center" }}
            className="text-[1.85rem] font-semibold leading-[1.05] tracking-tight md:text-[2.45rem]"
          >
            {profile.roles[index]}
          </motion.p>
        </AnimatePresence>
        <span className="absolute bottom-3 right-4 font-mono text-[11px] tracking-wide text-black/35">
          {current} / {total}
        </span>
      </div>
    </div>
  );
}
