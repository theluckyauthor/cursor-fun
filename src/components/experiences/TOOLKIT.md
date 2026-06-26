# Experience toolkit

Libraries installed for building interactive canvas experiences. Agents should prefer these over adding new dependencies.

| Library | Use for |
|---------|---------|
| **framer-motion** | Smooth animations, springs, enter/exit, draggable motion |
| **canvas-confetti** | Celebration bursts (`fireConfetti`, `fireConfettiBurst`) |
| **react-draggable** | Fake desktop windows, movable stickers |
| **lucide-react** | Icons (folder, x, minimize, star, etc.) |
| **zustand** | Lightweight state inside an experience |
| **howler** | Sound effects via `playSound("/sounds/pop.mp3")` |
| **clsx + tailwind-merge** | `cn()` for class names |
| **three + @react-three/fiber + @react-three/drei** | 3D scenes, WebGL toys |

## Quick start

```tsx
"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { cn, fireConfettiBurst, playSound } from "@/lib/toolkit";

export function MyToy() {
  return (
    <motion.button
      type="button"
      className={cn("rounded-xl bg-canvas-accent px-4 py-2 font-bold text-white")}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => {
        fireConfettiBurst();
        playSound("/sounds/pop.mp3");
      }}
    >
      <Star className="inline h-4 w-4" /> Click me
    </motion.button>
  );
}
```

## 3D experiences

Use `@react-three/fiber` — render a `<Canvas>` inside a fixed-size box. See `Scene3D.tsx` for a working spinning-cube reference. Keep 3D components `"use client"` (they use WebGL and browser APIs).

```tsx
"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

export function MyScene({ size = 280 }: { size?: number }) {
  return (
    <div style={{ width: size, height: size }}>
      <Canvas>
        <ambientLight />
        <mesh>
          <sphereGeometry />
          <meshStandardMaterial color="hotpink" />
        </mesh>
        <OrbitControls />
      </Canvas>
    </div>
  );
}
```

Heavy experiences (three.js, large libs) should be lazy-loaded with `next/dynamic` in `ExperienceRenderer.tsx` so they don't bloat the main canvas bundle. See how `scene-3d` is registered.

Drop sound files in `public/sounds/`. Register new experiences in `ExperienceRenderer.tsx`.
