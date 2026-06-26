import type { ExperienceId } from "@/lib/types";
import { Calculator } from "./Calculator";

const EXPERIENCE_IDS: ExperienceId[] = ["calculator"];

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
    default: {
      const _exhaustive: never = parsed;
      return _exhaustive;
    }
  }
}
