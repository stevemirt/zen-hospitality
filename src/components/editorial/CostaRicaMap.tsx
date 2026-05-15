"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

/**
 * Costa Rica map — real geographic SVG path.
 *
 * Outline derived from Natural Earth 50m world atlas (public domain) via
 * topojson-client + d3-geo Mercator projection fitExtent into 560×600 viewBox
 * with 40px margin. This is the actual country shape — Nicoya Peninsula,
 * Osa Peninsula, Caribbean coast, Nicaragua border — at real proportions.
 */
const OUTLINE = "M520,308.358L519.483,310.884L516.9,313.916L513.283,316.695L508.633,318.716L497.266,312.653L485.899,306.083L480.215,309.116L477.632,317.706L473.498,322.253L468.332,324.021L466.265,326.8L465.748,356.091L466.265,383.346L474.532,384.103L488.482,393.69L494.682,399.239L496.749,404.283L494.682,406.805L484.349,412.858L474.532,420.422L469.365,430.002L478.149,445.125L480.215,455.456L479.699,466.29L477.632,471.58L457.998,483.921L453.864,488.454L454.381,491.476L464.715,500.036L469.882,508.344L474.532,518.412L475.048,526.969L465.231,510.861L451.798,495.504L439.914,486.187L438.881,464.022L434.23,451.929L416.663,440.84L401.163,433.279L390.312,434.791L397.029,447.393L414.596,463.77L416.146,470.068L415.63,478.38L403.746,477.121L392.896,473.595L379.462,472.587L370.678,467.549L352.078,448.149L365.511,431.514L369.645,420.674L369.128,397.978L366.028,387.131L351.561,370.225L328.827,352.051L297.309,336.902L282.325,325.031L244.607,315.685L230.657,309.621L219.29,298.25L217.74,289.909L221.873,277.269L211.539,261.337L167.104,229.712L142.304,218.068L136.62,211.486L133.003,209.207L136.62,230.977L147.47,244.136L175.888,256.279L183.638,263.361L186.738,272.717L170.205,290.414L161.938,294.964L159.354,304.567L154.187,307.6L148.504,302.04L125.253,274.234L80.818,260.831L72.551,252.737L56.017,227.181L48.784,204.143L51.367,188.693L69.451,164.368L75.135,153.976L74.101,147.384L74.618,138.002L67.901,131.408L50.85,122.529L40,115.679L43.1,112.127L62.734,102.737L63.767,94.361L63.767,91.568L66.868,91.06L69.451,88.775L71.518,86.49L76.685,78.365L81.335,73.793L86.502,73.031L93.219,76.333L117.503,85.221L144.887,94.868L183.638,108.574L199.656,99.945L213.606,93.091L222.906,94.107L244.09,101.975L256.491,104.514L264.241,103.752L277.158,115.172L284.392,123.798L285.942,129.632L290.075,132.676L300.409,133.437L325.727,139.27L341.227,138.255L355.178,131.915L362.928,124.559L365.511,112.888L369.128,118.724L373.262,127.856L374.812,139.523L393.412,178.813L407.879,200.597L439.914,240.593L453.348,247.931L476.598,280.05L484.865,285.359L489.516,294.711L513.283,302.546Z";

// Zen Reserve locations — projected from real lon/lat via the same Mercator
// projection that produced the outline.
const REGIONS = [
  { x: 77, y: 145, name: "Papagayo", subtitle: "Bahía Papagayo · NW", delay: 0 },
  { x: 70, y: 203, name: "Guanacaste", subtitle: "Tamarindo · Liberia", delay: 0.35 },
  { x: 77, y: 251, name: "Nosara", subtitle: "Nicoya Peninsula", delay: 0.7 },
];

