import { getGPUTier } from "detect-gpu";

export type GpuTier = "low" | "mid" | "high";

let cached: GpuTier | null = null;

export async function detectTier(): Promise<GpuTier> {
  if (cached) return cached;
  if (typeof window === "undefined") return "mid";
  try {
    const result = await getGPUTier({ glContext: undefined });
    // detect-gpu returns { tier: 0|1|2|3 }
    if (result.tier <= 1) cached = "low";
    else if (result.tier === 2) cached = "mid";
    else cached = "high";
  } catch {
    cached = "mid";
  }
  return cached;
}
