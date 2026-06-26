"use client";

import { useEffect, useState } from "react";

interface RequestFormProps {
  onClose: () => void;
}

const COOLDOWN_MS = 5 * 60 * 1000;
const COOLDOWN_KEY = "open-canvas:last-submit";

function remainingCooldown(): number {
  if (typeof window === "undefined") return 0;
  const last = Number(window.localStorage.getItem(COOLDOWN_KEY) ?? 0);
  if (!last) return 0;
  const elapsed = Date.now() - last;
  return elapsed >= COOLDOWN_MS ? 0 : COOLDOWN_MS - elapsed;
}

function formatCountdown(ms: number): string {
  const total = Math.ceil(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function RequestForm({ onClose }: RequestFormProps) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [idea, setIdea] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [errorMsg, setErrorMsg] = useState("");
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    setCooldown(remainingCooldown());
    const interval = setInterval(() => {
      const remaining = remainingCooldown();
      setCooldown(remaining);
      if (remaining === 0) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !idea.trim() || cooldown > 0) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          idea: idea.trim(),
          contact: contact.trim(),
        }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "Something went wrong");
      }

      window.localStorage.setItem(COOLDOWN_KEY, String(Date.now()));
      setCooldown(COOLDOWN_MS);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Failed to submit");
    }
  }

  if (status === "success") {
    return (
      <div className="p-6 text-center">
        <div className="animate-bounce-soft text-6xl">🎉</div>
        <h3 className="mt-4 font-display text-2xl font-black">It&rsquo;s in the jar!</h3>
        <p className="mt-2 text-canvas-muted">
          <span className="font-semibold text-canvas-text">{name}</span>
          &rsquo;s idea is bubbling in the queue. Keep an eye on the canvas&hellip;
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 rounded-full bg-canvas-accent px-6 py-2.5 text-sm font-bold text-white transition hover:brightness-110 active:scale-95"
        >
          Back to the canvas
        </button>
      </div>
    );
  }

  const onCooldown = cooldown > 0;

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <h3 className="font-display text-2xl font-black">Whisper an idea</h3>
      <p className="mt-1 text-sm text-canvas-muted">
        Anything goes — make it weird, make it yours.
      </p>

      <label className="mt-5 block">
        <span className="text-sm font-medium text-canvas-muted">Your name *</span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ada the Magnificent"
          maxLength={40}
          required
          className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-canvas-text placeholder:text-canvas-muted/50 outline-none focus:border-canvas-accent/50 focus:ring-1 focus:ring-canvas-accent/30"
        />
      </label>

      <label className="mt-4 block">
        <span className="text-sm font-medium text-canvas-muted">
          Contact <span className="text-canvas-muted/60">(optional — email, @handle, anything)</span>
        </span>
        <input
          type="text"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder="@ada / ada@cafe.dev"
          maxLength={80}
          className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-canvas-text placeholder:text-canvas-muted/50 outline-none focus:border-canvas-accent/50 focus:ring-1 focus:ring-canvas-accent/30"
        />
      </label>

      <label className="mt-4 block">
        <span className="text-sm font-medium text-canvas-muted">Your idea *</span>
        <textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="A cat that rains confetti when you tap it..."
          maxLength={280}
          required
          rows={3}
          className="mt-1.5 w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-canvas-text placeholder:text-canvas-muted/50 outline-none focus:border-canvas-accent/50 focus:ring-1 focus:ring-canvas-accent/30"
        />
      </label>

      {status === "error" && (
        <p className="mt-3 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {errorMsg}
        </p>
      )}

      {onCooldown && (
        <p className="mt-3 rounded-lg bg-canvas-accent/10 px-3 py-2 text-center text-sm text-canvas-accent">
          One idea at a time! Next whisper in{" "}
          <span className="font-mono font-bold tabular-nums">
            {formatCountdown(cooldown)}
          </span>
        </p>
      )}

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 rounded-full border border-white/15 py-2.5 text-sm font-medium transition hover:bg-white/5"
        >
          Maybe later
        </button>
        <button
          type="submit"
          disabled={
            status === "loading" || !name.trim() || !idea.trim() || onCooldown
          }
          className="flex-1 rounded-full bg-canvas-accent py-2.5 text-sm font-bold text-white transition hover:brightness-110 active:scale-95 disabled:opacity-40"
        >
          {status === "loading"
            ? "Sending..."
            : onCooldown
              ? "Cooling down…"
              : "Send it ✦"}
        </button>
      </div>
    </form>
  );
}
