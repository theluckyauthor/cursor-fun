"use client";

import { useState } from "react";

interface RequestFormProps {
  onClose: () => void;
}

export function RequestForm({ onClose }: RequestFormProps) {
  const [name, setName] = useState("");
  const [idea, setIdea] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !idea.trim()) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), idea: idea.trim() }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "Something went wrong");
      }

      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Failed to submit");
    }
  }

  if (status === "success") {
    return (
      <div className="p-6 text-center">
        <div className="text-5xl">🎉</div>
        <h3 className="mt-4 font-display text-xl font-bold">Got it!</h3>
        <p className="mt-2 text-canvas-muted">
          <span className="font-semibold text-canvas-text">{name}</span>
          &rsquo;s idea is in the queue. Watch the canvas evolve!
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 rounded-full bg-canvas-accent px-6 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
        >
          Back to canvas
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <h3 className="font-display text-xl font-bold">Suggest something</h3>
      <p className="mt-1 text-sm text-canvas-muted">
        What should we add to the canvas?
      </p>

      <label className="mt-5 block">
        <span className="text-sm font-medium text-canvas-muted">Your name</span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Alex"
          maxLength={40}
          required
          className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-canvas-text placeholder:text-canvas-muted/50 outline-none focus:border-canvas-accent/50 focus:ring-1 focus:ring-canvas-accent/30"
        />
      </label>

      <label className="mt-4 block">
        <span className="text-sm font-medium text-canvas-muted">Your idea</span>
        <textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="Add a dancing cat, make it sunset colors..."
          maxLength={280}
          required
          rows={3}
          className="mt-1.5 w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-canvas-text placeholder:text-canvas-muted/50 outline-none focus:border-canvas-accent/50 focus:ring-1 focus:ring-canvas-accent/30"
        />
      </label>

      {status === "error" && (
        <p className="mt-3 text-sm text-red-400">{errorMsg}</p>
      )}

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 rounded-full border border-white/15 py-2.5 text-sm font-medium transition hover:bg-white/5"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={status === "loading" || !name.trim() || !idea.trim()}
          className="flex-1 rounded-full bg-canvas-accent py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-50"
        >
          {status === "loading" ? "Sending..." : "Submit idea"}
        </button>
      </div>
    </form>
  );
}
