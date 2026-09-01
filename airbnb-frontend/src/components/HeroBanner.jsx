/**
 * HeroBanner
 *
 * Full-width hero section at the top of the Home page.
 * Contains a headline, tagline, and a "Start exploring" CTA button that
 * navigates the user to the New York location page as a demo destination.
 * Background image and overlay are handled entirely in hero.css.
 */
import { useNavigate } from 'react-router-dom';
import '../styles/hero.css';

export default function HeroBanner() {
  const navigate = useNavigate();

  return (
    <section className="hero">
      <div className="hero__overlay" />
      <div className="hero__content container">
        <h1>Not all who wander are lost.</h1>
        <p>Find a place that feels like yours, anywhere in the world.</p>
        <button className="hero__cta" onClick={() => navigate('/locations/New York')}>
          Start exploring
        </button>
      </div>
    </section>
  );
}
