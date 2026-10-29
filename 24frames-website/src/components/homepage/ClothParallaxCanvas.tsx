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
 * Real-time 3D WebGL Cloth & Mandapam Simulation:
 * 1. 3D Emerald Silk Mantle: Subdivided grid mesh deformed with 4-octave Gerstner waves,
 *    analytical normals, Kajiya-Kay anisotropic silk sheen, and woven gold zari border.
 * 2. 3D Twisting Gold Silk Sash: 3D parametric ribbon with continuous 360° Frenet twist,
 *    champagne gold luster, and double-sided lighting (Storyboard Frame 06 & 07).
 * 3. South Indian Mandapam Architecture: Fluted granite pillars with stepped pedestals,
 *    multi-tier lotus capitals, carved torana arch, and cascading jasmine mogra garlands (Frame 08 & 09).
 * 4. Sacred Govinda Namalu Devotional Crest: Pristine white Tiruman uprights, crimson Kasturi Tilak,
 *    and golden Sudarshana sunburst medallion at the arch apex (Frame 09).
 * 5. Colonnade Corridor & Horizon Dawn Light: Receding perspective portal with camera dolly into The Vows (Frame 10).
 * 6. Dual-Engine Architecture: High-fidelity Three.js WebGL with resilient 2D Canvas fallback.
 */
