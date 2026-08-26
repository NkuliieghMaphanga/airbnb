/**
 * Header — persistent top navigation bar.
 *
 * Features:
 * - Airbnb SVG logo linking to home
 * - Location search bar (navigates to /locations/:query)
 * - "Become a host" link (logged-out) / "Host dashboard" link (host/admin)
 * - Profile button with hamburger + avatar initial
 * - Inline greeting "Hi, username" always visible next to avatar (logged-in)
 * - Dropdown menu: reservations, host dashboard, log out (logged-in)
 *                  sign up, log in, become a host (logged-out)
 */
import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import '../styles/header.css';

function AirbnbLogo() {
  return (
    <svg
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      className="site-header__logo-svg"
    >
      <path
        d="M16 1C7.163 1 0 8.163 0 17c0 8.836 7.163 16 16 16s16-7.164 16-16C32 8.163 24.837 1 16 1zm0 4c1.657 0 3 1.343 3 3s-1.343 3-3 3-3-1.343-3-3 1.343-3 3-3zm5.5 18H10.5a.5.5 0 0 1-.5-.5v-.5c0-3.038 2.686-5.5 6-5.5s6 2.462 6 5.5v.5a.5.5 0 0 1-.5.5z"
        fill="currentColor"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false" width="16" height="16">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        d="M13 24c6.075 0 11-4.925 11-11S19.075 2 13 2 2 6.925 2 13s4.925 11 11 11zm8-3 9 9"
      />
    </svg>
  );
}

function HamburgerIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false" width="16" height="16">
      <rect y="6" width="32" height="2" rx="1" fill="currentColor" />
      <rect y="15" width="32" height="2" rx="1" fill="currentColor" />
      <rect y="24" width="32" height="2" rx="1" fill="currentColor" />
    </svg>
  );
}

export default function Header() {
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const term = query.trim();
    if (term) navigate(`/locations/${encodeURIComponent(term)}`);
  };

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  const isHost = user && (user.role === 'host' || user.role === 'admin');

  return (
    <header className="site-header">
      <div className="site-header__inner container">

        {/* ── Logo ── */}
        <Link to="/" className="site-header__logo" aria-label="airbnb home">
          <AirbnbLogo />
          <span>airbnb</span>
        </Link>

        {/* ── Search bar ── */}
        <form className="site-header__search" onSubmit={handleSearch} role="search">
          <input
            type="text"
            placeholder="Search destinations"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search destinations"
          />
          <button type="submit" aria-label="Search">
            <SearchIcon />
          </button>
        </form>

        {/* ── Right-hand actions ── */}
        <div className="site-header__actions" ref={menuRef}>

          {/* Become a host / Host dashboard (outside dropdown for visibility) */}
          {!user && (
            <Link to="/login?mode=register&role=host" className="site-header__host-link">
              Become a host
            </Link>
          )}
          {isHost && (
            <Link to="/host" className="site-header__host-link">
              Host dashboard
            </Link>
          )}

          {/* Profile button — hamburger + avatar + inline greeting when logged in */}
          <button
            className="site-header__profile-btn"
            onClick={() => setMenuOpen((v) => !v)}
            aria-haspopup="true"
            aria-expanded={menuOpen}
            aria-label="User menu"
          >
            <HamburgerIcon />
            {/* Inline greeting — always visible next to the avatar for logged-in users */}
            {user && (
              <span className="site-header__inline-greeting">
                Hi, {user.username}
              </span>
            )}
            <span className="site-header__avatar" aria-hidden="true">
              {user ? user.username.charAt(0).toUpperCase() : '?'}
            </span>
          </button>

          {/* ── Dropdown ── */}
          {menuOpen && (
            <div className="site-header__dropdown" role="menu">
              {user ? (
                <>
                  <p className="site-header__dropdown-greeting">Signed in as {user.role}</p>
                  <button
                    role="menuitem"
                    onClick={() => { setMenuOpen(false); navigate('/reservations'); }}
                  >
                    My reservations
                  </button>
                  {isHost && (
                    <button
                      role="menuitem"
                      onClick={() => { setMenuOpen(false); navigate('/host'); }}
                    >
                      Host dashboard
                    </button>
                  )}
                  <hr className="site-header__dropdown-divider" />
                  <button role="menuitem" onClick={handleLogout}>
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <button
                    role="menuitem"
                    className="site-header__dropdown-signup"
                    onClick={() => { setMenuOpen(false); navigate('/login?mode=register'); }}
                  >
                    Sign up
                  </button>
                  <button
                    role="menuitem"
                    onClick={() => { setMenuOpen(false); navigate('/login'); }}
                  >
                    Log in
                  </button>
                  <hr className="site-header__dropdown-divider" />
                  <button
                    role="menuitem"
                    onClick={() => { setMenuOpen(false); navigate('/login?mode=register&role=host'); }}
                  >
                    Become a host
                  </button>
                </>
              )}
            </div>
          )}

        </div>
      </div>
    </header>
  );
}
