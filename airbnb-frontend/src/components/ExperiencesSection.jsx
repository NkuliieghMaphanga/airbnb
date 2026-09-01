/**
 * ExperiencesSection
 *
 * "Discover Airbnb Experiences" section on the Home page.
 * Renders the two experience cards (trip + home) from staticContent.js as a
 * side-by-side 2-column grid, each with a background image, scrim overlay,
 * title, subtitle, and a CTA button.
 *
 * Note: the individual "Things to do on your trip" and "Things to do at home"
 * full-width sections are rendered separately via ThingsToDoSection.jsx,
 * placed above this grid in HomePage.jsx.
 */
import { experiences } from '../data/staticContent.js';
import '../styles/sections.css';

export default function ExperiencesSection() {
  return (
    <section className="section container">
      <h2 className="section__title">Discover Airbnb Experiences</h2>
      <div className="experience-grid">
        {experiences.map((exp) => (
          <div key={exp.title} className="experience-card" style={{ backgroundImage: `url(${exp.image})` }}>
            <div className="experience-card__scrim" />
            <div className="experience-card__content">
              <h3>{exp.title}</h3>
              <p>{exp.subtitle}</p>
              <button className="experience-card__btn">{exp.cta}</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
