"use client";

import { useEffect, useState } from "react";
import type { ContributorPrompt } from "@/lib/types";
import { findContributor, latestShippedPrompt } from "@/lib/agent-prompt";
import {
  loadSubmitter,
  markNotified,
} from "@/lib/submitter";
import type { Contributor } from "@/lib/types";

interface ShippedBannerProps {
  contributors: Contributor[];
  onViewContributors: () => void;
}

export function ShippedBanner({
  contributors,
  onViewContributors,
}: ShippedBannerProps) {
  const [shipment, setShipment] = useState<ContributorPrompt | null>(null);
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    const submitter = loadSubmitter();
    if (!submitter) return;

    const contributor = findContributor(contributors, submitter.name);
    if (!contributor) return;

    const latest = latestShippedPrompt(contributor);
    if (!latest?.version || latest.version <= submitter.lastNotifiedVersion) {
      return;
    }

    setName(submitter.name);
    setShipment(latest);
  }, [contributors]);

  if (!shipment || !name) return null;

  function dismiss() {
    if (shipment?.version) markNotified(shipment.version);
    setShipment(null);
  }

  return (
    <div className="absolute left-3 right-3 top-3 z-20 sm:left-5 sm:right-auto sm:max-w-md">
      <div className="rounded-2xl border border-canvas-accent/30 bg-canvas-surface/95 p-4 shadow-xl backdrop-blur-md">
        <p className="text-xs font-semibold uppercase tracking-widest text-canvas-accent">
          Your idea shipped
        </p>
        <p className="mt-1 font-display text-lg font-bold">
          Hey {name}!
        </p>
        <p className="mt-1 text-sm font-semibold text-canvas-text">
          {shipment.shippedTitle ?? "Something new is on the canvas"}
        </p>
        {shipment.shippedNote && (
          <p className="mt-1 text-sm text-canvas-muted">{shipment.shippedNote}</p>
        )}
        {shipment.idea && (
          <p className="mt-2 text-xs text-canvas-muted/80">
            You asked for &ldquo;{shipment.idea}&rdquo;
          </p>
        )}
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => {
              onViewContributors();
              dismiss();
            }}
            className="flex-1 rounded-full bg-canvas-accent py-2 text-xs font-bold text-white transition hover:brightness-110"
          >
            See what we built
          </button>
          <button
            type="button"
            onClick={dismiss}
            className="rounded-full border border-white/15 px-4 py-2 text-xs font-medium text-canvas-muted transition hover:bg-white/5"
          >
            Nice!
          </button>
        </div>
      </div>
    </div>
  );
}
