import { useEffect, useRef } from 'react';
import { useCssVar } from '../hooks/useCssVar';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  a: number;
}

const LINK_DIST = 120;
const MOUSE_RADIUS = 140;

/** Lightweight full-page 2D canvas of slowly drifting particles. */
export default function ParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rgb = useCssVar('--particle') || '0, 229, 255';
  const rgbRef = useRef(rgb);
  rgbRef.current = rgb;

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // With "reduce motion" on (e.g. Windows "Animation effects" off) keep a calm, slower
    // drift instead of freezing, and skip the mouse interaction.
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const speed = reduced ? 0.4 : 1;
    let particles: Particle[] = [];
    let w = 0;
    let h = 0;
    let raf = 0;
    const mouse = { x: -9999, y: -9999 };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.round(Math.min(110, Math.max(28, (w * h) / 14000)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35 - 0.08,
        r: Math.random() * 1.6 + 0.5,
        a: Math.random() * 0.5 + 0.25,
      }));
    };

    const draw = () => {
      const c = rgbRef.current;
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!reduced) {
          // Gentle mouse repel
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < MOUSE_RADIUS * MOUSE_RADIUS) {
            const d = Math.sqrt(d2) || 1;
            const f = (1 - d / MOUSE_RADIUS) * 0.6;
            p.x += (dx / d) * f;
            p.y += (dy / d) * f;
          }
        }
        p.x += p.vx * speed;
        p.y += p.vy * speed;
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${c}, ${p.a})`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK_DIST * LINK_DIST) {
            const alpha = (1 - Math.sqrt(d2) / LINK_DIST) * 0.12;
            ctx.strokeStyle = `rgba(${c}, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      }
    };

    const loop = () => {
      draw();
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onLeave = () => {
      mouse.x = mouse.y = -9999;
    };
    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) loop();
    };

    resize();
    loop();

    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className="particles" aria-hidden="true" />;
}
