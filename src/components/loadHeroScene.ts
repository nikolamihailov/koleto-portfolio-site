// Shared dynamic import so the loader can preload the three.js chunk
// while the KOLETO intro is playing.
export const loadHeroScene = () => import('./HeroScene');
