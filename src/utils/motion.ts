/**
 * Spread onto a motion component that animates opacity: `<m.div {...jsAnimated} … />`.
 *
 * Framer Motion normally hands opacity (and filter/clip-path) animations to the browser's
 * Web Animations API. When such an animation finishes, Firefox removes it a frame before
 * Framer Motion commits the final inline value, so for one frame the element snaps back
 * to its start value: fades flash, and outgoing gallery slides blink back to full opacity.
 * Framer Motion skips WAAPI for elements that have an `onUpdate` handler, so this no-op
 * keeps the animation on the main thread, where the value is written every frame and
 * there is no gap. The cost is negligible for the handful of elements animating at once.
 */
export const jsAnimated = { onUpdate: () => {} } as const;
