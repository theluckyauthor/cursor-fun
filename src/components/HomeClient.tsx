"use client";

import { useState } from "react";
import { Canvas } from "./Canvas";
import { Contributors } from "./Contributors";
import { Marquee } from "./Marquee";
import { QRShare } from "./QRShare";
import { RequestForm } from "./RequestForm";
import { SparkleCursor } from "./SparkleCursor";
import { Timeline } from "./Timeline";
import Link from "next/link";
import type { SiteState } from "@/lib/types";

interface HomeClientProps {
  state: SiteState;
  siteUrl: string;
}

type DrawerTab = "timeline" | "contributors";

export function HomeClient({ state, siteUrl }: HomeClientProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState<DrawerTab>("timeline");
  const [formOpen, setFormOpen] = useState(false);

  const ideaCount = state.contributors.reduce(
    (sum, c) => sum + c.prompts.length,
    0,
  );
  const recentIdeas = state.timeline
    .filter((t) => t.request)
    .sort((a, b) => b.version - a.version)
    .map((t) => (t.contributor ? `${t.request} — ${t.contributor}` : t.request!))
    .slice(0, 12);

  function openDrawer(tab: DrawerTab) {
    setDrawerTab(tab);
    setDrawerOpen(true);
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <SparkleCursor />

      <header className="flex items-center justify-between gap-4 px-4 py-4 sm:px-8">
        <div>
          <h1 className="wobble-hover inline-block font-display text-2xl font-black tracking-tight sm:text-3xl">
            {state.title}
          </h1>
          <p className="text-sm text-canvas-muted">{state.tagline}</p>
        </div>
        <div className="relative flex items-center gap-3">
          <Link
            href="/about"
            className="hidden rounded-full border border-white/15 px-3 py-1.5 text-xs font-medium transition hover:bg-white/5 sm:inline"
          >
            About
          </Link>
          <span className="hidden rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-canvas-muted sm:inline">
            v{state.version}
          </span>
          <QRShare url={siteUrl} />
        </div>
      </header>

      {recentIdeas.length > 0 && <Marquee items={recentIdeas} />}

      <main className="flex flex-1 flex-col gap-4 px-4 pb-32 pt-4 sm:px-8">
        <Canvas
          elements={state.elements}
          background={state.theme.background}
          backgroundSecondary={state.theme.backgroundSecondary}
        />

        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-canvas-muted">
          <p>
            <span className="font-display text-lg font-black text-canvas-accent">
              {ideaCount}
            </span>{" "}
            {ideaCount === 1 ? "idea has" : "ideas have"} shaped this site
            {state.contributors.length > 0 && (
              <>
                {" "}
                from{" "}
                <span className="font-bold text-canvas-text">
                  {state.contributors.length}
                </span>{" "}
                {state.contributors.length === 1 ? "human" : "humans"}
              </>
            )}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          <button
            type="button"
            onClick={() => openDrawer("timeline")}
            className="rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-medium transition hover:-translate-y-0.5 hover:bg-white/10"
          >
            📜 Timeline
          </button>
          <button
            type="button"
            onClick={() => openDrawer("contributors")}
            className="rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-medium transition hover:-translate-y-0.5 hover:bg-white/10"
          >
            🪶 Contributors
          </button>
          <Link
            href="/about"
            className="col-span-2 rounded-xl border border-white/10 bg-white/5 py-3 text-center text-sm font-medium transition hover:-translate-y-0.5 hover:bg-white/10 sm:col-span-1"
          >
            👋 About
          </Link>
        </div>
      </main>

      <button
        type="button"
        onClick={() => setFormOpen(true)}
        className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 rounded-full bg-gradient-to-r from-canvas-accent to-canvas-accent-2 px-7 py-3.5 text-sm font-black text-white shadow-lg shadow-canvas-accent/30 transition hover:-translate-y-0.5 hover:shadow-xl active:scale-95"
      >
        ✦ Whisper an idea
      </button>

      {drawerOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setDrawerOpen(false)}
        >
          <div
            className="drawer-enter max-h-[78vh] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-white/10 bg-canvas-surface"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 flex items-center justify-between border-b border-white/10 bg-canvas-surface px-6 py-4">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setDrawerTab("timeline")}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                    drawerTab === "timeline"
                      ? "bg-canvas-accent/20 text-canvas-accent"
                      : "text-canvas-muted hover:text-canvas-text"
                  }`}
                >
                  Timeline
                </button>
                <button
                  type="button"
                  onClick={() => setDrawerTab("contributors")}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                    drawerTab === "contributors"
                      ? "bg-canvas-accent/20 text-canvas-accent"
                      : "text-canvas-muted hover:text-canvas-text"
                  }`}
                >
                  Contributors
                </button>
              </div>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="rounded-full p-2 text-canvas-muted transition hover:bg-white/5 hover:text-canvas-text"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              {drawerTab === "timeline" ? (
                <Timeline entries={state.timeline} />
              ) : (
                <Contributors contributors={state.contributors} />
              )}
            </div>
          </div>
        </div>
      )}

      {formOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center"
          onClick={() => setFormOpen(false)}
        >
          <div
            className="drawer-enter w-full max-w-md rounded-t-2xl border border-white/10 bg-canvas-surface sm:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <RequestForm onClose={() => setFormOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
