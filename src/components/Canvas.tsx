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
      className="relative min-h-[50vh] flex-1 overflow-hidden rounded-2xl border border-white/10 grain"
      style={{
        background: `radial-gradient(ellipse at 30% 20%, ${backgroundSecondary} 0%, ${background} 70%)`,
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(circle at 70% 80%, #7b5cff33 0%, transparent 50%)",
        }}
      />
      {visibleElements.map(renderElement)}
    </div>
  );
}
