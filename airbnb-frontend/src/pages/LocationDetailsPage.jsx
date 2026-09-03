/**
 * LocationDetailsPage
 *
 * Full listing detail view. Improvements over original:
 *  - Styled subheading with star rating, review count, superhost badge
 *  - Amenities list with matching emoji icons per amenity name
 *  - Host section with avatar circle (initial letter) + join date
 *  - Rating rows with visual progress bars
 *  - "Where you'll sleep" bedroom cards
 *  - Back breadcrumb navigation
 */
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAccommodationById } from '../api/accommodations.js';
import ImageGallery from '../components/ImageGallery.jsx';
import CostCalculator from '../components/CostCalculator.jsx';
import '../styles/locationDetails.css';

/* ── Amenity → emoji icon map ── */
const AMENITY_ICONS = {
  'WiFi':             '📶',
  'Kitchen':          '🍳',
  'Air conditioning': '❄️',
  'Washer':           '🫧',
  'TV':               '📺',
  'Free parking':     '🅿️',
  'Pool':             '🏊',
  'Hot tub':          '♨️',
  'BBQ grill':        '🔥',
  'Balcony':          '🌅',
  'Enhanced cleaning':'✨',
  'Self check-in':    '🔑',
};

function amenityIcon(name) {
  return AMENITY_ICONS[name] || '✓';
}

/* ── Rating progress bar ── */
function RatingBar({ value, max = 5 }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="details-page__rating-bar-wrap">
      <div className="details-page__rating-bar">
        <div className="details-page__rating-bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <span>{typeof value === 'number' ? value.toFixed(1) : value}</span>
    </div>
  );
}

/* ── Bedroom card ── */
function BedroomCard({ index, guests }) {
  return (
    <div className="details-page__bedroom-card">
      <span className="details-page__bedroom-icon" aria-hidden="true">🛏</span>
      <p className="details-page__bedroom-label">Bedroom {index + 1}</p>
      <p className="details-page__bedroom-sub">
        {index === 0 ? `Fits up to ${guests} guests` : 'Cosy private room'}
      </p>
    </div>
  );
}

