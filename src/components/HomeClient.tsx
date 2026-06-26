"use client";

import { useState } from "react";
import { Canvas } from "./Canvas";
import { Contributors } from "./Contributors";
import { QRShare } from "./QRShare";
import { RequestForm } from "./RequestForm";
import { ShippedBanner } from "./ShippedBanner";
import { SparkleCursor } from "./SparkleCursor";
import { Timeline } from "./Timeline";
import Link from "next/link";
import type { SiteState } from "@/lib/types";

interface HomeClientProps {
  state: SiteState;
  siteUrl: string;
}

type HeaderTab = "canvas" | "timeline" | "contributors";

const TABS: { id: HeaderTab; label: string }[] = [
  { id: "canvas", label: "Canvas" },
  { id: "timeline", label: "Timeline" },
  { id: "contributors", label: "Contributors" },
];

export function HomeClient({ state, siteUrl }: HomeClientProps) {
  const [activeTab, setActiveTab] = useState<HeaderTab>("canvas");
  const [formOpen, setFormOpen] = useState(false);

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <SparkleCursor />

      <header className="z-20 flex shrink-0 items-center gap-3 border-b border-white/10 bg-canvas-bg/90 px-3 py-2.5 backdrop-blur-md sm:gap-4 sm:px-5">
        <h1 className="shrink-0 font-display text-lg font-black tracking-tight sm:text-xl">
          {state.title}
        </h1>

        <nav
          className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto"
          aria-label="Site sections"
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition sm:px-4 sm:text-sm ${
                activeTab === tab.id
                  ? "bg-canvas-accent/20 text-canvas-accent"
                  : "text-canvas-muted hover:bg-white/5 hover:text-canvas-text"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <span className="hidden rounded-full bg-white/5 px-2 py-0.5 text-xs font-medium text-canvas-muted sm:inline">
            v{state.version}
          </span>
          <QRShare url={siteUrl} />
          <Link
            href="/about"
            className="hidden rounded-full border border-white/15 px-2.5 py-1 text-xs font-medium transition hover:bg-white/5 sm:inline"
          >
            About
          </Link>
        </div>
      </header>

      <main className="relative min-h-0 flex-1">
        {activeTab === "canvas" ? (
          <>
            <ShippedBanner
              contributors={state.contributors}
              onViewContributors={() => setActiveTab("contributors")}
            />
            <Canvas
              elements={state.elements}
              background={state.theme.background}
              backgroundSecondary={state.theme.backgroundSecondary}
            />
          </>
        ) : (
          <div className="h-full overflow-y-auto px-4 py-6 sm:px-8">
            {activeTab === "timeline" ? (
              <Timeline entries={state.timeline} />
            ) : (
              <Contributors contributors={state.contributors} />
            )}
          </div>
        )}

        {activeTab === "canvas" && (
          <button
            type="button"
            onClick={() => setFormOpen(true)}
            className="fixed bottom-6 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-canvas-accent to-canvas-accent-2 text-2xl font-black text-white shadow-lg shadow-canvas-accent/40 transition hover:scale-105 hover:shadow-xl active:scale-95"
            aria-label="Suggest an idea"
          >
            +
          </button>
        )}
      </main>

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
