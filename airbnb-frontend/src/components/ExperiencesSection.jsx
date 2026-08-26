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
