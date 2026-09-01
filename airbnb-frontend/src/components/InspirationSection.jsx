/**
 * InspirationSection
 *
 * "Inspiration for your next trip" section on the Home page.
 * Renders a responsive grid of destination cards sourced from the static
 * `destinations` array in staticContent.js.  Each card links to the
 * LocationPage for that destination.
 */
import { Link } from 'react-router-dom';
import { destinations } from '../data/staticContent.js';
import '../styles/sections.css';

export default function InspirationSection() {
  return (
    <section className="section container">
      <h2 className="section__title">Inspiration for your next trip</h2>
      <div className="destination-grid">
        {destinations.map((dest) => (
          <Link key={dest.name} to={`/locations/${encodeURIComponent(dest.name)}`} className="destination-card">
            <div className="destination-card__image">
              <img src={dest.image} alt={dest.name} loading="lazy" />
            </div>
            <p className="destination-card__name">{dest.name}</p>
            <p className="destination-card__tagline">{dest.tagline}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
