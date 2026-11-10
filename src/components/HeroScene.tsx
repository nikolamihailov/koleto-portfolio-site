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

function ParticleSphere({ count, color, additive }: { count: number; color: string; additive: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);
  const texture = useDotTexture();
  const { viewport, pointer } = useThree();
  const mouseWorld = useMemo(() => new THREE.Vector3(), []);
  const mouseLocal = useMemo(() => new THREE.Vector3(), []);

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

    // Pointer → world point in front of the sphere → sphere-local space
    mouseWorld.set((pointer.x * viewport.width) / 2, (pointer.y * viewport.height) / 2, RADIUS * 0.6);
    mouseLocal.copy(mouseWorld);
    pts.worldToLocal(mouseLocal);

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
      if (d < MOUSE_RADIUS) {
        const f = (1 - d / MOUSE_RADIUS) ** 2 * PUSH;
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
