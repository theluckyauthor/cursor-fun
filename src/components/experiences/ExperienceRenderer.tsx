import type { ExperienceId } from "@/lib/types";
import dynamic from "next/dynamic";
import { Calculator } from "./Calculator";

const EXPERIENCE_IDS: ExperienceId[] = ["calculator", "scene-3d"];

// Heavy (three.js) — only loaded when a 3D experience is actually on the canvas
const Scene3D = dynamic(
  () => import("./Scene3D").then((m) => m.Scene3D),
  {
    ssr: false,
    loading: () => (
      <div className="grid h-[280px] w-[280px] place-items-center rounded-2xl border border-white/15 bg-canvas-surface/80 text-sm text-canvas-muted">
        Loading 3D…
      </div>
    ),
  },
);

function parseExperienceId(content: string): ExperienceId | null {
  return EXPERIENCE_IDS.includes(content as ExperienceId)
    ? (content as ExperienceId)
    : null;
}

interface ExperienceRendererProps {
  experienceId: string;
  size?: number;
}

export function ExperienceRenderer({
  experienceId,
  size,
}: ExperienceRendererProps) {
  const parsed = parseExperienceId(experienceId);
  if (!parsed) {
    return (
      <div className="rounded-xl border border-dashed border-white/20 px-4 py-3 text-sm text-canvas-muted">
        Unknown experience: {experienceId}
      </div>
    );
  }

  switch (parsed) {
    case "calculator":
      return <Calculator width={size ?? 260} />;
    case "scene-3d":
      return <Scene3D size={size ?? 280} />;
    default: {
      const _exhaustive: never = parsed;
      return _exhaustive;
    }
  }
}
