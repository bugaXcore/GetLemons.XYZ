import React, { useRef, useEffect } from 'react';
import { AppConfig } from '../types';

interface PulseCanvasProps {
  config: AppConfig;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  age: number;
  hue: number;
  rotation: number;
  speed: number;
  id: number;
}

const MAX_PARTICLES = 2000; // Hard performance limit

export const PulseCanvas: React.FC<PulseCanvasProps> = ({ config }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);
  const mouseRef = useRef<{x: number, y: number}>({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const isPressedRef = useRef<boolean>(false);
  const particlesRef = useRef<Particle[]>([]);
  const frameCountRef = useRef<number>(0);
  const spawnAccumulatorRef = useRef<number>(0);
  const configRef = useRef<AppConfig>(config);
  
  // Store processed Path2D and its dimensions
  const pathDataRef = useRef<{ path: Path2D; viewBox: { x: number; y: number; width: number; height: number } } | null>(null);

  // Update config ref whenever props change
  useEffect(() => {
    configRef.current = config;
    if (config.customSvg) {
      pathDataRef.current = {
        path: new Path2D(config.customSvg.path),
        viewBox: config.customSvg.viewBox
      };
    } else {
      pathDataRef.current = null;
    }
  }, [config]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (frameCountRef.current < 10) {
        mouseRef.current = { x: canvas.width / 2, y: canvas.height / 2 };
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseDown = (e: MouseEvent) => {
      isPressedRef.current = true;
      mouseRef.current = { x: e.clientX, y: e.clientY };
      // Reset accumulator to trigger immediate spawn
      spawnAccumulatorRef.current = Math.max(0.1, configRef.current.frequency);
    };

    const handleMouseUp = () => {
      isPressedRef.current = false;
    };

    const handleTouchStart = (e: TouchEvent) => {
      // Allow scrolling (no preventDefault), but track interaction
      isPressedRef.current = true;
      const touch = e.touches[0];
      if (touch) {
        mouseRef.current = { x: touch.clientX, y: touch.clientY };
      }
      spawnAccumulatorRef.current = Math.max(0.1, configRef.current.frequency);
    };

    const handleTouchEnd = () => {
      isPressedRef.current = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (touch) {
        mouseRef.current = { x: touch.clientX, y: touch.clientY };
      }
    };

    const handleBlur = () => {
      isPressedRef.current = false;
    };

    // Attach to WINDOW to capture events even through the Foreground UI
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    handleResize();

    let particleIdCounter = 0;

    const animate = () => {
      const currentConfig = configRef.current;
      frameCountRef.current++;

      // 1. Clear Screen
      ctx.fillStyle = '#09090b'; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Spawn Logic
      if (isPressedRef.current) {
        spawnAccumulatorRef.current += 1;
        const period = Math.max(0.1, currentConfig.frequency);
        
        while (spawnAccumulatorRef.current >= period) {
          spawnAccumulatorRef.current -= period;
          
          if (particlesRef.current.length < MAX_PARTICLES) {
            const hueOffset = (frameCountRef.current * currentConfig.colorCycleSpeed) % 360;
            const hue = (currentConfig.baseHue + hueOffset) % 360;
            
            particlesRef.current.push({
              x: mouseRef.current.x,
              y: mouseRef.current.y,
              size: currentConfig.initialSize,
              age: 0,
              hue: hue,
              rotation: (currentConfig.initialRotation * Math.PI) / 180,
              speed: currentConfig.speed,
              id: particleIdCounter++,
            });
          }
        }
      } else {
        spawnAccumulatorRef.current = 0;
      }

      // 3. Update & Draw Loop (Optimized In-Place Compaction)
      const particles = particlesRef.current;
      let aliveCount = 0;
      
      // Hoist static properties
      ctx.lineWidth = currentConfig.strokeWidth;
      const customPathData = pathDataRef.current;
      const lifespan = currentConfig.lifespan;
      const shapeRoundness = currentConfig.shapeRoundness;
      const rotationSpeedRad = (currentConfig.rotationSpeed * Math.PI) / 180;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        p.age++;
        p.size += currentConfig.speed; 
        p.rotation += rotationSpeedRad;

        if (p.age < lifespan) {
          // Keep alive: Compact array by moving to front if needed
          if (i !== aliveCount) {
            particles[aliveCount] = p;
          }
          aliveCount++;

          // Rendering
          const opacity = 1 - (p.age / lifespan);
          // Skip practically invisible particles for performance
          if (opacity > 0.01) {
            const easedOpacity = opacity * opacity; 
            
            ctx.strokeStyle = `hsla(${p.hue}, 80%, 60%, ${easedOpacity})`;
            
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);
            
            if (customPathData) {
              const { path, viewBox } = customPathData;
              const maxDim = Math.max(viewBox.width, viewBox.height) || 24;
              const scale = p.size / maxDim;
              
              if (scale > 0.0001) {
                  ctx.scale(scale, scale);
                  // Constant stroke width in screen pixels
                  ctx.lineWidth = currentConfig.strokeWidth / scale;
                  
                  const cx = viewBox.x + (viewBox.width / 2);
                  const cy = viewBox.y + (viewBox.height / 2);
                  
                  ctx.translate(-cx, -cy);
                  ctx.stroke(path);
              }
            } else {
              // Basic Shapes
              const size = p.size;
              const radius = Math.min(size/2, shapeRoundness);
              
              ctx.beginPath();
              if (radius > 0) {
                  ctx.roundRect(-size / 2, -size / 2, size, size, radius);
              } else {
                  ctx.rect(-size / 2, -size / 2, size, size);
              }
              ctx.stroke();
            }
            
            ctx.restore();
          }
        }
      }

      // Truncate the array to remove dead particles from the end
      if (particles.length > aliveCount) {
        particles.length = aliveCount;
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      // Remove from WINDOW
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="block w-full h-full absolute top-0 left-0 touch-none"
    />
  );
};