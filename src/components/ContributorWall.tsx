import type { Contributor } from "@/lib/types";

interface ContributorWallProps {
  contributors: Contributor[];
}

export function ContributorWall({ contributors }: ContributorWallProps) {
  if (contributors.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-white/15 px-6 py-10 text-center">
        <p className="font-display text-lg font-bold text-canvas-text/60">
          No signatures yet
        </p>
        <p className="mt-2 text-sm text-canvas-muted">
          Be the first to shape the canvas!
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {contributors.map((c, i) => (
        <div
          key={`${c.name}-${c.signedAt}-${i}`}
          className="group rounded-xl border border-white/10 bg-white/5 p-4 transition hover:border-canvas-accent/30 hover:bg-white/8"
        >
          <p
            className="font-display text-xl font-bold text-canvas-accent"
            style={{
              fontFamily: "cursive",
              transform: `rotate(${((i % 5) - 2) * 1.5}deg)`,
            }}
          >
            {c.name}
          </p>
          <p className="mt-2 text-sm text-canvas-muted">
            &ldquo;{c.request}&rdquo;
          </p>
        </div>
      ))}
    </div>
  );
}
