import type { WidgetId } from "@/lib/types";
import { Calculator } from "./Calculator";

const WIDGET_IDS: WidgetId[] = ["calculator"];

function parseWidgetId(content: string): WidgetId | null {
  return WIDGET_IDS.includes(content as WidgetId)
    ? (content as WidgetId)
    : null;
}

interface WidgetRendererProps {
  widgetId: string;
  size?: number;
}

export function WidgetRenderer({ widgetId, size }: WidgetRendererProps) {
  const parsed = parseWidgetId(widgetId);
  if (!parsed) {
    return (
      <div className="rounded-xl border border-dashed border-white/20 px-4 py-3 text-sm text-canvas-muted">
        Unknown widget: {widgetId}
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
