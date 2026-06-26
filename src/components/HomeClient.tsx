"use client";

import { useState } from "react";
import { Canvas } from "./Canvas";
import { ContributorWall } from "./ContributorWall";
import { QRShare } from "./QRShare";
import { RequestForm } from "./RequestForm";
import { Timeline } from "./Timeline";
import type { SiteState } from "@/lib/types";

interface HomeClientProps {
  state: SiteState;
  siteUrl: string;
}

type DrawerTab = "timeline" | "wall";

export function HomeClient({ state, siteUrl }: HomeClientProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState<DrawerTab>("timeline");
  const [formOpen, setFormOpen] = useState(false);

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="flex items-center justify-between gap-4 px-4 py-4 sm:px-8">
        <div>
          <h1 className="font-display text-xl font-extrabold tracking-tight sm:text-2xl">
            {state.title}
          </h1>
          <p className="text-sm text-canvas-muted">{state.tagline}</p>
        </div>
        <div className="relative flex items-center gap-3">
          <span className="hidden rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-canvas-muted sm:inline">
            v{state.version}
          </span>
          <QRShare url={siteUrl} />
        </div>
      </header>

      <main className="flex flex-1 flex-col gap-4 px-4 pb-28 sm:px-8">
        <Canvas
          elements={state.elements}
          background={state.theme.background}
          backgroundSecondary={state.theme.backgroundSecondary}
        />

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setDrawerTab("timeline");
              setDrawerOpen(true);
            }}
            className="flex-1 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-medium transition hover:bg-white/8"
          >
            Timeline
          </button>
          <button
            type="button"
            onClick={() => {
              setDrawerTab("wall");
              setDrawerOpen(true);
            }}
            className="flex-1 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-medium transition hover:bg-white/8"
          >
            Wall of Names
          </button>
        </div>
      </main>

      <button
        type="button"
        onClick={() => setFormOpen(true)}
        className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 rounded-full bg-gradient-to-r from-canvas-accent to-canvas-accent-2 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-canvas-accent/25 transition hover:brightness-110 active:scale-95"
      >
        ✨ Suggest something
      </button>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm">
          <div className="drawer-enter max-h-[75vh] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-white/10 bg-canvas-surface">
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
                  onClick={() => setDrawerTab("wall")}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                    drawerTab === "wall"
                      ? "bg-canvas-accent/20 text-canvas-accent"
                      : "text-canvas-muted hover:text-canvas-text"
                  }`}
                >
                  Wall
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
                <ContributorWall contributors={state.contributors} />
              )}
            </div>
          </div>
        </div>
      )}

      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center">
          <div className="drawer-enter w-full max-w-md rounded-t-2xl border border-white/10 bg-canvas-surface sm:rounded-2xl">
            <RequestForm onClose={() => setFormOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
