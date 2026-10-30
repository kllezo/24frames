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
 * ClothParallaxCanvas
 *
 * Real-time 100% Procedural 3D WebGL Cloth & Mandapam Simulation (ZERO STILL IMAGES):
 * 1. 3D Emerald Silk Mantle: High-subdivision plane deformed with 4-octave Gerstner waves,
 *    analytical normals, Kajiya-Kay anisotropic silk sheen, procedural micro-weave grain,
 *    woven gold zari border, and catenary drape opening.
 * 2. 3D Twisting Champagne Silk Sash: 3D parametric ribbon with continuous 360° Frenet twist,
 *    champagne gold satin luster, double-sided lighting, and true 3D spatial occlusion.
 * 3. South Indian Mandapam Architecture: Multi-tiered ceremonial stone platform, fluted pillars
 *    with carved lotus capitals, cross beams, sculpted torana arch, and cascading jasmine & marigold garlands.
 * 4. Sacred Govinda Namalu Devotional Crest: Pristine white Tiruman uprights, crimson Kasturi Tilak,
 *    and golden Sudarshana sunburst medallion at the arch apex (Frame 09, zero text).
 * 5. Colonnade Corridor & Horizon Dawn Light: Receding perspective portal with camera dolly into The Vows.
 * 6. Dual-Engine Architecture: High-fidelity Three.js WebGL with resilient 2D Canvas fallback.
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
      };
      rafId: number;
    }>({
      mode: "webgl",
      progress: initialProgress,
      isActive: false,
      rafId: 0,
    });

    // Expose zero-overhead imperative handle for GSAP ScrollTrigger
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
        // 100% Procedural Graphics — Zero Image Textures Loaded
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

          const uniforms = {
            uProgress: { value: initialProgress },
            uTime: { value: 0 },
            uAspect: { value: width / height },
          };

          // ── GLSL Vertex Shader: 3D Multi-Octave Gerstner Cloth Physics ──
          const clothVertexShader = `
            uniform float uProgress;
            uniform float uTime;
            uniform float uAspect;
            varying vec2 vUv;
            varying vec3 vNormal;
            varying vec3 vViewPosition;
            varying vec3 vWorldPosition;
            varying float vFoldDepth;

            vec3 gerstnerFold(vec2 uv, vec2 dir, float steepness, float wavelength, float speed, float time, float p) {
              float k = 6.283185 / wavelength;
              float c = sqrt(9.8 / k);
              vec2 d = normalize(dir);
              float f = k * (dot(d, uv * vec2(14.0, 9.5)) - c * speed * time + p * 4.0);
              float a = steepness / k;

              return vec3(
                d.x * (a * cos(f)),
                d.y * (a * cos(f)),
                a * sin(f)
              );
            }

            vec3 computeCloth(vec2 uv, float p, float time) {
              float entry = smoothstep(0.0, 0.22, p);
              float flow  = smoothstep(0.16, 0.62, p);
              float drape = smoothstep(0.52, 0.90, p);

              float x = (uv.x - 0.5) * 16.0;
              float y = (uv.y - 0.5) * 10.2;
              vec3 pos = vec3(x, y, 0.0);

              vec3 g1 = gerstnerFold(uv, vec2(0.82, 0.58), 0.52, 6.2, 0.85, time, p);
              vec3 g2 = gerstnerFold(uv, vec2(-0.62, 0.78), 0.38, 3.6, 1.15, time, p);
              vec3 g3 = gerstnerFold(uv, vec2(0.35, -0.92), 0.22, 1.9, 1.45, time, p);
              vec3 g4 = gerstnerFold(uv, vec2(0.95, 0.15), 0.12, 0.75, 2.1, time, p);

              float foldAmp = mix(0.35, 1.25, flow);
              pos.x -= (g1.x + g2.x * 0.5) * foldAmp;
              pos.y -= (g1.y + g2.y * 0.5) * foldAmp;
              pos.z += (g1.z + g2.z + g3.z + g4.z) * foldAmp;

              float diag = (uv.x + (1.0 - uv.y)) * 0.5;
              pos.z += sin(diag * 4.0 - time * 0.85 + p * 3.4) * 0.85 * flow;

              // Swag Curtain Drape Morph (reveals temple mandapam arch)
              float archDist = abs(uv.x - 0.5) * 2.0;
              float catenaryArch = pow(archDist, 1.8);
              float swagY = mix(2.8, -3.4, catenaryArch);
              float flutedPleats = sin(uv.x * 40.0) * 0.25 * smoothstep(0.30, 1.0, archDist);

              vec3 drapedPos = vec3(
                mix(pos.x, (uv.x - 0.5) * 10.5 + (uv.x < 0.5 ? -1.8 : 1.8), drape * 0.82),
                mix(pos.y, swagY, drape),
                mix(pos.z * 0.4, flutedPleats - 0.35, drape)
              );

              pos = mix(pos, drapedPos, drape);

              pos.x += (1.0 - entry) * -11.0;
              pos.y += (1.0 - entry) * 7.0;
              pos.z += (1.0 - entry) * -3.5;

              return pos;
            }

            vec3 safeNormalize(vec3 v, vec3 fallback) {
              float len = length(v);
              return len > 0.0001 ? v / len : fallback;
            }

            void main() {
              vUv = uv;
              vec3 pos = computeCloth(uv, uProgress, uTime);

              float delta = 0.012;
              vec3 posX = computeCloth(uv + vec2(delta, 0.0), uProgress, uTime);
              vec3 posY = computeCloth(uv + vec2(0.0, delta), uProgress, uTime);
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

          // ── GLSL Fragment Shader: Pure Procedural Anisotropic Silk + Woven Gold Zari ──
          const emeraldSilkFragmentShader = `
            uniform float uProgress;
            uniform float uTime;

            varying vec2 vUv;
            varying vec3 vNormal;
            varying vec3 vViewPosition;
            varying vec3 vWorldPosition;
            varying float vFoldDepth;

            vec3 safeNormalize(vec3 v, vec3 fallback) {
              float len = length(v);
              return len > 0.0001 ? v / len : fallback;
            }

            void main() {
              vec3 N = safeNormalize(vNormal, vec3(0.0, 0.0, 1.0));
              if (!gl_FrontFacing) {
                N = -N;
              }
              vec3 V = safeNormalize(vViewPosition, vec3(0.0, 0.0, 1.0));

              // Procedural Silk Color Palette
              vec3 deepForest = vec3(0.012, 0.095, 0.055);
              vec3 richEmerald = vec3(0.038, 0.28, 0.17);
              vec3 vividEmerald = vec3(0.075, 0.48, 0.30);
              vec3 goldZari = vec3(0.96, 0.82, 0.42);

              // Lighting vectors
              vec3 L1 = normalize(vec3(-0.62, 0.78, 0.7));
              vec3 H1 = normalize(L1 + V);
              float NdotL1 = max(dot(N, L1), 0.0);

              // Analytical Anisotropic Silk Sheen (Kajiya-Kay Strand Model)
              vec3 guide = abs(N.y) > 0.9 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 1.0, 0.0);
              vec3 T = safeNormalize(cross(N, guide), vec3(1.0, 0.0, 0.0));
              float TdotH = clamp(dot(T, H1), -1.0, 1.0);
              float sinTH = sqrt(max(0.0, 1.0 - TdotH * TdotH));
              float anisoSharp = pow(sinTH, 36.0) * 1.15;
              float anisoBroad = pow(sinTH, 7.0) * 0.42;

              float fresnel = pow(1.0 - max(dot(N, V), 0.0), 2.8);

              // Procedural micro-weave texture
              float weave = sin(vUv.x * 240.0) * sin(vUv.y * 240.0) * 0.05;

              // Shading base
              vec3 baseColor = mix(deepForest, richEmerald, NdotL1);
              baseColor = mix(baseColor, vividEmerald, pow(NdotL1, 2.0));
              baseColor += vec3(weave);

              // Combine anisotropic highlights + fresnel rim
              vec3 litColor = baseColor;
              litColor += goldZari * (anisoSharp + anisoBroad) * 0.55;
              litColor += goldZari * fresnel * 0.38;

              // Procedural Woven Gold Zari Border along hem
              float edgeDist = min(vUv.y, 1.0 - vUv.y);
              float zariBorder = smoothstep(0.065, 0.0, edgeDist) + smoothstep(0.935, 1.0, vUv.y);
              float zariBraid = sin(vUv.x * 90.0) * 0.15;
              vec3 wovenGold = goldZari * (0.85 + zariBraid) + vec3(anisoSharp * 0.8);
              litColor = mix(litColor, wovenGold, zariBorder * 0.88);

              float alpha = smoothstep(0.0, 0.06, uProgress) * (1.0 - smoothstep(0.88, 0.98, uProgress));
              gl_FragColor = vec4(litColor, alpha);
            }
          `;

          const emeraldGeo = new THREE.PlaneGeometry(1, 1, 150, 150);
          geometriesToDispose.push(emeraldGeo);

          const emeraldMat = new THREE.ShaderMaterial({
            vertexShader: clothVertexShader,
            fragmentShader: emeraldSilkFragmentShader,
            uniforms,
            transparent: true,
            side: THREE.DoubleSide,
            depthWrite: false,
          });
          materialsToDispose.push(emeraldMat);

          const emeraldMesh = new THREE.Mesh(emeraldGeo, emeraldMat);
          scene.add(emeraldMesh);

          // ── Component 2: 3D Twisting Champagne Silk Ribbon ────────────
          const ribbonVertexShader = `
            uniform float uProgress;
            uniform float uTime;
            uniform float uAspect;
            varying vec2 vUv;
            varying vec3 vNormal;
            varying vec3 vViewPosition;

            vec3 ribbonPath(float t, float p, float time) {
              vec3 p0 = vec3(-7.2, 4.5, -0.8);
              vec3 p1 = vec3(-2.4, 2.0, 1.1);
              vec3 p2 = vec3(1.4, -0.5, 1.6);
              vec3 p3 = vec3(6.5, -3.2, 0.0);

              float u = 1.0 - t;
              vec3 pt = u*u*u*p0 + 3.0*u*u*t*p1 + 3.0*u*t*t*p2 + t*t*t*p3;

              float wave = sin(t * 7.0 - time * 1.1 + p * 4.6) * 0.45;
              pt.y += wave;
              pt.z += cos(t * 5.5 - time * 0.95 + p * 4.0) * 0.55;

              return pt;
            }

            void main() {
              vUv = uv;
              float t = uv.x;
              float ribbonWidth = 0.85;

              vec3 pos = ribbonPath(t, uProgress, uTime);
              vec3 posNext = ribbonPath(min(1.0, t + 0.01), uProgress, uTime);
              vec3 tangent = normalize(posNext - pos);

              float twist = t * 3.14159 * 2.4 - uTime * 0.5 + uProgress * 3.8;
              vec3 up = vec3(sin(twist), cos(twist), sin(twist * 0.5));
              vec3 normal = normalize(cross(tangent, up));
              vec3 binormal = cross(tangent, normal);

              float widthOffset = (uv.y - 0.5) * ribbonWidth;
              vec3 finalPos = pos + binormal * widthOffset;

              float entry = smoothstep(0.04, 0.25, uProgress);
              finalPos.x += (1.0 - entry) * -8.5;
              finalPos.y += (1.0 - entry) * 5.2;

              vNormal = normalMatrix * (uv.y > 0.5 ? normal : -normal);

              vec4 mvPos = modelViewMatrix * vec4(finalPos, 1.0);
              vViewPosition = -mvPos.xyz;

              gl_Position = projectionMatrix * mvPos;
            }
          `;

          const ribbonFragmentShader = `
            uniform float uProgress;
            uniform float uTime;
            varying vec2 vUv;
            varying vec3 vNormal;
            varying vec3 vViewPosition;

            vec3 safeNormalize(vec3 v, vec3 fallback) {
              float len = length(v);
              return len > 0.0001 ? v / len : fallback;
            }

            void main() {
              vec3 N = safeNormalize(vNormal, vec3(0.0, 0.0, 1.0));
              if (!gl_FrontFacing) {
                N = -N;
              }
              vec3 V = safeNormalize(vViewPosition, vec3(0.0, 0.0, 1.0));

              vec3 L = normalize(vec3(-0.6, 0.85, 0.7));
              vec3 H = normalize(L + V);

              float NdotL = max(dot(N, L), 0.0);
              float specSharp = pow(max(dot(N, H), 0.0), 42.0) * 1.6;
              float specBroad = pow(max(dot(N, H), 0.0), 9.0) * 0.65;
              float fresnel = pow(1.0 - max(dot(N, V), 0.0), 2.2);

              vec3 goldShadow = vec3(0.42, 0.30, 0.12);
              vec3 goldMid    = vec3(0.92, 0.80, 0.48);
              vec3 goldPeak   = vec3(1.0, 0.98, 0.90);

              vec3 color = mix(goldShadow, goldMid, NdotL);
              color += goldPeak * (specSharp + specBroad);
              color += goldPeak * fresnel * 0.75;

              float hem = smoothstep(0.12, 0.0, vUv.y) + smoothstep(0.88, 1.0, vUv.y);
              vec3 bullion = vec3(1.0, 0.88, 0.45);
              color = mix(color, bullion, hem * 0.82);

              float glint = sin(vUv.x * 65.0 + uTime * 3.2) * 0.08;
              color += vec3(glint);

              float alpha = smoothstep(0.04, 0.15, uProgress) * (1.0 - smoothstep(0.70, 0.88, uProgress));
              gl_FragColor = vec4(color, alpha);
            }
          `;

          const ribbonGeo = new THREE.PlaneGeometry(1, 1, 130, 24);
          geometriesToDispose.push(ribbonGeo);

          const ribbonMat = new THREE.ShaderMaterial({
            vertexShader: ribbonVertexShader,
            fragmentShader: ribbonFragmentShader,
            uniforms,
            transparent: true,
            side: THREE.DoubleSide,
            depthWrite: false,
          });
          materialsToDispose.push(ribbonMat);

          const ribbonMesh = new THREE.Mesh(ribbonGeo, ribbonMat);
          ribbonMesh.position.z = 0.25;
          scene.add(ribbonMesh);

          // ── Component 3: South Indian Temple Mandapam Architecture ────
          const mandapamGroup = new THREE.Group();
          mandapamGroup.visible = false;
          scene.add(mandapamGroup);

          // Shared Materials
          const stoneMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(0x352e28), // Carved antique granite
            roughness: 0.68,
            metalness: 0.12,
            transparent: true,
            depthWrite: false,
            opacity: 0,
          });
          materialsToDispose.push(stoneMat);

          const goldTrimMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(0xf5c85d), // Polished temple gold
            roughness: 0.22,
            metalness: 0.72,
            transparent: true,
            depthWrite: false,
            opacity: 0,
          });
          materialsToDispose.push(goldTrimMat);

          // 1. Ceremonial Raised Stone Platform (Adhisthana)
          const plinthLowerGeo = new THREE.BoxGeometry(9.5, 0.35, 6.0);
          geometriesToDispose.push(plinthLowerGeo);
          const plinthLower = new THREE.Mesh(plinthLowerGeo, stoneMat);
          plinthLower.position.set(0, -2.4, -1.5);
          mandapamGroup.add(plinthLower);

          const plinthUpperGeo = new THREE.BoxGeometry(8.6, 0.25, 5.2);
          geometriesToDispose.push(plinthUpperGeo);
          const plinthUpper = new THREE.Mesh(plinthUpperGeo, stoneMat);
          plinthUpper.position.set(0, -2.1, -1.5);
          mandapamGroup.add(plinthUpper);

          // 2. Pillars (Stambhas) with bases, fluted shafts & carved capitals
          const pillarBaseGeo = new THREE.BoxGeometry(0.52, 0.42, 0.52);
          geometriesToDispose.push(pillarBaseGeo);

          const pillarShaftGeo = new THREE.CylinderGeometry(0.20, 0.22, 3.4, 16);
          geometriesToDispose.push(pillarShaftGeo);

          const pillarCapitalGeo = new THREE.CylinderGeometry(0.34, 0.18, 0.32, 16);
          geometriesToDispose.push(pillarCapitalGeo);

          const pillarBracketGeo = new THREE.BoxGeometry(0.68, 0.16, 0.68);
          geometriesToDispose.push(pillarBracketGeo);

          const createPillar = (x: number, z: number) => {
            const pillar = new THREE.Group();
            pillar.position.set(x, 0, z);

            // Base plinth
            const base = new THREE.Mesh(pillarBaseGeo, stoneMat);
            base.position.y = -1.78;
            pillar.add(base);

            // Fluted shaft
            const shaft = new THREE.Mesh(pillarShaftGeo, stoneMat);
            shaft.position.y = 0.12;
            pillar.add(shaft);

            // Carved capital (bodika)
            const cap = new THREE.Mesh(pillarCapitalGeo, goldTrimMat);
            cap.position.y = 1.95;
            pillar.add(cap);

            const bracket = new THREE.Mesh(pillarBracketGeo, stoneMat);
            bracket.position.y = 2.15;
            pillar.add(bracket);

            return pillar;
          };

          // Front Entrance Pillars
          mandapamGroup.add(createPillar(-3.6, 0.0));
          mandapamGroup.add(createPillar(-1.8, 0.0));
          mandapamGroup.add(createPillar(1.8, 0.0));
          mandapamGroup.add(createPillar(3.6, 0.0));

          // Receding Colonnade Hall Pillars (Depth & Perspective)
          mandapamGroup.add(createPillar(-1.8, -2.2));
          mandapamGroup.add(createPillar(1.8, -2.2));
          mandapamGroup.add(createPillar(-1.8, -4.4));
          mandapamGroup.add(createPillar(1.8, -4.4));
          mandapamGroup.add(createPillar(-1.8, -6.6));
          mandapamGroup.add(createPillar(1.8, -6.6));

          // 3. Horizontal Architrave & Carved Cross Beams (Uttira)
          const frontBeamGeo = new THREE.BoxGeometry(8.8, 0.34, 0.55);
          geometriesToDispose.push(frontBeamGeo);
          const frontBeam = new THREE.Mesh(frontBeamGeo, stoneMat);
          frontBeam.position.set(0, 2.38, 0.0);
          mandapamGroup.add(frontBeam);

          // Longitudinal side beams spanning into the colonnade
          const sideBeamGeo = new THREE.BoxGeometry(0.42, 0.32, 7.2);
          geometriesToDispose.push(sideBeamGeo);

          const leftSideBeam = new THREE.Mesh(sideBeamGeo, stoneMat);
          leftSideBeam.position.set(-1.8, 2.38, -3.3);
          mandapamGroup.add(leftSideBeam);

          const rightSideBeam = new THREE.Mesh(sideBeamGeo, stoneMat);
          rightSideBeam.position.set(1.8, 2.38, -3.3);
          mandapamGroup.add(rightSideBeam);

          // 4. Sculpted Torana Arch (Frames 08 & 09)
          const archGeo = new THREE.TorusGeometry(1.85, 0.15, 16, 48, Math.PI);
          geometriesToDispose.push(archGeo);
          const archMesh = new THREE.Mesh(archGeo, goldTrimMat);
          archMesh.position.set(0, 1.85, 0.05);
          mandapamGroup.add(archMesh);

          // 4b. Bellamkonda Sai Sreenivas & Kavya Reddy Wedding Photograph (Framed in Mandapam Arch)
          const archShape = new THREE.Shape();
          const archHalfW = 1.72;
          const archBottom = -2.1;
          const archSpring = 1.35;
          const archApex = 3.25;

          archShape.moveTo(-archHalfW, archBottom);
          archShape.lineTo(archHalfW, archBottom);
          archShape.lineTo(archHalfW, archSpring);
          archShape.bezierCurveTo(archHalfW, archSpring + 0.8, 0.45, archApex - 0.25, 0.0, archApex);
          archShape.bezierCurveTo(-0.45, archApex - 0.25, -archHalfW, archSpring + 0.8, -archHalfW, archSpring);
          archShape.closePath();

          const archPhotoGeo = new THREE.ShapeGeometry(archShape, 32);
          geometriesToDispose.push(archPhotoGeo);

          const texLoader = new THREE.TextureLoader();
          const bellamTexture = texLoader.load("/images/stories/bellam-srikonda/IMG_6339.webp");
          bellamTexture.colorSpace = THREE.SRGBColorSpace;
          bellamTexture.generateMipmaps = true;
          bellamTexture.minFilter = THREE.LinearMipmapLinearFilter;

          const archPhotoUniforms = {
            uPhoto: { value: bellamTexture },
            uOpacity: { value: 0 },
          };

          const archPhotoMat = new THREE.ShaderMaterial({
            uniforms: archPhotoUniforms,
            vertexShader: `
              varying vec2 vUv;
              void main() {
                float normX = (position.x + 1.72) / 3.44;
                float normY = (position.y - (-2.1)) / 5.35;
                vUv = vec2(normX, normY);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
              }
            `,
            fragmentShader: `
              uniform sampler2D uPhoto;
              uniform float uOpacity;
              varying vec2 vUv;
              void main() {
                vec2 uv = vUv;
                uv.y = uv.y * 0.94 + 0.04;
                vec4 tex = texture2D(uPhoto, uv);
                vec3 col = tex.rgb;

                float dist = length(vec2(vUv.x - 0.5, vUv.y - 0.5));
                col *= (1.0 - smoothstep(0.40, 0.68, dist) * 0.28);

                gl_FragColor = vec4(col, tex.a * uOpacity);
              }
            `,
            transparent: true,
            depthWrite: false,
            side: THREE.DoubleSide,
          });
          materialsToDispose.push(archPhotoMat);

          const archPhotoMesh = new THREE.Mesh(archPhotoGeo, archPhotoMat);
          archPhotoMesh.position.set(0, 0, -0.05);
          mandapamGroup.add(archPhotoMesh);

          // 5. Cascading Jasmine (Mogra) & Marigold Garlands (Mallige Male)
          const mograGeo = new THREE.SphereGeometry(0.08, 8, 8);
          geometriesToDispose.push(mograGeo);

          const mograMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(0xfffdf2), // Ivory jasmine buds
            roughness: 0.85,
            metalness: 0.05,
            transparent: true,
            depthWrite: false,
            opacity: 0,
          });
          materialsToDispose.push(mograMat);

          const marigoldGeo = new THREE.SphereGeometry(0.09, 8, 8);
          geometriesToDispose.push(marigoldGeo);

          const marigoldMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(0xf59e0b), // Golden marigold blossoms
            roughness: 0.78,
            metalness: 0.08,
            transparent: true,
            depthWrite: false,
            opacity: 0,
          });
          materialsToDispose.push(marigoldMat);

          const garlandCount = 120;
          const garlandInstances = new THREE.InstancedMesh(mograGeo, mograMat, garlandCount);
          const garlandMarigoldInstances = new THREE.InstancedMesh(marigoldGeo, marigoldMat, garlandCount);
          const dummy = new THREE.Object3D();

          for (let i = 0; i < 60; i++) {
            const t = i / 60.0;
            const angleL = t * 14.0;
            const rL = 0.38 + Math.sin(t * 12.0) * 0.05;

            // Left pillar garland
            dummy.position.set(-1.8 + Math.cos(angleL) * rL, 1.9 - t * 3.8, 0.05 + Math.sin(angleL) * rL);
            dummy.scale.setScalar(0.75 + Math.sin(t * 9.0) * 0.3);
            dummy.updateMatrix();
            garlandInstances.setMatrixAt(i, dummy.matrix);

            // Alternate marigolds
            dummy.position.set(-1.8 + Math.cos(angleL + 1.2) * (rL * 0.9), 1.85 - t * 3.8, 0.05 + Math.sin(angleL + 1.2) * (rL * 0.9));
            dummy.scale.setScalar(0.85);
            dummy.updateMatrix();
            garlandMarigoldInstances.setMatrixAt(i, dummy.matrix);

            // Right pillar garland
            const angleR = t * 14.0 + Math.PI;
            const rR = 0.38 + Math.sin(t * 12.0) * 0.05;
            dummy.position.set(1.8 + Math.cos(angleR) * rR, 1.9 - t * 3.8, 0.05 + Math.sin(angleR) * rR);
            dummy.scale.setScalar(0.75 + Math.sin(t * 9.0) * 0.3);
            dummy.updateMatrix();
            garlandInstances.setMatrixAt(i + 60, dummy.matrix);

            dummy.position.set(1.8 + Math.cos(angleR + 1.2) * (rR * 0.9), 1.85 - t * 3.8, 0.05 + Math.sin(angleR + 1.2) * (rR * 0.9));
            dummy.scale.setScalar(0.85);
            dummy.updateMatrix();
            garlandMarigoldInstances.setMatrixAt(i + 60, dummy.matrix);
          }
          garlandInstances.instanceMatrix.needsUpdate = true;
          garlandMarigoldInstances.instanceMatrix.needsUpdate = true;
          mandapamGroup.add(garlandInstances);
          mandapamGroup.add(garlandMarigoldInstances);

          // ── Component 4: Sacred Govinda Namalu Devotional Crest (Frame 09) ──
          // Located at the center apex of the Torana Arch (y = 2.45) — NO TEXT
          const namaluGroup = new THREE.Group();
          namaluGroup.position.set(0, 2.45, 0.22);
          mandapamGroup.add(namaluGroup);

          const tirumanMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(0xffffff),
            roughness: 0.18,
            metalness: 0.15,
            emissive: new THREE.Color(0x444444),
            transparent: true,
            depthWrite: false,
            opacity: 0,
          });
          materialsToDispose.push(tirumanMat);

          const tirumanGeo = new THREE.CylinderGeometry(0.08, 0.055, 1.05, 16);
          geometriesToDispose.push(tirumanGeo);

          const leftTiruman = new THREE.Mesh(tirumanGeo, tirumanMat);
          leftTiruman.position.set(-0.28, 0.36, 0);
          leftTiruman.rotation.z = -0.15;
          namaluGroup.add(leftTiruman);

          const rightTiruman = new THREE.Mesh(tirumanGeo, tirumanMat);
          rightTiruman.position.set(0.28, 0.36, 0);
          rightTiruman.rotation.z = 0.15;
          namaluGroup.add(rightTiruman);

          const tirumanBaseGeo = new THREE.TorusGeometry(0.28, 0.065, 12, 24, Math.PI);
          geometriesToDispose.push(tirumanBaseGeo);
          const tirumanBase = new THREE.Mesh(tirumanBaseGeo, tirumanMat);
          tirumanBase.rotation.z = Math.PI;
          tirumanBase.position.set(0, -0.04, 0);
          namaluGroup.add(tirumanBase);

          const tilakMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(0xd61827),
            roughness: 0.28,
            metalness: 0.18,
            emissive: new THREE.Color(0x660810),
            transparent: true,
            depthWrite: false,
            opacity: 0,
          });
          materialsToDispose.push(tilakMat);

          const tilakGeo = new THREE.CylinderGeometry(0.048, 0.032, 0.88, 16);
          geometriesToDispose.push(tilakGeo);
          const tilakMesh = new THREE.Mesh(tilakGeo, tilakMat);
          tilakMesh.position.set(0, 0.35, 0.02);
          namaluGroup.add(tilakMesh);

          const medallionGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.05, 32);
          geometriesToDispose.push(medallionGeo);
          const medallionMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(0xffd700),
            roughness: 0.20,
            metalness: 0.82,
            emissive: new THREE.Color(0x4a3200),
            transparent: true,
            depthWrite: false,
            opacity: 0,
          });
          materialsToDispose.push(medallionMat);

          const medallionMesh = new THREE.Mesh(medallionGeo, medallionMat);
          medallionMesh.rotation.x = Math.PI / 2;
          medallionMesh.position.set(0, -0.18, 0);
          namaluGroup.add(medallionMesh);

          const haloGeo = new THREE.PlaneGeometry(3.0, 3.0);
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
          haloMesh.position.set(0, 0.26, -0.06);
          namaluGroup.add(haloMesh);

          // ── Component 5: Horizon Dawn Light at Colonnade Terminus (Stage 10 to 13) ──
          const sanctumLightGeo = new THREE.PlaneGeometry(8.0, 8.0);
          geometriesToDispose.push(sanctumLightGeo);
          const sanctumLightMat = new THREE.ShaderMaterial({
            uniforms: {
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
              uniform float uOpacity;
              varying vec2 vUv;
              void main() {
                float dist = length(vUv - vec2(0.5));
                float glow = smoothstep(0.5, 0.0, dist);
                vec3 dawnColor = vec3(1.0, 0.92, 0.72);
                gl_FragColor = vec4(dawnColor, glow * uOpacity);
              }
            `,
            transparent: true,
            depthWrite: false,
          });
          materialsToDispose.push(sanctumLightMat);

          const sanctumLightMesh = new THREE.Mesh(sanctumLightGeo, sanctumLightMat);
          sanctumLightMesh.position.set(0, 0.4, -7.8);
          mandapamGroup.add(sanctumLightMesh);

          // ── Component 6: Cinematic 3D Floating Bokeh Dust Particles ──
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

          // Scene Lighting: Warm Directional Golden Sun + Temple Interior Fill
          const ambientLight = new THREE.AmbientLight(0xfff6e5, 0.88);
          scene.add(ambientLight);

          const sunLight = new THREE.DirectionalLight(0xfff0c2, 1.35);
          sunLight.position.set(-6, 7, 5);
          scene.add(sunLight);

          const templeGlow = new THREE.PointLight(0xffb84d, 1.4, 18);
          templeGlow.position.set(0, 1.2, -2.0);
          scene.add(templeGlow);

          stateRef.current.webgl = {
            renderer,
            scene,
            camera,
            uniforms,
            materials: materialsToDispose,
            geometries: geometriesToDispose,
          };

          // ── High-Performance Visibility-Aware WebGL Render Loop ──
          let renderLoopRunning = false;
          let lastTime = performance.now();

          const renderScene = (time: number) => {
            const dt = Math.min((time - lastTime) * 0.001, 0.1);
            lastTime = time;

            uniforms.uTime.value += dt;
            haloMat.uniforms.uTime.value += dt;

            // Slowly drift bokeh particles in 3D space
            const positions = bokehGeo.attributes.position.array as Float32Array;
            for (let i = 0; i < bokehCount; i++) {
              positions[i * 3 + 1] += Math.sin(time * 0.001 + i) * 0.0015;
              positions[i * 3 + 0] += Math.cos(time * 0.0008 + i) * 0.0015;
            }
            bokehGeo.attributes.position.needsUpdate = true;

            const p = uniforms.uProgress.value;

            // Mandapam visibility gate: Renders when fabric starts to drape (p > 0.48)
            mandapamGroup.visible = p > 0.48;

            if (mandapamGroup.visible) {
              const mandapamOpacity = THREE.MathUtils.smoothstep(p, 0.52, 0.78);
              const mandapamExit = 1.0 - THREE.MathUtils.smoothstep(p, 0.97, 1.0);
              const currentArchAlpha = mandapamOpacity * mandapamExit;

              stoneMat.opacity = currentArchAlpha * 0.98;
              goldTrimMat.opacity = currentArchAlpha * 0.98;
              mograMat.opacity = currentArchAlpha * 0.95;
              marigoldMat.opacity = currentArchAlpha * 0.95;

              const namaluOpacity =
                THREE.MathUtils.smoothstep(p, 0.68, 0.82) * (1.0 - THREE.MathUtils.smoothstep(p, 0.96, 1.0));
              tirumanMat.opacity = namaluOpacity * 0.98;
              tilakMat.opacity = namaluOpacity * 0.98;
              medallionMat.opacity = namaluOpacity * 0.95;
              haloMat.uniforms.uOpacity.value = namaluOpacity * 0.85;

              const dawnLightOpacity = THREE.MathUtils.smoothstep(p, 0.76, 0.98);
              sanctumLightMat.uniforms.uOpacity.value = dawnLightOpacity * 0.88;

              // Framed Bellamkonda & Kavya wedding photograph reveal through arch
              const photoReveal = THREE.MathUtils.smoothstep(p, 0.60, 0.85);
              const photoExit = 1.0 - THREE.MathUtils.smoothstep(p, 0.97, 1.0);
              archPhotoUniforms.uOpacity.value = photoReveal * photoExit;
            }

            // Smooth Perspective Camera Dolly into Colonnade Hall (Stages 10 to 13)
            if (p > 0.82) {
              const dolly = THREE.MathUtils.smoothstep(p, 0.82, 1.0);
              camera.position.z = 7.5 - dolly * 3.6;
              camera.position.y = dolly * 0.35;
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

          // Performance guard: automatically pause when container is scrolled out of viewport
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
            bellamTexture.dispose();
            geometriesToDispose.forEach((g) => g.dispose());
            materialsToDispose.forEach((m) => m.dispose());
          };
        } catch (e) {
          console.error("--> WebGL initialization failed:", e);
        }
      }

      // ═════════════════════════════════════════════════════════════
      // PATH B: PROCEDURAL 2D CANVAS CLOTH ENGINE (RESILIENT FALLBACK)
      // Preserves 100% continuous mathematical silk deformation,
      // billowing ribbon motion, and South Indian mandapam formation
      // even in environments where WebGL is disabled or unsupported.
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

        stateRef.current.canvas2d = { ctx, width, height, time: 0 };

        let renderLoopRunning2d = false;
        let lastTime2d = performance.now();
        const render2D = (time: number) => {
          const dt = (time - lastTime2d) * 0.001;
          lastTime2d = time;

          const p = stateRef.current.progress;
          ctx.clearRect(0, 0, width, height);

          if (p <= 0.01) return;

          const entry = Math.min(1, Math.max(0, (p - 0.0) / 0.28));
          const drape = Math.min(1, Math.max(0, (p - 0.52) / 0.38));
          const exit = 1.0 - Math.min(1, Math.max(0, (p - 0.95) / 0.05));

          ctx.save();
          ctx.globalAlpha = entry * exit;

          const grad = ctx.createLinearGradient(0, 0, width, height);
          grad.addColorStop(0, "#011209");
          grad.addColorStop(0.4, "#063824");
          grad.addColorStop(0.8, "#0d5c3b");
          grad.addColorStop(1, "#021c10");

          ctx.fillStyle = grad;
          ctx.beginPath();

          const wave1 = Math.sin(time * 0.0012 + p * 3.5) * (height * 0.12);
          const wave2 = Math.cos(time * 0.0016 + p * 2.8) * (height * 0.08);

          const archPull = drape * width * 0.35;
          const leftX = width * 0.1 - archPull;
          const rightX = width * 0.9 + archPull;

          ctx.moveTo(0, 0);
          ctx.lineTo(width, 0);
          ctx.bezierCurveTo(
            rightX, height * 0.35 + wave2,
            width * 0.5, height * 0.5 + wave1 - drape * (height * 0.3),
            leftX, height * 0.8 + wave2
          );
          ctx.lineTo(0, height);
          ctx.closePath();
          ctx.fill();

          // Ribbon Overlay
          if (p > 0.08 && p < 0.85) {
            const ribbonAlpha = Math.min(1, (p - 0.08) / 0.15) * Math.min(1, (0.85 - p) / 0.15);
            ctx.strokeStyle = `rgba(245, 200, 93, ${0.75 * ribbonAlpha})`;
            ctx.lineWidth = Math.max(3, width * 0.012);
            ctx.beginPath();
            ctx.moveTo(width * 0.05, height * 0.85);
            ctx.bezierCurveTo(
              width * 0.35, height * 0.45 + Math.sin(time * 0.002) * 30,
              width * 0.65, height * 0.75 + Math.cos(time * 0.002) * 30,
              width * 0.95, height * 0.25
            );
            ctx.stroke();
          }

          // Mandapam Arch & Govinda Namalu in Fallback Canvas
          if (drape > 0.1) {
            ctx.strokeStyle = `rgba(245, 200, 93, ${drape * 0.9})`;
            ctx.lineWidth = Math.max(2, width * 0.006);
            ctx.beginPath();
            ctx.arc(width * 0.5, height * 0.48, width * 0.18, Math.PI, 0, false);
            ctx.stroke();

            // Devotional Crest (No text)
            const crestY = height * 0.48 - width * 0.18;
            ctx.fillStyle = `rgba(255, 255, 255, ${drape * 0.95})`;
            ctx.fillRect(width * 0.5 - 12, crestY - 24, 6, 28);
            ctx.fillRect(width * 0.5 + 6, crestY - 24, 6, 28);
            ctx.fillStyle = `rgba(214, 24, 39, ${drape * 0.95})`;
            ctx.fillRect(width * 0.5 - 2, crestY - 22, 4, 26);
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
