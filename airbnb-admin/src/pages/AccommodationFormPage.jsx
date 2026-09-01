/**
 * AccommodationFormPage
 *
 * Shared create / edit form for accommodation listings.
 * Detected by the presence of an `:id` URL param — if id exists the form
 * pre-fills from the API and calls PUT on submit; otherwise it calls POST.
 *
 * Image handling supports two modes:
 *  1. File upload — user picks a file via <input type="file">.
 *     The payload is sent as multipart/form-data (FormData), which lets the
 *     backend's multer middleware save the file to /uploads/.
 *  2. URL entry — user pastes one or more image URLs (one per line) into the
 *     textarea.  The payload is sent as plain JSON.
 *
 * If both are provided the file upload takes priority.
 */
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  createAccommodation,
  updateAccommodation,
  getAccommodationById,
} from '../api/admin.js';
import '../styles/form.css';

// ── Constants ─────────────────────────────────────────────────────────────────

const TYPES = [
  'Entire apartment',
  'Private room',
  'Shared room',
  'Entire house',
  'Entire villa',
];

const COMMON_AMENITIES = [
  'WiFi', 'Kitchen', 'Air conditioning', 'Washer', 'TV', 'Free parking',
  'Pool', 'Hot tub', 'BBQ grill', 'Breakfast included', 'Fireplace',
  'Garden', 'Balcony', 'Rooftop terrace', 'Soaking tub', 'Coffee maker',
];

