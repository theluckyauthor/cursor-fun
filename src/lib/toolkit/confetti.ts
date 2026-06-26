import confetti, { type Options } from "canvas-confetti";

export function fireConfetti(options?: Options) {
  if (typeof window === "undefined") return;
  return confetti({
    origin: { y: 0.65 },
    ...options,
  });
}

/** Classic neal.fun-style celebration burst */
export function fireConfettiBurst() {
  fireConfetti({ particleCount: 140, spread: 80, startVelocity: 35 });
}

/** Side cannons — good for "you won" moments */
export function fireConfettiCannons() {
  if (typeof window === "undefined") return;
  const end = Date.now() + 800;

  (function frame() {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.65 },
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.65 },
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}
