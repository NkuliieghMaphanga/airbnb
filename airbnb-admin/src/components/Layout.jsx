import { useState, useRef, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import '../styles/layout.css';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/users', label: 'Users', icon: '👥' },
  { to: '/accommodations', label: 'Accommodations', icon: '🏠' },
  { to: '/reservations', label: 'Reservations', icon: '📅' },
];

// Derive a human-readable page title from the current path
function usePageTitle() {
  const { pathname } = useLocation();
  if (pathname.startsWith('/accommodations/new')) return 'Add New Listing';
  if (pathname.match(/\/accommodations\/.+\/edit/)) return 'Edit Listing';
  const match = NAV_ITEMS.find((n) => pathname.startsWith(n.to));
  return match ? match.label : 'Admin';
}

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const pageTitle = usePageTitle();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/login');
  };

  return (
    <div className="admin-shell">
      {/* ── Sidebar ─────────────────────────────────── */}
      <aside className="sidebar">
        <div className="sidebar__brand">
          {/* Airbnb logo SVG */}
          <svg viewBox="0 0 32 32" className="sidebar__logo" aria-hidden="true" focusable="false">
            <path
              d="M16 1C7.163 1 0 8.163 0 17c0 8.836 7.163 16 16 16s16-7.164 16-16C32 8.163 24.837 1 16 1zm0 4c1.657 0 3 1.343 3 3s-1.343 3-3 3-3-1.343-3-3 1.343-3 3-3zm5.5 18H10.5a.5.5 0 0 1-.5-.5v-.5c0-3.038 2.686-5.5 6-5.5s6 2.462 6 5.5v.5a.5.5 0 0 1-.5.5z"
              fill="#ff385c"
            />
          </svg>
          <span className="sidebar__title">Airbnb Admin</span>
        </div>

        <nav className="sidebar__nav" aria-label="Admin navigation">
          {NAV_ITEMS.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
              }
            >
              <span className="sidebar__link-icon" aria-hidden="true">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar footer — user info + sign out */}
        <div className="sidebar__footer">
          <div className="sidebar__user">
            <div className="sidebar__avatar" aria-hidden="true">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="sidebar__username">{user?.username}</p>
              <p className="sidebar__role">{user?.role}</p>
            </div>
          </div>
          <button className="sidebar__logout" onClick={handleLogout}>
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Right-hand panel ────────────────────────── */}
      <div className="admin-panel">
        {/* ── Top header bar ──────────────────────── */}
        <header className="admin-topbar">
          <h1 className="admin-topbar__title">{pageTitle}</h1>

          <div className="admin-topbar__actions" ref={dropdownRef}>
            {/* Greeting visible at all times in the header */}
            <span className="admin-topbar__greeting">
              Welcome, <strong>{user?.username}</strong>
            </span>

            {/* Profile button */}
            <button
              className="admin-topbar__profile-btn"
              onClick={() => setDropdownOpen((v) => !v)}
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
              aria-label="User menu"
            >
              <span className="admin-topbar__avatar" aria-hidden="true">
                {user?.username?.charAt(0).toUpperCase()}
              </span>
              <svg viewBox="0 0 32 32" aria-hidden="true" width="12" height="12">
                <path d="M6 12l10 10 10-10" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </button>

            {/* Dropdown menu */}
            {dropdownOpen && (
              <div className="admin-topbar__dropdown" role="menu">
                <p className="admin-topbar__dropdown-user">
                  {user?.username}
                  <span className="admin-topbar__dropdown-role">{user?.role}</span>
                </p>
                <hr className="admin-topbar__dropdown-divider" />
                <button
                  role="menuitem"
                  onClick={() => { setDropdownOpen(false); navigate('/reservations'); }}
                >
                  📅 View reservations
                </button>
                <button
                  role="menuitem"
                  onClick={() => { setDropdownOpen(false); navigate('/accommodations'); }}
                >
                  🏠 Manage listings
                </button>
                <hr className="admin-topbar__dropdown-divider" />
                <button role="menuitem" className="admin-topbar__dropdown-logout" onClick={handleLogout}>
                  Sign out
                </button>
              </div>
            )}
          </div>
        </header>

        {/* ── Page content ────────────────────────── */}
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
