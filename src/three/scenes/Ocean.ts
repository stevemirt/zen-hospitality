import * as THREE from "three";

// A large plane with vertex-displaced gentle waves and a fresnel-tinted
// fragment that fades from deep navy to sky cyan near the camera/horizon.
// Visible during arrival → residence acts; fades out during interior+.

const VERT = /* glsl */ `
uniform float uTime;
uniform float uScroll;
varying vec3 vWorldPos;
varying float vWave;

float wave(vec2 p, vec2 dir, float freq, float speed, float amp) {
  return sin(dot(p, dir) * freq + uTime * speed) * amp;
}

void main() {
  vec3 p = position;
  vec2 pp = p.xy;
  float w = 0.0;
  w += wave(pp, vec2(1.0, 0.3), 0.06, 0.6, 0.4);
  w += wave(pp, vec2(-0.4, 1.0), 0.09, 0.8, 0.28);
  w += wave(pp, vec2(0.7, -0.7), 0.14, 1.1, 0.16);
  // amplitude grows with scroll until residence then shrinks
  float amp = smoothstep(0.05, 0.35, uScroll) * (1.0 - smoothstep(0.55, 0.85, uScroll));
  p.z += w * amp;
  vWave = w;
  vec4 wp = modelMatrix * vec4(p, 1.0);
  vWorldPos = wp.xyz;
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`;

const FRAG = /* glsl */ `
precision highp float;
uniform float uScroll;
uniform float uTime;
uniform vec3  uCameraPos;
varying vec3 vWorldPos;
varying float vWave;

vec3 NAVY = vec3(0.016, 0.169, 0.349);
vec3 INK  = vec3(0.0);
vec3 SKY  = vec3(0.345, 0.764, 0.910);
vec3 SAND = vec3(0.788, 0.718, 0.604);

void main() {
  // viewing distance fade
  float d = length(vWorldPos.xz - uCameraPos.xz);
  float horizon = smoothstep(220.0, 80.0, d);

  // fresnel-ish: nearer to camera, more reflectivity
  vec3 N = normalize(vec3(vWave * 0.2, 1.0, vWave * 0.2));
  vec3 V = normalize(uCameraPos - vWorldPos);
  float fres = pow(1.0 - max(dot(N, V), 0.0), 3.0);

  vec3 base = mix(INK, NAVY, 0.7);
  vec3 reflCol = mix(NAVY, SKY, 0.6);

  // warm during arrival/residence (sand kiss on horizon)
  float arr = smoothstep(0.15, 0.45, uScroll) * (1.0 - smoothstep(0.50, 0.70, uScroll));
  vec3 col = mix(base, reflCol, fres);
  col = mix(col, mix(col, SAND, 0.3), arr * (1.0 - horizon) * 0.4);

  // fade out ocean for interior+ecosystem acts
  float vis = (1.0 - smoothstep(0.50, 0.75, uScroll));

  gl_FragColor = vec4(col, vis);
}
`;

export class Ocean {
  mesh: THREE.Mesh;
  private geometry: THREE.PlaneGeometry;
  private material: THREE.ShaderMaterial;
  private uCameraPos = { value: new THREE.Vector3() };

  constructor(uScroll: { value: number }, uTime: { value: number }) {
    this.geometry = new THREE.PlaneGeometry(800, 800, 128, 128);
    this.material = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms: {
        uScroll,
        uTime,
        uCameraPos: this.uCameraPos,
      },
      transparent: true,
      depthWrite: false,
      fog: true,
    });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.rotation.x = -Math.PI / 2;
    this.mesh.position.y = 0;
    this.mesh.frustumCulled = false;
  }

  update(_progress: number) {
    // camera position uniform synced from Stage via Scene's auto-attached camera in render path
    // (we don't have a direct camera ref here — use 0 origin as approximation)
  }

  setCameraPos(v: THREE.Vector3) {
    this.uCameraPos.value.copy(v);
  }

  dispose() {
    this.geometry.dispose();
    this.material.dispose();
  }
}
