"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { profile } from "@/content/profile";

const doorColors: Record<string, [string, string]> = {
  web: ["#22304a", "#1c2840"],
  software: ["#4a3540", "#3f2d37"],
  uiux: ["#7a8670", "#66705d"],
  digital: ["#a4552c", "#8c4826"],
};

type Spring = { set: (target: number) => void };

function makeSpring(
  { tension, friction }: { tension: number; friction: number },
  render: (value: number) => void
): Spring {
  let x = 0;
  let v = 0;
  let target = 0;
  let raf = 0;
  const step = () => {
    const dt = 1 / 60;
    const a = tension * (target - x) - friction * v;
    v += a * dt;
    x += v * dt;
    render(x);
    if (Math.abs(target - x) < 0.001 && Math.abs(v) < 0.001) {
      x = target;
      v = 0;
      render(x);
      raf = 0;
      return;
    }
    raf = requestAnimationFrame(step);
  };
  render(0);
  return {
    set(next) {
      target = next;
      if (!raf) raf = requestAnimationFrame(step);
    },
  };
}

const doorStyles = `
.doors {
  position: relative;
  z-index: 1;
  margin-top: -2rem;
  padding-top: 7.25rem;
  overflow: hidden;
  background:
    linear-gradient(180deg, rgba(0, 0, 0, 0.05) 0%, transparent 22%, transparent 78%, rgba(0, 0, 0, 0.07) 100%),
    linear-gradient(180deg, var(--wall-hi, #e4dfdb) 0%, var(--wall, #dad4cf) 55%);
}
.dark .doors {
  --wall: #1f1c1c;
  --wall-hi: #262222;
  --casing: #3a3434;
  --base: #2f2a2a;
  --paint: #e8e4e0;
  --lamp: rgba(232, 214, 210, 0.06);
  --room: #050505;
  --room-sh: rgba(0, 0, 0, 0.85);
  --rim: rgba(214, 196, 196, 0.22);
  --lift: rgba(0, 0, 0, 0.7);
  --dinfo-accent: #d9c6c6;
  --btn-bg: #e8e4e0;
  --btn-fg: #1a1818;
}
.doors.lift { will-change: transform; }
.doors.through { overflow: visible; z-index: 60; }
.doors.through::before, .doors.through::after {
  content: ""; position: absolute; top: 0; bottom: 0; width: 55vw; pointer-events: none;
  background: linear-gradient(180deg, var(--wall-hi, #e4dfdb) 0%, var(--wall, #dad4cf) 55%);
}
.doors.through::before { right: 100%; }
.doors.through::after { left: 100%; }
.doors__wall {
  position: relative; display: flex; flex-direction: column; align-items: center;
  gap: 3.6rem; max-width: 84rem; margin-inline: auto; padding-inline: 1.5rem;
}
@media (min-width: 768px) { .doors__wall { padding-inline: 3.5rem; } }
.paint {
  position: relative; z-index: 3; pointer-events: none; margin: 0; text-align: center;
  font-weight: 700; letter-spacing: -0.03em; line-height: 0.95; color: var(--paint, #1a1818);
  font-size: 2.6rem; max-width: 14ch; text-wrap: balance; padding: 0.08em 0 0.14em;
}
@media (min-width: 640px) { .paint { font-size: 4rem; max-width: none; } }
@media (min-width: 1024px) { .paint { font-size: 4.75rem; } }
.doors__row {
  --gap: 1.5rem; position: relative; z-index: 2; display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr)); gap: var(--gap); align-items: end;
  width: 100%; list-style: none; margin: 0; padding: 0;
}
@media (min-width: 1024px) { .doors__row { --gap: 3rem; } }
.doors__row::after {
  content: ""; position: absolute; left: -50vw; right: -50vw; bottom: 0; height: 1.5rem; z-index: -1;
  background: linear-gradient(180deg, rgba(255,255,255,.55) 0, rgba(255,255,255,.55) 1px, rgba(0,0,0,.06) 2px, transparent 4px, transparent 7px, rgba(0,0,0,.05) 8px, rgba(255,255,255,.25) 9px, transparent 11px, rgba(0,0,0,.08) 100%), var(--base, #eae6e2);
  box-shadow: rgba(0,0,0,.07) 0 -1px 0, rgba(0,0,0,.16) 0 -0.5rem 0.9rem -0.45rem;
}
.dark .doors__row::after {
  background: linear-gradient(180deg, rgba(255,255,255,.06) 0, rgba(255,255,255,.06) 1px, rgba(0,0,0,.3) 2px, transparent 4px, transparent 7px, rgba(0,0,0,.25) 8px, transparent 11px, rgba(0,0,0,.3) 100%), var(--base, #2f2a2a);
  box-shadow: rgba(0,0,0,.4) 0 -1px 0, rgba(0,0,0,.5) 0 -0.5rem 0.9rem -0.45rem;
}
.unit {
  position: relative; container-type: inline-size; width: 100%;
  max-width: min(17.5rem, -8.66667rem + 0.444444 * 100svh); justify-self: center;
}
.unit::before {
  content: ""; position: absolute; left: -35%; right: -35%; top: -18%; height: 62%;
  pointer-events: none; z-index: -1;
  background: radial-gradient(50% 50% at 50% 30%, var(--lamp, rgba(255,250,242,.9)), transparent 100%);
  transition: opacity 0.5s;
}
.unit .doorway { transition: opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), filter 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
.doors.focus .unit:not(.on) .doorway { opacity: 0.03; filter: saturate(0.2); }
.doors.focus .unit:not(.on)::before { opacity: 0; }
.doorway {
  position: relative; display: block; width: 100%; aspect-ratio: 1 / 2.25; cursor: pointer;
  border-radius: 50cqi 50cqi 0 0 / 50cqi 50cqi 0 0;
}
@media (hover: hover) and (pointer: fine) { .doorway { cursor: none; } }
.casing {
  position: absolute; inset: 0; border-radius: 50cqi 50cqi 0 0 / 50cqi 50cqi 0 0;
  background: linear-gradient(90deg, rgba(0,0,0,.07), rgba(255,255,255,.18) 3cqi, transparent 6cqi, transparent calc(100% - 6cqi), rgba(0,0,0,.05) calc(100% - 3cqi), rgba(0,0,0,.12)), linear-gradient(180deg, rgba(255,255,255,.35), transparent 30%), var(--casing, #f2efec);
  box-shadow: rgba(255,255,255,.28) 0 0 0 1.1cqi inset, rgba(0,0,0,.07) 0 0 0 1.5cqi inset, rgba(255,255,255,.12) 0 0 0 3.6cqi inset, rgba(0,0,0,.08) 0 0 0 4.1cqi inset, rgba(0,0,0,.06) 0 0 0 1px, rgba(26,24,24,.2) 1.5cqi 2.5cqi 4.5cqi, rgba(26,24,24,.08) -0.5cqi 1cqi 3cqi;
  transition: box-shadow 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.dark .casing {
  background: linear-gradient(90deg, rgba(0,0,0,.25), rgba(255,255,255,.04) 3cqi, transparent 6cqi, transparent calc(100% - 6cqi), rgba(0,0,0,.3)), linear-gradient(180deg, rgba(255,255,255,.05), transparent 30%), var(--casing, #3a3434);
  box-shadow: rgba(255,255,255,.05) 0 0 0 1.1cqi inset, rgba(0,0,0,.25) 0 0 0 1.5cqi inset, rgba(255,255,255,.03) 0 0 0 3.6cqi inset, rgba(0,0,0,.22) 0 0 0 4.1cqi inset, rgba(0,0,0,.4) 0 0 0 1px, rgba(0,0,0,.6) 1.5cqi 2.5cqi 5cqi;
}
.casing::after {
  content: ""; position: absolute; inset: 4.6cqi 4.6cqi 0 4.6cqi;
  border-radius: 45.4cqi 45.4cqi 0 0 / 45.4cqi 45.4cqi 0 0;
  border-width: 0.45cqi 0.45cqi 0 0.45cqi; border-style: solid solid none; border-color: rgba(0,0,0,.07);
}
.dark .casing::after { border-color: rgba(255,255,255,.05); }
.opening { position: absolute; inset: 7.5cqi 7.5cqi 0 7.5cqi; perspective: 160cqi; perspective-origin: 50% 42%; }
.room {
  position: absolute; inset: 0; overflow: hidden; border-radius: 42.5cqi 42.5cqi 0 0 / 42.5cqi 42.5cqi 0 0;
  background: var(--room, #fbfaf8);
  box-shadow: inset 2cqi 0 4cqi var(--room-sh, rgba(26,24,24,.1)), inset 0 2cqi 4cqi var(--room-sh, rgba(26,24,24,.1));
}
.room::after {
  content: ""; position: absolute; inset: 0; pointer-events: none; opacity: 0;
  transition: opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: inset 0 0 5cqi var(--rim, rgba(255,255,255,.95)), inset 0 0 1.2cqi var(--rim, rgba(255,255,255,.95));
}
.door {
  --dc: var(--door); position: absolute; inset: 0; transform-origin: 0 50%; transform: rotateY(0deg);
  transform-style: preserve-3d; will-change: transform;
  border-radius: 42.5cqi 42.5cqi 0 0 / 42.5cqi 42.5cqi 0 0;
  background: linear-gradient(100deg, rgba(255,255,255,.1) 0%, rgba(255,255,255,0) 30%, rgba(0,0,0,.18) 100%), var(--dc);
  box-shadow: rgba(0,0,0,.28) 0 0 0 0.3cqi inset, rgba(255,255,255,.05) 0.6cqi 0 0 inset;
  transition: box-shadow 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.dark .door { --dc: var(--door-dk, var(--door)); }
.door::after {
  content: ""; position: absolute; top: 40cqi; bottom: 0; right: 0; width: 3.4cqi;
  transform-origin: 100% 50%; transform: rotateY(-90deg);
  background: linear-gradient(180deg, rgba(255,255,255,.08), rgba(0,0,0,.25)), var(--dc);
  filter: brightness(0.62); pointer-events: none;
}
.door__flute {
  position: absolute; inset: 8cqi 8cqi 9cqi 8cqi;
  border-radius: 34.5cqi 34.5cqi 1.2cqi 1.2cqi / 34.5cqi 34.5cqi 1.2cqi 1.2cqi;
  background: repeating-linear-gradient(90deg, rgba(255,255,255,.075) 0, rgba(255,255,255,.02) 1cqi, rgba(0,0,0,.13) 2.1cqi, rgba(255,255,255,.075) 2.8cqi);
  box-shadow: rgba(0,0,0,.16) 0 0 0 0.3cqi inset, rgba(0,0,0,.28) 1cqi 1.2cqi 2cqi inset, rgba(255,255,255,.07) -0.6cqi -0.6cqi 1cqi inset;
}
.door__shade {
  position: absolute; inset: 0; border-radius: inherit; background: #000;
  opacity: calc(var(--o, 0) * 0.5); pointer-events: none;
}
.unit.on .casing {
  box-shadow: 0 0 0 1px rgba(0,0,0,.06), 2cqi 5cqi 9cqi var(--lift, rgba(26,24,24,.3)), -1cqi 2cqi 5cqi rgba(0,0,0,.08), inset 0 1px 0 rgba(255,255,255,.55);
}
.unit.on .door {
  box-shadow: rgba(0,0,0,.2) 0 0 0 0.35cqi inset, rgba(0,0,0,.18) -2.5cqi 0 3cqi inset, rgba(0,0,0,.45) 4cqi 0 7cqi;
}
.unit.on .room::after { opacity: 1; }
.plate {
  position: absolute; left: 50%; top: 31%; translate: -50% -50%; width: 58cqi; padding: 2.6cqi 4cqi;
  border-radius: 0.9cqi; z-index: 1; text-align: center; font-size: 5.4cqi; font-weight: 600;
  line-height: 1.15; letter-spacing: 0.09em; text-transform: uppercase; text-wrap: balance;
  color: rgb(43, 33, 18);
  text-shadow: rgba(255,238,196,.55) 0 0.28cqi 0, rgba(0,0,0,.25) 0 -0.15cqi 0;
  background: linear-gradient(160deg, rgb(239,223,178) 0%, rgb(201,168,102) 28%, rgb(227,204,146) 48%, rgb(169,135,71) 72%, rgb(210,182,122) 100%);
  box-shadow: rgba(0,0,0,.4) 0 0.5cqi 1cqi, rgba(255,250,228,.7) 0 0.3cqi 0 inset, rgba(88,62,22,.45) 0 -0.3cqi 0 inset;
}
.plate::before, .plate::after {
  content: ""; position: absolute; top: 50%; width: 1.6cqi; height: 1.6cqi; margin-top: -0.8cqi;
  border-radius: 50%; background: radial-gradient(circle at 35% 35%, rgb(255,243,207), rgb(143,111,51) 70%);
  box-shadow: rgba(0,0,0,.4) 0 0.15cqi 0.2cqi;
}
.plate::before { left: 1.8cqi; }
.plate::after { right: 1.8cqi; }
.handle {
  position: absolute; right: 7cqi; top: 59%; width: 9.4cqi; height: 9.4cqi; border-radius: 50%; z-index: 1;
  background: radial-gradient(circle at 36% 30%, rgb(255,246,220) 0, rgb(230,203,138) 14%, rgb(184,147,76) 40%, rgb(128,96,42) 70%, rgb(77,56,22) 100%);
  box-shadow: rgba(0,0,0,.22) 0 0 0 0.35cqi, rgba(0,0,0,.45) 0.9cqi 1.5cqi 2cqi, rgba(40,26,6,.55) -0.7cqi -0.9cqi 1.1cqi inset, rgba(255,248,222,.5) 0.5cqi 0.6cqi 0.8cqi inset;
}
.handle::before {
  content: ""; position: absolute; inset: 2.3cqi; border-radius: 50%;
  background: radial-gradient(circle at 38% 32%, rgb(255,243,208), rgb(201,164,92) 45%, rgb(111,81,34) 100%);
  box-shadow: rgba(0,0,0,.45) 0.4cqi 0.7cqi 0.9cqi, rgba(255,240,200,.35) 0 0 0 0.2cqi inset;
}
.handle__lever {
  position: absolute; right: 3.6cqi; top: 2.75cqi; width: 23cqi; height: 3.9cqi;
  border-radius: 2.4cqi 1.6cqi 1.6cqi 2.4cqi; transform-origin: calc(100% - 1.9cqi) 50%;
  background: linear-gradient(rgb(255,245,214) 0%, rgb(236,211,149) 16%, rgb(195,157,85) 42%, rgb(142,106,45) 72%, rgb(92,65,25) 100%);
  box-shadow: rgba(0,0,0,.38) 0.3cqi 2.4cqi 2.2cqi, rgba(0,0,0,.25) 0 0.4cqi 0.4cqi, rgba(50,32,8,.45) 0 -0.3cqi 0.4cqi inset;
  transition: transform 0.18s cubic-bezier(0.3, 0.7, 0.4, 1);
}
.handle__lever::before {
  content: ""; position: absolute; left: -0.4cqi; top: -0.45cqi; width: 7cqi; height: 4.8cqi; border-radius: 2.4cqi;
  background: linear-gradient(rgb(255,245,214) 0%, rgb(232,205,140) 18%, rgb(191,152,80) 45%, rgb(134,99,42) 75%, rgb(92,65,25) 100%);
  box-shadow: rgba(0,0,0,.3) 0 0.5cqi 0.6cqi;
}
.handle__lever::after {
  content: ""; position: absolute; left: 1.4cqi; right: 2.6cqi; top: 0.55cqi; height: 0.55cqi; border-radius: 1cqi;
  background: linear-gradient(90deg, rgba(255,255,240,.95), rgba(255,250,225,.35));
}
.unit.press .handle__lever { transform: rotate(-32deg); }
.handle__lock {
  position: absolute; left: 50%; top: calc(100% + 6.5cqi); width: 5.4cqi; height: 10.5cqi;
  margin-left: -2.7cqi; border-radius: 2.7cqi;
  background: radial-gradient(at 38% 28%, rgb(255,243,208) 0, rgb(217,184,111) 22%, rgb(160,123,55) 55%, rgb(94,68,25) 100%);
  box-shadow: rgba(0,0,0,.2) 0 0 0 0.3cqi, rgba(0,0,0,.42) 0.6cqi 1cqi 1.4cqi, rgba(40,26,6,.5) -0.4cqi -0.6cqi 0.8cqi inset, rgba(255,248,222,.45) 0.3cqi 0.4cqi 0.5cqi inset;
}
.handle__lock::before {
  content: ""; position: absolute; left: 50%; top: 30%; width: 2cqi; height: 2cqi;
  margin-left: -1cqi; border-radius: 50%; background: rgb(20, 13, 4);
}
.handle__lock::after {
  content: ""; position: absolute; left: 50%; top: calc(30% + 1.3cqi); width: 1cqi; height: 3cqi;
  margin-left: -0.5cqi; border-radius: 0 0 0.3cqi 0.3cqi; background: rgb(20, 13, 4);
}
.sill {
  position: absolute; left: 3cqi; right: 3cqi; bottom: 0; height: 1cqi; z-index: 2; pointer-events: none;
  border-radius: 1cqi; background: rgba(255, 232, 186, 0.95); filter: blur(0.7cqi); opacity: 0.4;
  transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.dark .sill { opacity: 0.75; }
.unit.on .sill { opacity: 1; }
.dinfo {
  position: absolute; z-index: 3; pointer-events: none; opacity: 0; transform: translateY(0.6rem);
  transition: opacity 0.35s ease, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1); max-width: 22rem;
}
.dinfo.on {
  opacity: 1; transform: none;
  transition: opacity 0.45s ease 0.08s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.08s;
}
.dinfo__h {
  font-size: 2rem; font-weight: 600; line-height: 1.05; letter-spacing: -0.02em;
  color: var(--foreground); margin: 0 0 0.45rem;
}
.dinfo__t {
  font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace; font-size: 0.8125rem;
  font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--dinfo-accent, #6b4f4f); margin-bottom: 1.15rem;
}
.dinfo__p {
  display: flex; flex-direction: column; gap: 0.5rem; list-style: none; margin: 0; padding: 0;
  font-size: 1rem; font-weight: 450; line-height: 1.35; color: var(--foreground);
}
.dinfo__p li { display: flex; align-items: center; gap: 0.7rem; }
.dinfo.on .dinfo__p li { animation: liIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) backwards; }
.dinfo.on .dinfo__p li:nth-child(2) { animation-delay: 0.05s; }
.dinfo.on .dinfo__p li:nth-child(3) { animation-delay: 0.1s; }
.dinfo.on .dinfo__p li:nth-child(4) { animation-delay: 0.15s; }
.dinfo.on .dinfo__p li:nth-child(5) { animation-delay: 0.2s; }
.dinfo.on .dinfo__p li:nth-child(6) { animation-delay: 0.25s; }
@keyframes liIn { 0% { opacity: 0; transform: translateX(-0.5rem); } }
.door-cursor {
  position: fixed; left: 0; top: 0; z-index: 90; pointer-events: none; padding: 0.6rem 1rem;
  border-radius: 9999px; background: var(--btn-bg, #1a1818); color: var(--btn-fg, #e8e4e0);
  font-size: 0.8125rem; font-weight: 500; letter-spacing: 0.01em; white-space: nowrap;
  box-shadow: rgba(0,0,0,.45) 0 0.5rem 1.5rem -0.5rem; opacity: 0; transition: opacity 0.18s;
}
.door-cursor.on { opacity: 1; }
@media (max-width: 639.98px) {
  .doors__row { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .dinfo {
    position: relative; max-width: 100%; margin: 0.9rem 0 0; padding-top: 1rem;
    border-top: 1px solid rgba(26,24,24,.1); opacity: 1; transform: none;
    left: auto !important; top: auto !important; width: auto !important;
  }
}
`;

