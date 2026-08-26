/**
 * LocationDetailsPage
 *
 * Shows full accommodation details:
 *  - Heading: type + location
 *  - Subheading: star rating, review count, location
 *  - ImageGallery: large main + 2×2 thumbnail grid
 *  - Two-column body:
 *      Left  — all static info sections
 *      Right — CostCalculator (sticky)
 */
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAccommodationById } from '../api/accommodations.js';
import ImageGallery from '../components/ImageGallery.jsx';
import CostCalculator from '../components/CostCalculator.jsx';
import '../styles/locationDetails.css';

export default function LocationDetailsPage() {
  const { id, location } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getAccommodationById(id)
      .then((res) => {
        if (!cancelled) setListing(res.data.data);
      })
      .catch(() => {
        if (!cancelled) setError('This listing could not be found.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <div className="container details-page__status">
        <p>Loading listing…</p>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="container details-page__status">
        <p>{error || 'Listing not found.'}</p>
        <Link to="/" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
          Back to home
        </Link>
      </div>
    );
  }

  const ratings = listing.specificRatings || {};
  const ratingEntries = Object.entries(ratings).filter(([, v]) => v > 0);

  return (
    <div className="container details-page">

      {/* ── Heading ── */}
      <header className="details-page__heading">
        <h1>{listing.type} in {listing.location}</h1>
        <p className="details-page__subheading">
          <span>★ {listing.rating?.toFixed(2) || 'New'}</span>
          <span>·</span>
          <span>{listing.reviews || 0} review{listing.reviews !== 1 ? 's' : ''}</span>
          <span>·</span>
          <span>{listing.location}</span>
        </p>
      </header>

      {/* ── Image gallery: large left, 2×2 grid right ── */}
      <ImageGallery images={listing.images} title={listing.title} />

      {/* ── Two-column body ── */}
      <div className="details-page__body">

        {/* LEFT — static info sections */}
        <div className="details-page__main">

          {/* Accommodation details */}
          <section className="details-page__section">
            <h2>{listing.title}</h2>
            <p className="details-page__meta">
              <span>👥 {listing.guests} guest{listing.guests !== 1 ? 's' : ''}</span>
              <span>🛏 {listing.bedrooms} bedroom{listing.bedrooms !== 1 ? 's' : ''}</span>
              <span>🚿 {listing.bathrooms} bathroom{listing.bathrooms !== 1 ? 's' : ''}</span>
            </p>
            <p>{listing.description}</p>
          </section>

          {/* Where you'll sleep */}
          <section className="details-page__section">
            <h3>Where you'll sleep</h3>
            <p>
              {listing.bedrooms} cosy bedroom{listing.bedrooms !== 1 ? 's' : ''}, comfortably fitting
              up to {listing.guests} guests.
            </p>
          </section>

          {/* What this place offers */}
          <section className="details-page__section">
            <h3>What this place offers</h3>
            <ul className="details-page__amenities">
              {(listing.amenities || []).map((a) => (
                <li key={a}>{a}</li>
              ))}
              {listing.enhancedCleaning && <li>Enhanced cleaning</li>}
              {listing.selfCheckIn && <li>Self check-in</li>}
            </ul>
          </section>

          {/* 7 nights section */}
          <section className="details-page__section">
            <h3>7 nights in {listing.location}</h3>
            <p>
              Priced at <strong>${listing.price}</strong> a night. Book 7 or more nights and
              receive a {listing.weeklyDiscount || 0}% weekly discount applied automatically.
            </p>
          </section>

          {/* Reviews */}
          {ratingEntries.length > 0 && (
            <section className="details-page__section">
              <h3>Reviews</h3>
              <div className="details-page__overall-rating">
                <span className="star-icon">★</span>
                <span className="rating-big">{listing.rating?.toFixed(2)}</span>
                <span style={{ color: 'var(--color-text-secondary)', fontSize: 14 }}>
                  · {listing.reviews || 0} review{listing.reviews !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="details-page__ratings-grid">
                {ratingEntries.map(([key, value]) => (
                  <div key={key} className="details-page__rating-row">
                    <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                    <span>
                      <span style={{ color: 'var(--color-primary)' }}>★</span>{' '}
                      {typeof value === 'number' ? value.toFixed(1) : value}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Host details */}
          <section className="details-page__section">
            <h3>Hosted by {listing.host?.username || 'your host'}</h3>
            <p>
              Your host is ready to make your stay special. Reach out through the reservations
              dashboard once you've booked to coordinate arrival details.
            </p>
          </section>

          {/* House rules / health & safety / cancellation */}
          <section className="details-page__section">
            <h3>House rules, health &amp; safety, cancellation policy</h3>
            <p>
              Check in respectfully, self check-in available where indicated. Flexible
              cancellation — cancel up to 48 hours before check-in for a full refund.
              Enhanced cleaning protocols followed between every stay.
            </p>
          </section>

        </div>

        {/* RIGHT — cost calculator (sticky on desktop) */}
        <CostCalculator listing={listing} />

      </div>
    </div>
  );
}