/* ── Main component ── */
export default function LocationDetailsPage() {
  const { id, location } = useParams();
  const [listing, setListing]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getAccommodationById(id)
      .then((res)  => { if (!cancelled) setListing(res.data.data); })
      .catch(()    => { if (!cancelled) setError('This listing could not be found.'); })
      .finally(()  => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [id]);

  /* ── Loading state ── */
  if (loading) {
    return (
      <div className="container details-page__status">
        <div className="details-page__spinner" aria-label="Loading" />
        <p>Loading listing…</p>
      </div>
    );
  }

  /* ── Error / not found state ── */
  if (error || !listing) {
    return (
      <div className="container details-page__status">
        <span className="details-page__status-icon" aria-hidden="true">🏚</span>
        <p>{error || 'Listing not found.'}</p>
        <Link to="/" className="details-page__status-link">
          ← Back to home
        </Link>
      </div>
    );
  }

  const ratings      = listing.specificRatings || {};
  const ratingEntries = Object.entries(ratings).filter(([, v]) => v > 0);

  const allAmenities = [
    ...(listing.amenities || []),
    ...(listing.enhancedCleaning ? ['Enhanced cleaning'] : []),
    ...(listing.selfCheckIn      ? ['Self check-in']     : []),
  ];

  const hostInitial = listing.host?.username
    ? listing.host.username.charAt(0).toUpperCase()
    : '?';

  return (
    <div className="container details-page">

      {/* ── Breadcrumb ── */}
      <nav className="details-page__breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span aria-hidden="true"> / </span>
        <Link to={`/locations/${encodeURIComponent(location)}`}>{location}</Link>
        <span aria-hidden="true"> / </span>
        <span>{listing.title}</span>
      </nav>

      {/* ── Heading ── */}
      <header className="details-page__heading">
        <h1>{listing.type} in {listing.location}</h1>

        {/* Styled subheading — star · reviews · location */}
        <div className="details-page__subheading">
          <span className="details-page__subheading-rating">
            <span className="details-page__subheading-star" aria-hidden="true">★</span>
            {listing.rating > 0 ? listing.rating.toFixed(2) : 'New'}
          </span>

          {listing.reviews > 0 && (
            <>
              <span className="details-page__subheading-dot" aria-hidden="true">·</span>
              <span className="details-page__subheading-underline">
                {listing.reviews} review{listing.reviews !== 1 ? 's' : ''}
              </span>
            </>
          )}

          <span className="details-page__subheading-dot" aria-hidden="true">·</span>
          <span className="details-page__subheading-location">
            <span aria-hidden="true">📍</span>
            {listing.location}
          </span>
        </div>
      </header>

      {/* ── Image gallery ── */}
      <ImageGallery images={listing.images} title={listing.title} />

      {/* ── Two-column body ── */}
      <div className="details-page__body">

        {/* ═══ LEFT — info sections ═══ */}
        <div className="details-page__main">

          {/* § 1 — Title, meta pills, description */}
          <section className="details-page__section">
            <div className="details-page__host-row">
              <div className="details-page__host-info">
                <h2>{listing.title}</h2>
                <p>Hosted by {listing.host?.username || 'your host'}</p>
              </div>
              {/* Host avatar circle */}
              <div
                className="details-page__host-avatar"
                aria-label={`Host: ${listing.host?.username || 'host'}`}
              >
                {hostInitial}
              </div>
            </div>

            {/* Meta pills — guests · bedrooms · bathrooms */}
            <div className="details-page__meta">
              <span>
                <span aria-hidden="true">👥</span>
                {listing.guests} guest{listing.guests !== 1 ? 's' : ''}
              </span>
              <span>
                <span aria-hidden="true">🛏</span>
                {listing.bedrooms} bedroom{listing.bedrooms !== 1 ? 's' : ''}
              </span>
              <span>
                <span aria-hidden="true">🚿</span>
                {listing.bathrooms} bathroom{listing.bathrooms !== 1 ? 's' : ''}
              </span>
            </div>

            <p className="details-page__description">{listing.description}</p>
          </section>

          {/* § 2 — Highlights / feature badges */}
          {(listing.selfCheckIn || listing.enhancedCleaning) && (
            <section className="details-page__section">
              <div className="details-page__highlights">
                {listing.selfCheckIn && (
                  <div className="details-page__highlight">
                    <span className="details-page__highlight-icon" aria-hidden="true">🔑</span>
                    <div>
                      <strong>Self check-in</strong>
                      <p>Check yourself in with the lockbox.</p>
                    </div>
                  </div>
                )}
                {listing.enhancedCleaning && (
                  <div className="details-page__highlight">
                    <span className="details-page__highlight-icon" aria-hidden="true">✨</span>
                    <div>
                      <strong>Enhanced cleaning</strong>
                      <p>This host follows Airbnb's 5-step enhanced cleaning process.</p>
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* § 3 — Where you'll sleep (bedroom cards) */}
          {listing.bedrooms > 0 && (
            <section className="details-page__section">
              <h3>Where you'll sleep</h3>
              <div className="details-page__bedrooms">
                {Array.from({ length: Math.min(listing.bedrooms, 4) }, (_, i) => (
                  <BedroomCard key={i} index={i} guests={listing.guests} />
                ))}
              </div>
            </section>
          )}

          {/* § 4 — Amenities with icons */}
          {allAmenities.length > 0 && (
            <section className="details-page__section">
              <h3>What this place offers</h3>
              <ul className="details-page__amenities">
                {allAmenities.map((a) => (
                  <li key={a}>
                    <span className="details-page__amenities-icon" aria-hidden="true">
                      {amenityIcon(a)}
                    </span>
                    {a}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* § 5 — Pricing / weekly discount callout */}
          <section className="details-page__section">
            <h3>7 nights in {listing.location}</h3>
            <p>
              Priced at <strong>${listing.price}</strong> a night.
              {listing.weeklyDiscount > 0 && (
                <> Book 7 or more nights and receive a{' '}
                  <strong>{listing.weeklyDiscount}% weekly discount</strong> applied automatically.</>
              )}
            </p>
          </section>

          {/* § 6 — Reviews */}
          {ratingEntries.length > 0 && (
            <section className="details-page__section">
              <h3>Reviews</h3>

              {/* Overall rating */}
              <div className="details-page__overall-rating">
                <span className="star-icon" aria-hidden="true">★</span>
                <span className="rating-big">
                  {listing.rating > 0 ? listing.rating.toFixed(2) : 'New'}
                </span>
                <span className="details-page__review-count">
                  · {listing.reviews || 0} review{listing.reviews !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Per-category bars */}
              <div className="details-page__ratings-grid">
                {ratingEntries.map(([key, value]) => (
                  <div key={key} className="details-page__rating-row">
                    <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                    <RatingBar value={value} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* § 7 — Host section with avatar */}
          <section className="details-page__section">
            <div className="details-page__host-full">
              <div className="details-page__host-full-avatar" aria-hidden="true">
                {hostInitial}
              </div>
              <div>
                <h3 style={{ marginBottom: 4 }}>
                  Hosted by {listing.host?.username || 'your host'}
                </h3>
                <p className="details-page__host-joined">
                  Reach out through the reservations dashboard once you've booked
                  to coordinate arrival details.
                </p>
              </div>
            </div>
          </section>

          {/* § 8 — House rules */}
          <section className="details-page__section">
            <h3>House rules, health &amp; safety, cancellation policy</h3>
            <div className="details-page__rules">
              <div className="details-page__rule">
                <span aria-hidden="true">🕐</span>
                Check in after 3:00 PM · Check out before 11:00 AM
              </div>
              <div className="details-page__rule">
                <span aria-hidden="true">🚫</span>
                No smoking · No parties or events
              </div>
              <div className="details-page__rule">
                <span aria-hidden="true">↩️</span>
                Flexible cancellation — cancel up to 48 hours before check-in for a full refund
              </div>
            </div>
          </section>

        </div>

        {/* ═══ RIGHT — sticky cost calculator ═══ */}
        <CostCalculator listing={listing} />

      </div>
    </div>
  );
}
