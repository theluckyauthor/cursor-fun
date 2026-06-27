"use client";

interface LiveUpdateToastProps {
  version: number;
  onDismiss: () => void;
}

export function LiveUpdateToast({ version, onDismiss }: LiveUpdateToastProps) {
  return (
    <div className="fixed bottom-6 left-1/2 z-40 w-[min(92vw,22rem)] -translate-x-1/2">
      <div className="drawer-enter flex items-center gap-3 rounded-2xl border border-canvas-accent/40 bg-canvas-surface/95 px-4 py-3 shadow-2xl backdrop-blur-md">
        <span className="text-xl" aria-hidden>
          ✦
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-canvas-text">
            v{version} just shipped
          </p>
          <p className="text-xs text-canvas-muted">Canvas updated automatically.</p>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 rounded-full p-1.5 text-canvas-muted transition hover:bg-white/5 hover:text-canvas-text"
          aria-label="Dismiss"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
