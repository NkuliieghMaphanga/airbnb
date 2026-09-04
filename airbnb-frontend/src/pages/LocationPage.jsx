import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getAccommodations } from '../api/accommodations.js';
import { resolveImageUrl } from '../utils/imageUrl.js';
import '../styles/location.css';

function StarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="12"
      height="12"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
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

  // ALL LOCATIONS is always the default
  const currentLocation =
    !location || location.toLowerCase() === 'all'
      ? 'all'
      : location;

  const [filterValue, setFilterValue] = useState(
    currentLocation === 'all' ? '' : currentLocation
  );

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  /*
   * Keep the search input synchronized with the URL.
   */
  useEffect(() => {
    setFilterValue(
      currentLocation === 'all' ? '' : currentLocation
    );
  }, [currentLocation]);

  /*
   * Fetch accommodations.
   *
   * "all" means no location filter.
   */
  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError('');

    const params =
      currentLocation === 'all'
        ? {}
        : { location: currentLocation };

    getAccommodations(params)
      .then((res) => {
        if (!cancelled) {
          setListings(res.data.data || []);
        }
      })
      .catch((err) => {
        console.error(err);

        if (!cancelled) {
          setError(
            'Could not load listings. Please try again shortly.'
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [currentLocation]);

  /*
   * Search handler.
   *
   * Empty search = ALL LOCATIONS.
   */
  const handleFilterSubmit = (e) => {
    e.preventDefault();

    const term = filterValue.trim();

    // Empty search returns ALL locations
    if (!term) {
      navigate('/locations/all');
      return;
    }

    navigate(
      `/locations/${encodeURIComponent(term)}`
    );
  };

  return (
    <div className="container location-page">

      {/* Search */}
      <form
        className="location-filter"
        onSubmit={handleFilterSubmit}
        role="search"
      >
        <label htmlFor="loc-filter">
          Where to?
        </label>

        <input
          id="loc-filter"
          type="text"
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          placeholder="All Locations"
          aria-label="Search destination"
        />

        <button type="submit">
          Search
        </button>
      </form>

      {/* Heading */}
      <h1 className="location-page__heading">
        {loading ? (
          'Searching…'
        ) : (
          <>
            {listings.length}{' '}
            {listings.length === 1 ? 'stay' : 'stays'}{' '}
            {currentLocation === 'all'
              ? 'in All Locations'
              : `in ${currentLocation}`}

            <span className="location-page__count">
              {listings.length > 0
                ? ' — enter dates for exact pricing'
                : ''}
            </span>
          </>
        )}
      </h1>

      {/* Error */}
      {error && (
        <p className="location-page__error">
          {error}
        </p>
      )}

      {/* Empty state */}
      {!loading &&
        !error &&
        listings.length === 0 && (
          <p className="location-page__empty">
            {currentLocation === 'all'
              ? 'No accommodation listings are available yet.'
              : `No listings found for "${currentLocation}" yet.`}{' '}

            <Link
              to="/locations/all"
              style={{
                color: 'var(--color-primary)',
                fontWeight: 700,
              }}
            >
              View all locations
            </Link>
          </p>
        )}

      {/* Loading */}
      {loading && <SkeletonGrid />}

      {/* Listings */}
      {!loading && (
        <div className="location-list">

          {listings.map((listing) => (
            <Link
              key={listing._id}
              to={`/locations/${
                encodeURIComponent(
                  listing.location || 'all'
                )
              }/${listing._id}`}
              className="location-card"
            >

              {/* Image */}
              <div className="location-card__image">
                <img
                  src={resolveImageUrl(listing.images?.[0])}
                  alt={listing.title}
                  loading="lazy"
                />

                <span
                  className="location-card__wishlist"
                  aria-hidden="true"
                >
                  ♡
                </span>
              </div>

              {/* Details */}
              <div className="location-card__details">

                <div className="location-card__top">

                  <h3 className="location-card__title">
                    {listing.title}
                  </h3>

                  <span className="location-card__rating">
                    <StarIcon />

                    {listing.rating > 0
                      ? listing.rating.toFixed(2)
                      : 'New'}
                  </span>

                </div>

                {/* Show the actual location */}
                <p className="location-card__type">
                  {listing.location}
                </p>

                <p className="location-card__amenities">
                  {(listing.amenities || [])
                    .slice(0, 3)
                    .join(' · ') ||
                    'No amenities listed'}
                </p>

                <p className="location-card__price">
                  <strong>
                    ${listing.price}
                  </strong>{' '}
                  / night
                </p>

              </div>
            </Link>
          ))}

        </div>
      )}

    </div>
  );
}