import HeroBanner from '../components/HeroBanner.jsx';
import InspirationSection from '../components/InspirationSection.jsx';
import ExperiencesSection from '../components/ExperiencesSection.jsx';
import ShopAirbnbSection from '../components/ShopAirbnbSection.jsx';
import FutureGetawaysSection from '../components/FutureGetawaysSection.jsx';

export default function HomePage() {
  return (
    <div>
      <HeroBanner />
      <InspirationSection />
      <ExperiencesSection />
      <ShopAirbnbSection />
      <FutureGetawaysSection />
    </div>
  );
}
