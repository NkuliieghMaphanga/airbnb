import '../styles/sections.css';

export default function ShopAirbnbSection() {
  return (
    <section className="section container">
      <div className="shop-airbnb">
        <div className="shop-airbnb__text">
          <h2>Give the gift of travel</h2>
          <p>Airbnb gift cards work anywhere Airbnb is available — no expiration, no fees.</p>
          <button className="shop-airbnb__btn">Shop gift cards</button>
        </div>
        <div className="shop-airbnb__image">
          <img src="https://picsum.photos/seed/airbnb-gift-cards/700/450" alt="Airbnb gift cards" loading="lazy" />
        </div>
      </div>
    </section>
  );
}
