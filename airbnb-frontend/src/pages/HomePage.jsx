/**
 * HomePage
 *
 * Composes all home-page sections in the order specified by the brief:
 *   1. Hero Banner
 *   2. Inspiration for your next trip (destination cards)
 *   3. Things to do on your trip
 *   4. Things to do at home
 *   5. Discover Airbnb Experiences (full 2-up grid)
 *   6. ShopAirbnb (gift cards promo)
 *   7. Inspiration for future getaways (tabs)
 */
import HeroBanner from '../components/HeroBanner.jsx';
import InspirationSection from '../components/InspirationSection.jsx';
import ThingsToDoSection from '../components/ThingsToDoSection.jsx';
import ExperiencesSection from '../components/ExperiencesSection.jsx';
import ShopAirbnbSection from '../components/ShopAirbnbSection.jsx';
import FutureGetawaysSection from '../components/FutureGetawaysSection.jsx';

// Static data for the two "Things to do" sections — images use consistent
// picsum seeds so they don't change between renders.
const TRIP_SECTION = {
  title: 'Things to do on your trip',
  subtitle: 'Book unique experiences hosted by locals — food tours, guided hikes, cooking classes and more.',
  cta: 'Explore experiences',
  image: 'https://picsum.photos/seed/things-trip-airbnb/1200/500',
};

const HOME_SECTION = {
  title: 'Things to do at home',
  subtitle: 'Join live online experiences without leaving your house — yoga, art, trivia and beyond.',
  cta: 'Explore online experiences',
  image: 'https://picsum.photos/seed/things-home-airbnb/1200/500',
};

export default function HomePage() {
  return (
    <div>
      {/* 1. Hero banner with CTA */}
      <HeroBanner />

      {/* 2. Destination inspiration cards */}
      <InspirationSection />

      {/* 3. Things to do on your trip — full-width image card */}
      <ThingsToDoSection {...TRIP_SECTION} />

      {/* 4. Things to do at home — full-width image card */}
      <ThingsToDoSection {...HOME_SECTION} />

      {/* 5. Discover Airbnb Experiences — 2-column grid */}
      <ExperiencesSection />

      {/* 6. ShopAirbnb — gift card promo */}
      <ShopAirbnbSection />

      {/* 7. Future getaways — tabbed list */}
      <FutureGetawaysSection />
    </div>
  );
}