/** Default (empty) form state used when creating a new listing. */
const EMPTY_FORM = {
  title: '',
  description: '',
  location: '',
  type: TYPES[0],
  guests: 1,
  bedrooms: 1,
  bathrooms: 1,
  price: '',
  weeklyDiscount: 0,
  cleaningFee: 0,
  serviceFee: 0,
  occupancyTaxes: 0,
  rating: 0,
  reviews: 0,
  enhancedCleaning: false,
  selfCheckIn: false,
  amenities: [],
  imageUrls: '', // newline-separated URL strings
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function AccommodationFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  // Form field state
  const [form, setForm] = useState(EMPTY_FORM);

  // File upload state — stores the File object selected by the user
  const [imageFile, setImageFile] = useState(null);
  // Preview URL generated from the selected File (revoked on unmount/change)
  const [previewUrl, setPreviewUrl] = useState('');

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Ref for the hidden file input so we can programmatically clear it
  const fileInputRef = useRef(null);

  // ── Load existing listing when editing ──────────────────────────────────────
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
          // Join existing image URLs so the user can see / edit them
          imageUrls: (d.images || []).join('\n'),
        });
      })
      .catch(() => setError('Could not load listing.'))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  // ── Cleanup object URL on unmount to avoid memory leaks ─────────────────────
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // ── Generic field setter ─────────────────────────────────────────────────────
  /** Returns an onChange handler that updates a single form field. */
  const set = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [field]: value }));
  };

  // ── Amenity checkbox toggle ──────────────────────────────────────────────────
  const toggleAmenity = (amenity) => {
    setForm((f) => ({
      ...f,
      amenities: f.amenities.includes(amenity)
        ? f.amenities.filter((a) => a !== amenity)
        : [...f.amenities, amenity],
    }));
  };

  // ── File input handler ───────────────────────────────────────────────────────
  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;

    // Revoke any previous preview URL before creating a new one
    if (previewUrl) URL.revokeObjectURL(previewUrl);

    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setImageFile(null);
      setPreviewUrl('');
    }
  };

  /** Remove the selected file and reset the hidden input. */
  const clearFile = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setImageFile(null);
    setPreviewUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ── Form submission ──────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic required-field validation
    if (!form.title.trim() || !form.description.trim() || !form.location.trim() || !form.price) {
      setError('Title, description, location and price are required.');
      return;
    }

    // Parse URL list from the textarea
    const urlImages = form.imageUrls
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    // For new listings, require at least one image (file OR URL)
    if (!isEdit && !imageFile && urlImages.length === 0) {
      setError('Please upload an image file or enter at least one image URL.');
      return;
    }

    try {
      setSaving(true);

      let payload;

      if (imageFile) {
        // ── Mode 1: file upload — build FormData ──────────────────────────────
        // axios will automatically set Content-Type: multipart/form-data with
        // the correct boundary when the data argument is a FormData instance.
        const fd = new FormData();

        // Append all scalar fields
        fd.append('title', form.title.trim());
        fd.append('description', form.description.trim());
        fd.append('location', form.location.trim());
        fd.append('type', form.type);
        fd.append('guests', Number(form.guests));
        fd.append('bedrooms', Number(form.bedrooms));
        fd.append('bathrooms', Number(form.bathrooms));
        fd.append('price', Number(form.price));
        fd.append('weeklyDiscount', Number(form.weeklyDiscount));
        fd.append('cleaningFee', Number(form.cleaningFee));
        fd.append('serviceFee', Number(form.serviceFee));
        fd.append('occupancyTaxes', Number(form.occupancyTaxes));
        fd.append('rating', Number(form.rating));
        fd.append('reviews', Number(form.reviews));
        fd.append('enhancedCleaning', form.enhancedCleaning);
        fd.append('selfCheckIn', form.selfCheckIn);

        // Amenities — append each item separately so Express can parse the array
        form.amenities.forEach((a) => fd.append('amenities', a));

        // Attach the image file under the key the backend's multer expects
        fd.append('images', imageFile);

        payload = fd;
      } else {
        // ── Mode 2: URL-only — send plain JSON ────────────────────────────────
        payload = {
          title: form.title.trim(),
          description: form.description.trim(),
          location: form.location.trim(),
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
          // Only include images key if there are URLs to send
          ...(urlImages.length > 0 ? { images: urlImages } : {}),
        };
      }

      if (isEdit) {
        await updateAccommodation(id, payload);
      } else {
        await createAccommodation(payload);
      }

      navigate('/accommodations');
    } catch (err) {
      // Show backend validation details if available
      const details = err.response?.data?.details;
      setError(
        details
          ? details.join(' • ')
          : err.response?.data?.message || 'Could not save listing.'
      );
    } finally {
      setSaving(false);
    }
  };

  // ── Loading state ────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="page">
        <p className="text-muted">Loading…</p>
      </div>
    );
  }

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">{isEdit ? 'Edit Listing' : 'Add New Listing'}</h1>
      </div>

      {error && <p className="text-error form-error">{error}</p>}

      <form className="form-card" onSubmit={handleSubmit} noValidate>

        {/* ── Basic Info ──────────────────────────────────────────────────── */}
        <h2 className="form-section-title">Basic Info</h2>
        <div className="form-row">
          <label className="field">
            Title *
            <input
              type="text"
              value={form.title}
              onChange={set('title')}
              placeholder="Cosy loft in downtown…"
            />
          </label>
          <label className="field">
            Location *
            <input
              type="text"
              value={form.location}
              onChange={set('location')}
              placeholder="New York"
            />
          </label>
        </div>
        <label className="field">
          Description *
          <textarea
            rows={4}
            value={form.description}
            onChange={set('description')}
            placeholder="Describe the space…"
          />
        </label>
        <label className="field">
          Type
          <select value={form.type} onChange={set('type')}>
            {TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </label>

        {/* ── Capacity ────────────────────────────────────────────────────── */}
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

        {/* ── Pricing ─────────────────────────────────────────────────────── */}
        <h2 className="form-section-title">Pricing</h2>
        <div className="form-row">
          <label className="field">
            Price per night ($) *
            <input
              type="number"
              min={0}
              value={form.price}
              onChange={set('price')}
              placeholder="120"
            />
          </label>
          <label className="field">
            Weekly discount (%)
            <input
              type="number"
              min={0}
              max={100}
              value={form.weeklyDiscount}
              onChange={set('weeklyDiscount')}
            />
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

        {/* ── Ratings ─────────────────────────────────────────────────────── */}
        <h2 className="form-section-title">Ratings</h2>
        <div className="form-row">
          <label className="field">
            Overall rating (0–5)
            <input
              type="number"
              min={0}
              max={5}
              step={0.1}
              value={form.rating}
              onChange={set('rating')}
            />
          </label>
          <label className="field">
            Number of reviews
            <input type="number" min={0} value={form.reviews} onChange={set('reviews')} />
          </label>
        </div>

        {/* ── Amenities ───────────────────────────────────────────────────── */}
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

        {/* ── Features ────────────────────────────────────────────────────── */}
        <h2 className="form-section-title">Features</h2>
        <div className="form-row">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={form.enhancedCleaning}
              onChange={set('enhancedCleaning')}
            />
            Enhanced cleaning
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={form.selfCheckIn}
              onChange={set('selfCheckIn')}
            />
            Self check-in
          </label>
        </div>

        {/* ── Images ──────────────────────────────────────────────────────── */}
        <h2 className="form-section-title">Images</h2>

        {/* Option A: upload a file from disk */}
        <div className="field">
          <span className="field__label">Upload image file</span>
          <div className="image-upload-area">
            {/* Hidden native input — triggered by the styled button below */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              id="image-file-input"
              className="image-upload-area__input"
              onChange={handleFileChange}
            />
            <label htmlFor="image-file-input" className="image-upload-area__btn">
              {imageFile ? '📎 Change file' : '📁 Choose image…'}
            </label>

            {/* File name + clear button once a file is chosen */}
            {imageFile && (
              <div className="image-upload-area__info">
                <span className="image-upload-area__filename">{imageFile.name}</span>
                <button
                  type="button"
                  className="image-upload-area__clear"
                  onClick={clearFile}
                  aria-label="Remove selected file"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* Live preview of the chosen file */}
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview of selected image"
              className="image-upload-area__preview"
            />
          )}
          <span className="field__hint">Supported formats: JPG, PNG, WebP, GIF.</span>
        </div>

        {/* Option B: paste image URLs */}
        <label className="field">
          Or enter image URLs (one per line)
          <textarea
            rows={4}
            value={form.imageUrls}
            onChange={set('imageUrls')}
            placeholder={
              'https://example.com/image1.jpg\nhttps://example.com/image2.jpg'
            }
          />
          <span className="field__hint">
            If a file is selected above it takes priority over these URLs.
            The first URL is used as the cover image.
          </span>
        </label>

        {/* ── Actions ─────────────────────────────────────────────────────── */}
        <div className="form-actions">
          <button
            type="button"
            className="btn btn--secondary"
            onClick={() => navigate('/accommodations')}
          >
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
