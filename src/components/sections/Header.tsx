"use client";

import { useEffect, useState } from "react";
import { profile } from "@/content/profile";
import { PullCord } from "@/components/pullcord";
import "@/components/pullcord/pullcord.css";

const nav = [
  { label: "Home", href: "#top" },
  ...profile.doors.map((door) => ({ label: door.title, href: "#work", door: door.id })),
  { label: "My story", href: "#story" },
  { label: "Contact", href: "#contact" },
];

export function Header() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (
      document.documentElement.classList.contains("dark") ||
      localStorage.getItem("theme") === "dark"
    ) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }

    const update = () => {
      const now = new Date();
      setTime(
        now
          .toLocaleTimeString("en-GB", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })
          .replace(" ", "")
          .toLowerCase()
      );
      const formatted = now.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      setDate(formatted.replace(/ (\d{4})$/, ", $1"));
    };

    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-center justify-between gap-4 px-6 pt-5 md:px-10 md:pr-40 md:pt-6">
        <nav className="nav-scroll pointer-events-auto flex min-w-0 flex-1 items-center gap-3 overflow-x-auto text-[12.5px] text-[var(--foreground)]/75 md:gap-5 md:text-[13.5px]">
          {nav.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => {
                if (!("door" in item) || !item.door) return;
                window.dispatchEvent(new CustomEvent("open-door", { detail: item.door }));
              }}
              className="shrink-0 whitespace-nowrap transition-colors hover:text-[var(--foreground)]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="pointer-events-auto hidden shrink-0 rounded-xl bg-[rgba(242,238,235,0.55)] px-3.5 py-2 text-[12.5px] text-[rgba(26,24,24,0.72)] backdrop-blur-sm md:block">
          <span className="opacity-80">Local time </span>
          <span className="font-medium text-[#1a1818]">{time}</span>
          <span className="mx-1.5">•</span>
          <span>{date}</span>
        </div>
      </header>

      <PullCord
        pulled={isDark}
        onPull={toggleTheme}
        ariaLabel={isDark ? "Light mode (pull the cord)" : "Dark mode (pull the cord)"}
        className="theme-pullcord"
      />
    </>
  );
}
