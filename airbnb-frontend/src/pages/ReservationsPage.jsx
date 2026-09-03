/**
 * ReservationsPage — logged-in user's booking history.
 *
 * - Auth-guarded: redirects to /login if not logged in
 * - Skeleton loader while fetching
 * - Table wrapped in overflow container for mobile scroll
 * - Cancel button uses the .reservations-table__cancel danger style
 */
import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getMyReservations, deleteReservation } from '../api/reservations.js';
import '../styles/reservations.css';

function SkeletonRows() {
  return (
    <div className="reservations-page__loading" aria-busy="true" aria-label="Loading reservations">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="reservations-page__skeleton-row" />
      ))}
    </div>
  );
}

export default function ReservationsPage() {
  const { user, loading: authLoading } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    getMyReservations()
      .then((res) => setReservations(res.data.data))
      .catch(() => setError('Could not load your reservations. Please try again.'))
      .finally(() => setLoading(false));
  }, [user]);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this reservation? This cannot be undone.')) return;
    try {
      await deleteReservation(id);
      setReservations((rs) => rs.filter((r) => r._id !== id));
    } catch {
      setError('Could not cancel that reservation. Please try again.');
    }
  };

  /* ── Auth guard ── */
  if (authLoading) return null;
  if (!user)       return <Navigate to="/login" replace />;

  return (
    <div className="container reservations-page">
      <h1>Your reservations</h1>
      <p className="reservations-page__subtitle">
        {!loading && reservations.length > 0
          ? `${reservations.length} booking${reservations.length !== 1 ? 's' : ''} found`
          : 'Manage your upcoming and past stays below.'}
      </p>

      {/* Error banner */}
      {error && <p className="reservations-page__error">{error}</p>}

      {/* Skeleton while loading */}
      {loading && <SkeletonRows />}

      {/* Empty state */}
      {!loading && !error && reservations.length === 0 && (
        <p className="reservations-page__empty">
          You don't have any reservations yet.{' '}
          <Link to="/">Start exploring stays</Link>.
        </p>
      )}

      {/* ── Reservations table ── */}
      {!loading && reservations.length > 0 && (
        <div className="reservations-table-wrap">
          <table className="reservations-table">
            <thead>
              <tr>
                <th>Listing</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Guests</th>
                <th>Total</th>
                <th>Status</th>
                <th><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((r) => (
                <tr key={r._id}>

                  {/* Listing name — links to listing details */}
                  <td className="reservations-table__listing">
                    {r.accommodation?._id ? (
                      <Link
                        to={`/locations/${encodeURIComponent(r.accommodation.location || 'listing')}/${r.accommodation._id}`}
                      >
                        {r.accommodation.title || 'View listing'}
                      </Link>
                    ) : (
                      <span style={{ color: 'var(--color-text-secondary)' }}>
                        {r.accommodation?.title || 'Listing removed'}
                      </span>
                    )}
                  </td>

                  <td>{new Date(r.checkIn).toLocaleDateString(undefined, { dateStyle: 'medium' })}</td>
                  <td>{new Date(r.checkOut).toLocaleDateString(undefined, { dateStyle: 'medium' })}</td>
                  <td>{r.guests}</td>
                  <td>${r.totalCost?.toFixed(2) ?? '—'}</td>

                  {/* Status badge */}
                  <td>
                    <span
                      className={`reservations-table__status reservations-table__status--${r.status}`}
                    >
                      {r.status}
                    </span>
                  </td>

                  {/* Cancel action — danger button from reservations.css */}
                  <td>
                    {r.status !== 'cancelled' && r.status !== 'completed' && (
                      <button
                        className="reservations-table__cancel"
                        onClick={() => handleCancel(r._id)}
                        type="button"
                      >
                        Cancel
                      </button>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
