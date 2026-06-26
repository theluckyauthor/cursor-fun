import { Howl } from "howler";

const cache = new Map<string, Howl>();

/**
 * Play a short sound from /public/sounds/ or any URL.
 * Add mp3/ogg files under public/sounds/ as needed (e.g. pop.mp3, win.mp3).
 */
export function playSound(src: string, volume = 0.45) {
  if (typeof window === "undefined") return;

  let howl = cache.get(src);
  if (!howl) {
    howl = new Howl({ src: [src], volume });
    cache.set(src, howl);
  }

  howl.volume(volume);
  howl.play();
}

export function stopSound(src: string) {
  cache.get(src)?.stop();
}