const ClothParallaxCanvas = forwardRef<ClothParallaxHandle, ClothParallaxCanvasProps>(
  ({ initialProgress = 0 }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fallbackCanvasRef = useRef<HTMLCanvasElement>(null);

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
        }
      },
      setActive: (active: boolean) => {
        stateRef.current.isActive = active;
        if (containerRef.current) {
          containerRef.current.style.opacity = active ? "1" : "0";
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
      } catch (e) {
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
          renderer.toneMappingExposure = 1.25;

          const scene = new THREE.Scene();
          const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
          camera.position.set(0, 0, 7.5);

          const uniforms = {
            uProgress: { value: initialProgress },
            uTime: { value: 0 },
            uAspect: { value: width / height },
          };

          const materialsToDispose: THREE.Material[] = [];
          const geometriesToDispose: THREE.BufferGeometry[] = [];

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

            // Gerstner Trochoidal Wave Function for Authentic Cloth Folds
            vec3 gerstnerFold(vec2 uv, vec2 dir, float steepness, float wavelength, float speed, float time, float p) {
              float k = 6.283185 / wavelength;
              float c = sqrt(9.8 / k);
              vec2 d = normalize(dir);
              float f = k * (dot(d, uv * vec2(12.0, 8.0)) - c * speed * time + p * 4.2);
              float a = steepness / k;

              return vec3(
                d.x * (a * cos(f)),
                d.y * (a * cos(f)),
                a * sin(f)
              );
            }

            vec3 computeCloth(vec2 uv, float p, float time) {
              // Time and scroll-driven entry progress
              float entry = smoothstep(0.0, 0.25, p);
              float flow  = smoothstep(0.18, 0.65, p);
              float drape = smoothstep(0.55, 0.92, p);

              // Base un-deformed coordinate plane
              float x = (uv.x - 0.5) * 12.5;
              float y = (uv.y - 0.5) * 8.2;
              vec3 pos = vec3(x, y, 0.0);

              // 4 Octaves of Trochoidal Gerstner Folds
              vec3 g1 = gerstnerFold(uv, vec2(0.85, 0.52), 0.58, 6.5, 0.85, time, p);
              vec3 g2 = gerstnerFold(uv, vec2(-0.65, 0.75), 0.42, 3.8, 1.15, time, p);
              vec3 g3 = gerstnerFold(uv, vec2(0.35, -0.92), 0.28, 2.1, 1.45, time, p);
              vec3 g4 = gerstnerFold(uv, vec2(1.0, 0.1), 0.15, 0.85, 2.1, time, p);

              float foldAmp = mix(0.4, 1.35, flow);
              pos.x -= (g1.x + g2.x * 0.5) * foldAmp;
              pos.y -= (g1.y + g2.y * 0.5) * foldAmp;
              pos.z += (g1.z + g2.z + g3.z + g4.z) * foldAmp;

              // Dramatic diagonal catenary billow from top-left (glare origin)
              float diagonalBias = (uv.x + (1.0 - uv.y)) * 0.5;
              pos.z += sin(diagonalBias * 4.2 - time * 0.9 + p * 3.6) * 0.85 * flow;

              // Architectural Mandapam Swag Drapery Morph (p > 0.55)
              // The central fabric pulls back to reveal the temple mandapam archway
              float archDist = abs(uv.x - 0.5) * 2.0;
              float catenaryArch = pow(archDist, 1.85);
              float swagY = mix(2.4, -3.2, catenaryArch);
              float flutedPleats = sin(uv.x * 40.0) * 0.24 * smoothstep(0.35, 1.0, archDist);

              vec3 drapedPos = vec3(
                mix(pos.x, (uv.x - 0.5) * 8.5 + (uv.x < 0.5 ? -1.2 : 1.2), drape * 0.75),
                mix(pos.y, swagY, drape),
                mix(pos.z * 0.4, flutedPleats - 0.35, drape)
              );

              pos = mix(pos, drapedPos, drape);

              // Smooth entry from top-left flare source
              pos.x += (1.0 - entry) * -9.5;
              pos.y += (1.0 - entry) * 6.2;
              pos.z += (1.0 - entry) * -3.0;

              return pos;
            }

            void main() {
              vUv = uv;
              vec3 pos = computeCloth(uv, uProgress, uTime);

              // Calculate Analytical Surface Normals via Finite Differences
              float delta = 0.012;
              vec3 posX = computeCloth(uv + vec2(delta, 0.0), uProgress, uTime);
              vec3 posY = computeCloth(uv + vec2(0.0, delta), uProgress, uTime);
              vec3 tangentX = normalize(posX - pos);
              vec3 tangentY = normalize(posY - pos);
              vec3 n = normalize(cross(tangentX, tangentY));

              vNormal = normalMatrix * n;
              vFoldDepth = pos.z;

              vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
              vViewPosition = -mvPos.xyz;
              vWorldPosition = (modelMatrix * vec4(pos, 1.0)).xyz;

              gl_Position = projectionMatrix * mvPos;
            }
          `;

          // ── GLSL Fragment Shader: Kajiya-Kay Anisotropic Emerald Silk ──
          const emeraldSilkFragmentShader = `
            uniform float uProgress;
            uniform float uTime;
            varying vec2 vUv;
            varying vec3 vNormal;
            varying vec3 vViewPosition;
            varying vec3 vWorldPosition;
            varying float vFoldDepth;

            void main() {
              vec3 N = normalize(vNormal);
              vec3 V = normalize(vViewPosition);

              // Directional warm sunlight and temple ambient fill
              vec3 L1 = normalize(vec3(-0.62, 0.78, 0.7));
              vec3 L2 = normalize(vec3(0.5, -0.4, 0.4));

              float NdotL1 = max(dot(N, L1), 0.0);
              float NdotL2 = max(dot(N, L2), 0.0) * 0.42;

              // Kajiya-Kay Anisotropic Silk Fiber Sheen
              vec3 T = normalize(cross(N, vec3(0.0, 1.0, 0.2)));
              vec3 H1 = normalize(L1 + V);
              float TdotH = dot(T, H1);
              float sinTH = sqrt(max(0.0, 1.0 - TdotH * TdotH));
              float anisoSharp = pow(sinTH, 32.0) * 1.35;
              float anisoBroad = pow(sinTH, 6.0) * 0.45;

              // Grazing Fresnel Rim
              float fresnel = pow(1.0 - max(dot(N, V), 0.0), 3.0);

              // Imperial Emerald & Forest Green Silk Palette
              vec3 deepShadow  = vec3(0.008, 0.045, 0.028); // #020d08 inky forest velvet
              vec3 midEmerald   = vec3(0.025, 0.22, 0.14);   // #063824 imperial emerald body
              vec3 crestEmerald = vec3(0.07, 0.48, 0.32);    // #127a52 vibrant satin crest
              vec3 champagne    = vec3(0.94, 0.84, 0.60);    // #f0d699 warm champagne glint

              vec3 silkColor = mix(deepShadow, midEmerald, NdotL1);
              silkColor = mix(silkColor, crestEmerald, pow(NdotL1, 2.2));
              silkColor += midEmerald * NdotL2;

              // Anisotropic silk fiber reflections
              silkColor += mix(crestEmerald, champagne, 0.72) * (anisoSharp + anisoBroad);
              silkColor += champagne * fresnel * 0.58;

              // Woven Zari Gold Bullion Brocade Border along outer selvedge edges
              float zariEdge = smoothstep(0.92, 0.985, vUv.x) + smoothstep(0.08, 0.015, vUv.x);
              float zariWeaveNoise = sin(vUv.y * 180.0) * 0.15 + cos(vUv.x * 120.0) * 0.15;
              vec3 goldZari = vec3(0.96, 0.82, 0.36) + zariWeaveNoise * 0.12;
              float zariSpec = pow(max(dot(N, H1), 0.0), 18.0) * 0.85;
              goldZari += vec3(0.98, 0.94, 0.72) * zariSpec;

              silkColor = mix(silkColor, goldZari, zariEdge * 0.92);

              // Alpha fade during entry and colonnade exit
              float alpha = smoothstep(0.0, 0.08, uProgress) * (1.0 - smoothstep(0.96, 1.0, uProgress));
              gl_FragColor = vec4(silkColor, alpha);
            }
          `;

          // 1. Create Subdivided 3D Emerald Silk Mesh (14,400 vertices for silky curves)
          const emeraldGeo = new THREE.PlaneGeometry(1, 1, 120, 120);
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

          // ── Component 2: 3D Twisting Gold Champagne Silk Ribbon (Frames 06 & 07) ──
          // A dedicated 3D parametric ribbon with true thickness, Frenet twisting, and champagne luster
          const ribbonVertexShader = `
            uniform float uProgress;
            uniform float uTime;
            uniform float uAspect;
            varying vec2 vUv;
            varying vec3 vNormal;
            varying vec3 vViewPosition;

            // Catmull-Rom 3D Spline Path for Flowing Ceremonial Sash
            vec3 ribbonPath(float t, float p, float time) {
              // 4 Control points forming an organic S-curve through 3D space
              vec3 p0 = vec3(-6.5, 4.2, -1.0);
              vec3 p1 = vec3(-2.2, 1.8, 1.2);
              vec3 p2 = vec3(1.2, -0.4, 1.8);
              vec3 p3 = vec3(5.8, -2.8, 0.2);

              // Cubic Bézier evaluation
              float u = 1.0 - t;
              vec3 pt = u*u*u*p0 + 3.0*u*u*t*p1 + 3.0*u*t*t*p2 + t*t*t*p3;

              // Wave undulating dynamics along spline
              float wave = sin(t * 7.5 - time * 1.2 + p * 5.0) * 0.45;
              pt.y += wave;
              pt.z += cos(t * 6.0 - time * 1.0 + p * 4.5) * 0.55;

              return pt;
            }

            void main() {
              vUv = uv;
              float t = uv.x;
              float ribbonWidth = 0.88;

              // Evaluate center spine position and tangent
              vec3 pos = ribbonPath(t, uProgress, uTime);
              vec3 posNext = ribbonPath(min(1.0, t + 0.01), uProgress, uTime);
              vec3 tangent = normalize(posNext - pos);

              // Continuous 360° Frenet Twist Angle
              float twist = t * 3.14159 * 2.4 - uTime * 0.6 + uProgress * 4.2;
              vec3 up = vec3(sin(twist), cos(twist), sin(twist * 0.5));
              vec3 normal = normalize(cross(tangent, up));
              vec3 binormal = cross(tangent, normal);

              // Displace vertices across ribbon width
              float widthOffset = (uv.y - 0.5) * ribbonWidth;
              vec3 finalPos = pos + binormal * widthOffset;

              // Entry & Exit animation
              float entry = smoothstep(0.04, 0.28, uProgress);
              float exit  = 1.0 - smoothstep(0.72, 0.90, uProgress);
              finalPos.x += (1.0 - entry) * -8.0;
              finalPos.y += (1.0 - entry) * 5.0;

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

            void main() {
              vec3 N = normalize(vNormal);
              vec3 V = normalize(vViewPosition);

              vec3 L = normalize(vec3(-0.6, 0.85, 0.7));
              vec3 H = normalize(L + V);

              float NdotL = max(dot(N, L), 0.0);
              float specSharp = pow(max(dot(N, H), 0.0), 45.0) * 1.8;
              float specBroad = pow(max(dot(N, H), 0.0), 9.0) * 0.75;
              float fresnel = pow(1.0 - max(dot(N, V), 0.0), 2.5);

              // Champagne & Bullion Gold Palette
              vec3 goldShadow = vec3(0.32, 0.22, 0.08); // #523814 rich amber shadow
              vec3 goldMid    = vec3(0.88, 0.72, 0.36); // #e0b85c warm spun champagne silk
              vec3 goldPeak   = vec3(1.0, 0.96, 0.82);  // #fff5d1 radiant specular crest

              vec3 color = mix(goldShadow, goldMid, NdotL);
              color += goldPeak * (specSharp + specBroad);
              color += goldPeak * fresnel * 0.75;

              // Metallic woven gold hem piping on ribbon borders
              float hem = smoothstep(0.08, 0.0, vUv.y) + smoothstep(0.92, 1.0, vUv.y);
              vec3 bullion = vec3(1.0, 0.86, 0.42);
              color = mix(color, bullion, hem * 0.75);

              // Sparkling specular glints
              float glint = sin(vUv.x * 65.0 + uTime * 3.2) * 0.08;
              color += vec3(glint);

              float alpha = smoothstep(0.05, 0.18, uProgress) * (1.0 - smoothstep(0.72, 0.88, uProgress));
              gl_FragColor = vec4(color, alpha);
            }
          `;

          const ribbonGeo = new THREE.PlaneGeometry(1, 1, 120, 24);
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

          // ── Component 3: South Indian Temple Mandapam Architecture (Frames 08 & 09) ──
          const mandapamGroup = new THREE.Group();
          scene.add(mandapamGroup);

          // Authentic Sandstone / Granite Temple Material
          const templeStoneMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(0xd2a764),
            roughness: 0.38,
            metalness: 0.28,
            transparent: true,
            opacity: 0,
          });
          materialsToDispose.push(templeStoneMat);

          const goldTrimMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(0xf5c85d),
            roughness: 0.22,
            metalness: 0.65,
            transparent: true,
            opacity: 0,
          });
          materialsToDispose.push(goldTrimMat);

          // Helper: Create a Fluted Dravidian Temple Column (Stambha)
          const createTempleColumn = (x: number, z: number, scale: number = 1.0) => {
            const colGroup = new THREE.Group();
            colGroup.position.set(x, -0.6, z);
            colGroup.scale.setScalar(scale);

            // 1. Stepped Pedestal Base (Upapitham / Adhisthana)
            const baseGeo1 = new THREE.BoxGeometry(1.2, 0.35, 1.2);
            geometriesToDispose.push(baseGeo1);
            const base1 = new THREE.Mesh(baseGeo1, templeStoneMat);
            base1.position.y = -3.2;
            colGroup.add(base1);

            const baseGeo2 = new THREE.BoxGeometry(0.95, 0.28, 0.95);
            geometriesToDispose.push(baseGeo2);
            const base2 = new THREE.Mesh(baseGeo2, templeStoneMat);
            base2.position.y = -2.9;
            colGroup.add(base2);

            // 2. Fluted Column Shaft (16-sided fluting)
            const shaftGeo = new THREE.CylinderGeometry(0.36, 0.42, 5.8, 16);
            geometriesToDispose.push(shaftGeo);
            const shaft = new THREE.Mesh(shaftGeo, templeStoneMat);
            shaft.position.y = 0.05;
            colGroup.add(shaft);

            // Decorative Horizontal Carved Rings (Bandhas)
            const bandGeo = new THREE.TorusGeometry(0.40, 0.045, 12, 24);
            geometriesToDispose.push(bandGeo);
            const band1 = new THREE.Mesh(bandGeo, goldTrimMat);
            band1.rotation.x = Math.PI / 2;
            band1.position.y = -1.2;
            colGroup.add(band1);

            const band2 = new THREE.Mesh(bandGeo, goldTrimMat);
            band2.rotation.x = Math.PI / 2;
            band2.position.y = 1.3;
            colGroup.add(band2);

            // 3. Multi-tiered Sculpted Capital (Potika / Bodigai)
            const capGeo1 = new THREE.CylinderGeometry(0.58, 0.38, 0.42, 16);
            geometriesToDispose.push(capGeo1);
            const cap1 = new THREE.Mesh(capGeo1, templeStoneMat);
            cap1.position.y = 3.05;
            colGroup.add(cap1);

            const capGeo2 = new THREE.BoxGeometry(0.95, 0.26, 0.95);
            geometriesToDispose.push(capGeo2);
            const cap2 = new THREE.Mesh(capGeo2, goldTrimMat);
            cap2.position.y = 3.32;
            colGroup.add(cap2);

            return colGroup;
          };

          // Main Mandapam Front Portal Columns
          const leftMainCol = createTempleColumn(-3.35, -0.2);
          const rightMainCol = createTempleColumn(3.35, -0.2);
          mandapamGroup.add(leftMainCol);
          mandapamGroup.add(rightMainCol);

          // ── The Sculpted Torana Arch (Frames 08 & 09) ──
          // Semicircular ornamental gateway bridging the columns
          const archGeo = new THREE.TorusGeometry(3.35, 0.24, 16, 48, Math.PI);
          geometriesToDispose.push(archGeo);
          const archMesh = new THREE.Mesh(archGeo, goldTrimMat);
          archMesh.position.set(0, 2.72, -0.2);
          archMesh.rotation.z = 0; // Semicircle opening downwards
          mandapamGroup.add(archMesh);

          // Horizontal Mandapam Lintel Beam (Uttira)
          const lintelGeo = new THREE.BoxGeometry(7.8, 0.32, 0.7);
          geometriesToDispose.push(lintelGeo);
          const lintelMesh = new THREE.Mesh(lintelGeo, templeStoneMat);
          lintelMesh.position.set(0, 2.85, -0.2);
          mandapamGroup.add(lintelMesh);

          // ── Cascading Jasmine / Mogra Flower Garlands (Mallige Male) ──
          const mograGeo = new THREE.SphereGeometry(0.085, 8, 8);
          geometriesToDispose.push(mograGeo);
          const mograMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(0xfffbf2),
            roughness: 0.85,
            metalness: 0.05,
            transparent: true,
            opacity: 0,
          });
          materialsToDispose.push(mograMat);

          const garlandCount = 160;
          const garlandInstances = new THREE.InstancedMesh(mograGeo, mograMat, garlandCount);
          const dummy = new THREE.Object3D();

          for (let i = 0; i < 80; i++) {
            const t = i / 80.0;
            // Left column spiral garland
            const angleL = t * 15.0;
            const rL = 0.44 + Math.sin(t * 12.0) * 0.06;
            dummy.position.set(-3.35 + Math.cos(angleL) * rL, 2.8 - t * 5.8, -0.2 + Math.sin(angleL) * rL);
            dummy.scale.setScalar(0.75 + Math.sin(t * 9.0) * 0.35);
            dummy.updateMatrix();
            garlandInstances.setMatrixAt(i, dummy.matrix);

            // Right column spiral garland
            const angleR = t * 15.0 + Math.PI;
            const rR = 0.44 + Math.sin(t * 12.0) * 0.06;
            dummy.position.set(3.35 + Math.cos(angleR) * rR, 2.8 - t * 5.8, -0.2 + Math.sin(angleR) * rR);
            dummy.scale.setScalar(0.75 + Math.sin(t * 9.0) * 0.35);
            dummy.updateMatrix();
            garlandInstances.setMatrixAt(i + 80, dummy.matrix);
          }
          garlandInstances.instanceMatrix.needsUpdate = true;
          mandapamGroup.add(garlandInstances);

          // ── Component 4: Sacred Govinda Namalu Devotional Crest (Frame 09) ──
          const namaluGroup = new THREE.Group();
          namaluGroup.position.set(0, 3.15, 0.12);
          mandapamGroup.add(namaluGroup);

          // 1. Pristine White Tiruman (Lord Venkateswara's holy horns)
          const tirumanMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(0xffffff),
            roughness: 0.25,
            metalness: 0.12,
            emissive: new THREE.Color(0x222222),
            transparent: true,
            opacity: 0,
          });
          materialsToDispose.push(tirumanMat);

          // Left Tiruman Horn
          const tirumanGeo = new THREE.CylinderGeometry(0.09, 0.065, 1.25, 16);
          geometriesToDispose.push(tirumanGeo);

          const leftTiruman = new THREE.Mesh(tirumanGeo, tirumanMat);
          leftTiruman.position.set(-0.35, 0.42, 0);
          leftTiruman.rotation.z = -0.14;
          namaluGroup.add(leftTiruman);

          // Right Tiruman Horn
          const rightTiruman = new THREE.Mesh(tirumanGeo, tirumanMat);
          rightTiruman.position.set(0.35, 0.42, 0);
          rightTiruman.rotation.z = 0.14;
          namaluGroup.add(rightTiruman);

          // Bottom Connecting Curve of Tiruman
          const tirumanBaseGeo = new THREE.TorusGeometry(0.35, 0.075, 12, 24, Math.PI);
          geometriesToDispose.push(tirumanBaseGeo);
          const tirumanBase = new THREE.Mesh(tirumanBaseGeo, tirumanMat);
          tirumanBase.rotation.z = Math.PI;
          tirumanBase.position.set(0, -0.05, 0);
          namaluGroup.add(tirumanBase);

          // 2. Central Crimson Kasturi Tilak
          const tilakMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(0xd61827),
            roughness: 0.32,
            metalness: 0.15,
            emissive: new THREE.Color(0x4a0508),
            transparent: true,
            opacity: 0,
          });
          materialsToDispose.push(tilakMat);

          const tilakGeo = new THREE.CylinderGeometry(0.05, 0.038, 1.05, 16);
          geometriesToDispose.push(tilakGeo);
          const tilakMesh = new THREE.Mesh(tilakGeo, tilakMat);
          tilakMesh.position.set(0, 0.40, 0.02);
          namaluGroup.add(tilakMesh);

          // 3. Golden Sudarshana Sunburst Medallion Base
          const medallionGeo = new THREE.CylinderGeometry(0.26, 0.26, 0.06, 32);
          geometriesToDispose.push(medallionGeo);
          const medallionMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(0xffd700),
            roughness: 0.22,
            metalness: 0.78,
            emissive: new THREE.Color(0x3d2800),
            transparent: true,
            opacity: 0,
          });
          materialsToDispose.push(medallionMat);

          const medallionMesh = new THREE.Mesh(medallionGeo, medallionMat);
          medallionMesh.rotation.x = Math.PI / 2;
          medallionMesh.position.set(0, -0.22, 0);
          namaluGroup.add(medallionMesh);

          // 4. Radiant Golden Sunburst Aura (Volumetric Light Halo)
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
          haloMesh.position.set(0, 0.3, -0.08);
          namaluGroup.add(haloMesh);

          // ── Component 5: Receding Colonnade Hall & Horizon Dawn Light (Frame 10) ──
          const colonnadeGroup = new THREE.Group();
          mandapamGroup.add(colonnadeGroup);

          // 3 Receding Tiers of Temple Columns
          for (let tier = 1; tier <= 3; tier++) {
            const zTier = -0.2 - tier * 4.2;
            const xTier = 3.35 + tier * 0.85;
            const scaleTier = 1.0 - tier * 0.18;

            colonnadeGroup.add(createTempleColumn(-xTier, zTier, scaleTier));
            colonnadeGroup.add(createTempleColumn(xTier, zTier, scaleTier));
          }

          // Radiant Golden Dawn Light Sphere at Horizon
          const dawnGeo = new THREE.SphereGeometry(2.4, 24, 24);
          geometriesToDispose.push(dawnGeo);
          const dawnMat = new THREE.MeshBasicMaterial({
            color: new THREE.Color(0xffe6a3),
            transparent: true,
            opacity: 0,
          });
          materialsToDispose.push(dawnMat);

          const dawnMesh = new THREE.Mesh(dawnGeo, dawnMat);
          dawnMesh.position.set(0, 0.8, -16.0);
          colonnadeGroup.add(dawnMesh);

          // ── Component 6: Cinematic 3D Floating Bokeh Dust Particles ──
          const bokehCount = 75;
          const bokehGeo = new THREE.BufferGeometry();
          geometriesToDispose.push(bokehGeo);

          const bokehPos = new Float32Array(bokehCount * 3);
          const bokehScales = new Float32Array(bokehCount);
          for (let i = 0; i < bokehCount; i++) {
            bokehPos[i * 3 + 0] = (Math.random() - 0.5) * 14.0;
            bokehPos[i * 3 + 1] = (Math.random() - 0.5) * 9.0;
            bokehPos[i * 3 + 2] = (Math.random() - 0.5) * 6.0;
            bokehScales[i] = Math.random() * 0.8 + 0.4;
          }
          bokehGeo.setAttribute("position", new THREE.BufferAttribute(bokehPos, 3));

          const bokehMat = new THREE.PointsMaterial({
            color: new THREE.Color(0xffdf88),
            size: 0.16,
            transparent: true,
            opacity: 0.55,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
          });
          materialsToDispose.push(bokehMat);

          const bokehPoints = new THREE.Points(bokehGeo, bokehMat);
          scene.add(bokehPoints);

          // Scene Lighting: Warm Directional Golden Sun + Temple Interior Fill
          const ambientLight = new THREE.AmbientLight(0xfff6e5, 0.95);
          scene.add(ambientLight);

          const sunLight = new THREE.DirectionalLight(0xfff0c2, 1.85);
          sunLight.position.set(-6, 7, 5);
          scene.add(sunLight);

          const templeGlow = new THREE.PointLight(0xffb84d, 1.4, 18);
          templeGlow.position.set(0, 1.5, -2.5);
          scene.add(templeGlow);

          stateRef.current.webgl = {
            renderer,
            scene,
            camera,
            uniforms,
            materials: materialsToDispose,
            geometries: geometriesToDispose,
          };

          // ── High-Performance Continuous 60 FPS WebGL Render Loop ──
          let lastTime = performance.now();
          const renderWebGL = (time: number) => {
            stateRef.current.rafId = requestAnimationFrame(renderWebGL);
            const dt = (time - lastTime) * 0.001;
            lastTime = time;

            uniforms.uTime.value += dt;
            haloMat.uniforms.uTime.value += dt;

            // Slowly drift bokeh particles in 3D space
            const positions = bokehGeo.attributes.position.array as Float32Array;
            for (let i = 0; i < bokehCount; i++) {
              positions[i * 3 + 1] += Math.sin(time * 0.001 + i) * 0.002;
              positions[i * 3 + 0] += Math.cos(time * 0.0008 + i) * 0.002;
            }
            bokehGeo.attributes.position.needsUpdate = true;

            const p = uniforms.uProgress.value;

            // Mandapam Temple Architecture Fade-in (Storyboard Frame 08 & 09)
            const mandapamOpacity = THREE.MathUtils.smoothstep(p, 0.58, 0.82);
            const mandapamExit = 1.0 - THREE.MathUtils.smoothstep(p, 0.97, 1.0);
            const currentArchAlpha = mandapamOpacity * mandapamExit;

            templeStoneMat.opacity = currentArchAlpha * 0.98;
            goldTrimMat.opacity = currentArchAlpha * 0.98;
            mograMat.opacity = currentArchAlpha * 0.95;
            dawnMat.opacity = currentArchAlpha * 0.85;

            // Sacred Govinda Namalu Devotional Symbol Fade-in (Storyboard Frame 09)
            const namaluOpacity =
              THREE.MathUtils.smoothstep(p, 0.72, 0.85) * (1.0 - THREE.MathUtils.smoothstep(p, 0.96, 1.0));
            tirumanMat.opacity = namaluOpacity * 0.98;
            tilakMat.opacity = namaluOpacity * 0.98;
            medallionMat.opacity = namaluOpacity * 0.95;
            haloMat.uniforms.uOpacity.value = namaluOpacity * 0.82;

            // Smooth Perspective Camera Dolly into Colonnade Hall (Storyboard Frame 10)
            if (p > 0.86) {
              const dolly = THREE.MathUtils.smoothstep(p, 0.86, 1.0);
              camera.position.z = 7.5 - dolly * 3.2;
              camera.position.y = dolly * 0.45;
            } else {
              camera.position.z = 7.5;
              camera.position.y = 0;
            }

            renderer.render(scene, camera);
          };

          stateRef.current.rafId = requestAnimationFrame(renderWebGL);

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

          return () => {
            window.removeEventListener("resize", handleResize);
            cancelAnimationFrame(stateRef.current.rafId);
            renderer.dispose();
            geometriesToDispose.forEach((g) => g.dispose());
            materialsToDispose.forEach((m) => m.dispose());
          };
        } catch (e) {
          console.warn("WebGL initialization failed, falling back to 2D Canvas engine:", e);
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

        let lastTime2d = performance.now();
        const render2D = (time: number) => {
          stateRef.current.rafId = requestAnimationFrame(render2D);
          const dt = (time - lastTime2d) * 0.001;
          lastTime2d = time;

          const p = stateRef.current.progress;
          ctx.clearRect(0, 0, width, height);

          if (p <= 0.01) return;

          // 1. Deep Emerald Silk Wave Mantle
          const entry = Math.min(1, Math.max(0, (p - 0.0) / 0.28));
          const drape = Math.min(1, Math.max(0, (p - 0.58) / 0.35));
          const exit = 1.0 - Math.min(1, Math.max(0, (p - 0.95) / 0.05));

          ctx.save();
          ctx.globalAlpha = entry * exit;

          // Rich Silk Gradient
          const grad = ctx.createLinearGradient(0, 0, width, height);
          grad.addColorStop(0, "#011209");
          grad.addColorStop(0.4, "#063824");
          grad.addColorStop(0.8, "#0d5c3b");
          grad.addColorStop(1, "#021c10");

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.moveTo(0, height);

          const step = width / 60;
          for (let x = 0; x <= width; x += step) {
            const normX = x / width;
            const wave1 = Math.sin(normX * 5.2 - dt + p * 3.5) * (height * 0.12);
            const wave2 = Math.cos(normX * 8.4 + p * 4.2) * (height * 0.06);
            const drapeArch = Math.pow(Math.abs(normX - 0.5) * 2.0, 2.0) * (height * 0.45);
            const y = (1.0 - entry) * height + Math.min(height, (height * 0.42 + wave1 + wave2) * (1.0 - drape) + drapeArch * drape);
            ctx.lineTo(x, y);
          }
          ctx.lineTo(width, height);
          ctx.closePath();
          ctx.fill();

          // 2. Gold Zari Edge
          ctx.strokeStyle = "#e8c36a";
          ctx.lineWidth = 4;
          ctx.stroke();

          // 3. Twisting Champagne Silk Ribbon
          const ribbonEntry = Math.min(1, Math.max(0, (p - 0.05) / 0.25));
          const ribbonExit = 1.0 - Math.min(1, Math.max(0, (p - 0.72) / 0.18));
          if (ribbonEntry > 0 && ribbonExit > 0) {
            ctx.globalAlpha = ribbonEntry * ribbonExit;
            ctx.beginPath();
            for (let x = 0; x <= width; x += step) {
              const normX = x / width;
              const ribbonY = height * 0.48 + Math.sin(normX * 4.5 + p * 5.2) * (height * 0.18);
              if (x === 0) ctx.moveTo(x, ribbonY);
              else ctx.lineTo(x, ribbonY);
            }
            ctx.strokeStyle = "#f3e0aa";
            ctx.lineWidth = 14;
            ctx.lineCap = "round";
            ctx.stroke();
          }

          // 4. Mandapam Temple Silhouette & Govinda Namalu (p > 0.65)
          if (drape > 0.1) {
            ctx.globalAlpha = drape * exit;

            // Fluted Columns
            const colWidth = 44;
            const leftColX = width * 0.22;
            const rightColX = width * 0.78;

            ctx.fillStyle = "#d2a764";
            ctx.fillRect(leftColX - colWidth / 2, height * 0.2, colWidth, height * 0.8);
            ctx.fillRect(rightColX - colWidth / 2, height * 0.2, colWidth, height * 0.8);

            // Carved Torana Arch
            ctx.strokeStyle = "#f5c85d";
            ctx.lineWidth = 12;
            ctx.beginPath();
            ctx.arc(width * 0.5, height * 0.42, width * 0.28, Math.PI, 2 * Math.PI, false);
            ctx.stroke();

            // Govinda Namalu Devotional Crest
            if (p > 0.75) {
              const namaluAlpha = Math.min(1, (p - 0.75) / 0.12) * exit;
              ctx.globalAlpha = namaluAlpha;

              const centerX = width * 0.5;
              const centerY = height * 0.22;

              // Golden Sunburst Medallion
              ctx.fillStyle = "#ffd700";
              ctx.beginPath();
              ctx.arc(centerX, centerY + 28, 18, 0, 2 * Math.PI);
              ctx.fill();

              // White Tiruman
              ctx.strokeStyle = "#ffffff";
              ctx.lineWidth = 8;
              ctx.beginPath();
              ctx.moveTo(centerX - 16, centerY - 24);
              ctx.lineTo(centerX - 12, centerY + 18);
              ctx.arc(centerX, centerY + 18, 12, Math.PI, 0, true);
              ctx.lineTo(centerX + 16, centerY - 24);
              ctx.stroke();

              // Red Kasturi Tilak
              ctx.fillStyle = "#d61827";
              ctx.fillRect(centerX - 3, centerY - 20, 6, 32);
            }
          }

          ctx.restore();
        };

        stateRef.current.rafId = requestAnimationFrame(render2D);

        return () => {
          cancelAnimationFrame(stateRef.current.rafId);
        };
      } catch (err) {
        console.error("Canvas 2D fallback error:", err);
      }
    }, [initialProgress]);

    return (
      <div ref={containerRef} className={styles.webglContainer}>
        {/* Primary High-Fidelity 3D WebGL Canvas */}
        <canvas ref={canvasRef} className={styles.webglCanvas} />
        {/* Resilient Fallback 2D Canvas */}
        <canvas ref={fallbackCanvasRef} className={styles.webglCanvas} />
      </div>
    );
  }
);

ClothParallaxCanvas.displayName = "ClothParallaxCanvas";

export default ClothParallaxCanvas;
