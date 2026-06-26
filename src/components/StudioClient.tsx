"use client";

import { useEffect, useState } from "react";
import { buildAgentPrompt, buildNotifyMessage } from "@/lib/agent-prompt";
import type { Contributor, ContributorPrompt, PendingRequest, TimelineEntry } from "@/lib/types";

interface StudioClientProps {
  version: number;
  requests: PendingRequest[];
  siteUrl: string;
  contributors: Contributor[];
  timeline: TimelineEntry[];
}

const ADMIN_TOKEN_KEY = "open-canvas:admin-token";

function formatTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function StudioClient({
  version,
  requests,
  siteUrl,
  contributors,
  timeline,
}: StudioClientProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [notifyCopiedId, setNotifyCopiedId] = useState<string | null>(null);
  const [refinements, setRefinements] = useState<Record<string, string>>({});
  const [adminToken, setAdminToken] = useState("");
  const [confirmReset, setConfirmReset] = useState(false);
  const [resetState, setResetState] = useState<
    "idle" | "loading" | "done" | "error"
  >("idle");
  const [resetMsg, setResetMsg] = useState("");

  useEffect(() => {
    setAdminToken(window.localStorage.getItem(ADMIN_TOKEN_KEY) ?? "");
  }, []);

  async function copyPrompt(request: PendingRequest) {
    await navigator.clipboard.writeText(
      buildAgentPrompt(request, refinements[request.id]),
    );
    setCopiedId(request.id);
    setTimeout(() => setCopiedId(null), 2500);
  }

  async function copyNotify(
    request: PendingRequest,
    prompt: ContributorPrompt,
  ) {
    await navigator.clipboard.writeText(
      buildNotifyMessage(request, prompt, siteUrl),
    );
    const key = prompt.version != null ? `v${prompt.version}` : request.id;
    setNotifyCopiedId(key);
    setTimeout(() => setNotifyCopiedId(null), 2500);
  }

  async function handleReset() {
    setResetState("loading");
    setResetMsg("");
    window.localStorage.setItem(ADMIN_TOKEN_KEY, adminToken);

    try {
      const res = await fetch("/api/reset", {
        method: "POST",
        headers: { "x-admin-token": adminToken },
      });
      const data = (await res.json()) as { version?: number; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Reset failed");

      setResetState("done");
      setResetMsg(
        `Canvas reset to v${data.version}. Live site updates after the deploy (~60s).`,
      );
      setConfirmReset(false);
    } catch (err) {
      setResetState("error");
      setResetMsg(err instanceof Error ? err.message : "Reset failed");
    }
  }

  const sorted = [...requests].sort(
    (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
  );

  const recentShipments = [...timeline]
    .filter((t) => t.contributor && t.request)
    .sort((a, b) => b.version - a.version)
    .slice(0, 8);

  function promptForShipment(entry: TimelineEntry): ContributorPrompt | undefined {
    if (!entry.contributor) return undefined;
    const contributor = contributors.find(
      (c) =>
        c.name.trim().toLowerCase() === entry.contributor!.trim().toLowerCase(),
    );
    return contributor?.prompts.find((p) => p.version === entry.version);
  }

  function notifyRequestFor(entry: TimelineEntry): PendingRequest {
    return {
      id: `shipped-${entry.version}`,
      name: entry.contributor!,
      idea: entry.request!,
      submittedAt: entry.timestamp,
      status: "done",
    };
  }

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
          <li>Someone submits a rough idea (neal.fun, desktop, myspace — anything)</li>
          <li>Talk it through — add a refined direction below if helpful</li>
          <li>Tap &ldquo;Copy for Cursor&rdquo; and paste into Cloud Agent</li>
          <li>After deploy, copy the notify message to their contact</li>
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
                    {req.contact && (
                      <p className="text-xs text-canvas-accent-2">{req.contact}</p>
                    )}
                    <p className="mt-1 text-sm text-canvas-text">
                      &ldquo;{req.idea}&rdquo;
                    </p>
                    <time className="mt-2 block text-xs text-canvas-muted">
                      {formatTime(req.submittedAt)}
                    </time>
                  </div>
                </div>

                <label className="mt-3 block">
                  <span className="text-xs font-medium text-canvas-muted">
                    Refined direction (optional)
                  </span>
                  <textarea
                    value={refinements[req.id] ?? ""}
                    onChange={(e) =>
                      setRefinements((prev) => ({
                        ...prev,
                        [req.id]: e.target.value,
                      }))
                    }
                    placeholder="A neal.fun-style clicker with confetti, centered on the canvas..."
                    rows={2}
                    className="mt-1 w-full resize-none rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-canvas-text placeholder:text-canvas-muted/50 outline-none focus:border-canvas-accent/50"
                  />
                </label>

                <button
                  type="button"
                  onClick={() => copyPrompt(req)}
                  className="mt-3 w-full rounded-full bg-canvas-accent py-2.5 text-sm font-semibold text-white transition hover:brightness-110 active:scale-[0.98]"
                >
                  {copiedId === req.id
                    ? "Copied! Paste in Cursor →"
                    : "Copy for Cursor"}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {recentShipments.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 font-display text-lg font-bold">
            Shipped — notify them
          </h2>
          <p className="mb-3 text-sm text-canvas-muted">
            Copy a message to paste into their email or DM. Visitors also see an
            in-app banner when they return.
          </p>
          <div className="space-y-3">
            {recentShipments.map((entry) => {
              const prompt = promptForShipment(entry);
              const notifyKey = `v${entry.version}`;
              return (
                <div
                  key={entry.version}
                  className="rounded-xl border border-white/10 bg-canvas-surface p-4"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="font-display font-bold">{entry.contributor}</p>
                    <span className="text-xs text-canvas-muted">v{entry.version}</span>
                  </div>
                  <p className="mt-1 text-sm font-semibold text-canvas-accent">
                    {prompt?.shippedTitle ?? entry.title}
                  </p>
                  <p className="mt-1 text-sm text-canvas-muted">
                    &ldquo;{entry.request}&rdquo;
                  </p>
                  {prompt && (
                    <button
                      type="button"
                      onClick={() =>
                        copyNotify(notifyRequestFor(entry), prompt)
                      }
                      className="mt-3 w-full rounded-full border border-canvas-accent/40 py-2.5 text-sm font-semibold text-canvas-accent transition hover:bg-canvas-accent/10"
                    >
                      {notifyCopiedId === notifyKey
                        ? "Notify message copied!"
                        : "Copy notify message"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section className="mt-8 rounded-xl border border-red-500/20 bg-red-500/5 p-4">
        <h2 className="font-display text-sm font-bold text-red-300">
          Danger zone
        </h2>
        <p className="mt-1 text-sm text-canvas-muted">
          Clear the canvas back to a blank slate. Timeline history and
          contributors are kept.
        </p>

        <label className="mt-3 block">
          <span className="text-xs font-medium text-canvas-muted">
            Admin token
          </span>
          <input
            type="password"
            value={adminToken}
            onChange={(e) => setAdminToken(e.target.value)}
            placeholder="Set ADMIN_TOKEN in your env"
            className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-canvas-text placeholder:text-canvas-muted/50 outline-none focus:border-red-400/50"
          />
        </label>

        {!confirmReset ? (
          <button
            type="button"
            onClick={() => {
              setConfirmReset(true);
              setResetState("idle");
            }}
            className="mt-3 w-full rounded-full border border-red-500/40 py-2.5 text-sm font-semibold text-red-300 transition hover:bg-red-500/10"
          >
            Reset canvas
          </button>
        ) : (
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => setConfirmReset(false)}
              className="flex-1 rounded-full border border-white/15 py-2.5 text-sm font-medium transition hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleReset}
              disabled={resetState === "loading"}
              className="flex-1 rounded-full bg-red-500 py-2.5 text-sm font-bold text-white transition hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
            >
              {resetState === "loading" ? "Resetting…" : "Yes, clear it"}
            </button>
          </div>
        )}

        {resetMsg && (
          <p
            className={`mt-3 text-sm ${
              resetState === "error" ? "text-red-300" : "text-canvas-accent-2"
            }`}
          >
            {resetMsg}
          </p>
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
