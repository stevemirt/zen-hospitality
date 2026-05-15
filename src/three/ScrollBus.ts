import { create } from "zustand";

type ScrollState = {
  progress: number; // 0..1 over cinematic section
  velocity: number; // -1..1 normalized
  act: "sky" | "arrival" | "residence" | "interior" | "ecosystem" | "partnership" | "after";
  setProgress: (p: number, v?: number) => void;
};

const ACT_BOUNDS: Array<[ScrollState["act"], number]> = [
  ["sky", 0.1],
  ["arrival", 0.28],
  ["residence", 0.48],
  ["interior", 0.68],
  ["ecosystem", 0.88],
  ["partnership", 1.0],
];

function progressToAct(p: number): ScrollState["act"] {
  if (p >= 1) return "after";
  for (const [act, end] of ACT_BOUNDS) {
    if (p < end) return act;
  }
  return "partnership";
}

export const useScrollBus = create<ScrollState>((set) => ({
  progress: 0,
  velocity: 0,
  act: "sky",
  setProgress: (p, v = 0) =>
    set({ progress: p, velocity: v, act: progressToAct(p) }),
}));
