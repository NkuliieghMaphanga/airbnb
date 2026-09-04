import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getAccommodations, deleteAccommodation, createAccommodation } from '../api/accommodations.js';
import { getHostReservations } from '../api/reservations.js';
import { resolveImageUrl } from '../utils/imageUrl.js';
import '../styles/hostDashboard.css';

const TYPES = ['Entire apartment', 'Private room', 'Shared room', 'Entire house', 'Entire villa'];
const COMMON_AMENITIES = [
  'WiFi', 'Kitchen', 'Air conditioning', 'Washer', 'TV',
  'Free parking', 'Pool', 'Hot tub', 'BBQ grill', 'Balcony',
];

const EMPTY_FORM = {
  title: '', description: '', location: '', type: TYPES[0],
  guests: 1, bedrooms: 1, bathrooms: 1,
  price: '', weeklyDiscount: 0, cleaningFee: 0, serviceFee: 0, occupancyTaxes: 0,
  amenities: [],
  enhancedCleaning: false, selfCheckIn: false,
  imageUrls: '',
};

export default function HostDashboardPage() {
  const { user, loading: authLoading } = useAuth();

  const [listings, setListings] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (!user) return;
    Promise.all([
      getAccommodations(),
      getHostReservations(),
    ])
      .then(([accomRes, resRes]) => {
        // Filter to only this host's listings
        const myListings = accomRes.data.data.filter(
          (l) => l.host?._id === user.id || l.host === user.id
        );
        setListings(myListings);
        setReservations(resRes.data.data);
      })
      .catch(() => setError('Could not load your data. Please refresh.'))
      .finally(() => setLoadingData(false));
  }, [user]);

  const set = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [field]: value }));
  };

  const toggleAmenity = (amenity) => {
    setForm((f) => ({
      ...f,
      amenities: f.amenities.includes(amenity)
        ? f.amenities.filter((a) => a !== amenity)
        : [...f.amenities, amenity],
    }));
  };

  const handleCreateListing = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!form.title || !form.description || !form.location || !form.price) {
      setFormError('Title, description, location and price are required.');
      return;
    }
    const images = form.imageUrls.split('\n').map((s) => s.trim()).filter(Boolean);
    if (images.length === 0) {
      setFormError('At least one image URL is required.');
      return;
    }

    const payload = {
      title: form.title, description: form.description,
      location: form.location, type: form.type,
      guests: Number(form.guests), bedrooms: Number(form.bedrooms), bathrooms: Number(form.bathrooms),
      price: Number(form.price), weeklyDiscount: Number(form.weeklyDiscount),
      cleaningFee: Number(form.cleaningFee), serviceFee: Number(form.serviceFee),
      occupancyTaxes: Number(form.occupancyTaxes),
      amenities: form.amenities, enhancedCleaning: form.enhancedCleaning,
      selfCheckIn: form.selfCheckIn, images,
    };

    try {
      setSaving(true);
      const res = await createAccommodation(payload);
      setListings((prev) => [res.data.data, ...prev]);
      setForm(EMPTY_FORM);
      setShowForm(false);
    } catch (err) {
      const details = err.response?.data?.details;
      setFormError(details ? details.join(' • ') : err.response?.data?.message || 'Could not create listing.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteListing = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await deleteAccommodation(id);
      setListings((prev) => prev.filter((l) => l._id !== id));
    } catch {
      setError('Could not delete that listing. Please try again.');
    }
  };

  if (authLoading) return null;
  if (!user || (user.role !== 'host' && user.role !== 'admin')) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="container host-dashboard">
      <h1>Host dashboard</h1>
      <p className="host-dashboard__subtitle">
        Welcome back, <strong>{user.username}</strong>. Manage your listings and reservations below.
      </p>

      {error && <p className="host-dashboard__error">{error}</p>}

      {/* ── Listings section ──────────────────────────────── */}
      <section className="host-section">
        <div className="host-section__header">
          <h2>Your listings <span className="host-section__count">({listings.length})</span></h2>
          <button
            className="btn-pill btn-pill--primary"
            onClick={() => { setShowForm((v) => !v); setFormError(''); setForm(EMPTY_FORM); }}
          >
            {showForm ? 'Cancel' : '+ Add listing'}
          </button>
        </div>

        {showForm && (
          <form className="listing-form" onSubmit={handleCreateListing} noValidate>
            <h3>New listing</h3>
            {formError && <p className="listing-form__error">{formError}</p>}

            <div className="listing-form__row">
              <label className="listing-form__field">
                Title *
                <input type="text" value={form.title} onChange={set('title')} placeholder="Cosy loft in…" />
              </label>
              <label className="listing-form__field">
                Location *
                <input type="text" value={form.location} onChange={set('location')} placeholder="Cape Town" />
              </label>
            </div>

            <label className="listing-form__field">
              Description *
              <textarea rows={3} value={form.description} onChange={set('description')} placeholder="Describe the space…" />
            </label>

            <div className="listing-form__row">
              <label className="listing-form__field">
                Type
                <select value={form.type} onChange={set('type')}>
                  {TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </label>
              <label className="listing-form__field">
                Price / night ($) *
                <input type="number" min={0} value={form.price} onChange={set('price')} placeholder="120" />
              </label>
              <label className="listing-form__field">
                Guests
                <input type="number" min={1} value={form.guests} onChange={set('guests')} />
              </label>
              <label className="listing-form__field">
                Bedrooms
                <input type="number" min={0} value={form.bedrooms} onChange={set('bedrooms')} />
              </label>
              <label className="listing-form__field">
                Bathrooms
                <input type="number" min={0} value={form.bathrooms} onChange={set('bathrooms')} />
              </label>
            </div>

            <div className="listing-form__row">
              <label className="listing-form__field">
                Weekly discount (%)
                <input type="number" min={0} max={100} value={form.weeklyDiscount} onChange={set('weeklyDiscount')} />
              </label>
              <label className="listing-form__field">
                Cleaning fee ($)
                <input type="number" min={0} value={form.cleaningFee} onChange={set('cleaningFee')} />
              </label>
              <label className="listing-form__field">
                Service fee ($)
                <input type="number" min={0} value={form.serviceFee} onChange={set('serviceFee')} />
              </label>
              <label className="listing-form__field">
                Occupancy taxes ($)
                <input type="number" min={0} value={form.occupancyTaxes} onChange={set('occupancyTaxes')} />
              </label>
            </div>

            <fieldset className="listing-form__fieldset">
              <legend>Amenities</legend>
              <div className="listing-form__amenities">
                {COMMON_AMENITIES.map((a) => (
                  <label key={a} className="listing-form__checkbox">
                    <input
                      type="checkbox"
                      checked={form.amenities.includes(a)}
                      onChange={() => toggleAmenity(a)}
                    />
                    {a}
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="listing-form__row">
              <label className="listing-form__checkbox">
                <input type="checkbox" checked={form.enhancedCleaning} onChange={set('enhancedCleaning')} />
                Enhanced cleaning
              </label>
              <label className="listing-form__checkbox">
                <input type="checkbox" checked={form.selfCheckIn} onChange={set('selfCheckIn')} />
                Self check-in
              </label>
            </div>

            <label className="listing-form__field">
              Image URLs (one per line) *
              <textarea
                rows={3}
                value={form.imageUrls}
                onChange={set('imageUrls')}
                placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
              />
              <span className="listing-form__hint">First URL is the cover image.</span>
            </label>

            <div className="listing-form__actions">
              <button type="button" className="btn-pill" onClick={() => { setShowForm(false); setForm(EMPTY_FORM); }}>
                Cancel
              </button>
              <button type="submit" className="btn-pill btn-pill--primary" disabled={saving}>
                {saving ? 'Creating…' : 'Create listing'}
              </button>
            </div>
          </form>
        )}

        {loadingData && <p className="host-dashboard__loading">Loading your listings…</p>}
        {!loadingData && listings.length === 0 && !showForm && (
          <p className="host-dashboard__empty">You haven't created any listings yet. Click "Add listing" to get started.</p>
        )}

        <div className="host-listing-grid">
          {listings.map((l) => (
            <div key={l._id} className="host-listing-card">
              <div className="host-listing-card__image">
                {l.images?.[0] ? (
                  <img src={resolveImageUrl(l.images[0])} alt={l.title} loading="lazy" />
                ) : (
                  <div className="host-listing-card__no-image">No image</div>
                )}
              </div>
              <div className="host-listing-card__body">
                <p className="host-listing-card__type">{l.type}</p>
                <h3>{l.title}</h3>
                <p className="host-listing-card__meta">{l.location} · ${l.price}/night</p>
                <p className="host-listing-card__rating">★ {l.rating?.toFixed(1) || 'New'} ({l.reviews || 0} reviews)</p>
              </div>
              <div className="host-listing-card__actions">
                <Link to={`/locations/${encodeURIComponent(l.location)}/${l._id}`} className="btn-pill btn-pill--sm">
                  View
                </Link>
                <button
                  className="btn-pill btn-pill--sm btn-pill--danger"
                  onClick={() => handleDeleteListing(l._id, l.title)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Reservations section ──────────────────────────── */}
      <section className="host-section">
        <div className="host-section__header">
          <h2>Guest reservations <span className="host-section__count">({reservations.length})</span></h2>
        </div>

        {loadingData && <p className="host-dashboard__loading">Loading reservations…</p>}
        {!loadingData && reservations.length === 0 && (
          <p className="host-dashboard__empty">No reservations for your listings yet.</p>
        )}

        {reservations.length > 0 && (
          <div className="host-reservations-table-wrap">
            <table className="host-reservations-table">
              <thead>
                <tr>
                  <th>Listing</th>
                  <th>Guest</th>
                  <th>Check-in</th>
                  <th>Check-out</th>
                  <th>Guests</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((r) => (
                  <tr key={r._id}>
                    <td>{r.accommodation?.title || '—'}</td>
                    <td>{r.user?.username || '—'}</td>
                    <td>{new Date(r.checkIn).toLocaleDateString()}</td>
                    <td>{new Date(r.checkOut).toLocaleDateString()}</td>
                    <td>{r.guests}</td>
                    <td>${r.totalCost?.toFixed(2)}</td>
                    <td>
                      <span className={`host-status host-status--${r.status}`}>{r.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
