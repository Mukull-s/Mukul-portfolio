"use client";

import { useEffect, useRef } from "react";
import styles from "./Hero.module.css";

interface ParticleCanvasProps {
  scrollProgressRef: React.MutableRefObject<number>;
  isLoaded: boolean;
}

interface Particle {
  index: number;
  originX: number;
  originY: number;
  targetX: number;
  targetY: number;
  fragEndX: number;
  fragEndY: number;
  size: number;
  angleOffset: number;
  speedFactor: number;
  clusterId: number;
  localAngle: number;
  localDist: number;
  revealWeight: number;
  trail: { x: number; y: number }[];
}

export default function ParticleCanvas({ scrollProgressRef, isLoaded }: ParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | null>(null);
  const particles = useRef<Particle[]>([]);
  const isInitialized = useRef(false);
  const clustersRef = useRef<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    rotSpeed: number;
    scaleSpeed: number;
  }[]>([]);

  useEffect(() => {
    if (!isLoaded) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const initCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      isInitialized.current = false; // Trigger re-scan on resize
    };

    initCanvasSize();
    window.addEventListener("resize", initCanvasSize);

    // Reset initialization when document fonts are loaded to ensure correct geometry scanning
    const handleFontsLoaded = () => {
      isInitialized.current = false;
    };
    
    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(handleFontsLoaded);
    }

    // Initialize particles by scanning offscreen text templates
    const initParticles = () => {
      const w = canvas.width;
      const h = canvas.height;

      // Create offscreen canvas for scanning
      const offscreen = document.createElement("canvas");
      offscreen.width = w;
      offscreen.height = h;
      const offCtx = offscreen.getContext("2d", { willReadFrequently: true });
      if (!offCtx) return;

      const isMobile = w < 768;

      // Dynamically retrieve Next.js hashed Google Font family names from CSS variables
      const computedStyle = getComputedStyle(document.documentElement);
      const yujiFontFamily = (computedStyle.getPropertyValue("--font-yuji") || '"Yuji Syuku", serif').trim();
      const cormorantFontFamily = (computedStyle.getPropertyValue("--font-cormorant") || '"Cormorant Garamond", Georgia, serif').trim();



      // 1. Scan Katakana characters ("ム" and "ル" separated)
      offCtx.clearRect(0, 0, w, h);
      
      const katakanaFontSize = isMobile ? h * 0.22 : h * 0.42;
      offCtx.font = `400 ${katakanaFontSize}px ${yujiFontFamily}`;
      offCtx.textAlign = "center";
      offCtx.textBaseline = "middle";
      offCtx.fillStyle = "white";

      if (isMobile) {
        offCtx.fillText("ム", w * 0.5, h * 0.32);
        offCtx.fillText("ル", w * 0.5, h * 0.62);
      } else {
        offCtx.fillText("ム", w * 0.22, h * 0.5);
        offCtx.fillText("ル", w * 0.78, h * 0.5);
      }

      const katakanaImgData = offCtx.getImageData(0, 0, w, h);
      const katakanaPoints: { x: number; y: number }[] = [];
      
      // Step through pixels (coarse step for performance and particle spacing)
      const step = isMobile ? 3 : (w > 1200 ? 5 : 4);
      for (let y = 0; y < h; y += step) {
        for (let x = 0; x < w; x += step) {
          const alphaIndex = (y * w + x) * 4 + 3;
          if (katakanaImgData.data[alphaIndex] > 128) {
            katakanaPoints.push({ x, y });
          }
        }
      }



      // 2. Scan English Name ("MUKUL") — positioned above portrait to match final y: -30vh
      offCtx.clearRect(0, 0, w, h);
      const englishFontSize = isMobile ? Math.min(w * 0.17, 90) : Math.min(w * 0.135, 170);
      offCtx.font = `italic 700 ${englishFontSize}px ${cormorantFontFamily}`;
      offCtx.textAlign = "center";
      offCtx.textBaseline = "middle";
      offCtx.fillStyle = "white";
      
      // Position at ~20% height (matches CSS y: -30vh from center = 50% - 30% = 20%)
      offCtx.fillText("MUKUL", w * 0.5, h * 0.2);

      const englishImgData = offCtx.getImageData(0, 0, w, h);
      const englishPoints: { x: number; y: number }[] = [];

      for (let y = 0; y < h; y += step) {
        for (let x = 0; x < w; x += step) {
          const alphaIndex = (y * w + x) * 4 + 3;
          if (englishImgData.data[alphaIndex] > 128) {
            englishPoints.push({ x, y });
          }
        }
      }



      // Guard against zero points
      if (katakanaPoints.length === 0 || englishPoints.length === 0) {
        console.warn("Scan failed: one of the text scans yielded 0 points. Canvas text rendering might have failed!");
        return;
      }

      // 3. Initialize cluster nodes for ink fragments
      const numClusters = 40;
      const tempClusters = [];
      for (let c = 0; c < numClusters; c++) {
        tempClusters.push({
          x: w * (0.15 + Math.random() * 0.7),
          y: h * (0.2 + Math.random() * 0.6),
          vx: (Math.random() - 0.5) * 4.5,
          vy: (Math.random() - 0.2) * 4.0 + 2.5, // Drift down-ish
          rotSpeed: (Math.random() - 0.5) * 0.05,
          scaleSpeed: 0.8 + Math.random() * 1.0,
        });
      }
      clustersRef.current = tempClusters;

      // 4. Build particle array
      const numParticles = 3200;
      const tempParticles: Particle[] = [];

      for (let i = 0; i < numParticles; i++) {
        const katakanaPoint = katakanaPoints[i % katakanaPoints.length];
        const englishPoint = englishPoints[i % englishPoints.length];

        // Find nearest cluster node
        let minD = Infinity;
        let clusterId = 0;
        for (let c = 0; c < numClusters; c++) {
          const dx = katakanaPoint.x - tempClusters[c].x;
          const dy = katakanaPoint.y - tempClusters[c].y;
          const d = dx * dx + dy * dy;
          if (d < minD) {
            minD = d;
            clusterId = c;
          }
        }

        const cluster = tempClusters[clusterId];
        const localX = katakanaPoint.x - cluster.x;
        const localY = katakanaPoint.y - cluster.y;
        const localAngle = Math.atan2(localY, localX);
        const localDist = Math.sqrt(localX * localX + localY * localY);

        // Pre-calculate fragment end position at tFrag = 1.0 (static starting point for flow)
        const endDriftX = cluster.vx * 90;
        const endDriftY = cluster.vy * 90;
        const endCx = cluster.x + endDriftX;
        const endCy = cluster.y + endDriftY;
        const endRotAngle = localAngle + cluster.rotSpeed * Math.PI * 1.5;
        const endRotDist = localDist * (1.0 + cluster.scaleSpeed * 0.4);
        const fragEndX = endCx + Math.cos(endRotAngle) * endRotDist;
        const fragEndY = endCy + Math.sin(endRotAngle) * endRotDist;

        // Calligraphic write-in progress: reveal top-to-bottom with noise
        const yMin = isMobile ? h * 0.15 : h * 0.25;
        const yMax = isMobile ? h * 0.75 : h * 0.75;
        const normalizedY = (katakanaPoint.y - yMin) / (yMax - yMin);
        const clampedY = Math.max(0, Math.min(1.0, normalizedY));
        // Max value is 0.75 + 0.12 = 0.87, ensuring all particles fade in before tReveal = 1.0
        const revealWeight = clampedY * 0.75 + Math.random() * 0.12;

        tempParticles.push({
          index: i,
          originX: katakanaPoint.x,
          originY: katakanaPoint.y,
          targetX: englishPoint.x,
          targetY: englishPoint.y,
          fragEndX,
          fragEndY,
          size: 1.0 + Math.random() * 2.0,
          angleOffset: Math.random() * Math.PI * 2,
          speedFactor: 0.5 + Math.random() * 0.7,
          clusterId,
          localAngle,
          localDist,
          revealWeight,
          trail: [],
        });
      }

      particles.current = tempParticles;
      isInitialized.current = true;
    };

    // Main animation loop
    const render = () => {
      if (!isInitialized.current) {
        initParticles();
      }

      const w = canvas.width;
      const h = canvas.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Clear the canvas
      ctx.clearRect(0, 0, w, h);

      const p = scrollProgressRef.current ?? 0;

      // Determine global canvas opacity based on timeline stages
      // Katakana is the starting shape, so canvas must be visible early
      let canvasOpacity = 0;
      if (p >= 0.05 && p < 0.15) {
        // Fade in during Act I (portrait push-in)
        canvasOpacity = (p - 0.05) / 0.10;
      } else if (p >= 0.15 && p < 0.78) {
        // Fully visible through Katakana, fragments, flow, and coalescence
        canvasOpacity = 1.0;
      } else if (p >= 0.78 && p < 0.82) {
        // Handoff fade-out as HTML English name snaps in
        canvasOpacity = 1.0 - (p - 0.78) / 0.04;
      }


      // Skip processing and clear trail arrays if canvas is completely invisible
      if (canvasOpacity <= 0) {
        for (let i = 0; i < particles.current.length; i++) {
          particles.current[i].trail = [];
        }
        animationFrameId.current = requestAnimationFrame(render);
        return;
      }

      const time = performance.now();

      // Define transition parameters based on stages
      let commonAlpha = 1.0;
      let commonScale = 1.0;

      if (p >= 0.50 && p < 0.60) {
        const tFrag = (p - 0.50) / 0.10;
        commonAlpha = 1.0 - tFrag * 0.15;
        commonScale = 1.0 + tFrag * 0.5;
      } else if (p >= 0.60 && p < 0.72) {
        const tFlow = (p - 0.60) / 0.12;
        commonAlpha = 0.85 - tFlow * 0.15;
        commonScale = 1.5 - tFlow * 0.3;
      } else if (p >= 0.72 && p < 0.78) {
        const tMorph = (p - 0.72) / 0.06;
        const easeMorph = 1 - Math.pow(1 - tMorph, 3);
        commonAlpha = 0.7 * (1 - easeMorph) + 1.0 * easeMorph;
        commonScale = 1.2 * (1 - easeMorph) + 1.0 * easeMorph;
      } else if (p >= 0.78) {
        const tHandoff = (p - 0.78) / 0.04;
        commonAlpha = Math.max(0, 1.0 - tHandoff);
        commonScale = 1.0;
      }

      // Batch all active particle drawings in a single path context
      ctx.beginPath();
      ctx.fillStyle = `rgba(245, 235, 220, ${commonAlpha * canvasOpacity})`;

      for (let i = 0; i < particles.current.length; i++) {
        const pt = particles.current[i];

        let finalX = pt.originX;
        let finalY = pt.originY;

        // --- POSITION CALCULATIONS ---
        
        if (p < 0.50) {
          // Stage 1 & 2: Katakana Reveal & Live Calligraphy
          // Reveal starts at p=0.05 (canvas fade-in start), fully revealed by p=0.20
          const tReveal = p >= 0.20 ? 1.0 : Math.max(0, (p - 0.05) / 0.15);
          
          if (tReveal < pt.revealWeight) {
            continue; // Not revealed yet, skip drawing
          } else {
            const breatheX = Math.sin(pt.originX * 0.05 + time * 0.001) * 1.5;
            const breatheY = Math.cos(pt.originY * 0.05 + time * 0.001) * 1.5;
            finalX = pt.originX + breatheX;
            finalY = pt.originY + breatheY;
          }
        } 
        else if (p >= 0.50 && p < 0.60) {
          // Stage 3: Ink Fragments
          const tFrag = (p - 0.50) / 0.10;
          
          const breatheX = Math.sin(pt.originX * 0.05 + time * 0.001) * 1.5;
          const breatheY = Math.cos(pt.originY * 0.05 + time * 0.001) * 1.5;
          const kX = pt.originX + breatheX;
          const kY = pt.originY + breatheY;

          const cluster = clustersRef.current[pt.clusterId];
          let fragX = pt.fragEndX;
          let fragY = pt.fragEndY;
          
          if (cluster) {
            const driftX = cluster.vx * tFrag * 90 + Math.sin(time * 0.0015 + pt.index) * 6 * tFrag;
            const driftY = cluster.vy * tFrag * 90 + Math.cos(time * 0.0015 + pt.index) * 6 * tFrag;
            const cx = cluster.x + driftX;
            const cy = cluster.y + driftY;
            
            const rotAngle = pt.localAngle + cluster.rotSpeed * tFrag * Math.PI * 1.5 + time * 0.0008 * cluster.rotSpeed;
            const rotDist = pt.localDist * (1.0 + tFrag * cluster.scaleSpeed * 0.4);
            
            fragX = cx + Math.cos(rotAngle) * rotDist;
            fragY = cy + Math.sin(rotAngle) * rotDist;
          }

          finalX = kX * (1 - tFrag) + fragX * tFrag;
          finalY = kY * (1 - tFrag) + fragY * tFrag;
        } 
        else if (p >= 0.60 && p < 0.72) {
          // Stage 4: Particle Flow (Fluid Swirl)
          const tFlow = (p - 0.60) / 0.12;

          const vortexCx = w * 0.5;
          const vortexCy = h * 0.5;
          const dx = pt.originX - vortexCx;
          const dy = pt.originY - vortexCy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const baseAngle = Math.atan2(dy, dx);
          
          const swirlAngle = baseAngle + tFlow * Math.PI * 2.2 + time * 0.0008 * pt.speedFactor + pt.angleOffset;
          const swirlRadius = dist * (0.85 - tFlow * 0.25) + Math.sin(time * 0.001 + pt.index) * 45 * pt.speedFactor;
          
          const waveX = Math.sin(pt.originY * 0.012 + time * 0.0015) * 55;
          const waveY = Math.cos(pt.originX * 0.012 + time * 0.0015) * 55;
          
          const flowX = vortexCx + Math.cos(swirlAngle) * swirlRadius + waveX;
          const flowY = vortexCy + Math.sin(swirlAngle) * swirlRadius + waveY + 70 * pt.speedFactor;

          finalX = pt.fragEndX * (1 - tFlow) + flowX * tFlow;
          finalY = pt.fragEndY * (1 - tFlow) + flowY * tFlow;
        } 
        else if (p >= 0.72 && p < 0.78) {
          // Stage 5: Coalescence into English Name "MUKUL"
          const tMorph = (p - 0.72) / 0.06;
          const easeMorph = 1 - Math.pow(1 - tMorph, 3); // Cubic ease-out

          const vortexCx = w * 0.5;
          const vortexCy = h * 0.5;
          const dx = pt.originX - vortexCx;
          const dy = pt.originY - vortexCy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const baseAngle = Math.atan2(dy, dx);
          
          const endSwirlAngle = baseAngle + Math.PI * 2.2 + time * 0.0008 * pt.speedFactor + pt.angleOffset;
          const endSwirlRadius = dist * 0.6 + Math.sin(time * 0.001 + pt.index) * 45 * pt.speedFactor;
          
          const endWaveX = Math.sin(pt.originY * 0.012 + time * 0.0015) * 55;
          const endWaveY = Math.cos(pt.originX * 0.012 + time * 0.0015) * 55;
          
          const flowEndX = vortexCx + Math.cos(endSwirlAngle) * endSwirlRadius + endWaveX;
          const flowEndY = vortexCy + Math.sin(endSwirlAngle) * endSwirlRadius + endWaveY + 70 * pt.speedFactor;

          const bounce = Math.sin(tMorph * Math.PI * 2.5) * (1 - tMorph) * 12 * pt.speedFactor;

          finalX = flowEndX * (1 - easeMorph) + pt.targetX * easeMorph;
          finalY = flowEndY * (1 - easeMorph) + pt.targetY * easeMorph + bounce;
        } 
        else {
          // Stage 6: Handoff Snap
          finalX = pt.targetX;
          finalY = pt.targetY;
        }

        // --- TRAIL HANDLING ---

        // Record trails for active movement phases (0.50 to 0.78)
        if (p >= 0.50 && p < 0.78) {
          pt.trail.push({ x: finalX, y: finalY });
          if (pt.trail.length > 5) {
            pt.trail.shift();
          }
        } else {
          pt.trail = [];
        }

        // --- BATCH PARTICLE GEOMETRY ---
        const r = pt.size * commonScale;
        ctx.moveTo(finalX + r, finalY);
        ctx.arc(finalX, finalY, r, 0, Math.PI * 2);
      }
      ctx.fill();

      // Draw trails in a single batched stroke operation
      if (p >= 0.50 && p < 0.78) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(245, 235, 220, ${commonAlpha * canvasOpacity * 0.22})`;
        ctx.lineWidth = 1.0;
        for (let i = 0; i < particles.current.length; i++) {
          const pt = particles.current[i];
          // Only draw trails for half the particles to save CPU/GPU overhead
          if (pt.trail.length > 1 && pt.index % 2 === 0) {
            ctx.moveTo(pt.trail[0].x, pt.trail[0].y);
            for (let j = 1; j < pt.trail.length; j++) {
              ctx.lineTo(pt.trail[j].x, pt.trail[j].y);
            }
          }
        }
        ctx.stroke();
      }

      animationFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", initCanvasSize);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [scrollProgressRef, isLoaded]);

  return (
    <canvas
      ref={canvasRef}
      className={styles.canvasLayer}
      style={{ pointerEvents: "none", display: "block" }}
    />
  );
}
