interface MarqueeProps {
  items: string[];
}

export function Marquee({ items }: MarqueeProps) {
  if (items.length === 0) return null;
  const loop = [...items, ...items];

  return (
    <div className="group relative overflow-hidden border-y border-white/10 bg-white/[0.03] py-2">
      <div className="flex w-max animate-marquee gap-8 whitespace-nowrap group-hover:[animation-play-state:paused]">
        {loop.map((item, i) => (
          <span key={i} className="text-sm text-canvas-muted">
            <span className="text-canvas-accent">✦</span> {item}
          </span>
        ))}
      </div>
    </div>
  );
}
