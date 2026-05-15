import * as THREE from "three";

// Bézier path through 6 acts: Sky → Arrival → Residence orbit → Interior → Ecosystem aerial → Partnership
const PATH_POINTS = [
  new THREE.Vector3(0, 80, 220),    // sky
  new THREE.Vector3(0, 40, 100),    // descent
  new THREE.Vector3(22, 14, 22),    // residence orbit start
  new THREE.Vector3(-22, 14, 22),   // residence orbit end (camera orbits)
  new THREE.Vector3(0, 8, 10),      // interior
  new THREE.Vector3(0, 160, 0),     // ecosystem aerial
  new THREE.Vector3(0, 18, 60),     // partnership pull-back
];

const LOOK_POINTS = [
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(0, 2, 0),
  new THREE.Vector3(0, 4, 0),
  new THREE.Vector3(0, 4, 0),
  new THREE.Vector3(0, 6, 0),
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(0, 4, 0),
];

const FOV_KEYS = [24, 30, 42, 50, 60, 30, 32];

export class CameraRig {
  private path: THREE.CatmullRomCurve3;
  private lookPath: THREE.CatmullRomCurve3;
  private camera: THREE.PerspectiveCamera;
  private noiseSeed = Math.random() * 1000;
  noiseAmplitude = 0.25;
  noiseEnabled = true;

  constructor(camera: THREE.PerspectiveCamera) {
    this.camera = camera;
    this.path = new THREE.CatmullRomCurve3(PATH_POINTS, false, "catmullrom", 0.4);
    this.lookPath = new THREE.CatmullRomCurve3(LOOK_POINTS, false, "catmullrom", 0.4);
  }

  update(progress: number, dt: number) {
    const p = THREE.MathUtils.clamp(progress, 0, 1);
    const pos = this.path.getPoint(p);
    const look = this.lookPath.getPoint(p);

    // FOV — piecewise interpolation across FOV_KEYS
    const segments = FOV_KEYS.length - 1;
    const segF = p * segments;
    const segIdx = Math.min(Math.floor(segF), segments - 1);
    const segT = segF - segIdx;
    const fov = THREE.MathUtils.lerp(FOV_KEYS[segIdx], FOV_KEYS[segIdx + 1], segT);

    // subtle handheld noise
    let nx = 0, ny = 0;
    if (this.noiseEnabled) {
      const t = (performance.now() + this.noiseSeed) * 0.0004;
      nx = Math.sin(t * 1.3) * this.noiseAmplitude * 0.1;
      ny = Math.cos(t * 1.7) * this.noiseAmplitude * 0.1;
    }

    this.camera.position.set(pos.x + nx, pos.y + ny, pos.z);
    this.camera.lookAt(look);
    if (Math.abs(this.camera.fov - fov) > 0.01) {
      this.camera.fov = fov;
      this.camera.updateProjectionMatrix();
    }
  }
}
