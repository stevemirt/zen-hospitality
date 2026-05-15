import type { ReactNode } from "react";
import "./globals.css";

// Root layout is intentionally minimal — locale-specific html/lang lives in [locale]/layout.tsx
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