export function CostaRicaMap() {
  const t = useTranslations("whyCostaRica");
  const ref = useRef<SVGSVGElement | null>(null);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.85 && rect.bottom > 0) {
      setArmed(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setArmed(true);
            obs.disconnect();
          }
        }
      },
      { threshold: 0.2 }
    );
    obs.observe(svg);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="relative w-full">
      <svg
        ref={ref}
        viewBox="0 0 560 600"
        className="block w-full h-auto"
        role="img"
        aria-label="Map of Costa Rica showing Zen Reserve regions on the Pacific coast"
      >
        <defs>
          <pattern id="zen-grid" x="0" y="0" width="22" height="22" patternUnits="userSpaceOnUse">
            <circle cx="11" cy="11" r="0.45" fill="#58c3e8" opacity="0.30" />
          </pattern>
          <radialGradient id="zen-radar" cx="50%" cy="50%" r="65%">
            <stop offset="0%" stopColor="#58c3e8" stopOpacity="0.22" />
            <stop offset="55%" stopColor="#58c3e8" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#042b59" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="zen-country-fill" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0a3a73" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#042b59" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="zen-coast" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#58c3e8" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#eaf1f6" stopOpacity="0.85" />
          </linearGradient>
          <linearGradient id="sweep-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#58c3e8" stopOpacity="0" />
            <stop offset="100%" stopColor="#58c3e8" stopOpacity="0.40" />
          </linearGradient>
          <filter id="zen-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="zen-topo" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" />
          </filter>
        </defs>

        {/* Radar background */}
        <circle cx="280" cy="300" r="270" fill="url(#zen-radar)" />
        <rect x="0" y="0" width="560" height="600" fill="url(#zen-grid)" />

        {/* Concentric radar rings */}
        {[80, 140, 200, 260].map((r, i) => (
          <circle
            key={r}
            cx="280"
            cy="300"
            r={armed ? r : 0}
            fill="none"
            stroke="#58c3e8"
            strokeOpacity={0.14 - i * 0.022}
            strokeWidth="0.4"
            style={{ transition: `r 1.8s cubic-bezier(0.22, 1, 0.36, 1) ${i * 0.12}s` }}
          />
        ))}

        {/* Cardinal hairlines */}
        <line x1="280" y1="30" x2="280" y2="560" stroke="#58c3e8" strokeOpacity="0.08" strokeDasharray="2 5" />
        <line x1="30" y1="300" x2="530" y2="300" stroke="#58c3e8" strokeOpacity="0.08" strokeDasharray="2 5" />

        {/* Radar sweep */}
        <g
          style={{
            transformOrigin: "280px 300px",
            animation: armed ? "zen-radar-sweep 14s linear infinite" : "none",
          }}
        >
          <path
            d="M 280 300 L 550 300 A 270 270 0 0 0 470 100 Z"
            fill="url(#sweep-grad)"
            opacity="0.50"
          />
        </g>

        {/* Topographic glow under country */}
        <path
          d={OUTLINE}
          fill="#58c3e8"
          fillOpacity={armed ? 0.18 : 0}
          stroke="none"
          filter="url(#zen-topo)"
          style={{ transition: "fill-opacity 1.4s ease-out 0.6s" }}
        />

        {/* Country body fill */}
        <path
          d={OUTLINE}
          fill="url(#zen-country-fill)"
          fillOpacity={armed ? 1 : 0}
          stroke="none"
          style={{ transition: "fill-opacity 1.4s ease-out 0.4s" }}
        />

        {/* Country outline — animated draw */}
        <path
          d={OUTLINE}
          fill="none"
          stroke="url(#zen-coast)"
          strokeWidth="1.4"
          strokeLinejoin="round"
          strokeLinecap="round"
          filter="url(#zen-glow)"
          style={{
            strokeDasharray: 3200,
            strokeDashoffset: armed ? 0 : 3200,
            transition: "stroke-dashoffset 3.6s cubic-bezier(0.22, 1, 0.36, 1) 0.3s",
          }}
        />

        {/* Ocean labels */}
        <g
          fill="#58c3e8"
          opacity={armed ? 0.70 : 0}
          style={{ transition: "opacity 1s ease-out 3.6s" }}
          fontFamily="Gotham, sans-serif"
          fontSize="10"
          letterSpacing="4"
          fontWeight="500"
        >
          <text x="35" y="510" style={{ textTransform: "uppercase" }}>{t("pacificOceanLabel")}</text>
          <text x="430" y="110" style={{ textTransform: "uppercase" }}>{t("caribbeanLabel")}</text>
        </g>

        {/* Country name */}
        <text
          x="280"
          y="565"
          textAnchor="middle"
          fill="#58c3e8"
          opacity={armed ? 0.95 : 0}
          style={{ transition: "opacity 1s ease-out 3.8s" }}
          fontFamily="Gotham, sans-serif"
          fontSize="15"
          fontWeight="500"
          letterSpacing="9"
        >
          COSTA RICA
        </text>
        <text
          x="280"
          y="585"
          textAnchor="middle"
          fill="#eaf1f6"
          opacity={armed ? 0.55 : 0}
          style={{ transition: "opacity 1s ease-out 4s" }}
          fontFamily="Gotham, sans-serif"
          fontSize="8"
          letterSpacing="3"
        >
          9.7489°N · 83.7534°W
        </text>

        {/* Markers — real lat/lon projected */}
        {REGIONS.map((r) => (
          <g key={r.name}>
            <circle
              cx={r.x}
              cy={r.y}
              r="12"
              fill="none"
              stroke="#58c3e8"
              strokeWidth="1.2"
              opacity={armed ? 1 : 0}
              style={{
                transformOrigin: `${r.x}px ${r.y}px`,
                animation: armed
                  ? `zen-marker-pulse 2.8s ease-out ${3.8 + r.delay}s infinite`
                  : "none",
                transition: "opacity 0.4s ease-out",
              }}
            />
            <circle
              cx={r.x}
              cy={r.y}
              r="18"
              fill="none"
              stroke="#58c3e8"
              strokeWidth="0.7"
              opacity={armed ? 0.35 : 0}
              style={{
                transformOrigin: `${r.x}px ${r.y}px`,
                animation: armed
                  ? `zen-marker-pulse 2.8s ease-out ${4 + r.delay}s infinite`
                  : "none",
                transition: "opacity 0.4s ease-out",
              }}
            />
            <circle
              cx={r.x}
              cy={r.y}
              r={armed ? 4 : 0}
              fill="#58c3e8"
              filter="url(#zen-glow)"
              style={{ transition: `r 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${3.8 + r.delay}s` }}
            />
            {/* Leader + label to the RIGHT of the marker (off the country, into the ocean) */}
            <g
              style={{
                opacity: armed ? 1 : 0,
                transition: `opacity 0.7s ease-out ${4 + r.delay}s`,
              }}
            >
              <line
                x1={r.x + 10}
                y1={r.y - 4}
                x2={r.x + 22}
                y2={r.y - 22}
                stroke="#58c3e8"
                strokeWidth="0.6"
                opacity="0.65"
              />
              {/* Dark backdrop pill for legibility */}
              <rect
                x={r.x + 22}
                y={r.y - 42}
                width="172"
                height="30"
                rx="2"
                fill="#042b59"
                fillOpacity="0.92"
                stroke="#58c3e8"
                strokeOpacity="0.4"
                strokeWidth="0.5"
              />
              <text
                x={r.x + 32}
                y={r.y - 26}
                fill="#eaf1f6"
                fontSize="11"
                fontFamily="Gotham, sans-serif"
                fontWeight="500"
                letterSpacing="3"
                style={{ textTransform: "uppercase" }}
              >
                {r.name}
              </text>
              <text
                x={r.x + 32}
                y={r.y - 16}
                fill="#58c3e8"
                fontSize="8"
                fontFamily="Gotham, sans-serif"
                letterSpacing="1.5"
                opacity="0.85"
              >
                {r.subtitle}
              </text>
            </g>
          </g>
        ))}

        {/* Compass NSEW */}
        <g
          fill="#58c3e8"
          opacity="0.5"
          fontFamily="Gotham, sans-serif"
          fontSize="10"
          letterSpacing="4"
          fontWeight="500"
          style={{ textTransform: "uppercase" }}
        >
          <text x="280" y="25" textAnchor="middle">N</text>
          <text x="20" y="304" textAnchor="middle">W</text>
          <text x="540" y="304" textAnchor="middle">E</text>
        </g>
      </svg>
    </div>
  );
}
