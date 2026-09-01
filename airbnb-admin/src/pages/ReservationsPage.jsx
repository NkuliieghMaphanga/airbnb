/**
 * ReservationsPage
 *
 * Displays all reservations across every listing on the platform.
 * Admins can search by listing title, guest name/email, or status,
 * and cancel any reservation via the Delete button.
 *
 * Data source: GET /api/admin/reservations (admin only, full population).
 * Cancel calls: DELETE /api/reservations/:id
 *
 * The table populates accommodation title/location from the populated
 * `accommodation` field, and guest username/email from the `user` field.
 * Empty-state row shown when the search filter returns no matches.
 */
import { useEffect, useState } from 'react';
import '../styles/table.css';

export default function ReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    getAllReservations()
      .then((res) => setReservations(res.data.data))
      .catch(() => setError('Could not load reservations.'))
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel and delete this reservation?')) return;
    setActionError('');
    try {
      await deleteReservation(id);
      setReservations((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      setActionError(err.response?.data?.message || 'Could not cancel reservation.');
    }
  };

  const filtered = reservations.filter((r) => {
    const q = search.toLowerCase();
    return (
      r.accommodation?.title?.toLowerCase().includes(q) ||
      r.user?.username?.toLowerCase().includes(q) ||
      r.user?.email?.toLowerCase().includes(q) ||
      r.status?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">All Reservations</h1>
        <span className="page__count">{reservations.length} total</span>
      </div>

      <input
        className="search-input"
        type="text"
        placeholder="Search by listing, guest, or status…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading && <p className="text-muted">Loading…</p>}
      {error && <p className="text-error">{error}</p>}
      {actionError && <p className="text-error">{actionError}</p>}

      {!loading && !error && (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Listing</th>
                <th>Location</th>
                <th>Guest</th>
                <th>Host</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Guests</th>
                <th>Total ($)</th>
                <th>Status</th>
                <th>Booked on</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r._id}>
                  <td>{r.accommodation?.title || '(listing removed)'}</td>
                  <td>{r.accommodation?.location || '—'}</td>
                  <td>
                    <div>{r.user?.username || '—'}</div>
                    <div className="text-muted text-sm">{r.user?.email}</div>
                  </td>
                  <td>{r.host?.username || '—'}</td>
                  <td>{new Date(r.checkIn).toLocaleDateString()}</td>
                  <td>{new Date(r.checkOut).toLocaleDateString()}</td>
                  <td>{r.guests}</td>
                  <td>${r.totalCost?.toFixed(2)}</td>
                  <td>
                    <span className={`badge badge--${r.status}`}>{r.status}</span>
                  </td>
                  <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn btn--danger btn--sm"
                      onClick={() => handleCancel(r._id)}
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={11} className="text-muted text-center">No reservations found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
