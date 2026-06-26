/**
 * Shared toolkit for building Open Canvas experiences.
 * Import from here when shipping neal.fun toys, fake desktops, guestbooks, etc.
 */

export { cn } from "@/lib/cn";
export { fireConfetti, fireConfettiBurst, fireConfettiCannons } from "./confetti";
export { playSound, stopSound } from "./sound";

// Re-export common libraries so experiences use one import path
export { motion, AnimatePresence, useAnimation, useMotionValue } from "framer-motion";
export { default as Draggable } from "react-draggable";
export { create } from "zustand";
