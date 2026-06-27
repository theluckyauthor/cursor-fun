export type ExperienceId = "calculator" | "scene-3d" | "dice-roller";

export type ElementType =
  | "color"
  | "text"
  | "emoji"
  | "shape"
  | "pixel-snake"
  | "widget"
  | "experience";

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

export interface ContributorPrompt {
  idea: string;
  /** Operator- or agent-refined direction we actually built toward */
  refinedIdea?: string;
  /** Short name of what shipped (shown to the contributor) */
  shippedTitle?: string;
  /** Friendly note explaining what was created and how we interpreted their idea */
  shippedNote?: string;
  version?: number;
  signedAt: string;
}

export interface Contributor {
  name: string;
  contact?: string;
  prompts: ContributorPrompt[];
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
  contact?: string;
  idea: string;
  submittedAt: string;
  status: "pending" | "done";
}

export interface PendingRequestsFile {
  requests: PendingRequest[];
}

export interface SubmitterProfile {
  name: string;
  lastNotifiedVersion: number;
}
