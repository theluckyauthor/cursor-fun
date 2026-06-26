"use client";

import { useState } from "react";

interface CalculatorProps {
  width?: number;
}

export function Calculator({ width = 260 }: CalculatorProps) {
  const [display, setDisplay] = useState("0");
  const [stored, setStored] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [fresh, setFresh] = useState(true);

  function inputDigit(digit: string) {
    setDisplay((prev) => {
      if (fresh) return digit === "." ? "0." : digit;
      if (digit === "." && prev.includes(".")) return prev;
      return prev === "0" && digit !== "." ? digit : prev + digit;
    });
    setFresh(false);
  }

  function clear() {
    setDisplay("0");
    setStored(null);
    setOperator(null);
    setFresh(true);
  }

  function compute(a: number, b: number, op: string): number {
    switch (op) {
      case "+":
        return a + b;
      case "-":
        return a - b;
      case "×":
        return a * b;
      case "÷":
        return b === 0 ? NaN : a / b;
      default: {
        const _exhaustive: never = op as never;
        return _exhaustive;
      }
    }
  }

  function handleOperator(op: string) {
    const current = parseFloat(display);
    if (stored !== null && operator && !fresh) {
      const result = compute(stored, current, operator);
      setDisplay(Number.isNaN(result) ? "Error" : String(result));
      setStored(Number.isNaN(result) ? null : result);
    } else {
      setStored(current);
    }
    setOperator(op);
    setFresh(true);
  }

  function handleEquals() {
    if (stored === null || !operator) return;
    const current = parseFloat(display);
    const result = compute(stored, current, operator);
    setDisplay(Number.isNaN(result) ? "Error" : String(result));
    setStored(null);
    setOperator(null);
    setFresh(true);
  }

  const buttons = [
    ["C", "±", "%", "÷"],
    ["7", "8", "9", "×"],
    ["4", "5", "6", "-"],
    ["1", "2", "3", "+"],
    ["0", ".", "="],
  ] as const;

  function handleButton(label: string) {
    if (label === "C") {
      clear();
      return;
    }
    if (label === "±") {
      setDisplay((prev) =>
        prev === "0" || prev === "Error" ? prev : String(parseFloat(prev) * -1),
      );
      return;
    }
    if (label === "%") {
      setDisplay((prev) => String(parseFloat(prev) / 100));
      setFresh(false);
      return;
    }
    if (["+", "-", "×", "÷"].includes(label)) {
      handleOperator(label);
      return;
    }
    if (label === "=") {
      handleEquals();
      return;
    }
    inputDigit(label);
  }

  return (
    <div
      className="rounded-2xl border border-white/15 bg-canvas-surface/95 p-3 shadow-2xl backdrop-blur-sm"
      style={{ width }}
    >
      <div className="mb-2 rounded-xl bg-black/30 px-3 py-3 text-right font-mono text-2xl font-bold tabular-nums text-canvas-text">
        {display}
      </div>
      <div className="grid grid-cols-4 gap-1.5">
        {buttons.flatMap((row, rowIndex) =>
          row.map((label) => {
            const isOp = ["+", "-", "×", "÷", "="].includes(label);
            const isWide = label === "0";
            return (
              <button
                key={`${rowIndex}-${label}`}
                type="button"
                onClick={() => handleButton(label)}
                className={`rounded-xl py-2.5 text-sm font-bold transition active:scale-95 ${
                  isWide ? "col-span-2" : ""
                } ${
                  isOp
                    ? "bg-canvas-accent text-white hover:brightness-110"
                    : label === "C"
                      ? "bg-red-500/20 text-red-300 hover:bg-red-500/30"
                      : "bg-white/10 text-canvas-text hover:bg-white/15"
                }`}
              >
                {label}
              </button>
            );
          }),
        )}
      </div>
    </div>
  );
}
