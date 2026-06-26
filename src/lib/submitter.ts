import type { SubmitterProfile } from "./types";

const SUBMITTER_KEY = "open-canvas:submitter";

export function loadSubmitter(): SubmitterProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SUBMITTER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SubmitterProfile;
  } catch {
    return null;
  }
}

export function saveSubmitter(name: string): void {
  const existing = loadSubmitter();
  window.localStorage.setItem(
    SUBMITTER_KEY,
    JSON.stringify({
      name: name.trim(),
      lastNotifiedVersion: existing?.lastNotifiedVersion ?? 0,
    } satisfies SubmitterProfile),
  );
}

export function markNotified(version: number): void {
  const existing = loadSubmitter();
  if (!existing) return;
  window.localStorage.setItem(
    SUBMITTER_KEY,
    JSON.stringify({
      ...existing,
      lastNotifiedVersion: Math.max(existing.lastNotifiedVersion, version),
    } satisfies SubmitterProfile),
  );
}
