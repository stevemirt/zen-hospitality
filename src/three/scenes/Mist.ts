import * as THREE from "three";
import type { GpuTier } from "@/lib/gpu";

// Floating mist particles around the camera. Soft cyan-tinted.
// Density scales by GPU tier.

const VERT = /* glsl */ `
uniform float uTime;
uniform float uScroll;
uniform float uPixelRatio;
attribute float aSize;
attribute float aOffset;
varying float vAlpha;

void main() {
  vec3 p = position;
  // gentle drift
  p.y += sin(uTime * 0.18 + aOffset * 6.28) * 0.6;
  p.x += cos(uTime * 0.14 + aOffset * 3.14) * 0.4;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = aSize * (220.0 / -mv.z) * uPixelRatio;

  // fade-in during sky (0-0.1) and arrival (0.1-0.28); reduce during interior+ecosystem
  float dim = 1.0 - smoothstep(0.45, 0.85, uScroll);
  vAlpha = 0.55 * dim;
}
`;

const FRAG = /* glsl */ `
precision highp float;
varying float vAlpha;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  float a = smoothstep(0.5, 0.0, d) * vAlpha;
  // soft cyan-white tinted
  gl_FragColor = vec4(vec3(0.78, 0.88, 0.98), a);
}
`;

export class Mist {
  points: THREE.Points;
  private geometry: THREE.BufferGeometry;
  private material: THREE.ShaderMaterial;

  constructor(uScroll: { value: number }, uTime: { value: number }, tier: GpuTier) {
    const count = tier === "low" ? 600 : tier === "mid" ? 2000 : 4500;
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const offsets = new Float32Array(count);
    const R = 80;
    for (let i = 0; i < count; i++) {
      // spherical cloud around origin, biased to be in front of camera path
      const r = Math.cbrt(Math.random()) * R;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.cos(phi) * 0.5 + 10; // bias upward
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
      sizes[i] = 2.0 + Math.random() * 6.0;
      offsets[i] = Math.random();
    }
    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    this.geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    this.geometry.setAttribute("aOffset", new THREE.BufferAttribute(offsets, 1));

    this.material = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms: {
        uTime,
        uScroll,
        uPixelRatio: { value: typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 1.75) : 1 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      fog: false,
    });

    this.points = new THREE.Points(this.geometry, this.material);
    this.points.frustumCulled = false;
  }

  update(camera: THREE.Camera, _progress: number) {
    // follow camera so we always have mist around the viewer
    this.points.position.copy(camera.position);
  }

  dispose() {
    this.geometry.dispose();
    this.material.dispose();
  }
}
