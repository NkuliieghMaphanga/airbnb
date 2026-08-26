const User = require('../models/User');
const Accommodation = require('../models/Accommodation');
const Reservation = require('../models/Reservation');

/**
 * @route   GET /api/admin/users
 * @desc    Get all users
 * @access  Private (admin only)
 */
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PATCH /api/admin/users/:id/role
 * @desc    Update a user's role (promote to host or admin)
 * @access  Private (admin only)
 */
const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['user', 'host', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Role must be one of: user, host, admin' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Prevent demoting yourself
    if (user._id.toString() === req.user._id.toString() && role !== 'admin') {
      return res.status(400).json({ success: false, message: 'You cannot change your own admin role' });
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      success: true,
      data: { id: user._id, username: user.username, email: user.email, role: user.role },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/admin/users/:id
 * @desc    Delete a user
 * @access  Private (admin only)
 */
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own account' });
    }
    await user.deleteOne();
    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/admin/reservations
 * @desc    Get all reservations across all listings
 * @access  Private (admin only)
 */
const getAllReservations = async (req, res, next) => {
  try {
    const reservations = await Reservation.find({})
      .populate('accommodation', 'title location images price')
      .populate('user', 'username email')
      .populate('host', 'username email')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: reservations.length, data: reservations });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/admin/stats
 * @desc    Get dashboard statistics
 * @access  Private (admin only)
 */
const getStats = async (req, res, next) => {
  try {
    const [totalUsers, totalAccommodations, totalReservations, reservations] = await Promise.all([
      User.countDocuments(),
      Accommodation.countDocuments(),
      Reservation.countDocuments(),
      Reservation.find({ status: { $ne: 'cancelled' } }).select('totalCost'),
    ]);

    const totalRevenue = reservations.reduce((sum, r) => sum + (r.totalCost || 0), 0);

    res.status(200).json({
      success: true,
      data: { totalUsers, totalAccommodations, totalReservations, totalRevenue },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllUsers, updateUserRole, deleteUser, getAllReservations, getStats };
