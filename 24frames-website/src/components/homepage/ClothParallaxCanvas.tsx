"use client";

import { useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import * as THREE from "three";
import styles from "./ClothParallaxCanvas.module.css";

export interface ClothParallaxHandle {
  setProgress: (p: number) => void;
  setActive: (active: boolean) => void;
}

interface ClothParallaxCanvasProps {
  initialProgress?: number;
}

/**
 * Creates the authentic South Indian Mandapam Cusped Torana Arch Shape
 * matching mandapp.png and mandapamArchClip.
 */
function createMandapamArchShape(width: number, height: number): THREE.Shape {
  const shape = new THREE.Shape();
  const toX = (xNorm: number) => (xNorm - 0.5) * width;
  const toY = (yNorm: number) => (0.5 - yNorm) * height;

  shape.moveTo(toX(0), toY(1));
  shape.lineTo(toX(0), toY(0.32));
  // Carved shoulder spring point
  shape.bezierCurveTo(toX(0), toY(0.24), toX(0.08), toY(0.24), toX(0.14), toY(0.20));
  // First cusped torana arch lobe
  shape.bezierCurveTo(toX(0.18), toY(0.17), toX(0.24), toY(0.18), toX(0.28), toY(0.14));
  // Second cusped lobe rising toward center
  shape.bezierCurveTo(toX(0.33), toY(0.09), toX(0.40), toY(0.08), toX(0.46), toY(0.03));
  // Sacred pinnacle apex at exact center top
  shape.bezierCurveTo(toX(0.48), toY(0.01), toX(0.49), toY(0.00), toX(0.50), toY(0.00));
  // Mirror down right side
  shape.bezierCurveTo(toX(0.51), toY(0.00), toX(0.52), toY(0.01), toX(0.54), toY(0.03));
  shape.bezierCurveTo(toX(0.60), toY(0.08), toX(0.67), toY(0.09), toX(0.72), toY(0.14));
  shape.bezierCurveTo(toX(0.76), toY(0.18), toX(0.82), toY(0.17), toX(0.86), toY(0.20));
  shape.bezierCurveTo(toX(0.92), toY(0.24), toX(1.00), toY(0.24), toX(1.00), toY(0.32));
  shape.lineTo(toX(1), toY(1));
  shape.closePath();

  return shape;
}

/**
 * ClothParallaxCanvas
 *
 * Real-Time 3D WebGL Four-Direction Luxury Silk Fabric & Authentic Mandapam Parallax:
 *
 * 1. Rich Full-Screen Silk Initial Composition (p = 0.0 - 0.18):
 *    Four overlapping high-subdivision silk panels (Imperial Emerald Silk & Champagne Gold Satin)
 *    blanketing the entire viewport with multi-octave Gerstner wave folds, woven micro-weave textile
 *    grain, soft rounded creases, and Kajiya-Kay strand anisotropic sheen. (NO twisted ribbons, flags, or flat strips).
 *
 * 2. Four-Direction Silk Reveal of mandapp.webp (p = 0.18 - 0.70):
 *    The luxury fabric physically pulls away from the center in 4 distinct directions:
 *    - Top panel moves UPWARD with gathered pleats and woven gold zari hem.
 *    - Bottom panel moves DOWNWARD with gathered pleats and woven gold zari hem.
 *    - Left panel moves LEFTWARD with vertical pleats and woven gold zari hem.
 *    - Right panel moves RIGHTWARD with vertical pleats and woven gold zari hem.
 *    Inner parting edges modulate with harmonic wave oscillations for organic fluid separation,
 *    uncovering the authentic South Indian temple mandapam (mandapp.webp) with carved wooden pillars,
 *    jasmine garlands, brass lamps, and sacred Govinda Namalu crest.
 *
 * 3. Mandapam Composition Hold (p = 0.70 - 0.76):
 *    Silk panels held gathered at viewport edges; mandapp composition held in crisp, clear, unobstructed view.
 *
 * 4. Mandapam Forward Parallax & Bellamkonda Photograph Emergence (p = 0.76 - 0.96):
 *    Camera dollies forward into the central opening; outer wooden pillars move outward towards viewport
 *    edges in perspective. The authentic Bellamkonda Sai Sreenivas & Kavya Reddy wedding photograph
 *    (IMG_6339.webp) emerges from deep within the opening, framed inside the authentic Mandapam Arch Silhouette,
 *    and scales precisely into alignment.
 *
 * 5. Dual-Engine Architecture:
 *    High-performance Three.js WebGL with resilient 2D Canvas fallback.
 */
const ClothParallaxCanvas = forwardRef<ClothParallaxHandle, ClothParallaxCanvasProps>(
  ({ initialProgress = 0 }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fallbackCanvasRef = useRef<HTMLCanvasElement>(null);

    const startLoopRef = useRef<() => void>(() => {});
    const stopLoopRef = useRef<() => void>(() => {});
    const renderSceneRef = useRef<(time: number) => void>(() => {});

    const stateRef = useRef<{
      mode: "webgl" | "canvas2d";
      progress: number;
      isActive: boolean;
      webgl?: {
        renderer: THREE.WebGLRenderer;
        scene: THREE.Scene;
        camera: THREE.PerspectiveCamera;
        uniforms: {
          uProgress: { value: number };
          uTime: { value: number };
          uAspect: { value: number };
        };
        materials: THREE.Material[];
        geometries: THREE.BufferGeometry[];
      };
      canvas2d?: {
        ctx: CanvasRenderingContext2D;
        width: number;
        height: number;
        time: number;
        mandappImg: HTMLImageElement;
        bellamImg: HTMLImageElement;
      };
      rafId: number;
    }>({
      mode: "webgl",
      progress: initialProgress,
      isActive: false,
      rafId: 0,
    });

    useImperativeHandle(ref, () => ({
      setProgress: (p: number) => {
        const clamped = Math.max(0, Math.min(1, p));
        stateRef.current.progress = clamped;
        if (stateRef.current.webgl) {
          stateRef.current.webgl.uniforms.uProgress.value = clamped;
          if (!stateRef.current.isActive) {
            renderSceneRef.current(performance.now());
          }
        }
      },
      setActive: (active: boolean) => {
        stateRef.current.isActive = active;
        if (containerRef.current) {
          containerRef.current.style.opacity = active ? "1" : "0";
        }
        if (active) {
          startLoopRef.current();
        } else {
          stopLoopRef.current();
        }
      },
    }));

    useEffect(() => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      const fallbackCanvas = fallbackCanvasRef.current;
      if (!container || !canvas || !fallbackCanvas) return;

      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || window.innerHeight;

      // ── Step 1: Detect WebGL Support Safely ───────────────────────
      let gl: WebGLRenderingContext | WebGL2RenderingContext | null = null;
      try {
        gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
      } catch {
        gl = null;
      }

      if (gl) {
        // ═════════════════════════════════════════════════════════════
        // PATH A: HIGH-FIDELITY REAL-TIME 3D THREE.JS WEBGL ENGINE
        // ═════════════════════════════════════════════════════════════
        try {
          stateRef.current.mode = "webgl";
          fallbackCanvas.style.display = "none";
          canvas.style.display = "block";

          const renderer = new THREE.WebGLRenderer({
            canvas,
            context: gl,
            alpha: true,
            antialias: true,
            powerPreference: "high-performance",
          });
          renderer.setSize(width, height);
          renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
          renderer.toneMapping = THREE.ACESFilmicToneMapping;
          renderer.toneMappingExposure = 1.1;

          const scene = new THREE.Scene();
          scene.background = new THREE.Color(0x011009); // Deep imperial forest-green atmosphere

          const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
          camera.position.set(0, 0, 7.5);

          const materialsToDispose: THREE.Material[] = [];
          const geometriesToDispose: THREE.BufferGeometry[] = [];
          const texturesToDispose: THREE.Texture[] = [];

          const uniforms = {
            uProgress: { value: initialProgress },
            uTime: { value: 0 },
            uAspect: { value: width / height },
          };

          // ── Texture Loader for Mandapam & Bellamkonda Photograph ─────
          const texLoader = new THREE.TextureLoader();

          const mandappTexture = texLoader.load("/images/mandapp.webp");
          mandappTexture.colorSpace = THREE.SRGBColorSpace;
          mandappTexture.generateMipmaps = true;
          mandappTexture.minFilter = THREE.LinearMipmapLinearFilter;
          texturesToDispose.push(mandappTexture);

          const bellamTexture = texLoader.load("/images/stories/bellam-srikonda/IMG_6339.webp");
          bellamTexture.colorSpace = THREE.SRGBColorSpace;
          bellamTexture.generateMipmaps = true;
          bellamTexture.minFilter = THREE.LinearMipmapLinearFilter;
          texturesToDispose.push(bellamTexture);

          // ── 1. Authentic South Indian Mandapam Mesh (mandapp.webp) ───
          const mandappGeo = new THREE.PlaneGeometry(12.2, 9.4, 32, 32);
          geometriesToDispose.push(mandappGeo);

          const mandappUniforms = {
            uTexture: { value: mandappTexture },
            uOpacity: { value: 0 },
            uDolly: { value: 0 },
            uTime: { value: 0 },
          };

          const mandappMat = new THREE.ShaderMaterial({
            uniforms: mandappUniforms,
            vertexShader: `
              varying vec2 vUv;
              void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
              }
            `,
            fragmentShader: `
              uniform sampler2D uTexture;
              uniform float uOpacity;
              uniform float uDolly;
              uniform float uTime;
              varying vec2 vUv;

              void main() {
                vec4 tex = texture2D(uTexture, vUv);
                vec3 col = tex.rgb;

                // Subtle warm golden temple ambient grading
                col = mix(col, col * vec3(1.06, 1.01, 0.94), 0.45);

                // Central sanctum glow
                float sanctumDist = length(vUv - vec2(0.5, 0.52));
                float glow = (1.0 - smoothstep(0.0, 0.45, sanctumDist)) * (0.08 + 0.04 * sin(uTime * 1.5));
                col += vec3(0.96, 0.82, 0.42) * glow;

                gl_FragColor = vec4(col, tex.a * uOpacity);
              }
            `,
            transparent: true,
            depthWrite: false,
          });
          materialsToDispose.push(mandappMat);

          const mandappMesh = new THREE.Mesh(mandappGeo, mandappMat);
          mandappMesh.position.set(0, 0, -1.2);
          scene.add(mandappMesh);

          // ── 2. Bellamkonda & Kavya Wedding Photograph in Mandapam Arch ──
          const archShape = createMandapamArchShape(3.55, 4.95);
          const archPhotoGeo = new THREE.ShapeGeometry(archShape, 32);
          geometriesToDispose.push(archPhotoGeo);

          const archPhotoUniforms = {
            uPhoto: { value: bellamTexture },
            uOpacity: { value: 0 },
          };

          const archPhotoMat = new THREE.ShaderMaterial({
            uniforms: archPhotoUniforms,
            vertexShader: `
              varying vec2 vUv;
              void main() {
                // Map local coordinates [-1.775, +1.775] and [-2.475, +2.475] to [0, 1]
                float normX = (position.x + 1.775) / 3.55;
                float normY = (position.y + 2.475) / 4.95;
                vUv = vec2(normX, normY);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
              }
            `,
            fragmentShader: `
              uniform sampler2D uPhoto;
              uniform float uOpacity;
              varying vec2 vUv;

              void main() {
                // Focus slightly higher for facial poise under arch
                vec2 uv = vec2(vUv.x, vUv.y * 0.94 + 0.05);
                vec4 tex = texture2D(uPhoto, uv);
                vec3 col = tex.rgb;

                // Warm cinematic grading
                col = mix(col, col * vec3(1.05, 1.0, 0.94), 0.4);

                // Polished gold rim contour along the cusped arch boundary
                float edgeX = min(vUv.x, 1.0 - vUv.x);
                float edgeY = min(vUv.y, 1.0 - vUv.y);
                float rim = smoothstep(0.04, 0.0, min(edgeX, edgeY));
                vec3 goldRim = vec3(0.96, 0.82, 0.42);
                col = mix(col, goldRim, rim * 0.72);

                gl_FragColor = vec4(col, tex.a * uOpacity);
              }
            `,
            transparent: true,
            depthWrite: false,
            side: THREE.DoubleSide,
          });
          materialsToDispose.push(archPhotoMat);

          const archPhotoMesh = new THREE.Mesh(archPhotoGeo, archPhotoMat);
          archPhotoMesh.position.set(0, 0, 0.05);
          archPhotoMesh.visible = false;
          scene.add(archPhotoMesh);

          // ── 3. Four-Direction Luxury Silk Fabric System ───────────────
          // High-subdivision meshes with Kajiya-Kay anisotropic sheen,
          // multi-octave Gerstner waves, micro-weave grain, and gold zari hem.
          const clothVertexShader = `
            uniform float uProgress;
            uniform float uTime;
            uniform vec2 uDirection; // (0, 1) top, (0, -1) bottom, (-1, 0) left, (1, 0) right
            varying vec2 vUv;
            varying vec3 vNormal;
            varying vec3 vViewPosition;
            varying vec3 vWorldPosition;
            varying float vFoldDepth;

            vec3 gerstnerFold(vec2 uv, vec2 dir, float steepness, float wavelength, float speed, float time, float p) {
              float k = 6.283185 / wavelength;
              float c = sqrt(9.8 / k);
              vec2 d = normalize(dir);
              float f = k * (dot(d, uv * vec2(12.0, 8.5)) - c * speed * time + p * 3.5);
              float a = steepness / k;

              return vec3(
                d.x * (a * cos(f)),
                d.y * (a * cos(f)),
                a * sin(f)
              );
            }

            float getInnerEdgeDist(vec2 uv, vec2 d) {
              if (d.y > 0.5) return uv.y;
              if (d.y < -0.5) return 1.0 - uv.y;
              if (d.x < -0.5) return 1.0 - uv.x;
              return uv.x;
            }

            vec3 computeSilk(vec2 uv, vec3 origPos, vec2 dir, float p, float time) {
              vec3 pos = origPos;
              float pull = smoothstep(0.18, 0.70, p);

              // 1. Multi-octave natural Gerstner fabric folds
              vec3 g1 = gerstnerFold(uv, vec2(0.70, 0.71), 0.42, 5.2, 0.85, time, p);
              vec3 g2 = gerstnerFold(uv, vec2(-0.71, 0.70), 0.32, 3.2, 1.15, time, p);
              vec3 g3 = gerstnerFold(uv, vec2(0.35, -0.93), 0.18, 1.8, 1.45, time, p);

              float foldAmp = mix(0.40, 1.15, smoothstep(0.08, 0.45, p));
              pos.x -= (g1.x + g2.x * 0.5) * foldAmp;
              pos.y -= (g1.y + g2.y * 0.5) * foldAmp;
              pos.z += (g1.z + g2.z + g3.z) * foldAmp;

              // 2. Physical Four-Direction Pull
              float pullDistance = (abs(dir.x) > 0.5) ? 9.2 : 6.8;
              pos.xy += dir * pullDistance * pull;

              // 3. Fluid harmonic wave modulation along inner parting edge
              float edgeDist = getInnerEdgeDist(uv, dir);
              vec2 perp = vec2(dir.y, -dir.x);
              float edgeWave = sin(dot(origPos.xy, perp) * 1.6 + time * 0.9) * 0.42 * (1.0 - pull * 0.7);
              pos.xy += dir * edgeWave * (1.0 - smoothstep(0.0, 0.28, edgeDist));

              // 4. Gathering compression pleats as fabric gathers at viewport boundaries
              float gatherFactor = smoothstep(0.3, 1.0, 1.0 - edgeDist);
              pos.z += sin(dot(origPos.xy, perp) * 5.2) * pull * 0.48 * gatherFactor;

              return pos;
            }

            vec3 safeNormalize(vec3 v, vec3 fallback) {
              float len = length(v);
              return len > 0.0001 ? v / len : fallback;
            }

            void main() {
              vUv = uv;
              vec3 pos = computeSilk(uv, position, uDirection, uProgress, uTime);

              float delta = 0.012;
              vec3 posX = computeSilk(uv + vec2(delta, 0.0), position + vec3(delta, 0.0, 0.0), uDirection, uProgress, uTime);
              vec3 posY = computeSilk(uv + vec2(0.0, delta), position + vec3(0.0, delta, 0.0), uDirection, uProgress, uTime);
              vec3 tangentX = safeNormalize(posX - pos, vec3(1.0, 0.0, 0.0));
              vec3 tangentY = safeNormalize(posY - pos, vec3(0.0, 1.0, 0.0));
              vec3 n = safeNormalize(cross(tangentX, tangentY), vec3(0.0, 0.0, 1.0));

              vNormal = normalMatrix * n;
              vFoldDepth = pos.z;

              vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
              vViewPosition = -mvPos.xyz;
              vWorldPosition = (modelMatrix * vec4(pos, 1.0)).xyz;

              gl_Position = projectionMatrix * mvPos;
            }
          `;

          const clothFragmentShader = `
            uniform float uProgress;
            uniform float uTime;
            uniform vec2 uDirection;
            uniform float uColorType; // 0.0 = Imperial Emerald Silk, 1.0 = Champagne Gold Satin
            varying vec2 vUv;
            varying vec3 vNormal;
            varying vec3 vViewPosition;
            varying vec3 vWorldPosition;
            varying float vFoldDepth;

            vec3 safeNormalize(vec3 v, vec3 fallback) {
              float len = length(v);
              return len > 0.0001 ? v / len : fallback;
            }

            float getInnerEdgeDist(vec2 uv, vec2 d) {
              if (d.y > 0.5) return uv.y;
              if (d.y < -0.5) return 1.0 - uv.y;
              if (d.x < -0.5) return 1.0 - uv.x;
              return uv.x;
            }

            void main() {
              vec3 N = safeNormalize(vNormal, vec3(0.0, 0.0, 1.0));
              if (!gl_FrontFacing) {
                N = -N;
              }
              vec3 V = safeNormalize(vViewPosition, vec3(0.0, 0.0, 1.0));

              // Lighting vectors: Warm golden temple sun
              vec3 L1 = normalize(vec3(-0.62, 0.78, 0.72));
              vec3 H1 = normalize(L1 + V);
              float NdotL1 = max(dot(N, L1), 0.0);

              // Kajiya-Kay Strand Anisotropic Silk Sheen
              vec3 guide = abs(N.y) > 0.9 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 1.0, 0.0);
              vec3 T = safeNormalize(cross(N, guide), vec3(1.0, 0.0, 0.0));
              float TdotH = clamp(dot(T, H1), -1.0, 1.0);
              float sinTH = sqrt(max(0.0, 1.0 - TdotH * TdotH));
              float anisoSharp = pow(sinTH, 34.0) * 1.25;
              float anisoBroad = pow(sinTH, 6.5) * 0.45;
              float fresnel = pow(1.0 - max(dot(N, V), 0.0), 2.6);

              // Procedural micro-weave textile grain
              float weave = sin(vUv.x * 220.0) * sin(vUv.y * 220.0) * 0.04;

              vec3 litColor;
              vec3 goldZari = vec3(0.96, 0.82, 0.42);

              if (uColorType < 0.5) {
                // ── Imperial Emerald Silk Palette ──
                vec3 deepForest = vec3(0.012, 0.095, 0.055);
                vec3 richEmerald = vec3(0.038, 0.28, 0.17);
                vec3 vividEmerald = vec3(0.075, 0.48, 0.30);

                vec3 baseColor = mix(deepForest, richEmerald, NdotL1);
                baseColor = mix(baseColor, vividEmerald, pow(NdotL1, 2.0));
                baseColor += vec3(weave);

                litColor = baseColor;
                litColor += goldZari * (anisoSharp + anisoBroad) * 0.55;
                litColor += goldZari * fresnel * 0.36;
              } else {
                // ── Champagne Gold Satin Silk Palette ──
                vec3 goldShadow = vec3(0.40, 0.30, 0.14);
                vec3 goldMid    = vec3(0.90, 0.78, 0.48);
                vec3 goldPeak   = vec3(1.0, 0.98, 0.90);

                vec3 baseColor = mix(goldShadow, goldMid, NdotL1);
                baseColor += vec3(weave);

                litColor = baseColor;
                litColor += goldPeak * (anisoSharp * 1.2 + anisoBroad * 0.55);
                litColor += goldPeak * fresnel * 0.55;
              }

              // Woven Gold Zari Border along inner parting seam
              float edgeDist = getInnerEdgeDist(vUv, uDirection);
              float zariBorder = smoothstep(0.065, 0.0, edgeDist);
              vec2 perp = vec2(uDirection.y, -uDirection.x);
              float zariBraid = sin(dot(vWorldPosition.xy, perp) * 8.5) * 0.14;
              vec3 wovenGold = goldZari * (0.85 + zariBraid) + vec3(anisoSharp * 0.75);
              litColor = mix(litColor, wovenGold, zariBorder * 0.90);

              // Overall Alpha: Fades in during logo dissolved exit, holds, fades out when camera enters opening
              float alpha = smoothstep(0.0, 0.06, uProgress) * (1.0 - smoothstep(0.82, 0.94, uProgress));
              gl_FragColor = vec4(litColor, alpha);
            }
          `;

          // Top Panel (Emerald Silk with bottom hem gold zari)
          const topGeo = new THREE.PlaneGeometry(16.5, 6.2, 110, 50);
          geometriesToDispose.push(topGeo);
          const topMat = new THREE.ShaderMaterial({
            vertexShader: clothVertexShader,
            fragmentShader: clothFragmentShader,
            uniforms: {
              ...uniforms,
              uDirection: { value: new THREE.Vector2(0, 1) },
              uColorType: { value: 0.0 }, // Emerald
            },
            transparent: true,
            side: THREE.DoubleSide,
            depthWrite: false,
          });
          materialsToDispose.push(topMat);
          const topMesh = new THREE.Mesh(topGeo, topMat);
          topMesh.position.set(0, 2.4, 0.0);
          scene.add(topMesh);

          // Bottom Panel (Champagne Gold Satin with top hem gold zari)
          const bottomGeo = new THREE.PlaneGeometry(16.5, 6.2, 110, 50);
          geometriesToDispose.push(bottomGeo);
          const bottomMat = new THREE.ShaderMaterial({
            vertexShader: clothVertexShader,
            fragmentShader: clothFragmentShader,
            uniforms: {
              ...uniforms,
              uDirection: { value: new THREE.Vector2(0, -1) },
              uColorType: { value: 1.0 }, // Champagne
            },
            transparent: true,
            side: THREE.DoubleSide,
            depthWrite: false,
          });
          materialsToDispose.push(bottomMat);
          const bottomMesh = new THREE.Mesh(bottomGeo, bottomMat);
          bottomMesh.position.set(0, -2.4, 0.0);
          scene.add(bottomMesh);

          // Left Panel (Emerald Silk with right hem gold zari, layered forward)
          const leftGeo = new THREE.PlaneGeometry(9.2, 11.0, 60, 80);
          geometriesToDispose.push(leftGeo);
          const leftMat = new THREE.ShaderMaterial({
            vertexShader: clothVertexShader,
            fragmentShader: clothFragmentShader,
            uniforms: {
              ...uniforms,
              uDirection: { value: new THREE.Vector2(-1, 0) },
              uColorType: { value: 0.0 }, // Emerald
            },
            transparent: true,
            side: THREE.DoubleSide,
            depthWrite: false,
          });
          materialsToDispose.push(leftMat);
          const leftMesh = new THREE.Mesh(leftGeo, leftMat);
          leftMesh.position.set(-4.1, 0, 0.02);
          scene.add(leftMesh);

          // Right Panel (Champagne Gold Satin with left hem gold zari, layered forward)
          const rightGeo = new THREE.PlaneGeometry(9.2, 11.0, 60, 80);
          geometriesToDispose.push(rightGeo);
          const rightMat = new THREE.ShaderMaterial({
            vertexShader: clothVertexShader,
            fragmentShader: clothFragmentShader,
            uniforms: {
              ...uniforms,
              uDirection: { value: new THREE.Vector2(1, 0) },
              uColorType: { value: 1.0 }, // Champagne
            },
            transparent: true,
            side: THREE.DoubleSide,
            depthWrite: false,
          });
          materialsToDispose.push(rightMat);
          const rightMesh = new THREE.Mesh(rightGeo, rightMat);
          rightMesh.position.set(4.1, 0, 0.02);
          scene.add(rightMesh);

          // ── 4. Sacred Devotional Halo Glow at Apex ────────────────────
          const haloGeo = new THREE.PlaneGeometry(3.2, 3.2);
          geometriesToDispose.push(haloGeo);
          const haloMat = new THREE.ShaderMaterial({
            uniforms: {
              uTime: { value: 0 },
              uOpacity: { value: 0 },
            },
            vertexShader: `
              varying vec2 vUv;
              void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
              }
            `,
            fragmentShader: `
              uniform float uTime;
              uniform float uOpacity;
              varying vec2 vUv;
              void main() {
                vec2 center = vUv - vec2(0.5);
                float dist = length(center);
                float angle = atan(center.y, center.x);
                float rays = 0.5 + 0.5 * sin(angle * 16.0 + uTime * 1.5);
                float glow = smoothstep(0.5, 0.0, dist) * (0.65 + 0.35 * rays);
                vec3 goldColor = vec3(1.0, 0.88, 0.48);
                gl_FragColor = vec4(goldColor, glow * uOpacity);
              }
            `,
            transparent: true,
            depthWrite: false,
          });
          materialsToDispose.push(haloMat);
          const haloMesh = new THREE.Mesh(haloGeo, haloMat);
          haloMesh.position.set(0, 1.85, -0.9);
          scene.add(haloMesh);

          // ── 5. Cinematic Floating Golden Bokeh Dust Particles ─────────
          const bokehCount = 70;
          const bokehGeo = new THREE.BufferGeometry();
          geometriesToDispose.push(bokehGeo);
          const bokehPos = new Float32Array(bokehCount * 3);
          for (let i = 0; i < bokehCount; i++) {
            bokehPos[i * 3 + 0] = (Math.random() - 0.5) * 14.0;
            bokehPos[i * 3 + 1] = (Math.random() - 0.5) * 9.0;
            bokehPos[i * 3 + 2] = (Math.random() - 0.5) * 6.0;
          }
          bokehGeo.setAttribute("position", new THREE.BufferAttribute(bokehPos, 3));

          const bokehMat = new THREE.PointsMaterial({
            color: new THREE.Color(0xffdf88),
            size: 0.14,
            transparent: true,
            opacity: 0.55,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
          });
          materialsToDispose.push(bokehMat);
          const bokehPoints = new THREE.Points(bokehGeo, bokehMat);
          scene.add(bokehPoints);

          // Scene Lighting: Warm Directional Golden Sun + Temple Fill
          const ambientLight = new THREE.AmbientLight(0xfff6e5, 0.90);
          scene.add(ambientLight);

          const sunLight = new THREE.DirectionalLight(0xfff0c2, 1.4);
          sunLight.position.set(-6, 7, 5);
          scene.add(sunLight);

          stateRef.current.webgl = {
            renderer,
            scene,
            camera,
            uniforms,
            materials: materialsToDispose,
            geometries: geometriesToDispose,
          };

          // ── Render Loop ─────────────────────────────────────────────
          let renderLoopRunning = false;
          let lastTime = performance.now();

          const renderScene = (time: number) => {
            const dt = Math.min((time - lastTime) * 0.001, 0.1);
            lastTime = time;

            uniforms.uTime.value += dt;
            mandappUniforms.uTime.value += dt;
            haloMat.uniforms.uTime.value += dt;

            // Slowly drift bokeh particles in 3D space
            const positions = bokehGeo.attributes.position.array as Float32Array;
            for (let i = 0; i < bokehCount; i++) {
              positions[i * 3 + 1] += Math.sin(time * 0.001 + i) * 0.0015;
              positions[i * 3 + 0] += Math.cos(time * 0.0008 + i) * 0.0015;
            }
            bokehGeo.attributes.position.needsUpdate = true;

            const p = uniforms.uProgress.value;

            // 1. Mandapam Reveal & Parallax
            // Unveiled as silk pulls away (0.18 -> 0.55)
            const mandappAlpha = THREE.MathUtils.smoothstep(p, 0.18, 0.55);
            const mandappExit = 1.0 - THREE.MathUtils.smoothstep(p, 0.97, 1.0);
            mandappUniforms.uOpacity.value = mandappAlpha * mandappExit;

            // Forward camera parallax dolly into central opening (0.76 -> 0.96)
            if (p > 0.76) {
              const dolly = THREE.MathUtils.smoothstep(p, 0.76, 0.96);
              mandappUniforms.uDolly.value = dolly;
              // Outer pillars slide outward towards viewport edges in perspective
              mandappMesh.scale.set(1.0 + dolly * 0.60, 1.0 + dolly * 0.60, 1.0);
              mandappMesh.position.z = -1.2 + dolly * 0.8;
              mandappMesh.position.y = -dolly * 0.35;
            } else {
              mandappUniforms.uDolly.value = 0;
              mandappMesh.scale.set(1.0, 1.0, 1.0);
              mandappMesh.position.set(0, 0, -1.2);
            }

            // 2. Bellamkonda & Kavya Wedding Photograph Emergence
            // Emerges from deep inside central architectural opening (0.76 -> 0.96)
            archPhotoMesh.visible = p > 0.74;
            if (archPhotoMesh.visible) {
              const photoDolly = THREE.MathUtils.smoothstep(p, 0.76, 0.94);
              const photoExit = 1.0 - THREE.MathUtils.smoothstep(p, 0.98, 1.0);
              archPhotoUniforms.uOpacity.value = photoDolly * photoExit;
              archPhotoMesh.scale.set(0.78 + photoDolly * 0.22, 0.78 + photoDolly * 0.22, 1.0);
              archPhotoMesh.position.z = -1.6 + photoDolly * 1.65;
            }

            // 3. Sacred Govinda Namalu Devotional Halo
            const haloOpacity =
              THREE.MathUtils.smoothstep(p, 0.60, 0.76) * (1.0 - THREE.MathUtils.smoothstep(p, 0.90, 0.98));
            haloMat.uniforms.uOpacity.value = haloOpacity * 0.75;

            // 4. Camera Position
            if (p > 0.82) {
              const camDolly = THREE.MathUtils.smoothstep(p, 0.82, 0.98);
              camera.position.z = 7.5 - camDolly * 2.2;
              camera.position.y = camDolly * 0.25;
            } else {
              camera.position.z = 7.5;
              camera.position.y = 0;
            }

            renderer.render(scene, camera);

            if (stateRef.current.isActive) {
              stateRef.current.rafId = requestAnimationFrame(renderScene);
            } else {
              renderLoopRunning = false;
              stateRef.current.rafId = 0;
            }
          };

          renderSceneRef.current = renderScene;

          const startLoop = () => {
            if (!renderLoopRunning) {
              renderLoopRunning = true;
              lastTime = performance.now();
              stateRef.current.rafId = requestAnimationFrame(renderScene);
            }
          };

          const stopLoop = () => {
            if (stateRef.current.rafId) {
              cancelAnimationFrame(stateRef.current.rafId);
              stateRef.current.rafId = 0;
            }
            renderLoopRunning = false;
          };

          startLoopRef.current = startLoop;
          stopLoopRef.current = stopLoop;

          if (stateRef.current.isActive) {
            startLoop();
          } else {
            renderScene(performance.now());
          }

          const handleResize = () => {
            if (!container) return;
            const newW = container.clientWidth || window.innerWidth;
            const newH = container.clientHeight || window.innerHeight;
            camera.aspect = newW / newH;
            camera.updateProjectionMatrix();
            renderer.setSize(newW, newH);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            uniforms.uAspect.value = newW / newH;
          };
          window.addEventListener("resize", handleResize);

          let observer: IntersectionObserver | null = null;
          if (typeof IntersectionObserver !== "undefined") {
            observer = new IntersectionObserver(
              (entries) => {
                const entry = entries[0];
                if (!entry) return;
                if (!entry.isIntersecting) {
                  stopLoop();
                } else if (stateRef.current.isActive) {
                  startLoop();
                }
              },
              { rootMargin: "100px" }
            );
            observer.observe(container);
          }

          return () => {
            window.removeEventListener("resize", handleResize);
            observer?.disconnect();
            stopLoop();
            renderer.dispose();
            texturesToDispose.forEach((t) => t.dispose());
            geometriesToDispose.forEach((g) => g.dispose());
            materialsToDispose.forEach((m) => m.dispose());
          };
        } catch (e) {
          console.error("--> WebGL initialization failed:", e);
        }
      }

      // ═════════════════════════════════════════════════════════════
      // PATH B: PROCEDURAL 2D CANVAS CLOTH ENGINE (RESILIENT FALLBACK)
      // ═════════════════════════════════════════════════════════════
      try {
        stateRef.current.mode = "canvas2d";
        canvas.style.display = "none";
        fallbackCanvas.style.display = "block";

        const ctx = fallbackCanvas.getContext("2d", { alpha: true });
        if (!ctx) return;

        fallbackCanvas.width = width * Math.min(window.devicePixelRatio, 2);
        fallbackCanvas.height = height * Math.min(window.devicePixelRatio, 2);
        ctx.scale(Math.min(window.devicePixelRatio, 2), Math.min(window.devicePixelRatio, 2));

        const mandappImg = new Image();
        mandappImg.src = "/images/mandapp.webp";

        const bellamImg = new Image();
        bellamImg.src = "/images/stories/bellam-srikonda/IMG_6339.webp";

        stateRef.current.canvas2d = { ctx, width, height, time: 0, mandappImg, bellamImg };

        let renderLoopRunning2d = false;
        let lastTime2d = performance.now();

        const render2D = (time: number) => {
          const dt = (time - lastTime2d) * 0.001;
          lastTime2d = time;

          const p = stateRef.current.progress;
          ctx.clearRect(0, 0, width, height);

          if (p <= 0.01) return;

          const entry = Math.min(1, Math.max(0, (p - 0.0) / 0.18));
          const pull = Math.min(1, Math.max(0, (p - 0.18) / 0.52));
          const exit = 1.0 - Math.min(1, Math.max(0, (p - 0.95) / 0.05));

          ctx.save();
          ctx.globalAlpha = entry * exit;

          // 1. Draw Mandapam Image
          if (mandappImg.complete && p > 0.15) {
            const mAlpha = Math.min(1, (p - 0.15) / 0.40);
            ctx.save();
            ctx.globalAlpha = mAlpha * exit;
            const dollyScale = p > 0.76 ? 1.0 + Math.min(1, (p - 0.76) / 0.20) * 0.45 : 1.0;
            const drawW = width * dollyScale;
            const drawH = (width * 1100 / 1430) * dollyScale;
            const drawX = (width - drawW) * 0.5;
            const drawY = (height - drawH) * 0.5;
            ctx.drawImage(mandappImg, drawX, drawY, drawW, drawH);
            ctx.restore();
          }

          // 2. Draw Bellamkonda Photograph Framed in Mandapam Arch
          if (bellamImg.complete && p > 0.75) {
            const bAlpha = Math.min(1, (p - 0.75) / 0.18);
            ctx.save();
            ctx.globalAlpha = bAlpha * exit;
            const photoW = Math.min(width * 0.38, 380);
            const photoH = photoW * 1.42;
            const photoX = (width - photoW) * 0.5;
            const photoY = (height - photoH) * 0.5;

            // Clip to cusped arch
            ctx.beginPath();
            ctx.moveTo(photoX, photoY + photoH);
            ctx.lineTo(photoX, photoY + photoH * 0.32);
            ctx.bezierCurveTo(photoX, photoY + photoH * 0.24, photoX + photoW * 0.08, photoY + photoH * 0.24, photoX + photoW * 0.14, photoY + photoH * 0.20);
            ctx.bezierCurveTo(photoX + photoW * 0.18, photoY + photoH * 0.17, photoX + photoW * 0.24, photoY + photoH * 0.18, photoX + photoW * 0.28, photoY + photoH * 0.14);
            ctx.bezierCurveTo(photoX + photoW * 0.33, photoY + photoH * 0.09, photoX + photoW * 0.40, photoY + photoH * 0.08, photoX + photoW * 0.46, photoY + photoH * 0.03);
            ctx.bezierCurveTo(photoX + photoW * 0.48, photoY + photoH * 0.01, photoX + photoW * 0.49, photoY, photoX + photoW * 0.50, photoY);
            ctx.bezierCurveTo(photoX + photoW * 0.51, photoY, photoX + photoW * 0.52, photoY + photoH * 0.01, photoX + photoW * 0.54, photoY + photoH * 0.03);
            ctx.bezierCurveTo(photoX + photoW * 0.60, photoY + photoH * 0.08, photoX + photoW * 0.67, photoY + photoH * 0.09, photoX + photoW * 0.72, photoY + photoH * 0.14);
            ctx.bezierCurveTo(photoX + photoW * 0.76, photoY + photoH * 0.18, photoX + photoW * 0.82, photoY + photoH * 0.17, photoX + photoW * 0.86, photoY + photoH * 0.20);
            ctx.bezierCurveTo(photoX + photoW * 0.92, photoY + photoH * 0.24, photoX + photoW, photoY + photoH * 0.24, photoX + photoW, photoY + photoH * 0.32);
            ctx.lineTo(photoX + photoW, photoY + photoH);
            ctx.closePath();
            ctx.clip();

            ctx.drawImage(bellamImg, photoX, photoY, photoW, photoH);
            ctx.strokeStyle = "#f5c85d";
            ctx.lineWidth = 3;
            ctx.stroke();
            ctx.restore();
          }

          // 3. Four-Direction Silk Flaps (Covering until pulled away)
          if (p < 0.90) {
            const silkAlpha = Math.min(1, (0.90 - p) / 0.12);
            ctx.globalAlpha = entry * silkAlpha;

            const pullDistY = pull * (height * 0.65);
            const pullDistX = pull * (width * 0.65);

            // Top Flap (Emerald)
            const topGrad = ctx.createLinearGradient(0, 0, 0, height * 0.5 - pullDistY);
            topGrad.addColorStop(0, "#01150c");
            topGrad.addColorStop(0.7, "#063e26");
            topGrad.addColorStop(1, "#0d5c3b");
            ctx.fillStyle = topGrad;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(width, 0);
            ctx.lineTo(width, height * 0.52 - pullDistY);
            ctx.bezierCurveTo(
              width * 0.65, height * 0.52 - pullDistY + Math.sin(time * 0.002) * 20,
              width * 0.35, height * 0.52 - pullDistY - Math.sin(time * 0.002) * 20,
              0, height * 0.52 - pullDistY
            );
            ctx.closePath();
            ctx.fill();

            // Bottom Flap (Champagne Gold)
            const botGrad = ctx.createLinearGradient(0, height * 0.48 + pullDistY, 0, height);
            botGrad.addColorStop(0, "#e8c374");
            botGrad.addColorStop(0.5, "#a67832");
            botGrad.addColorStop(1, "#3b260e");
            ctx.fillStyle = botGrad;
            ctx.beginPath();
            ctx.moveTo(0, height);
            ctx.lineTo(width, height);
            ctx.lineTo(width, height * 0.48 + pullDistY);
            ctx.bezierCurveTo(
              width * 0.65, height * 0.48 + pullDistY - Math.sin(time * 0.002) * 20,
              width * 0.35, height * 0.48 + pullDistY + Math.sin(time * 0.002) * 20,
              0, height * 0.48 + pullDistY
            );
            ctx.closePath();
            ctx.fill();

            // Left Flap (Emerald)
            ctx.fillStyle = topGrad;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(width * 0.52 - pullDistX, 0);
            ctx.bezierCurveTo(
              width * 0.52 - pullDistX + Math.cos(time * 0.002) * 15, height * 0.5,
              width * 0.52 - pullDistX - Math.cos(time * 0.002) * 15, height * 0.7,
              width * 0.52 - pullDistX, height
            );
            ctx.lineTo(0, height);
            ctx.closePath();
            ctx.fill();

            // Right Flap (Champagne)
            ctx.fillStyle = botGrad;
            ctx.beginPath();
            ctx.moveTo(width, 0);
            ctx.lineTo(width * 0.48 + pullDistX, 0);
            ctx.bezierCurveTo(
              width * 0.48 + pullDistX - Math.cos(time * 0.002) * 15, height * 0.5,
              width * 0.48 + pullDistX + Math.cos(time * 0.002) * 15, height * 0.7,
              width * 0.48 + pullDistX, height
            );
            ctx.lineTo(width, height);
            ctx.closePath();
            ctx.fill();
          }

          ctx.restore();

          if (stateRef.current.isActive) {
            stateRef.current.rafId = requestAnimationFrame(render2D);
          } else {
            renderLoopRunning2d = false;
            stateRef.current.rafId = 0;
          }
        };

        renderSceneRef.current = (t: number) => render2D(t);
        const startLoop2D = () => {
          if (!renderLoopRunning2d) {
            renderLoopRunning2d = true;
            lastTime2d = performance.now();
            stateRef.current.rafId = requestAnimationFrame(render2D);
          }
        };
        const stopLoop2D = () => {
          if (stateRef.current.rafId) {
            cancelAnimationFrame(stateRef.current.rafId);
            stateRef.current.rafId = 0;
          }
          renderLoopRunning2d = false;
        };

        startLoopRef.current = startLoop2D;
        stopLoopRef.current = stopLoop2D;

        if (stateRef.current.isActive) {
          startLoop2D();
        } else {
          render2D(performance.now());
        }

        const handleResize2D = () => {
          if (!container) return;
          const newW = container.clientWidth || window.innerWidth;
          const newH = container.clientHeight || window.innerHeight;
          fallbackCanvas.width = newW * Math.min(window.devicePixelRatio, 2);
          fallbackCanvas.height = newH * Math.min(window.devicePixelRatio, 2);
          ctx.scale(Math.min(window.devicePixelRatio, 2), Math.min(window.devicePixelRatio, 2));
          if (stateRef.current.canvas2d) {
            stateRef.current.canvas2d.width = newW;
            stateRef.current.canvas2d.height = newH;
          }
        };
        window.addEventListener("resize", handleResize2D);

        return () => {
          window.removeEventListener("resize", handleResize2D);
          stopLoop2D();
        };
      } catch (e2d) {
        console.error("--> 2D Canvas fallback initialization failed:", e2d);
      }
    }, [initialProgress]);

    return (
      <div ref={containerRef} className={styles.webglContainer} aria-hidden="true">
        <canvas ref={canvasRef} className={styles.webglCanvas} />
        <canvas ref={fallbackCanvasRef} className={styles.fallbackCanvas} />
      </div>
    );
  }
);

ClothParallaxCanvas.displayName = "ClothParallaxCanvas";

export default ClothParallaxCanvas;
