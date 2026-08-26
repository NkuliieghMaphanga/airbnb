import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { createReservation } from '../api/reservations.js';
import '../styles/costCalculator.css';

function nightsBetween(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0;
  const ms = new Date(checkOut) - new Date(checkIn);
  const nights = Math.ceil(ms / (1000 * 60 * 60 * 24));
  return nights > 0 ? nights : 0;
}

export default function CostCalculator({ listing }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [status, setStatus] = useState({ type: 'idle', message: '' });

  const nights = nightsBetween(checkIn, checkOut);

  const breakdown = useMemo(() => {
    const subtotal = nights * (listing.price || 0);
    const discount = nights >= 7 ? subtotal * ((listing.weeklyDiscount || 0) / 100) : 0;
    const cleaningFee = listing.cleaningFee || 0;
    const serviceFee = listing.serviceFee || 0;
    const occupancyTaxes = listing.occupancyTaxes || 0;
    const total = subtotal - discount + cleaningFee + serviceFee + occupancyTaxes;
    return { subtotal, discount, cleaningFee, serviceFee, occupancyTaxes, total };
  }, [nights, listing]);

  const handleReserve = async (e) => {
    e.preventDefault();
    setStatus({ type: 'idle', message: '' });

    if (!user) {
      navigate('/login', { state: { from: 'reservation' } });
      return;
    }
    if (!checkIn || !checkOut || nights <= 0) {
      setStatus({ type: 'error', message: 'Please choose a valid check-in and check-out date.' });
      return;
    }
    if (guests > listing.guests) {
      setStatus({ type: 'error', message: `This place only fits up to ${listing.guests} guests.` });
      return;
    }

    try {
      setStatus({ type: 'loading', message: '' });
      await createReservation({
        accommodation: listing._id,
        checkIn,
        checkOut,
        guests: Number(guests),
      });
      setStatus({ type: 'success', message: 'Reservation confirmed! You can view it under "View reservations".' });
    } catch (err) {
      setStatus({
        type: 'error',
        message: err.response?.data?.message || 'Something went wrong creating your reservation.',
      });
    }
  };

  return (
    <div className="cost-calculator">
      <div className="cost-calculator__header">
        <span className="cost-calculator__price">${listing.price}</span>
        <span className="cost-calculator__unit"> / night</span>
        <span className="cost-calculator__rating">★ {listing.rating?.toFixed(1) || 'New'}</span>
      </div>

      <form onSubmit={handleReserve} className="cost-calculator__form">
        <div className="cost-calculator__dates">
          <label>
            Check-in
            <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} required />
          </label>
          <label>
            Check-out
            <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} required />
          </label>
        </div>
        <label className="cost-calculator__guests">
          Guests
          <input
            type="number"
            min={1}
            max={listing.guests}
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
          />
        </label>

        <button type="submit" className="cost-calculator__reserve-btn" disabled={status.type === 'loading'}>
          {status.type === 'loading' ? 'Reserving…' : 'Reserve'}
        </button>

        {status.type === 'error' && <p className="cost-calculator__message cost-calculator__message--error">{status.message}</p>}
        {status.type === 'success' && <p className="cost-calculator__message cost-calculator__message--success">{status.message}</p>}
      </form>

      {nights > 0 && (
        <div className="cost-calculator__breakdown">
          <div className="cost-calculator__row">
            <span>${listing.price} x {nights} night{nights > 1 ? 's' : ''}</span>
            <span>${breakdown.subtotal.toFixed(2)}</span>
          </div>
          {breakdown.discount > 0 && (
            <div className="cost-calculator__row cost-calculator__row--discount">
              <span>Weekly discount</span>
              <span>-${breakdown.discount.toFixed(2)}</span>
            </div>
          )}
          <div className="cost-calculator__row">
            <span>Cleaning fee</span>
            <span>${breakdown.cleaningFee.toFixed(2)}</span>
          </div>
          <div className="cost-calculator__row">
            <span>Service fee</span>
            <span>${breakdown.serviceFee.toFixed(2)}</span>
          </div>
          <div className="cost-calculator__row">
            <span>Occupancy taxes and fees</span>
            <span>${breakdown.occupancyTaxes.toFixed(2)}</span>
          </div>
          <div className="cost-calculator__row cost-calculator__row--total">
            <span>Total</span>
            <span>${breakdown.total.toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
