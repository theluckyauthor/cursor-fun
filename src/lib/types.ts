export type ElementType = "color" | "text" | "emoji" | "shape";

export interface Position {
  x: number;
  y: number;
}

export interface CanvasElement {
  id: string;
  type: ElementType;
  content: string;
  position?: Position;
  size?: number;
  color?: string;
  animation?: "float" | "bounce" | "spin" | "pulse" | "none";
}

export interface Theme {
  background: string;
  backgroundSecondary: string;
  accent: string;
  text: string;
}

export interface TimelineEntry {
  version: number;
  title: string;
  description: string;
  request?: string;
  contributor?: string;
  timestamp: string;
}

export interface Contributor {
  name: string;
  request: string;
  signedAt: string;
}

export interface SiteState {
  version: number;
  title: string;
  tagline: string;
  theme: Theme;
  elements: CanvasElement[];
  timeline: TimelineEntry[];
  contributors: Contributor[];
}

export interface PendingRequest {
  id: string;
  name: string;
  idea: string;
  submittedAt: string;
  status: "pending" | "done";
}

export interface PendingRequestsFile {
  requests: PendingRequest[];
}
