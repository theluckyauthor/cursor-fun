"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const POLL_INTERVAL_MS = 10_000;
const CONFIRM_VISIBLE_MS = 6_000;

interface LiveVersion {
  /** A version that was just auto-applied, for a brief confirmation toast */
  justShipped: number | null;
  /** Hide the confirmation toast */
  dismiss: () => void;
}

/**
 * Polls /api/version and, when a newer canvas version has deployed,
 * automatically refreshes the page content so visitors see live updates
 * without touching anything. Free — no sockets, just polling + router.refresh.
 */
export function useLiveVersion(currentVersion: number): LiveVersion {
  const router = useRouter();
  const [justShipped, setJustShipped] = useState<number | null>(null);
  const baseline = useRef(currentVersion);

  useEffect(() => {
    baseline.current = currentVersion;
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
          // Bump baseline immediately so we don't re-trigger before the
          // refreshed server props arrive.
          baseline.current = data.version;
          setJustShipped(data.version);
          router.refresh();
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
  }, [router]);

  useEffect(() => {
    if (justShipped === null) return;
    const id = setTimeout(() => setJustShipped(null), CONFIRM_VISIBLE_MS);
    return () => clearTimeout(id);
  }, [justShipped]);

  function dismiss() {
    setJustShipped(null);
  }

  return { justShipped, dismiss };
}
