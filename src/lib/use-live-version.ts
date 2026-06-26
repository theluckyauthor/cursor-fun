"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const POLL_INTERVAL_MS = 15_000;

interface LiveVersion {
  /** The newest version seen from the server, if it's ahead of the loaded one */
  newVersion: number | null;
  /** Re-fetch server components and clear the pending notice */
  applyUpdate: () => void;
  /** Dismiss the notice without refreshing */
  dismiss: () => void;
}

/**
 * Polls /api/version and surfaces when a newer canvas version has deployed,
 * so visitors can see live updates without a manual reload. Free — no sockets.
 */
export function useLiveVersion(currentVersion: number): LiveVersion {
  const router = useRouter();
  const [newVersion, setNewVersion] = useState<number | null>(null);
  const baseline = useRef(currentVersion);

  useEffect(() => {
    baseline.current = currentVersion;
    setNewVersion(null);
  }, [currentVersion]);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const res = await fetch("/api/version", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as { version?: number };
        if (
          !cancelled &&
          typeof data.version === "number" &&
          data.version > baseline.current
        ) {
          setNewVersion(data.version);
        }
      } catch {
        // network blips are fine — try again next tick
      }
    }

    const id = setInterval(poll, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  function applyUpdate() {
    setNewVersion(null);
    router.refresh();
  }

  function dismiss() {
    setNewVersion(null);
  }

  return { newVersion, applyUpdate, dismiss };
}
