import Link from "next/link";

export const metadata = {
  title: "About — Open Canvas",
};

export default function AboutPage() {
  return (
    <div className="relative min-h-dvh overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 grain opacity-40"
        style={{
          background:
            "radial-gradient(ellipse at 70% 10%, #1a1230 0%, #0f0a1a 70%)",
        }}
      />
      <div className="relative mx-auto flex min-h-dvh max-w-2xl flex-col items-center justify-center px-6 text-center">
        <Link
          href="/"
          className="absolute left-6 top-6 text-sm text-canvas-muted transition hover:text-canvas-text"
        >
          ← back to the canvas
        </Link>

        <div className="animate-float text-7xl">🚧</div>
        <h1 className="mt-6 font-display text-4xl font-black tracking-tight sm:text-5xl">
          About me
        </h1>
        <p className="mt-4 text-lg text-canvas-muted">
          This page is a blank canvas too.
        </p>
        <p className="mt-2 max-w-md text-canvas-muted/80">
          Something is being built here. Check back soon — or scribble it into
          existence at the cafe.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-sm text-canvas-muted/60">
          <span className="animate-pulse-soft">✦</span>
          <span>more coming soon</span>
          <span className="animate-pulse-soft">✦</span>
        </div>
      </div>
    </div>
  );
}
