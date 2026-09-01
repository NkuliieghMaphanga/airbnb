/**
 * ThingsToDoSection
 *
 * Renders a single full-width "things to do" promotional section:
 * a large background image with an overlaid title, subtitle, and CTA button.
 *
 * Props:
 *   title    {string} — section heading
 *   subtitle {string} — short description
 *   cta      {string} — button label
 *   image    {string} — background image URL
 */
import '../styles/sections.css';

export default function ThingsToDoSection({ title, subtitle, cta, image }) {
  return (
    <section className="section container">
      <div
        className="things-to-do-card"
        style={{ backgroundImage: `url(${image})` }}
        role="img"
        aria-label={title}
      >
        {/* Dark gradient scrim so text is readable over any image */}
        <div className="things-to-do-card__scrim" aria-hidden="true" />

        <div className="things-to-do-card__content">
          <h2>{title}</h2>
          <p>{subtitle}</p>
          <button className="things-to-do-card__btn" type="button">
            {cta}
          </button>
        </div>
      </div>
    </section>
  );
}
