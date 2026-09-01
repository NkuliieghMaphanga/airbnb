/**
 * Reservation model
 *
 * Stores a guest's booking for a specific accommodation.
 * The totalCost is computed server-side by the reservationController before
 * the document is created — clients should never send it directly.
 *
 * Fields:
 *   accommodation — ref to the booked Accommodation document
 *   user          — ref to the guest User who made the booking
 *   host          — ref to the host User who owns the listing (denormalised for
 *                   fast host-scoped queries without a join to Accommodation)
 *   checkIn/Out   — dates; checkOut must be strictly after checkIn (validated)
 *   guests        — number of guests (must not exceed accommodation.guests)
 *   totalCost     — computed: nights×price − discount + fees
 *   status        — lifecycle state; defaults to 'confirmed' on creation
 */
const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema(
  {
    accommodation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Accommodation',
      required: [true, 'Accommodation is required'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Host is required'],
    },
    checkIn: {
      type: Date,
      required: [true, 'Check-in date is required'],
    },
    checkOut: {
      type: Date,
      required: [true, 'Check-out date is required'],
      validate: {
        validator: function validateCheckOut(value) {
          return value > this.checkIn;
        },
        message: 'Check-out date must be after check-in date',
      },
    },
    guests: {
      type: Number,
      required: [true, 'Number of guests is required'],
      min: 1,
    },
    totalCost: {
      type: Number,
      required: [true, 'Total cost is required'],
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'confirmed',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Reservation', ReservationSchema);
