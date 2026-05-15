import * as THREE from "three";

// Cinematic sky dome that lerps through 5 atmospheric stages on scroll.
// Each stage has zenith and horizon colors plus a horizon "glow" band.

const VERT = /* glsl */ `
varying vec3 vWorldPos;
void main() {
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vWorldPos = wp.xyz;
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`;

const FRAG = /* glsl */ `
precision highp float;
uniform float uScroll;
uniform float uTime;
varying vec3 vWorldPos;

// Zen Hospitality palette
const vec3 INK    = vec3(0.000, 0.000, 0.000);
const vec3 NAVY   = vec3(0.016, 0.169, 0.349);
const vec3 SKY    = vec3(0.345, 0.764, 0.910);
const vec3 SAND   = vec3(0.788, 0.718, 0.604);
const vec3 EMBER  = vec3(0.95, 0.55, 0.30);
const vec3 MIST   = vec3(0.918, 0.945, 0.965);
const vec3 BONE   = vec3(0.957, 0.937, 0.902);
const vec3 TEAL   = vec3(0.10, 0.35, 0.55);

// Stage colors: [zenith, horizon, glow]
// A — predawn (deep ink → faint teal at horizon, no glow yet)
// B — arrival (navy zenith, sand horizon, warm ember glow band)
// C — golden hour (deep teal zenith, sand+ember horizon, strong glow)
// D — interior wash (cool mist zenith, mist horizon)
// E — ecosystem aerial (sky cyan zenith, mist horizon, subtle cyan glow)
// F — partnership (full bone)

vec3 stageZenith(float k) {
       if (k < 1.0) return mix(INK,          NAVY,        smoothstep(0.0, 1.0, k));        // A→B
  else if (k < 2.0) return mix(NAVY,         TEAL,        smoothstep(0.0, 1.0, k - 1.0));  // B→C
  else if (k < 3.0) return mix(TEAL,         mix(NAVY,MIST,0.6),  smoothstep(0.0, 1.0, k - 2.0)); // C→D
  else if (k < 4.0) return mix(mix(NAVY,MIST,0.6), mix(SKY,MIST,0.4), smoothstep(0.0,1.0, k-3.0)); // D→E
  else              return mix(mix(SKY,MIST,0.4),  BONE,        smoothstep(0.0, 1.0, k - 4.0));  // E→F
}

vec3 stageHorizon(float k) {
       if (k < 1.0) return mix(mix(INK,NAVY,0.5),  mix(NAVY,SAND,0.25),   smoothstep(0.0,1.0,k));
  else if (k < 2.0) return mix(mix(NAVY,SAND,0.25), mix(SAND,EMBER,0.55), smoothstep(0.0,1.0,k-1.0));
  else if (k < 3.0) return mix(mix(SAND,EMBER,0.55), MIST,                smoothstep(0.0,1.0,k-2.0));
  else if (k < 4.0) return mix(MIST,                 mix(MIST,SKY,0.35),  smoothstep(0.0,1.0,k-3.0));
  else              return mix(mix(MIST,SKY,0.35),   BONE,                smoothstep(0.0,1.0,k-4.0));
}

// Strength of horizon glow (0..1)
float stageGlow(float k) {
       if (k < 1.0) return mix(0.0, 0.35, smoothstep(0.0,1.0,k));
  else if (k < 2.0) return mix(0.35, 1.0,  smoothstep(0.0,1.0,k-1.0));
  else if (k < 3.0) return mix(1.0, 0.45,  smoothstep(0.0,1.0,k-2.0));
  else if (k < 4.0) return mix(0.45, 0.2,  smoothstep(0.0,1.0,k-3.0));
  else              return mix(0.2, 0.0,   smoothstep(0.0,1.0,k-4.0));
}

void main() {
  // height 0 (down) to 1 (up)
  float h = normalize(vWorldPos).y;
  float t = clamp(h * 0.5 + 0.5, 0.0, 1.0);

  // Map scroll (0..1) to stage index (0..5)
  float k = uScroll * 5.0;
  vec3 zen = stageZenith(k);
  vec3 hor = stageHorizon(k);
  float glow = stageGlow(k);

  // Vertical blend — steeper near horizon, smoother above
  float bias = pow(t, 1.8);
  vec3 col = mix(hor, zen, bias);

  // Horizon glow band — concentrated around h≈0 (horizon line)
  float band = 1.0 - smoothstep(0.0, 0.18, abs(h));
  vec3 glowColor = mix(SAND, EMBER, smoothstep(0.5, 1.5, k));
  // Stage D-F uses cyan-mist glow
  if (k > 2.5) glowColor = mix(MIST, SKY, smoothstep(2.5, 4.0, k));
  col += glowColor * band * glow * 0.5;

  // Add a star-like noise sparkle in the upper sky during predawn
  float sparkle = step(0.9995, fract(sin(dot(normalize(vWorldPos).xy * 800.0 + uTime * 0.02, vec2(12.9898, 78.233))) * 43758.5453));
  float predawnFade = 1.0 - smoothstep(0.0, 0.18, uScroll);
  col += vec3(0.85, 0.92, 1.0) * sparkle * predawnFade * t * 0.8;

  // Subtle film grain
  float n = fract(sin(dot(gl_FragCoord.xy + uTime, vec2(12.9898, 78.233))) * 43758.5453);
  col += (n - 0.5) * 0.012;

  gl_FragColor = vec4(col, 1.0);
}
`;

export class SkyDome {
  mesh: THREE.Mesh;
  private material: THREE.ShaderMaterial;
  private geometry: THREE.SphereGeometry;

  constructor(uScroll: { value: number }, uTime: { value: number }) {
    this.geometry = new THREE.SphereGeometry(600, 48, 32);
    this.material = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms: { uScroll, uTime },
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
    });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = -1000;
  }

  update(_progress: number) {}

  dispose() {
    this.geometry.dispose();
    this.material.dispose();
  }
}
