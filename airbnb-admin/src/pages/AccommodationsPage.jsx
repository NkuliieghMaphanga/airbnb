import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllAccommodations, deleteAccommodation } from '../api/admin.js';
import '../styles/table.css';

export default function AccommodationsPage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    getAllAccommodations()
      .then((res) => setListings(res.data.data))
      .catch(() => setError('Could not load accommodations.'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setActionError('');
    try {
      await deleteAccommodation(id);
      setListings((prev) => prev.filter((l) => l._id !== id));
    } catch (err) {
      setActionError(err.response?.data?.message || 'Could not delete listing.');
    }
  };

  const filtered = listings.filter(
    (l) =>
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">Accommodations</h1>
        <Link to="/accommodations/new" className="btn btn--primary">
          + Add listing
        </Link>
      </div>

      <input
        className="search-input"
        type="text"
        placeholder="Search by title or location…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading && <p className="text-muted">Loading…</p>}
      {error && <p className="text-error">{error}</p>}
      {actionError && <p className="text-error">{actionError}</p>}

      {!loading && !error && (
        <>
          <p className="text-muted">{filtered.length} listing{filtered.length !== 1 ? 's' : ''}</p>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Location</th>
                  <th>Type</th>
                  <th>Price / night</th>
                  <th>Rating</th>
                  <th>Host</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((l) => (
                  <tr key={l._id}>
                    <td>
                      {l.images?.[0] ? (
                        <img
                          src={l.images[0]}
                          alt={l.title}
                          className="table-thumb"
                        />
                      ) : (
                        <div className="table-thumb table-thumb--empty">📷</div>
                      )}
                    </td>
                    <td>
                      <strong>{l.title}</strong>
                    </td>
                    <td>{l.location}</td>
                    <td>{l.type}</td>
                    <td>${l.price}</td>
                    <td>★ {l.rating?.toFixed(1) || 'New'}</td>
                    <td>{l.host?.username || '—'}</td>
                    <td className="table-actions">
                      <Link to={`/accommodations/${l._id}/edit`} className="btn btn--secondary btn--sm">
                        Edit
                      </Link>
                      <button
                        className="btn btn--danger btn--sm"
                        onClick={() => handleDelete(l._id, l.title)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
