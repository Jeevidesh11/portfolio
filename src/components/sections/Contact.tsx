"use client";

import { useState, useEffect } from "react";
import { profile } from "@/content/profile";

export function Contact() {
  const [year, setYear] = useState("");

  useEffect(() => {
    setYear(new Date().getFullYear().toString());
  }, []);

  return (
    <section id="contact" className="py-32 px-6 md:px-12 max-w-7xl mx-auto border-t border-[var(--foreground)]/10">
      <div className="flex flex-col md:flex-row justify-between gap-16">
        
        <div className="space-y-8 md:w-1/2">
          <div>
            <p className="text-sm tracking-widest uppercase mb-4 opacity-70">
              Status
            </p>
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight">
              {profile.headline}
            </h2>
          </div>
          <p className="text-lg opacity-80 max-w-md">
            Working with businesses on practical digital and software solutions.
          </p>
        </div>

        <div className="md:w-1/3 space-y-12">
          <div className="space-y-6">
            <h3 className="text-sm tracking-widest uppercase opacity-70">
              Connect
            </h3>
            <ul className="space-y-4 text-xl">
              <li>
                <a 
                  href={profile.links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-70 transition-opacity flex items-center gap-4 group"
                >
                  LinkedIn
                  <span className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all">→</span>
                </a>
              </li>
              <li>
                <a 
                  href={profile.links.riyantech}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-70 transition-opacity flex items-center gap-4 group"
                >
                  Riyan Tech
                  <span className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all">→</span>
                </a>
              </li>
              {profile.links.email && (
                <li>
                  <a 
                    href={`mailto:${profile.links.email}`}
                    className="hover:opacity-70 transition-opacity flex items-center gap-4 group"
                  >
                    Email
                    <span className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all">→</span>
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

      </div>

      <div className="mt-32 pt-8 border-t border-[var(--foreground)]/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm opacity-50">
        <p>© {year} {profile.name}. All rights reserved.</p>
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="hover:opacity-100 transition-opacity"
        >
          Back to top ↑
        </button>
      </div>
    </section>
  );
}
