/**
 * LocationPage — search results grid matching the Figma listing card design.
 *
 * - Filter pill with Where-to search
 * - 2-column card grid (image top, details bottom) on desktop
 * - Star rating + price displayed on each card
 * - Skeleton loader while fetching
 */
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getAccommodations } from '../api/accommodations.js';
import '../styles/location.css';

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" aria-hidden="true">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7
        14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function SkeletonGrid() {
  return (
    <div className="location-skeleton">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="location-skeleton__card">
          <div className="location-skeleton__img" />
          <div className="location-skeleton__body">
            <div className="location-skeleton__line location-skeleton__line--medium" />
            <div className="location-skeleton__line location-skeleton__line--short" />
            <div className="location-skeleton__line location-skeleton__line--medium" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function LocationPage() {
  const { location } = useParams();
  const navigate = useNavigate();
  const [filterValue, setFilterValue] = useState(location || '');
  const [listings, setListings]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');

  /* Sync filter input when URL param changes */
  useEffect(() => {
    setFilterValue(location || '');
  }, [location]);

  /* Fetch listings whenever location changes */
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');

    getAccommodations({ location })
      .then((res) => { if (!cancelled) setListings(res.data.data); })
      .catch(() => { if (!cancelled) setError('Could not load listings. Please try again shortly.'); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [location]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    const term = filterValue.trim();
    if (term) navigate(`/locations/${encodeURIComponent(term)}`);
  };

  return (
    <div className="container location-page">

      {/* ── Filter pill ── */}
      <form className="location-filter" onSubmit={handleFilterSubmit} role="search">
        <label htmlFor="loc-filter">Where to?</label>
        <input
          id="loc-filter"
          type="text"
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          placeholder="Search by location, e.g. Cape Town"
          aria-label="Search destination"
        />
        <button type="submit">Search</button>
      </form>

      {/* ── Heading ── */}
      <h1 className="location-page__heading">
        {loading ? 'Searching…' : (
          <>
            {listings.length} stay{listings.length !== 1 ? 's' : ''} in {location}
            <span className="location-page__count">
              {listings.length > 0 ? ' — enter dates for exact pricing' : ''}
            </span>
          </>
        )}
      </h1>

      {/* ── Error state ── */}
      {error && <p className="location-page__error">{error}</p>}

      {/* ── Empty state ── */}
      {!loading && !error && listings.length === 0 && (
        <p className="location-page__empty">
          No listings found for "{location}" yet.{' '}
          <Link to="/" style={{ color: 'var(--color-primary)', fontWeight: 700 }}>
            Try another destination
          </Link>
        </p>
      )}

      {/* ── Skeleton while loading ── */}
      {loading && <SkeletonGrid />}

      {/* ── Listing cards ── */}
      {!loading && (
        <div className="location-list">
          {listings.map((listing) => (
            <Link
              key={listing._id}
              to={`/locations/${encodeURIComponent(location)}/${listing._id}`}
              className="location-card"
            >
              {/* Image */}
              <div className="location-card__image">
                <img
                  src={listing.images?.[0]}
                  alt={listing.title}
                  loading="lazy"
                />
                <span className="location-card__wishlist" aria-hidden="true">♡</span>
              </div>

              {/* Details */}
              <div className="location-card__details">
                <div className="location-card__top">
                  <h3 className="location-card__title">{listing.title}</h3>
                  <span className="location-card__rating">
                    <StarIcon />
                    {listing.rating > 0 ? listing.rating.toFixed(2) : 'New'}
                  </span>
                </div>

                <p className="location-card__type">{listing.type}</p>

                <p className="location-card__amenities">
                  {(listing.amenities || []).slice(0, 3).join(' · ') || 'No amenities listed'}
                </p>

                <p className="location-card__price">
                  <strong>${listing.price}</strong> / night
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

    </div>
  );
}
