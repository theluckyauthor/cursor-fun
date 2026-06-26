"use client";

import { useState } from "react";
import { buildAgentPrompt } from "@/lib/agent-prompt";
import type { PendingRequest } from "@/lib/types";

interface StudioClientProps {
  version: number;
  requests: PendingRequest[];
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function StudioClient({ version, requests }: StudioClientProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function copyPrompt(request: PendingRequest) {
    await navigator.clipboard.writeText(buildAgentPrompt(request));
    setCopiedId(request.id);
    setTimeout(() => setCopiedId(null), 2500);
  }

  const sorted = [...requests].sort(
    (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
  );

  return (
    <div className="min-h-dvh bg-canvas-bg px-4 py-6">
      <header className="mb-6">
        <p className="text-xs font-medium uppercase tracking-widest text-canvas-accent">
          Operator Studio
        </p>
        <h1 className="mt-1 font-display text-2xl font-extrabold">Open Canvas</h1>
        <p className="mt-1 text-sm text-canvas-muted">
          Current version: <span className="font-bold text-canvas-text">v{version}</span>
        </p>
      </header>

      <section className="mb-6 rounded-xl border border-white/10 bg-white/5 p-4">
        <h2 className="font-display text-sm font-bold">Cafe-day workflow</h2>
        <ol className="mt-2 list-inside list-decimal space-y-1 text-sm text-canvas-muted">
          <li>Someone submits an idea on the site</li>
          <li>Tap &ldquo;Copy for Cursor&rdquo; below</li>
          <li>Paste into Cursor Cloud Agent on your phone</li>
          <li>Wait ~60s for deploy — canvas updates!</li>
        </ol>
      </section>

      <section>
        <h2 className="mb-3 font-display text-lg font-bold">
          Pending requests
          <span className="ml-2 rounded-full bg-canvas-accent/20 px-2 py-0.5 text-sm text-canvas-accent">
            {sorted.length}
          </span>
        </h2>

        {sorted.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/15 px-6 py-12 text-center">
            <p className="text-4xl">☕</p>
            <p className="mt-3 font-display font-bold text-canvas-text/60">
              Queue is empty
            </p>
            <p className="mt-1 text-sm text-canvas-muted">
              Share the QR code and wait for ideas to roll in
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sorted.map((req) => (
              <div
                key={req.id}
                className="rounded-xl border border-white/10 bg-canvas-surface p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-display font-bold">{req.name}</p>
                    <p className="mt-1 text-sm text-canvas-text">
                      &ldquo;{req.idea}&rdquo;
                    </p>
                    <time className="mt-2 block text-xs text-canvas-muted">
                      {formatTime(req.submittedAt)}
                    </time>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => copyPrompt(req)}
                  className="mt-3 w-full rounded-full bg-canvas-accent py-2.5 text-sm font-semibold text-white transition hover:brightness-110 active:scale-[0.98]"
                >
                  {copiedId === req.id ? "Copied! Paste in Cursor →" : "Copy for Cursor"}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <footer className="mt-8 text-center">
        <a
          href="/"
          className="text-sm text-canvas-muted underline decoration-canvas-accent/50 underline-offset-2 hover:text-canvas-text"
        >
          View live canvas →
        </a>
      </footer>
    </div>
  );
}
