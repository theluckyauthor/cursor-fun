import type { PendingRequest } from "./types";

export function buildAgentPrompt(request: PendingRequest): string {
  return `Implement this Open Canvas request:

Contributor: ${request.name}
Idea: "${request.idea}"

Steps:
1. Read data/site-state.json
2. Update the canvas (add elements, change theme, etc.)
3. Bump version number
4. Add a timeline entry with the contributor's name and their idea
5. Add them to the contributors array
6. Remove this request (id: ${request.id}) from data/pending-requests.json
7. Commit and push`;
}
