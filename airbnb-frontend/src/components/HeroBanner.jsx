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
