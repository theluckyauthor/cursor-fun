import type { CanvasElement } from "@/lib/types";
import { CanvasElementView, toVisibleElements } from "./Canvas";

interface GalleryProps {
  elements: CanvasElement[];
}

const TYPE_LABEL: Record<string, string> = {
  text: "Text",
  emoji: "Emoji",
  shape: "Shape",
  "pixel-snake": "Pixel art",
  widget: "Experience",
  experience: "Experience",
};

export function Gallery({ elements }: GalleryProps) {
  const visible = toVisibleElements(elements);

  if (visible.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/15 px-6 py-12 text-center">
        <p className="text-4xl">🖼️</p>
        <p className="mt-3 font-display text-lg font-bold text-canvas-text/60">
          Nothing on the canvas yet
        </p>
        <p className="mt-1 text-sm text-canvas-muted">
          Submit an idea and it&rsquo;ll show up here, one tidy tile at a time.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {visible.map((element) => (
        <div
          key={element.id}
          className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]"
        >
          <div className="grid min-h-[180px] flex-1 place-items-center overflow-auto bg-[radial-gradient(120%_120%_at_50%_0%,rgba(255,255,255,0.06),transparent)] p-4">
            <CanvasElementView element={element} />
          </div>
          <div className="flex items-center justify-between gap-2 border-t border-white/10 px-3 py-2">
            <span className="truncate text-sm font-medium text-canvas-text">
              {element.label ?? (element.content || element.id)}
            </span>
            <span className="shrink-0 rounded-full bg-white/5 px-2 py-0.5 text-xs text-canvas-muted">
              {TYPE_LABEL[element.type] ?? element.type}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
