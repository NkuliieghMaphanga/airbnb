/**
 * ImageGallery
 *
 * Renders a large main image + 2×2 thumbnail grid (Figma layout).
 * "Show all photos" button opens a full-screen lightbox with navigation
 * arrows, keyboard support (←/→/Esc), and a thumbnail strip.
 */
import { useState, useEffect, useCallback } from 'react';
import '../styles/gallery.css';

/* ── Grid icon for "Show all photos" button ── */
function GridIcon() {
  return (
    <span className="gallery__show-all-icon" aria-hidden="true">
      <span /><span /><span /><span />
    </span>
  );
}

/* ── Lightbox ── */
function Lightbox({ images, title, startIndex, onClose }) {
  const [current, setCurrent] = useState(startIndex);
  const total = images.length;

  const prev = useCallback(() => setCurrent((i) => (i - 1 + total) % total), [total]);
  const next = useCallback(() => setCurrent((i) => (i + 1) % total), [total]);

  /* Keyboard navigation */
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowLeft')  prev();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'Escape')     onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [prev, next, onClose]);

  /* Lock body scroll while open */
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div
      className="gallery__lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Photo gallery"
      onClick={onClose}
    >
      <div
        className="gallery__lightbox-inner"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          className="gallery__lightbox-close"
          onClick={onClose}
          aria-label="Close gallery"
        >
          ✕
        </button>

        {/* Prev */}
        {total > 1 && (
          <button
            className="gallery__lightbox-nav gallery__lightbox-nav--prev"
            onClick={prev}
            aria-label="Previous photo"
          >
            ‹
          </button>
        )}

        {/* Main image */}
        <img
          key={current}
          src={images[current]}
          alt={`${title} — photo ${current + 1} of ${total}`}
          className="gallery__lightbox-img"
        />

        {/* Next */}
        {total > 1 && (
          <button
            className="gallery__lightbox-nav gallery__lightbox-nav--next"
            onClick={next}
            aria-label="Next photo"
          >
            ›
          </button>
        )}

        {/* Caption */}
        <p className="gallery__lightbox-caption">
          {current + 1} / {total}
        </p>

        {/* Thumbnail strip */}
        {total > 1 && (
          <div className="gallery__lightbox-thumbs" role="list">
            {images.map((img, i) => (
              <button
                key={i}
                role="listitem"
                className={`gallery__lightbox-thumb ${i === current ? 'gallery__lightbox-thumb--active' : ''}`}
                onClick={() => setCurrent(i)}
                aria-label={`Go to photo ${i + 1}`}
                aria-current={i === current}
              >
                <img src={img} alt="" loading="lazy" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Main component ── */
export default function ImageGallery({ images = [], title = 'Listing' }) {
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const open  = (index) => setLightboxIndex(index);
  const close = ()      => setLightboxIndex(null);

  const [main, ...rest] = images;
  const thumbs = rest.slice(0, 4);
  const totalCount = images.length;

  return (
    <>
      <div className="gallery" aria-label="Listing photos">
        {/* Large main image */}
        <div
          className="gallery__main"
          onClick={() => open(0)}
          role="button"
          tabIndex={0}
          aria-label="Open photo gallery"
          onKeyDown={(e) => e.key === 'Enter' && open(0)}
        >
          {main && (
            <img src={main} alt={`${title} — main photo`} loading="lazy" />
          )}
        </div>

        {/* 2×2 thumbnail grid */}
        <div className="gallery__grid" aria-hidden="true">
          {thumbs.map((img, i) => (
            <div
              key={i}
              className="gallery__thumb"
              onClick={() => open(i + 1)}
              role="button"
              tabIndex={0}
              aria-label={`View photo ${i + 2}`}
              onKeyDown={(e) => e.key === 'Enter' && open(i + 1)}
            >
              <img src={img} alt={`${title} — photo ${i + 2}`} loading="lazy" />
            </div>
          ))}
        </div>

        {/* "Show all photos" button — only shown when there are photos */}
        {totalCount > 0 && (
          <button
            className="gallery__show-all"
            onClick={() => open(0)}
            type="button"
            aria-label={`Show all ${totalCount} photos`}
          >
            <GridIcon />
            Show all photos
          </button>
        )}
      </div>

      {/* Lightbox portal */}
      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          title={title}
          startIndex={lightboxIndex}
          onClose={close}
        />
      )}
    </>
  );
}
