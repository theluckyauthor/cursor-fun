import type { CanvasElement, ElementType } from "@/lib/types";

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

function renderPixelSnake(
  element: CanvasElement,
  style: React.CSSProperties,
  anim: string,
) {
  const pixelSize = element.size ?? 10;
  const bodyColor = element.color ?? "#3dca6f";
  const headColor = "#2a9d5c";
  const eyeColor = "#1b1b22";
  const cols = 8;
  const rows = 8;

  return (
    <div
      key={element.id}
      className={`absolute ${anim}`}
      style={style}
      aria-label="Pixel snake"
    >
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${cols}, ${pixelSize}px)`,
          gridTemplateRows: `repeat(${rows}, ${pixelSize}px)`,
          imageRendering: "pixelated",
        }}
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
                boxShadow: isHead
                  ? `0 0 ${pixelSize}px ${headColor}80`
                  : undefined,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

function renderElement(element: CanvasElement) {
  const style: React.CSSProperties = {
    left: `${element.position?.x ?? 50}%`,
    top: `${element.position?.y ?? 50}%`,
    transform: "translate(-50%, -50%)",
  };

  const anim =
    element.animation && element.animation !== "none"
      ? animationClass[element.animation]
      : "";

  switch (element.type) {
    case "text":
      return (
        <div
          key={element.id}
          className={`absolute max-w-[80%] text-center font-display font-bold leading-tight whitespace-pre-line ${anim}`}
          style={{
            ...style,
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
          key={element.id}
          className={`absolute select-none ${anim}`}
          style={{
            ...style,
            fontSize: element.size ?? 32,
          }}
          aria-hidden
        >
          {element.content}
        </div>
      );
    case "shape":
      return (
        <div
          key={element.id}
          className={`absolute rounded-full ${anim}`}
          style={{
            ...style,
            width: element.size ?? 24,
            height: element.size ?? 24,
            backgroundColor: element.color ?? "#ff6b9d",
            boxShadow: `0 0 ${(element.size ?? 24) / 2}px ${element.color ?? "#ff6b9d"}80`,
          }}
          aria-hidden
        />
      );
    case "pixel-snake":
      return renderPixelSnake(element, style, anim);
    case "color":
      return null;
    default: {
      const _exhaustive: never = element.type as never;
      return _exhaustive;
    }
  }
}

export function Canvas({
  elements,
  background,
  backgroundSecondary,
}: CanvasProps) {
  const visibleElements = elements.filter(
    (e): e is CanvasElement & { type: Exclude<ElementType, "color"> } =>
      e.type !== "color",
  );

  return (
    <div
      className="relative min-h-[56vh] flex-1 overflow-hidden rounded-3xl ring-1 ring-black/5 shadow-[0_30px_90px_-24px_rgba(0,0,0,0.55)]"
      style={{
        background: `radial-gradient(130% 120% at 50% 0%, ${backgroundSecondary} 0%, ${background} 72%)`,
      }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.9), inset 0 0 1px rgba(0,0,0,0.04)",
        }}
      />
      {visibleElements.map(renderElement)}
    </div>
  );
}
