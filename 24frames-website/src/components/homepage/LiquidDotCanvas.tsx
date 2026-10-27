"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface Dot {
  baseX: number;
  baseY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface LiquidDotCanvasProps {
  className?: string;
  gridSpacing?: number;
  dotRadius?: number;
  dotColor?: string;
  influenceRadius?: number;
  maxDisplacement?: number;
}

export default function LiquidDotCanvas({
  className,
  gridSpacing = 30,
  dotRadius = 1.5,
  dotColor = "rgba(175, 165, 145, 0.48)",
  influenceRadius = 230,
  maxDisplacement = 13,
}: LiquidDotCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Check accessibility & device support
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouchOnly = "ontouchstart" in window && !window.matchMedia("(hover: hover)").matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let dots: Dot[] = [];

    // Pointer state relative to parent container
    let pointerX = -9999;
    let pointerY = -9999;
    let isPointerInside = false;
    let isAnimating = false;
    let startTime = performance.now();

    const buildGrid = (w: number, h: number) => {
      dots = [];
      const cols = Math.ceil(w / gridSpacing) + 1;
      const rows = Math.ceil(h / gridSpacing) + 1;
      const offsetX = (w - (cols - 1) * gridSpacing) / 2;
      const offsetY = (h - (rows - 1) * gridSpacing) / 2;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const bx = offsetX + c * gridSpacing;
          const by = offsetY + r * gridSpacing;
          dots.push({
            baseX: bx,
            baseY: by,
            x: bx,
            y: by,
            vx: 0,
            vy: 0,
          });
        }
      }
    };

    const drawStatic = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = dotColor;
      ctx.beginPath();
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        ctx.moveTo(d.baseX + dotRadius, d.baseY);
        ctx.arc(d.baseX, d.baseY, dotRadius, 0, Math.PI * 2);
      }
      ctx.fill();
    };

    const resize = () => {
      const rect = parent.getBoundingClientRect();
      width = Math.round(rect.width);
      height = Math.round(rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildGrid(width, height);

      if (prefersReducedMotion || isTouchOnly) {
        drawStatic();
      } else {
        renderFrame();
      }
    };

    // Frame rendering loop with fluid organic physics
    const renderFrame = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = dotColor;
      ctx.beginPath();

      const time = (performance.now() - startTime) * 0.001;
      let totalMotion = 0;
      const invRadius = 1 / influenceRadius;

      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];
        let targetX = dot.baseX;
        let targetY = dot.baseY;

        if (isPointerInside) {
          const dx = dot.baseX - pointerX;
          const dy = dot.baseY - pointerY;
          const distSq = dx * dx + dy * dy;

          if (distSq < influenceRadius * influenceRadius) {
            const dist = Math.sqrt(distSq);
            // Smooth cosine bell-curve for falloff
            const norm = dist * invRadius;
            const power = Math.cos(norm * (Math.PI * 0.5));

            // Radial direction away from pointer
            const angle = Math.atan2(dy, dx);
            const displacement = maxDisplacement * power;

            // Soft liquid ripple modulation
            const ripple = Math.sin(time * 3.5 - dist * 0.038) * power * 2.2;
            const totalDisplace = displacement + ripple;

            targetX = dot.baseX + Math.cos(angle) * totalDisplace;
            targetY = dot.baseY + Math.sin(angle) * totalDisplace;
          }
        }

        // Fluid damped relaxation (0.10 interpolation for continuous silky response)
        const diffX = targetX - dot.x;
        const diffY = targetY - dot.y;
        dot.x += diffX * 0.10;
        dot.y += diffY * 0.10;

        totalMotion += Math.abs(diffX) + Math.abs(diffY);

        ctx.moveTo(dot.x + dotRadius, dot.y);
        ctx.arc(dot.x, dot.y, dotRadius, 0, Math.PI * 2);
      }

      ctx.fill();

      // If pointer is outside and all dots have settled to base positions, sleep ticker to save CPU
      if (!isPointerInside && totalMotion < 0.1) {
        // Snap to exact base positions
        for (let i = 0; i < dots.length; i++) {
          dots[i].x = dots[i].baseX;
          dots[i].y = dots[i].baseY;
        }
        drawStatic();
        stopAnimation();
      }
    };

    const startAnimation = () => {
      if (isAnimating || prefersReducedMotion || isTouchOnly) return;
      isAnimating = true;
      gsap.ticker.add(renderFrame);
    };

    const stopAnimation = () => {
      if (!isAnimating) return;
      isAnimating = false;
      gsap.ticker.remove(renderFrame);
    };

    // Pointer event listeners on parent container
    const handlePointerMove = (e: PointerEvent) => {
      if (prefersReducedMotion || isTouchOnly) return;
      const rect = parent.getBoundingClientRect();
      pointerX = e.clientX - rect.left;
      pointerY = e.clientY - rect.top;
      isPointerInside = true;
      startAnimation();
    };

    const handlePointerLeave = () => {
      isPointerInside = false;
      pointerX = -9999;
      pointerY = -9999;
      // Let animation continue until dots smoothly settle back
      startAnimation();
    };

    parent.addEventListener("pointermove", handlePointerMove, { passive: true });
    parent.addEventListener("pointerleave", handlePointerLeave, { passive: true });

    // ResizeObserver for container dimensional shifts
    const observer = new ResizeObserver(() => {
      resize();
    });
    observer.observe(parent);

    // Initial sizing
    resize();

    return () => {
      stopAnimation();
      observer.disconnect();
      parent.removeEventListener("pointermove", handlePointerMove);
      parent.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [gridSpacing, dotRadius, dotColor, influenceRadius, maxDisplacement]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1,
      }}
    />
  );
}
