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
 * 3. South Indian Mandapam Architecture: Carved torana arch, cascading jasmine mogra garlands,
 *    and glowing temple sanctum portal (Frame 08 & 09).
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
          uTex06: { value: THREE.Texture | null };
          uTex07: { value: THREE.Texture | null };
          uTex08: { value: THREE.Texture | null };
          uTex09: { value: THREE.Texture | null };
          uTex10: { value: THREE.Texture | null };
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
          renderer.toneMappingExposure = 1.05;

          const scene = new THREE.Scene();
          scene.background = new THREE.Color(0x011009); // Deep imperial forest-green atmosphere

          const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
          camera.position.set(0, 0, 7.5);

          const materialsToDispose: THREE.Material[] = [];
          const geometriesToDispose: THREE.BufferGeometry[] = [];

          // Load High-Resolution Reference Texture Plates
          const texLoader = new THREE.TextureLoader();
          const loadTex = (url: string) => {
            const t = texLoader.load(url);
            t.wrapS = THREE.ClampToEdgeWrapping;
            t.wrapT = THREE.ClampToEdgeWrapping;
            t.minFilter = THREE.LinearFilter;
            t.magFilter = THREE.LinearFilter;
            return t;
          };

          const tex06 = loadTex("/images/transitions/fabric-parallax/06_fabric_emerge.webp");
          const tex07 = loadTex("/images/transitions/fabric-parallax/07_fabric_flow.webp");
          const tex08 = loadTex("/images/transitions/fabric-parallax/08_mandapam_drape.webp");
          const tex09 = loadTex("/images/transitions/fabric-parallax/09_mandapam_open.webp");
          const tex10 = loadTex("/images/transitions/fabric-parallax/10_colonnade_portal.webp");

          const uniforms = {
            uProgress: { value: initialProgress },
            uTime: { value: 0 },
            uAspect: { value: width / height },
            uTex06: { value: tex06 },
            uTex07: { value: tex07 },
            uTex08: { value: tex08 },
            uTex09: { value: tex09 },
            uTex10: { value: tex10 },
          };

          // ── Component 0: Backdrop Hall (Reveals Inner Temple Sanctum) ──
          const backdropGeo = new THREE.PlaneGeometry(16.5, 10.5);
          geometriesToDispose.push(backdropGeo);

          const backdropMat = new THREE.ShaderMaterial({
            uniforms,
            vertexShader: `
              varying vec2 vUv;
              void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
              }
            `,
            fragmentShader: `
              uniform float uProgress;
              uniform sampler2D uTex08;
              uniform sampler2D uTex09;
              uniform sampler2D uTex10;
              varying vec2 vUv;

              void main() {
                vec4 c08 = texture2D(uTex08, vUv);
                vec4 c09 = texture2D(uTex09, vUv);
                vec4 c10 = texture2D(uTex10, vUv);

                float w08 = 1.0 - smoothstep(0.68, 0.84, uProgress);
                float w09 = smoothstep(0.68, 0.82, uProgress) * (1.0 - smoothstep(0.88, 0.98, uProgress));
                float w10 = smoothstep(0.88, 0.98, uProgress);

                float totalW = w08 + w09 + w10 + 0.0001;
                vec3 col = (c08.rgb * w08 + c09.rgb * w09 + c10.rgb * w10) / totalW;

                float alpha = smoothstep(0.50, 0.68, uProgress) * (1.0 - smoothstep(0.97, 1.0, uProgress));
                gl_FragColor = vec4(col, alpha);
              }
            `,
            transparent: true,
            depthWrite: false,
          });
          materialsToDispose.push(backdropMat);

          const backdropMesh = new THREE.Mesh(backdropGeo, backdropMat);
          backdropMesh.position.set(0, 0, -4.5);
          scene.add(backdropMesh);

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
              float drape = smoothstep(0.55, 0.90, p);

              float x = (uv.x - 0.5) * 15.5;
              float y = (uv.y - 0.5) * 9.8;
              vec3 pos = vec3(x, y, 0.0);

              vec3 g1 = gerstnerFold(uv, vec2(0.82, 0.58), 0.52, 6.2, 0.85, time, p);
              vec3 g2 = gerstnerFold(uv, vec2(-0.62, 0.78), 0.38, 3.6, 1.15, time, p);
              vec3 g3 = gerstnerFold(uv, vec2(0.35, -0.92), 0.22, 1.9, 1.45, time, p);
              vec3 g4 = gerstnerFold(uv, vec2(0.95, 0.15), 0.12, 0.75, 2.1, time, p);

              float foldAmp = mix(0.35, 1.15, flow);
              pos.x -= (g1.x + g2.x * 0.5) * foldAmp;
              pos.y -= (g1.y + g2.y * 0.5) * foldAmp;
              pos.z += (g1.z + g2.z + g3.z + g4.z) * foldAmp;

              float diag = (uv.x + (1.0 - uv.y)) * 0.5;
              pos.z += sin(diag * 4.0 - time * 0.85 + p * 3.4) * 0.75 * flow;

              // Swag Curtain Drape Morph (reveals temple mandapam arch)
              float archDist = abs(uv.x - 0.5) * 2.0;
              float catenaryArch = pow(archDist, 1.8);
              float swagY = mix(2.6, -3.2, catenaryArch);
              float flutedPleats = sin(uv.x * 38.0) * 0.22 * smoothstep(0.32, 1.0, archDist);

              vec3 drapedPos = vec3(
                mix(pos.x, (uv.x - 0.5) * 9.8 + (uv.x < 0.5 ? -1.4 : 1.4), drape * 0.78),
                mix(pos.y, swagY, drape),
                mix(pos.z * 0.4, flutedPleats - 0.3, drape)
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

          // ── GLSL Fragment Shader: Photographic Texture Blend + Anisotropic Silk ──
          const emeraldSilkFragmentShader = `
            uniform float uProgress;
            uniform float uTime;
            uniform sampler2D uTex06;
            uniform sampler2D uTex07;
            uniform sampler2D uTex08;
            uniform sampler2D uTex09;
            uniform sampler2D uTex10;

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

              vec4 c06 = texture2D(uTex06, vUv);
              vec4 c07 = texture2D(uTex07, vUv);
              vec4 c08 = texture2D(uTex08, vUv);
              vec4 c09 = texture2D(uTex09, vUv);
              vec4 c10 = texture2D(uTex10, vUv);

              float w06 = 1.0 - smoothstep(0.18, 0.42, uProgress);
              float w07 = smoothstep(0.18, 0.36, uProgress) * (1.0 - smoothstep(0.50, 0.72, uProgress));
              float w08 = smoothstep(0.50, 0.66, uProgress) * (1.0 - smoothstep(0.74, 0.88, uProgress));
              float w09 = smoothstep(0.72, 0.86, uProgress) * (1.0 - smoothstep(0.92, 0.98, uProgress));
              float w10 = smoothstep(0.90, 0.99, uProgress);

              float totalW = w06 + w07 + w08 + w09 + w10 + 0.0001;
              vec3 texColor = (c06.rgb * w06 + c07.rgb * w07 + c08.rgb * w08 + c09.rgb * w09 + c10.rgb * w10) / totalW;

              vec3 L1 = normalize(vec3(-0.62, 0.78, 0.7));
              vec3 H1 = normalize(L1 + V);

              vec3 guide = abs(N.y) > 0.9 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 1.0, 0.0);
              vec3 T = safeNormalize(cross(N, guide), vec3(1.0, 0.0, 0.0));
              float TdotH = clamp(dot(T, H1), -1.0, 1.0);
              float sinTH = sqrt(max(0.0, 1.0 - TdotH * TdotH));
              float anisoSharp = pow(sinTH, 32.0) * 0.95;
              float anisoBroad = pow(sinTH, 6.0) * 0.35;

              float fresnel = pow(1.0 - max(dot(N, V), 0.0), 2.8);

              float NdotL1 = max(dot(N, L1), 0.0);
              vec3 ambient = vec3(0.04, 0.16, 0.10);
              vec3 litColor = texColor * (ambient + NdotL1 * 0.85);

              vec3 champagne = vec3(0.96, 0.86, 0.62);
              litColor += champagne * (anisoSharp + anisoBroad) * 0.65;
              litColor += champagne * fresnel * 0.42;

              float alpha = smoothstep(0.0, 0.06, uProgress) * (1.0 - smoothstep(0.85, 0.96, uProgress));
              gl_FragColor = vec4(litColor, alpha);
            }
          `;

          const emeraldGeo = new THREE.PlaneGeometry(1, 1, 140, 140);
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

              float wave = sin(t * 7.0 - time * 1.1 + p * 4.6) * 0.42;
              pt.y += wave;
              pt.z += cos(t * 5.5 - time * 0.95 + p * 4.0) * 0.50;

              return pt;
            }

            void main() {
              vUv = uv;
              float t = uv.x;
              float ribbonWidth = 0.82;

              vec3 pos = ribbonPath(t, uProgress, uTime);
              vec3 posNext = ribbonPath(min(1.0, t + 0.01), uProgress, uTime);
              vec3 tangent = normalize(posNext - pos);

              float twist = t * 3.14159 * 2.2 - uTime * 0.5 + uProgress * 3.8;
              vec3 up = vec3(sin(twist), cos(twist), sin(twist * 0.5));
              vec3 normal = normalize(cross(tangent, up));
              vec3 binormal = cross(tangent, normal);

              float widthOffset = (uv.y - 0.5) * ribbonWidth;
              vec3 finalPos = pos + binormal * widthOffset;

              float entry = smoothstep(0.04, 0.25, uProgress);
              float exit  = 1.0 - smoothstep(0.68, 0.88, uProgress);
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
              float specSharp = pow(max(dot(N, H), 0.0), 38.0) * 1.5;
              float specBroad = pow(max(dot(N, H), 0.0), 8.0) * 0.60;
              float fresnel = pow(1.0 - max(dot(N, V), 0.0), 2.2);

              vec3 goldShadow = vec3(0.38, 0.26, 0.10);
              vec3 goldMid    = vec3(0.90, 0.76, 0.40);
              vec3 goldPeak   = vec3(1.0, 0.98, 0.88);

              vec3 color = mix(goldShadow, goldMid, NdotL);
              color += goldPeak * (specSharp + specBroad);
              color += goldPeak * fresnel * 0.72;

              float hem = smoothstep(0.12, 0.0, vUv.y) + smoothstep(0.88, 1.0, vUv.y);
              vec3 bullion = vec3(1.0, 0.88, 0.45);
              color = mix(color, bullion, hem * 0.8);

              float glint = sin(vUv.x * 65.0 + uTime * 3.2) * 0.08;
              color += vec3(glint);

              float alpha = smoothstep(0.04, 0.15, uProgress) * (1.0 - smoothstep(0.68, 0.85, uProgress));
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
          ribbonMesh.position.z = 0.22;
          scene.add(ribbonMesh);

          // ── Component 3: South Indian Temple Mandapam Architecture (Frames 08 & 09) ──
          const mandapamGroup = new THREE.Group();
          mandapamGroup.visible = false;
          scene.add(mandapamGroup);

          const goldTrimMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(0xf5c85d),
            roughness: 0.22,
            metalness: 0.65,
            transparent: true,
            depthWrite: false,
            opacity: 0,
          });
          materialsToDispose.push(goldTrimMat);

          // ── Sculpted Torana Arch (Frames 08 & 09) ──
          const archGeo = new THREE.TorusGeometry(3.35, 0.18, 16, 48, Math.PI);
          geometriesToDispose.push(archGeo);
          const archMesh = new THREE.Mesh(archGeo, goldTrimMat);
          archMesh.position.set(0, 1.80, -0.2);
          mandapamGroup.add(archMesh);

          // ── Cascading Jasmine / Mogra Flower Garlands (Mallige Male) ──
          const mograGeo = new THREE.SphereGeometry(0.085, 8, 8);
          geometriesToDispose.push(mograGeo);
          const mograMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(0xfffbf2),
            roughness: 0.85,
            metalness: 0.05,
            transparent: true,
            depthWrite: false,
            opacity: 0,
          });
          materialsToDispose.push(mograMat);

          const garlandCount = 140;
          const garlandInstances = new THREE.InstancedMesh(mograGeo, mograMat, garlandCount);
          const dummy = new THREE.Object3D();

          for (let i = 0; i < 70; i++) {
            const t = i / 70.0;
            const angleL = t * 14.0;
            const rL = 0.44 + Math.sin(t * 12.0) * 0.06;
            dummy.position.set(-3.25 + Math.cos(angleL) * rL, 1.8 - t * 4.8, -0.2 + Math.sin(angleL) * rL);
            dummy.scale.setScalar(0.75 + Math.sin(t * 9.0) * 0.35);
            dummy.updateMatrix();
            garlandInstances.setMatrixAt(i, dummy.matrix);

            const angleR = t * 14.0 + Math.PI;
            const rR = 0.44 + Math.sin(t * 12.0) * 0.06;
            dummy.position.set(3.25 + Math.cos(angleR) * rR, 1.8 - t * 4.8, -0.2 + Math.sin(angleR) * rR);
            dummy.scale.setScalar(0.75 + Math.sin(t * 9.0) * 0.35);
            dummy.updateMatrix();
            garlandInstances.setMatrixAt(i + 70, dummy.matrix);
          }
          garlandInstances.instanceMatrix.needsUpdate = true;
          mandapamGroup.add(garlandInstances);

          // ── Component 4: Sacred Govinda Namalu Devotional Crest (Frame 09) ──
          // Located at the center apex of the Torana Arch (y = 1.95)
          const namaluGroup = new THREE.Group();
          namaluGroup.position.set(0, 1.95, 0.15);
          mandapamGroup.add(namaluGroup);

          const tirumanMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(0xffffff),
            roughness: 0.22,
            metalness: 0.12,
            emissive: new THREE.Color(0x333333),
            transparent: true,
            depthWrite: false,
            opacity: 0,
          });
          materialsToDispose.push(tirumanMat);

          const tirumanGeo = new THREE.CylinderGeometry(0.08, 0.06, 1.05, 16);
          geometriesToDispose.push(tirumanGeo);

          const leftTiruman = new THREE.Mesh(tirumanGeo, tirumanMat);
          leftTiruman.position.set(-0.28, 0.35, 0);
          leftTiruman.rotation.z = -0.14;
          namaluGroup.add(leftTiruman);

          const rightTiruman = new THREE.Mesh(tirumanGeo, tirumanMat);
          rightTiruman.position.set(0.28, 0.35, 0);
          rightTiruman.rotation.z = 0.14;
          namaluGroup.add(rightTiruman);

          const tirumanBaseGeo = new THREE.TorusGeometry(0.28, 0.065, 12, 24, Math.PI);
          geometriesToDispose.push(tirumanBaseGeo);
          const tirumanBase = new THREE.Mesh(tirumanBaseGeo, tirumanMat);
          tirumanBase.rotation.z = Math.PI;
          tirumanBase.position.set(0, -0.04, 0);
          namaluGroup.add(tirumanBase);

          const tilakMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(0xd61827),
            roughness: 0.30,
            metalness: 0.15,
            emissive: new THREE.Color(0x5a080c),
            transparent: true,
            depthWrite: false,
            opacity: 0,
          });
          materialsToDispose.push(tilakMat);

          const tilakGeo = new THREE.CylinderGeometry(0.045, 0.032, 0.88, 16);
          geometriesToDispose.push(tilakGeo);
          const tilakMesh = new THREE.Mesh(tilakGeo, tilakMat);
          tilakMesh.position.set(0, 0.34, 0.02);
          namaluGroup.add(tilakMesh);

          const medallionGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.05, 32);
          geometriesToDispose.push(medallionGeo);
          const medallionMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(0xffd700),
            roughness: 0.20,
            metalness: 0.80,
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

          const haloGeo = new THREE.PlaneGeometry(2.8, 2.8);
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
          haloMesh.position.set(0, 0.25, -0.06);
          namaluGroup.add(haloMesh);

          // ── Component 5: Cinematic 3D Floating Bokeh Dust Particles ──
          const bokehCount = 65;
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
            opacity: 0.52,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
          });
          materialsToDispose.push(bokehMat);

          const bokehPoints = new THREE.Points(bokehGeo, bokehMat);
          scene.add(bokehPoints);

          // Scene Lighting: Warm Directional Golden Sun + Temple Interior Fill
          const ambientLight = new THREE.AmbientLight(0xfff6e5, 0.85);
          scene.add(ambientLight);

          const sunLight = new THREE.DirectionalLight(0xfff0c2, 1.25);
          sunLight.position.set(-6, 7, 5);
          scene.add(sunLight);

          const templeGlow = new THREE.PointLight(0xffb84d, 1.2, 16);
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
              positions[i * 3 + 1] += Math.sin(time * 0.001 + i) * 0.0015;
              positions[i * 3 + 0] += Math.cos(time * 0.0008 + i) * 0.0015;
            }
            bokehGeo.attributes.position.needsUpdate = true;

            const p = uniforms.uProgress.value;

            // Mandapam visibility gate: Only render when fabric starts to drape (p > 0.48)
            mandapamGroup.visible = p > 0.48;

            if (mandapamGroup.visible) {
              const mandapamOpacity = THREE.MathUtils.smoothstep(p, 0.52, 0.78);
              const mandapamExit = 1.0 - THREE.MathUtils.smoothstep(p, 0.97, 1.0);
              const currentArchAlpha = mandapamOpacity * mandapamExit;

              goldTrimMat.opacity = currentArchAlpha * 0.98;
              mograMat.opacity = currentArchAlpha * 0.95;

              const namaluOpacity =
                THREE.MathUtils.smoothstep(p, 0.68, 0.82) * (1.0 - THREE.MathUtils.smoothstep(p, 0.96, 1.0));
              tirumanMat.opacity = namaluOpacity * 0.98;
              tilakMat.opacity = namaluOpacity * 0.98;
              medallionMat.opacity = namaluOpacity * 0.95;
              haloMat.uniforms.uOpacity.value = namaluOpacity * 0.82;
            }

            // Smooth Perspective Camera Dolly into Colonnade Hall (Storyboard Frame 10)
            if (p > 0.85) {
              const dolly = THREE.MathUtils.smoothstep(p, 0.85, 1.0);
              camera.position.z = 7.5 - dolly * 3.4;
              camera.position.y = dolly * 0.40;
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
            tex06.dispose();
            tex07.dispose();
            tex08.dispose();
            tex09.dispose();
            tex10.dispose();
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

        let lastTime2d = performance.now();
        const render2D = (time: number) => {
          stateRef.current.rafId = requestAnimationFrame(render2D);
          const dt = (time - lastTime2d) * 0.001;
          lastTime2d = time;

          const p = stateRef.current.progress;
          ctx.clearRect(0, 0, width, height);

          if (p <= 0.01) return;

          const entry = Math.min(1, Math.max(0, (p - 0.0) / 0.28));
          const drape = Math.min(1, Math.max(0, (p - 0.58) / 0.35));
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

          ctx.strokeStyle = "#e8c36a";
          ctx.lineWidth = 4;
          ctx.stroke();

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

          if (drape > 0.1) {
            ctx.globalAlpha = drape * exit;

            const colWidth = 44;
            const leftColX = width * 0.22;
            const rightColX = width * 0.78;

            ctx.fillStyle = "#d2a764";
            ctx.fillRect(leftColX - colWidth / 2, height * 0.2, colWidth, height * 0.8);
            ctx.fillRect(rightColX - colWidth / 2, height * 0.2, colWidth, height * 0.8);

            ctx.strokeStyle = "#f5c85d";
            ctx.lineWidth = 12;
            ctx.beginPath();
            ctx.arc(width * 0.5, height * 0.42, width * 0.28, Math.PI, 2 * Math.PI, false);
            ctx.stroke();

            if (p > 0.75) {
              const namaluAlpha = Math.min(1, (p - 0.75) / 0.12) * exit;
              ctx.globalAlpha = namaluAlpha;

              const centerX = width * 0.5;
              const centerY = height * 0.22;

              ctx.fillStyle = "#ffd700";
              ctx.beginPath();
              ctx.arc(centerX, centerY + 28, 18, 0, 2 * Math.PI);
              ctx.fill();

              ctx.strokeStyle = "#ffffff";
              ctx.lineWidth = 8;
              ctx.beginPath();
              ctx.moveTo(centerX - 16, centerY - 24);
              ctx.lineTo(centerX - 12, centerY + 18);
              ctx.arc(centerX, centerY + 18, 12, Math.PI, 0, true);
              ctx.lineTo(centerX + 16, centerY - 24);
              ctx.stroke();

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
