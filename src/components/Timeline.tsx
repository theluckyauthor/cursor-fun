import type { TimelineEntry } from "@/lib/types";

interface TimelineProps {
  entries: TimelineEntry[];
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function Timeline({ entries }: TimelineProps) {
  const sorted = [...entries].sort((a, b) => b.version - a.version);

  return (
    <div className="space-y-4">
      {sorted.map((entry, i) => (
        <div key={entry.version} className="relative flex gap-4">
          {i < sorted.length - 1 && (
            <div className="absolute left-[15px] top-8 h-[calc(100%+8px)] w-px bg-white/10" />
          )}
          <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-canvas-accent/20 text-xs font-bold text-canvas-accent ring-2 ring-canvas-accent/30">
            v{entry.version}
          </div>
          <div className="min-w-0 flex-1 pb-2">
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="font-display text-sm font-bold">{entry.title}</h3>
              <time className="shrink-0 text-xs text-canvas-muted">
                {formatTime(entry.timestamp)}
              </time>
            </div>
            <p className="mt-1 text-sm text-canvas-muted">{entry.description}</p>
            {entry.request && (
              <p className="mt-2 rounded-lg bg-white/5 px-3 py-2 text-sm italic text-canvas-text/80">
                &ldquo;{entry.request}&rdquo;
                {entry.contributor && (
                  <span className="not-italic text-canvas-muted">
                    {" "}
                    — {entry.contributor}
                  </span>
                )}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