export function Doors() {
  const secRef = useRef<HTMLElement>(null);
  const wallRef = useRef<HTMLDivElement>(null);
  const dinfoRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const unitRefs = useRef<(HTMLLIElement | null)[]>([]);
  const wayRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const doorRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const openRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const springsRef = useRef<Spring[]>([]);
  const walkRafRef = useRef(0);
  const busyRef = useRef(false);
  const currentRef = useRef(0);
  const router = useRouter();
  const routerRef = useRef(router);
  routerRef.current = router;

  const [infoIndex, setInfoIndex] = useState(0);

  useEffect(() => {
    const sec = secRef.current;
    const wallEl = wallRef.current;
    const dinfo = dinfoRef.current;
    const badge = badgeRef.current;
    if (!sec || !wallEl || !dinfo || !badge) return;

    const units = unitRefs.current.filter((u): u is HTMLLIElement => u !== null);
    const ways = wayRefs.current.filter((w): w is HTMLButtonElement => w !== null);
    const ANG = 70;
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const mob = window.matchMedia("(max-width: 639.98px)");

    springsRef.current = units.map((u, i) => {
      const door = doorRefs.current[i];
      return makeSpring({ tension: 120, friction: 14 }, (o) => {
        const clamped = Math.max(0, o);
        if (door) door.style.transform = `rotateY(${clamped * ANG}deg)`;
        u.style.setProperty("--o", clamped.toFixed(4));
      });
    });

    let over = false;
    const placeBadge = (e: PointerEvent) => {
      badge.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
    };
    const showBadge = (on: boolean) => {
      over = on;
      badge.classList.toggle("on", on);
    };

    let active = -1;
    let token = 0;
    let px = -1;
    let py = -1;

    const show = (i: number) => {
      const my = ++token;
      units.forEach((u, k) => u.classList.toggle("on", k === i));
      sec.classList.add("focus");
      if (mob.matches) {
        setInfoIndex(i);
        dinfo.classList.add("on");
        return;
      }
      const wr = wallEl.getBoundingClientRect();
      const r = units[i].getBoundingClientRect();
      const toRight = i < 2 && units[i + 2];
      const a = toRight
        ? units[i + 1].getBoundingClientRect()
        : (units[i - 2] || units[i - 1]).getBoundingClientRect();
      const b = toRight
        ? units[i + 2].getBoundingClientRect()
        : units[i - 1].getBoundingClientRect();
      const left = Math.min(a.left, b.left);
      const right = Math.max(a.right, b.right);
      const place = () => {
        if (my !== token || active !== i) return;
        setInfoIndex(i);
        requestAnimationFrame(() => {
          if (my !== token || active !== i) return;
          const w = Math.min(right - left, 22 * 16);
          dinfo.style.width = `${w}px`;
          dinfo.style.left = `${left - wr.left + (right - left - w) / 2}px`;
          dinfo.style.top = `${r.top - wr.top + r.height * 0.5 - dinfo.offsetHeight / 2}px`;
          dinfo.classList.add("on");
        });
      };
      if (dinfo.classList.contains("on")) {
        dinfo.classList.remove("on");
        window.setTimeout(place, 130);
      } else {
        place();
      }
    };

    const hide = () => {
      token++;
      sec.classList.remove("focus");
      units.forEach((u) => u.classList.remove("on"));
      if (!mob.matches) dinfo.classList.remove("on");
    };

    const setHover = (i: number) => {
      if (busyRef.current) i = -1;
      if (i === active) return;
      active = i;
      if (i < 0) hide();
      else show(i);
    };

    const under = (el: EventTarget | Element | null) => {
      const node = el instanceof Element ? el : null;
      const w = node?.closest(".doorway");
      return w ? units.findIndex((u) => u.contains(w)) : -1;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (over) placeBadge(e);
      if (!canHover) return;
      px = e.clientX;
      py = e.clientY;
      setHover(under(e.target));
    };
    const onScroll = () => {
      if (canHover && px >= 0) setHover(under(document.elementFromPoint(px, py)));
    };
    const onLeaveDoc = () => setHover(-1);

    const enter = (i: number) => {
      if (busyRef.current) return;
      busyRef.current = true;
      currentRef.current = i;
      sec.classList.add("lift");
      showBadge(false);
      setHover(-1);
      springsRef.current.forEach((s, k) => {
        if (k !== i) s.set(0);
      });
      const u = units[i];
      u.classList.add("press");
      window.setTimeout(() => u.classList.remove("press"), 380);
      window.setTimeout(() => springsRef.current[i].set(1), 170);
      window.setTimeout(() => through(i), 760);
    };

    const through = (i: number) => {
      const r = openRefs.current[i]!.getBoundingClientRect();
      const dr = doorRefs.current[i]!.getBoundingClientRect();
      const gapL = Math.min(Math.max(dr.right, r.left), r.right - 6);
      const gw = Math.max(r.right - gapL, 10);
      const gh = r.height;
      const cx = (gapL + r.right) / 2;
      const cy = r.top + gh * 0.5;
      const sr = sec.getBoundingClientRect();
      sec.style.transformOrigin = `${cx - sr.left}px ${cy - sr.top}px`;
      sec.classList.add("through");
      const tx = window.innerWidth / 2 - cx;
      const ty = window.innerHeight / 2 - cy;
      const sEnd = Math.max(window.innerWidth / gw, window.innerHeight / gh) * 1.15;
      const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
      const zoomOf = (e: number) => Math.exp(Math.log(sEnd) * e);
      const t0 = performance.now();
      const D = 1500;
      let handed = false;
      const step = (now: number) => {
        const p = Math.min(1, (now - t0) / D);
        const e = ease(p);
        const sc = zoomOf(e);
        const f = Math.min(1, e * 1.6);
        sec.style.transform = `translate(${tx * f}px, ${ty * f}px) scale(${sc})`;
        if (!handed && (sc >= sEnd / 1.15 || p >= 1)) {
          handed = true;
          const id = profile.doors[i]?.id;
          if (id) routerRef.current.push(`/work/${id}`);
        }
        if (p < 1) walkRafRef.current = requestAnimationFrame(step);
      };
      walkRafRef.current = requestAnimationFrame(step);
    };

    const resetWall = () => {
      cancelAnimationFrame(walkRafRef.current);
      sec.style.transform = "";
      sec.classList.remove("through", "lift");
      sec.style.transformOrigin = "";
      springsRef.current.forEach((s) => s.set(0));
      busyRef.current = false;
    };

    const onPageShow = () => resetWall();
    window.addEventListener("pageshow", onPageShow);

    const cleanups: (() => void)[] = [];
    ways.forEach((w, i) => {
      const onPtrEnter = (e: PointerEvent) => {
        if (!canHover) return;
        placeBadge(e);
        if (!busyRef.current) showBadge(true);
      };
      const onPtrLeave = () => {
        if (canHover) showBadge(false);
      };
      const onMouseEnter = () => {
        if (canHover && !busyRef.current) springsRef.current[i].set(0.1);
      };
      const onMouseLeave = () => {
        if (canHover && !busyRef.current) springsRef.current[i].set(0);
      };
      const onFocus = () => {
        if (w.matches(":focus-visible")) {
          if (!busyRef.current) springsRef.current[i].set(0.1);
          setHover(i);
        }
      };
      const onBlur = () => {
        if (!busyRef.current) springsRef.current[i].set(0);
        if (px < 0 || under(document.elementFromPoint(px, py)) !== i) setHover(-1);
      };
      const onClick = () => enter(i);

      w.addEventListener("pointerenter", onPtrEnter);
      w.addEventListener("pointerleave", onPtrLeave);
      w.addEventListener("mouseenter", onMouseEnter);
      w.addEventListener("mouseleave", onMouseLeave);
      w.addEventListener("focus", onFocus);
      w.addEventListener("blur", onBlur);
      w.addEventListener("click", onClick);
      cleanups.push(() => {
        w.removeEventListener("pointerenter", onPtrEnter);
        w.removeEventListener("pointerleave", onPtrLeave);
        w.removeEventListener("mouseenter", onMouseEnter);
        w.removeEventListener("mouseleave", onMouseLeave);
        w.removeEventListener("focus", onFocus);
        w.removeEventListener("blur", onBlur);
        w.removeEventListener("click", onClick);
      });
    });

    const onOpenEvent = (event: Event) => {
      const id = (event as CustomEvent<string>).detail;
      const idx = profile.doors.findIndex((door) => door.id === id);
      if (idx < 0) return;
      sec.scrollIntoView({ behavior: "smooth" });
      window.setTimeout(() => enter(idx), 520);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeaveDoc);
    window.addEventListener("blur", onLeaveDoc);
    window.addEventListener("open-door", onOpenEvent);

    return () => {
      cleanups.forEach((fn) => fn());
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
      document.documentElement.removeEventListener("pointerleave", onLeaveDoc);
      window.removeEventListener("blur", onLeaveDoc);
      window.removeEventListener("open-door", onOpenEvent);
      window.removeEventListener("pageshow", onPageShow);
    };
  }, []);

  const infoDoor = profile.doors[infoIndex] ?? profile.doors[0];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: doorStyles }} />
      <section ref={secRef} id="work" className="doors in" aria-labelledby="doorsTitle">
        <div ref={wallRef} className="doors__wall">
          <h2 id="doorsTitle" className="sr-only">
            My work, one door per skill
          </h2>
          <p className="paint" aria-hidden="true">
            Magic happens behind the doors
          </p>

          <div ref={dinfoRef} className="dinfo" aria-live="polite">
            <h3 className="dinfo__h">{infoDoor.title}</h3>
            <p className="dinfo__t">{infoDoor.kicker}</p>
            <ul className="dinfo__p">
              {infoDoor.points.map((point) => (
                <li key={point}>
                  <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full border border-[var(--dinfo-accent)] text-[10px]">
                    ✓
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <ul className="doors__row">
            {profile.doors.map((door, index) => {
              const [c, dk] = doorColors[door.id] ?? ["#22304a", "#1c2840"];
              return (
                <li
                  key={door.id}
                  ref={(el) => {
                    unitRefs.current[index] = el;
                  }}
                  className="unit"
                  style={
                    {
                      "--i": index,
                      "--door": c,
                      "--door-dk": dk,
                      "--o": 0,
                    } as React.CSSProperties
                  }
                >
                  <button
                    ref={(el) => {
                      wayRefs.current[index] = el;
                    }}
                    type="button"
                    className="doorway"
                    aria-label={`Open the ${door.title} door`}
                    aria-description={`${door.kicker}: ${door.points.join(", ")}`}
                  >
                    <span className="casing" />
                    <span
                      ref={(el) => {
                        openRefs.current[index] = el;
                      }}
                      className="opening"
                    >
                      <span className="room" />
                      <span
                        ref={(el) => {
                          doorRefs.current[index] = el;
                        }}
                        className="door"
                      >
                        <span className="door__flute" />
                        <span className="plate">{door.plate}</span>
                        <span className="handle">
                          <span className="handle__lever" />
                          <span className="handle__lock" />
                        </span>
                        <span className="door__shade" />
                      </span>
                      <span className="sill" />
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <div ref={badgeRef} className="door-cursor" aria-hidden="true">
        Click to enter
      </div>
    </>
  );
}

