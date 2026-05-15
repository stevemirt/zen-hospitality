import * as THREE from "three";
import {
  EffectComposer,
  RenderPass,
  EffectPass,
  BloomEffect,
  NoiseEffect,
  VignetteEffect,
  BlendFunction,
} from "postprocessing";
import { CameraRig } from "./CameraRig";
import { SkyDome } from "./scenes/SkyDome";
import { Mist } from "./scenes/Mist";
import { Ocean } from "./scenes/Ocean";
import { useScrollBus } from "./ScrollBus";
import type { GpuTier } from "@/lib/gpu";

export class Stage {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private composer: EffectComposer;
  private rig: CameraRig;
  private clock = new THREE.Clock();
  private sky: SkyDome;
  private mist: Mist;
  private ocean: Ocean;
  private raf = 0;
  private el: HTMLElement;
  private resizeObs?: ResizeObserver;
  private visible = true;
  private gpuTier: GpuTier;
  private uTime = { value: 0 };
  private uScroll = { value: 0 };

  constructor(el: HTMLElement, gpuTier: GpuTier = "high") {
    this.el = el;
    this.gpuTier = gpuTier;

    const dpr = Math.min(
      typeof window !== "undefined" ? window.devicePixelRatio : 1,
      gpuTier === "high" ? 1.75 : 1.25
    );

    this.renderer = new THREE.WebGLRenderer({
      antialias: false,
      powerPreference: "high-performance",
      alpha: false,
      stencil: false,
      depth: true,
      // Helps headless screenshots capture the canvas; minor perf cost.
      preserveDrawingBuffer: true,
    });
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(el.clientWidth, el.clientHeight, false);
    this.renderer.setClearColor(0x000000, 1);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;

    const canvas = this.renderer.domElement;
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    el.appendChild(canvas);

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x031126, 0.0025);

    this.camera = new THREE.PerspectiveCamera(
      24,
      el.clientWidth / el.clientHeight,
      0.1,
      2000
    );
    this.rig = new CameraRig(this.camera);

    // Lighting — hemisphere floor + key light parented to camera
    const hemi = new THREE.HemisphereLight(0x58c3e8, 0x042b59, 0.35);
    this.scene.add(hemi);
    const key = new THREE.DirectionalLight(0xffffff, 0.8);
    key.position.set(20, 30, 10);
    this.scene.add(key);

    // Scenes
    this.sky = new SkyDome(this.uScroll, this.uTime);
    this.mist = new Mist(this.uScroll, this.uTime, gpuTier);
    this.ocean = new Ocean(this.uScroll, this.uTime);
    this.scene.add(this.sky.mesh, this.mist.points, this.ocean.mesh);

    // Postprocessing
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    const effects = [];
    if (gpuTier !== "low") {
      effects.push(
        new BloomEffect({
          intensity: 0.6,
          luminanceThreshold: 0.7,
          luminanceSmoothing: 0.2,
          mipmapBlur: true,
        })
      );
    }
    effects.push(
      new VignetteEffect({
        eskil: false,
        offset: 0.35,
        darkness: 0.55,
      })
    );
    effects.push(
      new NoiseEffect({
        premultiply: true,
        blendFunction: BlendFunction.OVERLAY,
      })
    );
    if (effects.length > 0) {
      this.composer.addPass(new EffectPass(this.camera, ...effects));
    }

    this.setupResize();
    this.setupVisibility();
    this.start();
  }

  private setupResize() {
    const onResize = () => {
      const w = this.el.clientWidth;
      const h = this.el.clientHeight;
      this.renderer.setSize(w, h, false);
      this.composer.setSize(w, h);
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
    };
    if (typeof ResizeObserver !== "undefined") {
      this.resizeObs = new ResizeObserver(onResize);
      this.resizeObs.observe(this.el);
    } else if (typeof window !== "undefined") {
      window.addEventListener("resize", onResize);
    }
  }

  private setupVisibility() {
    // Pause rendering when tab is in true background (not just unfocused).
    // We use the page's IntersectionObserver of the mount element rather than
    // document.visibilityState so headless screenshot tools (which mark docs
    // as hidden) still see the rendered output.
    if (typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          this.visible = entry.isIntersecting;
        }
      },
      { threshold: 0 }
    );
    obs.observe(this.el);
  }

  private start() {
    const loop = () => {
      this.raf = requestAnimationFrame(loop);
      if (!this.visible) return;
      const dt = this.clock.getDelta();
      const t = this.clock.elapsedTime;

      const { progress } = useScrollBus.getState();
      this.uTime.value = t;
      this.uScroll.value = progress;

      // camera path
      this.rig.update(progress, dt);

      // mist follows camera
      this.mist.update(this.camera, progress);
      this.ocean.setCameraPos(this.camera.position);
      this.ocean.update(progress);
      this.sky.update(progress);

      // tone mapping breathes warmer in residence/interior acts
      this.renderer.toneMappingExposure = THREE.MathUtils.lerp(
        0.95,
        1.15,
        THREE.MathUtils.smoothstep(progress, 0.28, 0.68)
      );

      this.composer.render(dt);
    };
    loop();
  }

  dispose() {
    cancelAnimationFrame(this.raf);
    this.resizeObs?.disconnect();
    this.sky.dispose();
    this.mist.dispose();
    this.ocean.dispose();
    this.composer.dispose();
    this.renderer.dispose();
    if (this.renderer.domElement.parentElement === this.el) {
      this.el.removeChild(this.renderer.domElement);
    }
  }
}
