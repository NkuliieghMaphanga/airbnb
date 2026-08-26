import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getAccommodations } from '../api/accommodations.js';
import '../styles/location.css';

export default function LocationPage() {
  const { location } = useParams();
  const navigate = useNavigate();
  const [filterValue, setFilterValue] = useState(location || '');
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setFilterValue(location || '');
  }, [location]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');

    getAccommodations({ location })
      .then((res) => {
        if (!cancelled) setListings(res.data.data);
      })
      .catch(() => {
        if (!cancelled) setError('Could not load listings right now. Please try again shortly.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [location]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    const term = filterValue.trim();
    if (term) navigate(`/locations/${encodeURIComponent(term)}`);
  };

  return (
    <div className="container location-page">
      <form className="location-filter" onSubmit={handleFilterSubmit}>
        <label htmlFor="location-filter-input">Where to?</label>
        <input
          id="location-filter-input"
          type="text"
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          placeholder="Search by location, e.g. Lisbon"
        />
        <button type="submit">Search</button>
      </form>

      <h1 className="location-page__heading">
        {loading ? 'Searching…' : `${listings.length} stay${listings.length === 1 ? '' : 's'} in ${location}`}
      </h1>

      {error && <p className="location-page__error">{error}</p>}

      {!loading && !error && listings.length === 0 && (
        <p className="location-page__empty">
          No listings found for "{location}" yet. Try a different destination.
        </p>
      )}

      <div className="location-list">
        {listings.map((listing) => (
          <Link
            key={listing._id}
            to={`/locations/${encodeURIComponent(location)}/${listing._id}`}
            className="location-card"
          >
            <div className="location-card__image">
              <img src={listing.images?.[0]} alt={listing.title} loading="lazy" />
            </div>
            <div className="location-card__details">
              <p className="location-card__type">{listing.type}</p>
              <h3>{listing.title}</h3>
              <p className="location-card__amenities">
                {(listing.amenities || []).slice(0, 3).join(' · ') || 'No amenities listed'}
              </p>
              <p className="location-card__rating">
                ★ {listing.rating?.toFixed(1) || 'New'} ({listing.reviews || 0} reviews)
              </p>
              <p className="location-card__price">
                <strong>${listing.price}</strong> / night
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
