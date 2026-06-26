import type { CanvasElement, Theme } from "./types";

/**
 * The immaculate blank starting point. Used to seed the site and to reset the
 * canvas from the admin studio. Keep this in sync with data/site-state.json.
 */
export const DEFAULT_THEME: Theme = {
  background: "#f3f3f7",
  backgroundSecondary: "#ffffff",
  accent: "#6d5efc",
  text: "#1b1b22",
};

export const DEFAULT_ELEMENTS: CanvasElement[] = [
  {
    id: "tabula",
    type: "text",
    content: "A blank canvas",
    position: { x: 50, y: 45 },
    size: 40,
    color: "#1b1b22",
    animation: "none",
  },
  {
    id: "hint",
    type: "text",
    content: "what should appear first?",
    position: { x: 50, y: 57 },
    size: 16,
    color: "#8a8a96",
    animation: "pulse",
  },
  {
    id: "first-mark",
    type: "text",
    content: "✦",
    position: { x: 50, y: 70 },
    size: 20,
    color: "#6d5efc",
    animation: "float",
  },
];
