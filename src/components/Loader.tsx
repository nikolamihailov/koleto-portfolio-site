import { motion, type Variants } from 'framer-motion';

const WORD = 'KOLETO';

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
};

const letter: Variants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(12px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Loader() {
  return (
    <motion.div
      className="loader"
      role="status"
      aria-label="Loading"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.7, ease: [0.65, 0, 0.35, 1] } }}
    >
      <motion.h1
        className="loader__word"
        variants={container}
        initial="hidden"
        animate="show"
        exit={{ opacity: 0, scale: 1.08, filter: 'blur(10px)', transition: { duration: 0.6 } }}
      >
        {WORD.split('').map((ch, i) => (
          <motion.span key={i} variants={letter} className="loader__letter">
            {ch}
          </motion.span>
        ))}
      </motion.h1>
      <motion.span
        className="loader__bar"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.6, ease: [0.65, 0, 0.35, 1], delay: 0.3 }}
      />
    </motion.div>
  );
}
