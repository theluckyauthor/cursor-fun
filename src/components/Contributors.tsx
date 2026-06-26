"use client";

import { useState } from "react";
import type { Contributor } from "@/lib/types";

interface ContributorsProps {
  contributors: Contributor[];
}

const TILT = [-2, 1.5, -1, 2, -1.5, 1];

function ContactLink({ contact }: { contact: string }) {
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);
  const isUrl = /^https?:\/\//i.test(contact);
  const isHandle = contact.startsWith("@");

  if (isEmail) {
    return (
      <a
        href={`mailto:${contact}`}
        className="text-canvas-accent-2 underline decoration-dotted underline-offset-2 hover:text-canvas-accent"
      >
        {contact}
      </a>
    );
  }
  if (isUrl) {
    return (
      <a
        href={contact}
        target="_blank"
        rel="noreferrer"
        className="text-canvas-accent-2 underline decoration-dotted underline-offset-2 hover:text-canvas-accent"
      >
        {contact}
      </a>
    );
  }
  if (isHandle) {
    return (
      <a
        href={`https://x.com/${contact.slice(1)}`}
        target="_blank"
        rel="noreferrer"
        className="text-canvas-accent-2 underline decoration-dotted underline-offset-2 hover:text-canvas-accent"
      >
        {contact}
      </a>
    );
  }
  return <span className="text-canvas-muted">{contact}</span>;
}

function ContributorRow({
  contributor,
  index,
}: {
  contributor: Contributor;
  index: number;
}) {
  const [open, setOpen] = useState(false);
  const count = contributor.prompts.length;

  return (
    <li className="rounded-2xl border border-white/10 bg-white/[0.04] transition hover:border-canvas-accent/30">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left"
      >
        <span
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-canvas-accent/30 to-canvas-accent-2/30 font-display text-lg font-black"
          style={{ transform: `rotate(${TILT[index % TILT.length]}deg)` }}
        >
          {contributor.name.charAt(0).toUpperCase()}
        </span>
        <span className="min-w-0 flex-1">
          <span
            className="block truncate font-display text-lg font-bold"
            style={{ transform: `rotate(${TILT[index % TILT.length] / 2}deg)` }}
          >
            {contributor.name}
          </span>
          {contributor.contact && (
            <span className="block truncate text-xs">
              <ContactLink contact={contributor.contact} />
            </span>
          )}
        </span>
        <span className="shrink-0 rounded-full bg-canvas-accent/15 px-2.5 py-1 text-xs font-bold text-canvas-accent">
          {count} {count === 1 ? "idea" : "ideas"}
        </span>
        <span
          className={`shrink-0 text-canvas-muted transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        >
          ▾
        </span>
      </button>

      {open && (
        <ul className="space-y-2 border-t border-white/10 px-4 py-3">
          {contributor.prompts.map((p, i) => (
            <li
              key={`${p.signedAt}-${i}`}
              className="rounded-xl bg-white/5 px-3 py-2.5 text-sm"
            >
              <p className="text-canvas-text/90">&ldquo;{p.idea}&rdquo;</p>
              {p.shippedTitle && (
                <p className="mt-1.5 font-display font-bold text-canvas-accent">
                  → {p.shippedTitle}
                </p>
              )}
              {p.shippedNote && (
                <p className="mt-1 text-canvas-muted">{p.shippedNote}</p>
              )}
              {p.refinedIdea && p.refinedIdea !== p.idea && (
                <p className="mt-1 text-xs text-canvas-muted/70">
                  Refined to: {p.refinedIdea}
                </p>
              )}
              {p.version != null && (
                <p className="mt-1 text-xs text-canvas-muted">
                  Shipped in v{p.version}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

export function Contributors({ contributors }: ContributorsProps) {
  if (contributors.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/15 px-6 py-12 text-center">
        <p className="text-4xl">🪶</p>
        <p className="mt-3 font-display text-lg font-bold text-canvas-text/60">
          No signatures yet
        </p>
        <p className="mt-1 text-sm text-canvas-muted">
          Be the first to leave your mark on the canvas.
        </p>
      </div>
    );
  }

  const sorted = [...contributors].sort(
    (a, b) => b.prompts.length - a.prompts.length,
  );

  return (
    <ul className="space-y-3">
      {sorted.map((c, i) => (
        <ContributorRow key={`${c.name}-${i}`} contributor={c} index={i} />
      ))}
    </ul>
  );
}
