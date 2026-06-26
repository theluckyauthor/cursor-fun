"use client";

import { useEffect, useRef } from "react";

const SPARKLES = ["✦", "✧", "·", "✺"];
const COLORS = ["#6d5efc", "#9b86ff", "#f4f3f8"];

/**
 * Drops little fading sparkles behind the pointer. Skipped on touch / reduced
 * motion. Pure DOM nodes so it never blocks React renders.
 */
export function SparkleCursor() {
  const lastSpawn = useRef(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (reduce || !finePointer) return;

    function spawn(x: number, y: number) {
      const now = performance.now();
      if (now - lastSpawn.current < 40) return;
      lastSpawn.current = now;

      const el = document.createElement("span");
      el.textContent = SPARKLES[Math.floor(Math.random() * SPARKLES.length)];
      el.style.cssText = `position:fixed;left:${x}px;top:${y}px;pointer-events:none;z-index:9999;font-size:${
        10 + Math.random() * 12
      }px;color:${COLORS[Math.floor(Math.random() * COLORS.length)]};transform:translate(-50%,-50%);transition:transform .7s ease-out,opacity .7s ease-out;will-change:transform,opacity;`;
      document.body.appendChild(el);

      const dx = (Math.random() - 0.5) * 40;
      const dy = 20 + Math.random() * 30;
      requestAnimationFrame(() => {
        el.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) rotate(${
          (Math.random() - 0.5) * 90
        }deg)`;
        el.style.opacity = "0";
      });
      setTimeout(() => el.remove(), 750);
    }

    function onMove(e: MouseEvent) {
      spawn(e.clientX, e.clientY);
    }

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return null;
}
