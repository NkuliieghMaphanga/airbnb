/**
 * Header — Figma-accurate Airbnb navigation bar.
 *
 * Layout: Logo | Segmented search pill | Globe + Become a host + Profile menu
 * The search pill has three segments: Where · Check in · Check out (desktop)
 * collapsing to a single destination input on tablet/mobile.
 */
import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import '../styles/header.css';

/* ── SVG icons ─────────────────────────────────────────────────────────────── */

function AirbnbLogoSvg() {
  return (
    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true" focusable="false" className="site-header__logo-svg">
      <path
        d="M16 0C7.163 0 0 7.163 0 16c0 8.836 7.163 16 16 16s16-7.164
           16-16C32 7.163 24.837 0 16 0zm0 4c1.657 0 3 1.343 3 3s-1.343
           3-3 3-3-1.343-3-3 1.343-3 3-3zm5.5 18H10.5a.5.5 0 0
           1-.5-.5v-.5c0-3.038 2.686-5.5 6-5.5s6 2.462 6
           5.5v.5a.5.5 0 0 1-.5.5z"
        fill="currentColor"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false" width="16" height="16">
      <path fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round"
        d="M13 24c6.075 0 11-4.925 11-11S19.075 2 13 2 2 6.925 2 13s4.925 11 11 11zm8-3 9 9" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false" width="16" height="16"
      fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="8" cy="8" r="6.5" />
      <path d="M8 1.5C8 1.5 5.5 4.5 5.5 8s2.5 6.5 2.5 6.5S10.5 11.5 10.5 8 8 1.5 8 1.5z" />
      <path d="M1.5 8h13" />
    </svg>
  );
}

function HamburgerIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false" width="14" height="14">
      <rect y="6"  width="32" height="2.5" rx="1.25" fill="currentColor" />
      <rect y="15" width="32" height="2.5" rx="1.25" fill="currentColor" />
      <rect y="24" width="32" height="2.5" rx="1.25" fill="currentColor" />
    </svg>
  );
}

/* ── Component ──────────────────────────────────────────────────────────────── */

export default function Header() {
  const [query, setQuery]     = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef  = useRef(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  /* Close dropdown on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
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
        <Link to="/" className="site-header__logo" aria-label="Airbnb home">
          <AirbnbLogoSvg />
          <span>airbnb</span>
        </Link>

        {/* ── Segmented search pill ── */}
        <form className="site-header__search" onSubmit={handleSearch} role="search">
          {/* Segment 1 — Where */}
          <div className="site-header__search-segment">
            <span className="site-header__search-label">Where</span>
            <input
              type="text"
              placeholder="Search destinations"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search destinations"
            />
          </div>

          {/* Segment 2 — Check in (decorative on this demo) */}
          <div className="site-header__search-segment">
            <span className="site-header__search-label">Check in</span>
            <span className="site-header__search-value">Add dates</span>
          </div>

          {/* Segment 3 — Check out (decorative on this demo) */}
          <div className="site-header__search-segment">
            <span className="site-header__search-label">Check out</span>
            <span className="site-header__search-value">Add dates</span>
          </div>

          {/* Search submit button */}
          <button type="submit" className="site-header__search-btn" aria-label="Search">
            <SearchIcon />
          </button>
        </form>

        {/* ── Right-hand actions ── */}
        <div className="site-header__actions" ref={menuRef}>

          {/* Become a host / Host dashboard */}
          {!user && (
            <Link to="/login?mode=register&role=host" className="site-header__host-link">
              Become a Host
            </Link>
          )}
          {isHost && (
            <Link to="/host" className="site-header__host-link">
              Host dashboard
            </Link>
          )}

          {/* Globe language button */}
          <button className="site-header__globe-btn" type="button" aria-label="Change language">
            <GlobeIcon />
          </button>

          {/* Profile pill */}
          <button
            className="site-header__profile-btn"
            onClick={() => setMenuOpen((v) => !v)}
            aria-haspopup="true"
            aria-expanded={menuOpen}
            aria-label="User menu"
            type="button"
          >
            <HamburgerIcon />
            {user && (
              <span className="site-header__inline-greeting">
                Hi, {user.username}
              </span>
            )}
            <span className="site-header__avatar" aria-hidden="true">
              {user ? user.username.charAt(0).toUpperCase() : '👤'}
            </span>
          </button>

          {/* ── Dropdown ── */}
          {menuOpen && (
            <div className="site-header__dropdown" role="menu">
              {user ? (
                <>
                  <p className="site-header__dropdown-greeting">
                    Signed in as {user.role}
                  </p>
                  <button role="menuitem"
                    onClick={() => { setMenuOpen(false); navigate('/reservations'); }}>
                    My reservations
                  </button>
                  {isHost && (
                    <button role="menuitem"
                      onClick={() => { setMenuOpen(false); navigate('/host'); }}>
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
                  <button role="menuitem" className="site-header__dropdown-signup"
                    onClick={() => { setMenuOpen(false); navigate('/login?mode=register'); }}>
                    Sign up
                  </button>
                  <button role="menuitem"
                    onClick={() => { setMenuOpen(false); navigate('/login'); }}>
                    Log in
                  </button>
                  <hr className="site-header__dropdown-divider" />
                  <button role="menuitem"
                    onClick={() => { setMenuOpen(false); navigate('/login?mode=register&role=host'); }}>
                    Become a Host
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
