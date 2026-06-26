import type { CanvasElement, ElementType } from "@/lib/types";
import { ExperienceRenderer } from "./experiences/ExperienceRenderer";

const animationClass: Record<
  NonNullable<CanvasElement["animation"]>,
  string
> = {
  float: "animate-float",
  bounce: "animate-bounce-soft",
  spin: "animate-spin-slow",
  pulse: "animate-pulse-soft",
  none: "",
};

interface CanvasProps {
  elements: CanvasElement[];
  background: string;
  backgroundSecondary: string;
}

/** Retro snake body as [col, row] on a pixel grid */
const SNAKE_BODY: [number, number][] = [
  [2, 1],
  [3, 1],
  [4, 1],
  [5, 1],
  [5, 2],
  [4, 3],
  [5, 3],
  [3, 4],
  [4, 4],
  [2, 5],
  [3, 5],
  [1, 6],
  [2, 6],
];

const SNAKE_HEAD: [number, number] = [5, 1];
const SNAKE_EYE: [number, number] = [4, 1];

function PixelSnake({ element }: { element: CanvasElement }) {
  const pixelSize = element.size ?? 10;
  const bodyColor = element.color ?? "#3dca6f";
  const headColor = "#2a9d5c";
  const eyeColor = "#1b1b22";
  const cols = 8;
  const rows = 8;

  return (
    <div
      className="grid"
      style={{
        gridTemplateColumns: `repeat(${cols}, ${pixelSize}px)`,
        gridTemplateRows: `repeat(${rows}, ${pixelSize}px)`,
        imageRendering: "pixelated",
      }}
      aria-label="Pixel snake"
    >
      {Array.from({ length: cols * rows }, (_, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const isHead = col === SNAKE_HEAD[0] && row === SNAKE_HEAD[1];
        const isEye = col === SNAKE_EYE[0] && row === SNAKE_EYE[1];
        const isBody = SNAKE_BODY.some(([c, r]) => c === col && r === row);

        if (!isBody) {
          return (
            <div
              key={`${col}-${row}`}
              style={{ width: pixelSize, height: pixelSize }}
            />
          );
        }

        return (
          <div
            key={`${col}-${row}`}
            style={{
              width: pixelSize,
              height: pixelSize,
              backgroundColor: isEye ? eyeColor : isHead ? headColor : bodyColor,
              boxShadow: isHead ? `0 0 ${pixelSize}px ${headColor}80` : undefined,
            }}
          />
        );
      })}
    </div>
  );
}

type VisibleElement = CanvasElement & { type: Exclude<ElementType, "color"> };

/**
 * Renders just the visual content of an element (no positioning), so it can be
 * placed on the absolute canvas or inside a gallery tile.
 */
export function CanvasElementView({ element }: { element: VisibleElement }) {
  switch (element.type) {
    case "text":
      return (
        <div
          className="max-w-[80%] text-center font-display font-bold leading-tight whitespace-pre-line"
          style={{
            fontSize: element.size ?? 24,
            color: element.color ?? "#f5f0ff",
          }}
        >
          {element.content}
        </div>
      );
    case "emoji":
      return (
        <div
          className="select-none"
          style={{ fontSize: element.size ?? 32 }}
          aria-hidden
        >
          {element.content}
        </div>
      );
    case "shape":
      return (
        <div
          className="rounded-full"
          style={{
            width: element.size ?? 24,
            height: element.size ?? 24,
            backgroundColor: element.color ?? "#ff6b9d",
            boxShadow: `0 0 ${(element.size ?? 24) / 2}px ${element.color ?? "#ff6b9d"}80`,
          }}
          aria-hidden
        />
      );
    case "pixel-snake":
      return <PixelSnake element={element} />;
    case "widget":
    case "experience":
      return (
        <ExperienceRenderer
          experienceId={element.content}
          size={element.size}
        />
      );
    default: {
      const _exhaustive: never = element.type;
      return _exhaustive;
    }
  }
}

export function toVisibleElements(elements: CanvasElement[]): VisibleElement[] {
  return elements.filter((e): e is VisibleElement => e.type !== "color");
}

function renderOnCanvas(element: VisibleElement) {
  const anim =
    element.animation && element.animation !== "none"
      ? animationClass[element.animation]
      : "";

  return (
    <div
      key={element.id}
      className={`absolute ${anim}`}
      style={{
        left: `${element.position?.x ?? 50}%`,
        top: `${element.position?.y ?? 50}%`,
        transform: "translate(-50%, -50%)",
        zIndex: element.zIndex,
      }}
    >
      <CanvasElementView element={element} />
    </div>
  );
}

export function Canvas({
  elements,
  background,
  backgroundSecondary,
}: CanvasProps) {
  const visibleElements = toVisibleElements(elements);

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{
        background: `radial-gradient(130% 120% at 50% 0%, ${backgroundSecondary} 0%, ${background} 72%)`,
      }}
    >
      {visibleElements.length === 0 && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <p className="font-display text-2xl font-bold text-canvas-text/20 sm:text-4xl">
            blank canvas
          </p>
        </div>
      )}
      {visibleElements.map(renderOnCanvas)}
    </div>
  );
}
