// Framer Motion's animation, gesture, drag and layout features. Loaded as a separate
// chunk by <LazyMotion> in App so they stay out of the initial bundle. domMax (not
// the smaller domAnimation) because the nav underline uses layoutId and the gallery
// uses drag.
export { domMax as default } from 'framer-motion';
