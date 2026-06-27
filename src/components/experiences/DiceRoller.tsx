"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { Dices, Minus, Plus } from "lucide-react";
import {
  AnimatePresence,
  cn,
  fireConfettiBurst,
  fireConfettiCannons,
  motion,
} from "@/lib/toolkit";

const MIN_DICE = 1;
const MAX_DICE = 5;

/** Pip layout per face value — positions on a 3x3 grid (0–8, left→right, top→bottom). */
const PIP_LAYOUT: Record<number, number[]> = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

function rollValue(): number {
  return Math.floor(Math.random() * 6) + 1;
}

interface DieFaceProps {
  value: number;
  rolling: boolean;
  pixel: number;
}

function DieFace({ value, rolling, pixel }: DieFaceProps) {
  const litPips = PIP_LAYOUT[value] ?? PIP_LAYOUT[1];

  return (
    <motion.div
      className="grid place-items-center rounded-2xl bg-white shadow-lg ring-1 ring-black/10"
      style={{ width: pixel, height: pixel }}
      animate={
        rolling
          ? { rotate: [0, -18, 16, -10, 0], scale: [1, 1.08, 0.96, 1.04, 1] }
          : { rotate: 0, scale: 1 }
      }
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <div
        className="grid h-[78%] w-[78%] grid-cols-3 grid-rows-3 gap-[6%]"
        aria-hidden
      >
        {Array.from({ length: 9 }, (_, i) => (
          <span
            key={i}
            className={cn(
              "self-center justify-self-center rounded-full",
              litPips.includes(i) ? "bg-neutral-900" : "bg-transparent",
            )}
            style={{ width: "70%", height: "70%" }}
          />
        ))}
      </div>
    </motion.div>
  );
}

interface DiceRollerProps {
  size?: number;
}

export function DiceRoller({ size = 280 }: DiceRollerProps) {
  const [count, setCount] = useState(2);
  const [values, setValues] = useState<number[]>(() => [
    rollValue(),
    rollValue(),
  ]);
  const [rolling, setRolling] = useState(false);
  const [lastTotal, setLastTotal] = useState<number | null>(null);
  const [streakNote, setStreakNote] = useState<string | null>(null);
  const tumbleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const total = useMemo(() => values.reduce((a, b) => a + b, 0), [values]);
  const diePixel = Math.max(
    36,
    Math.min(72, Math.floor((size - 48) / Math.max(count, 3)) - 8),
  );

  const roll = useCallback(() => {
    if (rolling) return;
    setRolling(true);
    setStreakNote(null);

    // Quick shuffle so the dice visibly "tumble" before settling.
    const shuffle = setInterval(() => {
      setValues((prev) => prev.map(() => rollValue()));
    }, 80);

    tumbleTimer.current = setTimeout(() => {
      clearInterval(shuffle);
      const final = Array.from({ length: count }, () => rollValue());
      setValues(final);
      setRolling(false);

      const sum = final.reduce((a, b) => a + b, 0);
      setLastTotal(sum);

      const allMax = final.every((v) => v === 6);
      const allSame = final.length > 1 && final.every((v) => v === final[0]);

      if (allMax) {
        fireConfettiCannons();
        setStreakNote("MAX ROLL! 🎉");
      } else if (allSame) {
        fireConfettiBurst();
        setStreakNote(`Snake doubles — all ${final[0]}s!`);
      }
    }, 650);
  }, [count, rolling]);

  function changeCount(delta: number) {
    if (rolling) return;
    setCount((prev) => {
      const next = Math.min(MAX_DICE, Math.max(MIN_DICE, prev + delta));
      setValues((current) => {
        if (next > current.length) {
          return [
            ...current,
            ...Array.from({ length: next - current.length }, () => rollValue()),
          ];
        }
        return current.slice(0, next);
      });
      return next;
    });
    setStreakNote(null);
  }

  return (
    <div
      className="flex select-none flex-col gap-3 rounded-3xl border border-white/15 bg-canvas-surface/95 p-4 shadow-2xl backdrop-blur-sm"
      style={{ width: size }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-display text-sm font-bold text-canvas-text">
          <Dices className="h-4 w-4 text-canvas-accent" />
          Dice Roller
        </div>
        <div className="flex items-center gap-1 rounded-full bg-white/10 p-1">
          <button
            type="button"
            aria-label="Remove a die"
            onClick={() => changeCount(-1)}
            disabled={rolling || count <= MIN_DICE}
            className="grid h-6 w-6 place-items-center rounded-full text-canvas-text transition hover:bg-white/15 disabled:opacity-30"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="w-5 text-center text-sm font-bold tabular-nums text-canvas-text">
            {count}
          </span>
          <button
            type="button"
            aria-label="Add a die"
            onClick={() => changeCount(1)}
            disabled={rolling || count >= MAX_DICE}
            className="grid h-6 w-6 place-items-center rounded-full text-canvas-text transition hover:bg-white/15 disabled:opacity-30"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="grid min-h-[80px] place-items-center rounded-2xl bg-black/20 p-3">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {values.map((value, i) => (
            <DieFace
              key={i}
              value={value}
              rolling={rolling}
              pixel={diePixel}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-canvas-muted">
            Total
          </span>
          <span className="font-mono text-3xl font-bold tabular-nums text-canvas-text">
            {rolling ? "··" : total}
          </span>
        </div>
        <motion.button
          type="button"
          onClick={roll}
          disabled={rolling}
          whileHover={{ scale: rolling ? 1 : 1.04 }}
          whileTap={{ scale: rolling ? 1 : 0.95 }}
          className="rounded-2xl bg-canvas-accent px-5 py-3 font-display text-sm font-bold text-white shadow-lg transition hover:brightness-110 disabled:opacity-70"
        >
          {rolling ? "Rolling…" : "Roll"}
        </motion.button>
      </div>

      <AnimatePresence mode="wait">
        {streakNote && (
          <motion.div
            key={streakNote}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="rounded-xl bg-canvas-accent/15 px-3 py-1.5 text-center text-xs font-bold text-canvas-accent"
          >
            {streakNote}
          </motion.div>
        )}
      </AnimatePresence>

      {lastTotal !== null && !streakNote && (
        <p className="text-center text-[11px] text-canvas-muted">
          Last roll landed on {lastTotal}. Tap Roll to tempt fate again.
        </p>
      )}
    </div>
  );
}
