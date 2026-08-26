import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getMyReservations, deleteReservation } from '../api/reservations.js';
import '../styles/reservations.css';

export default function ReservationsPage() {
  const { user, loading: authLoading } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    getMyReservations()
      .then((res) => setReservations(res.data.data))
      .catch(() => setError('Could not load your reservations.'))
      .finally(() => setLoading(false));
  }, [user]);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this reservation?')) return;
    try {
      await deleteReservation(id);
      setReservations((rs) => rs.filter((r) => r._id !== id));
    } catch {
      setError('Could not cancel that reservation. Please try again.');
    }
  };

  if (authLoading) return null;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="container reservations-page">
      <h1>Your reservations</h1>

      {loading && <p>Loading…</p>}
      {error && <p className="reservations-page__error">{error}</p>}

      {!loading && reservations.length === 0 && (
        <p className="reservations-page__empty">
          You don't have any reservations yet. <Link to="/">Start exploring stays</Link>.
        </p>
      )}

      {reservations.length > 0 && (
        <table className="reservations-table">
          <thead>
            <tr>
              <th>Listing</th>
              <th>Check-in</th>
              <th>Check-out</th>
              <th>Guests</th>
              <th>Total</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((r) => (
              <tr key={r._id}>
                <td>{r.accommodation?.title || 'Listing removed'}</td>
                <td>{new Date(r.checkIn).toLocaleDateString()}</td>
                <td>{new Date(r.checkOut).toLocaleDateString()}</td>
                <td>{r.guests}</td>
                <td>${r.totalCost?.toFixed(2)}</td>
                <td>
                  <span className={`reservations-table__status reservations-table__status--${r.status}`}>
                    {r.status}
                  </span>
                </td>
                <td>
                  <button onClick={() => handleCancel(r._id)}>Cancel</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
