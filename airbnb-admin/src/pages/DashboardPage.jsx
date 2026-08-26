import { useEffect, useState } from 'react';
import { getStats } from '../api/admin.js';
import '../styles/dashboard.css';

function StatCard({ label, value, icon, color }) {
  return (
    <div className="stat-card" style={{ '--card-color': color }}>
      <div className="stat-card__icon">{icon}</div>
      <div className="stat-card__body">
        <p className="stat-card__value">{value}</p>
        <p className="stat-card__label">{label}</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getStats()
      .then((res) => setStats(res.data.data))
      .catch(() => setError('Could not load statistics.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page">
      <h1 className="page__title">Dashboard</h1>
      <p className="page__subtitle">Welcome back. Here's an overview of the platform.</p>

      {loading && <p className="text-muted">Loading stats…</p>}
      {error && <p className="text-error">{error}</p>}

      {stats && (
        <div className="stat-grid">
          <StatCard label="Total Users" value={stats.totalUsers} icon="👤" color="#ff385c" />
          <StatCard label="Accommodations" value={stats.totalAccommodations} icon="🏠" color="#00a699" />
          <StatCard label="Reservations" value={stats.totalReservations} icon="📅" color="#fc642d" />
          <StatCard
            label="Total Revenue"
            value={`$${Number(stats.totalRevenue).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            icon="💰"
            color="#484848"
          />
        </div>
      )}

      <div className="dashboard-links">
        <a href="/users" className="dashboard-link">
          <span className="dashboard-link__icon">👥</span>
          <div>
            <p className="dashboard-link__title">Manage Users</p>
            <p className="dashboard-link__desc">View all users, promote to host or admin, or remove accounts.</p>
          </div>
        </a>
        <a href="/accommodations" className="dashboard-link">
          <span className="dashboard-link__icon">🏘️</span>
          <div>
            <p className="dashboard-link__title">Manage Accommodations</p>
            <p className="dashboard-link__desc">Create, edit, or delete any accommodation listing on the platform.</p>
          </div>
        </a>
        <a href="/reservations" className="dashboard-link">
          <span className="dashboard-link__icon">📋</span>
          <div>
            <p className="dashboard-link__title">All Reservations</p>
            <p className="dashboard-link__desc">View and cancel any guest reservation across all listings.</p>
          </div>
        </a>
      </div>
    </div>
  );
}
