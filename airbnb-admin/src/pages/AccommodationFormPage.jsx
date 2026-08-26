import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  createAccommodation,
  updateAccommodation,
  getAccommodationById,
} from '../api/admin.js';
import '../styles/form.css';

const TYPES = ['Entire apartment', 'Private room', 'Shared room', 'Entire house', 'Entire villa'];
const COMMON_AMENITIES = [
  'WiFi', 'Kitchen', 'Air conditioning', 'Washer', 'TV', 'Free parking',
  'Pool', 'Hot tub', 'BBQ grill', 'Breakfast included', 'Fireplace',
  'Garden', 'Balcony', 'Rooftop terrace', 'Soaking tub', 'Coffee maker',
];

const EMPTY_FORM = {
  title: '', description: '', location: '', type: TYPES[0],
  guests: 1, bedrooms: 1, bathrooms: 1,
  price: '', weeklyDiscount: 0, cleaningFee: 0, serviceFee: 0, occupancyTaxes: 0,
  rating: 0, reviews: 0,
  enhancedCleaning: false, selfCheckIn: false,
  amenities: [],
  imageUrls: '',
};

export default function AccommodationFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    getAccommodationById(id)
      .then((res) => {
        const d = res.data.data;
        setForm({
          title: d.title || '',
          description: d.description || '',
          location: d.location || '',
          type: d.type || TYPES[0],
          guests: d.guests || 1,
          bedrooms: d.bedrooms || 0,
          bathrooms: d.bathrooms || 0,
          price: d.price || '',
          weeklyDiscount: d.weeklyDiscount || 0,
          cleaningFee: d.cleaningFee || 0,
          serviceFee: d.serviceFee || 0,
          occupancyTaxes: d.occupancyTaxes || 0,
          rating: d.rating || 0,
          reviews: d.reviews || 0,
          enhancedCleaning: d.enhancedCleaning || false,
          selfCheckIn: d.selfCheckIn || false,
          amenities: d.amenities || [],
          imageUrls: (d.images || []).join('\n'),
        });
      })
      .catch(() => setError('Could not load listing.'))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.title || !form.description || !form.location || !form.price) {
      setError('Title, description, location and price are required.');
      return;
    }

    const images = form.imageUrls
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    if (!isEdit && images.length === 0) {
      setError('At least one image URL is required.');
      return;
    }

    // Build a plain JSON payload (the seeded listings use URLs, not file uploads)
    const payload = {
      title: form.title,
      description: form.description,
      location: form.location,
      type: form.type,
      guests: Number(form.guests),
      bedrooms: Number(form.bedrooms),
      bathrooms: Number(form.bathrooms),
      price: Number(form.price),
      weeklyDiscount: Number(form.weeklyDiscount),
      cleaningFee: Number(form.cleaningFee),
      serviceFee: Number(form.serviceFee),
      occupancyTaxes: Number(form.occupancyTaxes),
      rating: Number(form.rating),
      reviews: Number(form.reviews),
      enhancedCleaning: form.enhancedCleaning,
      selfCheckIn: form.selfCheckIn,
      amenities: form.amenities,
      ...(images.length > 0 ? { images } : {}),
    };

    try {
      setSaving(true);
      if (isEdit) {
        await updateAccommodation(id, payload);
      } else {
        await createAccommodation(payload);
      }
      navigate('/accommodations');
    } catch (err) {
      const details = err.response?.data?.details;
      setError(
        details ? details.join(' • ') : err.response?.data?.message || 'Could not save listing.'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="page"><p className="text-muted">Loading…</p></div>;

  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">{isEdit ? 'Edit Listing' : 'Add New Listing'}</h1>
      </div>

      {error && <p className="text-error form-error">{error}</p>}

      <form className="form-card" onSubmit={handleSubmit} noValidate>
        <h2 className="form-section-title">Basic Info</h2>
        <div className="form-row">
          <label className="field">
            Title *
            <input type="text" value={form.title} onChange={set('title')} placeholder="Cosy loft in downtown…" />
          </label>
          <label className="field">
            Location *
            <input type="text" value={form.location} onChange={set('location')} placeholder="New York" />
          </label>
        </div>
        <label className="field">
          Description *
          <textarea rows={4} value={form.description} onChange={set('description')} placeholder="Describe the space…" />
        </label>
        <label className="field">
          Type
          <select value={form.type} onChange={set('type')}>
            {TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </label>

        <h2 className="form-section-title">Capacity</h2>
        <div className="form-row">
          <label className="field">
            Guests
            <input type="number" min={1} value={form.guests} onChange={set('guests')} />
          </label>
          <label className="field">
            Bedrooms
            <input type="number" min={0} value={form.bedrooms} onChange={set('bedrooms')} />
          </label>
          <label className="field">
            Bathrooms
            <input type="number" min={0} value={form.bathrooms} onChange={set('bathrooms')} />
          </label>
        </div>

        <h2 className="form-section-title">Pricing</h2>
        <div className="form-row">
          <label className="field">
            Price per night ($) *
            <input type="number" min={0} value={form.price} onChange={set('price')} placeholder="120" />
          </label>
          <label className="field">
            Weekly discount (%)
            <input type="number" min={0} max={100} value={form.weeklyDiscount} onChange={set('weeklyDiscount')} />
          </label>
          <label className="field">
            Cleaning fee ($)
            <input type="number" min={0} value={form.cleaningFee} onChange={set('cleaningFee')} />
          </label>
          <label className="field">
            Service fee ($)
            <input type="number" min={0} value={form.serviceFee} onChange={set('serviceFee')} />
          </label>
          <label className="field">
            Occupancy taxes ($)
            <input type="number" min={0} value={form.occupancyTaxes} onChange={set('occupancyTaxes')} />
          </label>
        </div>

        <h2 className="form-section-title">Ratings</h2>
        <div className="form-row">
          <label className="field">
            Overall rating (0–5)
            <input type="number" min={0} max={5} step={0.1} value={form.rating} onChange={set('rating')} />
          </label>
          <label className="field">
            Number of reviews
            <input type="number" min={0} value={form.reviews} onChange={set('reviews')} />
          </label>
        </div>

        <h2 className="form-section-title">Amenities</h2>
        <div className="amenities-grid">
          {COMMON_AMENITIES.map((a) => (
            <label key={a} className="checkbox-label">
              <input
                type="checkbox"
                checked={form.amenities.includes(a)}
                onChange={() => toggleAmenity(a)}
              />
              {a}
            </label>
          ))}
        </div>

        <h2 className="form-section-title">Features</h2>
        <div className="form-row">
          <label className="checkbox-label">
            <input type="checkbox" checked={form.enhancedCleaning} onChange={set('enhancedCleaning')} />
            Enhanced cleaning
          </label>
          <label className="checkbox-label">
            <input type="checkbox" checked={form.selfCheckIn} onChange={set('selfCheckIn')} />
            Self check-in
          </label>
        </div>

        <h2 className="form-section-title">Images</h2>
        <label className="field">
          Image URLs (one per line)
          <textarea
            rows={4}
            value={form.imageUrls}
            onChange={set('imageUrls')}
            placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
          />
          <span className="field__hint">Enter one image URL per line. The first URL is the cover image.</span>
        </label>

        <div className="form-actions">
          <button type="button" className="btn btn--secondary" onClick={() => navigate('/accommodations')}>
            Cancel
          </button>
          <button type="submit" className="btn btn--primary" disabled={saving}>
            {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create listing'}
          </button>
        </div>
      </form>
    </div>
  );
}
