import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';
import { useCssVar } from '../hooks/useCssVar';

const RADIUS = 1.45;
const MOUSE_RADIUS = 0.7;
const PUSH = 0.9;

/** Soft round sprite so points render as glowing dots, not squares. */
function useDotTexture() {
  return useMemo(() => {
    const size = 64;
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const ctx = c.getContext('2d')!;
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.35, 'rgba(255,255,255,0.8)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);
}

/**
 * Tracks the real pointer relative to the canvas, in normalised device coordinates.
 *
 * We compute this ourselves from the canvas' on-screen rect instead of using R3F's
 * `pointer`: with the canvas offset to the right of the hero (left: 40%) and events
 * sourced from <body>, R3F's value was shifted by the canvas offset, so hovering the
 * text pushed the sphere and hovering the sphere did nothing. It also defaults to the
 * canvas centre and keeps its last value, which dented the sphere with no cursor.
 *
 * `active` is true for a mouse/pen inside the window, or a finger while touching.
 */
function usePointer(canvas: HTMLCanvasElement) {
  const state = useRef({ active: false, ndc: new THREE.Vector2() });
  useEffect(() => {
    const track = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      state.current.ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    };
    const onMove = (e: PointerEvent) => {
      track(e);
      // Touch only counts while the finger is down
      state.current.active = e.pointerType !== 'touch' || e.pressure > 0 || e.buttons > 0;
    };
    const onDown = (e: PointerEvent) => {
      track(e);
      state.current.active = true;
    };
    const onUp = (e: PointerEvent) => {
      if (e.pointerType === 'touch') state.current.active = false;
    };
    const onLeave = () => (state.current.active = false);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    window.addEventListener('pointercancel', onLeave);
    window.addEventListener('blur', onLeave);
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onLeave);
      window.removeEventListener('blur', onLeave);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, [canvas]);
  return state;
}

function ParticleSphere({ count, color, additive }: { count: number; color: string; additive: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);
  const texture = useDotTexture();
  const { camera, gl } = useThree();
  const mouseLocal = useMemo(() => new THREE.Vector3(), []);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  // Slightly larger than the sphere so hovering just off the edge still ripples it
  const hitSphere = useMemo(() => new THREE.Sphere(new THREE.Vector3(), RADIUS * 1.08), []);
  const pointer = usePointer(gl.domElement);
  const strength = useRef(0);

  // Fibonacci sphere = evenly distributed points. Start scattered so they "assemble" on load.
  const { base, positions } = useMemo(() => {
    const base = new Float32Array(count * 3);
    const positions = new Float32Array(count * 3);
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = golden * i;
      const jitter = RADIUS * (1 + (Math.random() - 0.5) * 0.04);
      base[i * 3] = Math.cos(theta) * r * jitter;
      base[i * 3 + 1] = y * jitter;
      base[i * 3 + 2] = Math.sin(theta) * r * jitter;
      positions[i * 3] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 14;
    }
    return { base, positions };
  }, [count]);

  useFrame((state, delta) => {
    const pts = pointsRef.current;
    if (!pts) return;
    const t = state.clock.elapsedTime;
    pts.rotation.y += delta * 0.09;
    pts.rotation.x = Math.sin(t * 0.2) * 0.15;

    // Cast a ray from the camera through the cursor onto the sphere's surface, only while
    // a real pointer is present (see usePointer).
    let target = 0;
    if (pointer.current.active) {
      raycaster.setFromCamera(pointer.current.ndc, camera);
      if (raycaster.ray.intersectSphere(hitSphere, mouseLocal)) {
        pts.worldToLocal(mouseLocal);
        target = 1;
      }
    }
    // Ease the effect in/out so the dent never pops on or off
    strength.current += (target - strength.current) * Math.min(1, delta * 6);
    const push = PUSH * strength.current;

    const attr = pts.geometry.attributes.position as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    const ease = Math.min(1, delta * 4);

    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      const bx = base[ix];
      const by = base[ix + 1];
      const bz = base[ix + 2];
      // Subtle breathing wave across the surface
      const wave = 1 + Math.sin(t * 1.3 + by * 2.2 + bx * 1.4) * 0.035;
      let tx = bx * wave;
      let ty = by * wave;
      let tz = bz * wave;

      const dx = tx - mouseLocal.x;
      const dy = ty - mouseLocal.y;
      const dz = tz - mouseLocal.z;
      const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (push > 0.001 && d < MOUSE_RADIUS && d > 0) {
        const f = (1 - d / MOUSE_RADIUS) ** 2 * push;
        tx += (dx / d) * f;
        ty += (dy / d) * f;
        tz += (dz / d) * f;
      }

      arr[ix] += (tx - arr[ix]) * ease;
      arr[ix + 1] += (ty - arr[ix + 1]) * ease;
      arr[ix + 2] += (tz - arr[ix + 2]) * ease;
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        key={additive ? 'add' : 'normal'}
        map={texture}
        color={color}
        size={0.055}
        sizeAttenuation
        transparent
        depthWrite={false}
        opacity={additive ? 0.9 : 0.85}
        blending={additive ? THREE.AdditiveBlending : THREE.NormalBlending}
      />
    </points>
  );
}

const hasWebGL = () => {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch {
    return false;
  }
};

export default function HeroScene() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const { theme } = useTheme();
  const accent = useCssVar('--accent') || '#00e5ff';
  const supported = useMemo(hasWebGL, []);
  // Scaled with the sphere's surface area so the dot density stays the same
  const count = useMemo(() => (window.innerWidth < 768 ? 1300 : 2500), []);

  // Pause rendering when the hero is off-screen.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (!supported) return <div className="hero-scene hero-scene--fallback" aria-hidden="true" />;

  return (
    <div ref={wrapRef} className="hero-scene" aria-hidden="true">
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 6], fov: 50 }}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
        frameloop={visible ? 'always' : 'never'}
        eventSource={document.body}
        eventPrefix="client"
      >
        <ParticleSphere count={count} color={accent} additive={theme === 'dark'} />
      </Canvas>
    </div>
  );
}
