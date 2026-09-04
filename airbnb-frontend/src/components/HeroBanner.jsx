/**
 * HeroBanner — cinematic full-width hero matching the Figma design.
 * Eyebrow label · H1 headline · tagline · primary CTA button · scroll hint.
 */
import { useNavigate } from 'react-router-dom';
import '../styles/hero.css';

function ArrowDownIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <path d="M12 5v14M5 12l7 7 7-7" />
    </svg>
  );
}

export default function HeroBanner() {
  const navigate = useNavigate();

  return (
    <section className="hero" aria-label="Hero banner">
      {/* Dark gradient overlay */}
      <div className="hero__overlay" aria-hidden="true" />

      <div className="hero__content container">
        <p className="hero__eyebrow">Discover your next adventure</p>

        <h1>Not all who<br />wander are lost.</h1>

        <p>Find a place that feels like yours — from city lofts to
          mountain retreats, anywhere in the world.</p>

        <button
          className="hero__cta"
          type="button"
          onClick={() => navigate('/locations/all')}
        >
          Start exploring
        </button>
      </div>

      {/* Animated scroll hint */}
      <div className="hero__scroll-hint" aria-hidden="true">
        <span>Scroll</span>
        <ArrowDownIcon />
      </div>
    </section>
  );
}
