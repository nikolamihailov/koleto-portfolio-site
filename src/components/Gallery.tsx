import { AnimatePresence, motion, type PanInfo } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useI18n } from '../i18n/LanguageContext';
import { imgSrc, imgSrcSet, preloadImage } from '../utils/images';
import { jsAnimated } from '../utils/motion';

const SWIPE = 60;
// The gallery is capped at 900px (see _gallery.scss); below that it spans the width minus gutters.
const STAGE_SIZES = '(min-width: 964px) 900px, calc(100vw - 2rem)';

export default function Gallery({ images, title }: { images: string[]; title: string }) {
  const [[index, dir], setState] = useState<[number, number]>([0, 0]);
  const count = images.length;
  const { t } = useI18n();

  const go = useCallback((step: number) => setState(([i]) => [(i + step + count) % count, step]), [count]);

  // Preload the neighbouring slides so arrows/swipes show the next image instantly.
  useEffect(() => {
    if (count < 2) return;
    preloadImage(images[(index + 1) % count], STAGE_SIZES);
    preloadImage(images[(index - 1 + count) % count], STAGE_SIZES);
  }, [index, images, count]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -SWIPE) go(1);
    else if (info.offset.x > SWIPE) go(-1);
  };

  return (
    <div className="gallery">
      <div className="gallery__stage">
        {/* Default ("sync") mode: slides are absolutely positioned, so entering and exiting
            images can overlap. mode="popLayout" re-mounted the entering image when the
            exit finished, replaying its fade-in (visible as a twitch). */}
        <AnimatePresence initial={false} custom={dir}>
          <motion.img
            key={index}
            src={imgSrc(images[index], 1600)}
            srcSet={imgSrcSet(images[index])}
            sizes={STAGE_SIZES}
            alt={t('gallery.screenshot', { title, n: index + 1, count })}
            {...jsAnimated}
            className="gallery__image"
            // The first slide is above the fold on the detail page
            fetchPriority={index === 0 ? 'high' : 'auto'}
            custom={dir}
            variants={{
              enter: (d: number) => ({ opacity: 0, x: d >= 0 ? 80 : -80, scale: 0.98 }),
              center: { opacity: 1, x: 0, scale: 1 },
              exit: (d: number) => ({ opacity: 0, x: d >= 0 ? -80 : 80, scale: 0.98 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            drag={count > 1 ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={onDragEnd}
            draggable={false}
          />
        </AnimatePresence>

        {count > 1 && (
          <>
            <button
              type="button"
              className="gallery__nav gallery__nav--prev"
              onClick={() => go(-1)}
              aria-label={t('gallery.previous')}
            >
              <FiChevronLeft />
            </button>
            <button
              type="button"
              className="gallery__nav gallery__nav--next"
              onClick={() => go(1)}
              aria-label={t('gallery.next')}
            >
              <FiChevronRight />
            </button>
            <span className="gallery__counter">
              {index + 1} / {count}
            </span>
          </>
        )}
      </div>

      {count > 1 && (
        <ul className="gallery__thumbs">
          {images.map((src, i) => (
            <li key={src}>
              <button
                type="button"
                className={`gallery__thumb ${i === index ? 'is-active' : ''}`}
                onClick={() => setState([i, i > index ? 1 : -1])}
                aria-label={t('gallery.show', { n: i + 1 })}
                aria-current={i === index}
              >
                {/* Thumbnails always use the smallest size */}
                <img src={imgSrc(src, 480)} alt="" width={480} height={300} loading="lazy" decoding="async" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
