/**
 * Header — Airbnb-style navigation bar.
 *
 * Search pill: Where (text) | Check in (date) | Check out (date) | 🔍
 * All three fields are fully interactive and the form navigates to
 * /locations/:query when submitted.
 *
 * Bugs fixed vs previous version:
 *  - Check-in / Check-out were static <span> elements — now real date inputs
 *  - overflow:hidden on the pill clipped the calendar popup — removed
 *  - Date segment dividers now use box-shadow instead of a ::before pseudo
 *    element so they don't interfere with the date picker hit-test area
 */
import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import '../styles/header.css';

/* ─── Icons ──────────────────────────────────────────────────────────────── */

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

/* ─── Today's date as yyyy-mm-dd (used for min attribute) ─────────────────── */
function todayStr() {
  return new Date().toISOString().split('T')[0];
}

/* ─── Component ──────────────────────────────────────────────────────────── */

export default function Header() {
  const [query,    setQuery]    = useState('');
  const [checkIn,  setCheckIn]  = useState('');
  const [checkOut, setCheckOut] = useState('');
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

  /* Search — requires at least a destination */
  const handleSearch = (e) => {
    e.preventDefault();
    const term = query.trim();
    if (!term) return;

    // Build query string with optional dates
    const params = new URLSearchParams();
    if (checkIn)  params.set('checkIn',  checkIn);
    if (checkOut) params.set('checkOut', checkOut);
    const qs = params.toString();

    navigate(`/locations/${encodeURIComponent(term)}${qs ? `?${qs}` : ''}`);
  };

  /* When check-in changes, clear check-out if it's now before check-in */
  const handleCheckInChange = (e) => {
    const val = e.target.value;
    setCheckIn(val);
    if (checkOut && val && val >= checkOut) setCheckOut('');
  };

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  const isHost = user && (user.role === 'host' || user.role === 'admin');

  /* Format a yyyy-mm-dd string for display, e.g. "Jun 12" */
  const fmtDate = (d) =>
    d
      ? new Date(d + 'T00:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
      : null;

  return (
    <header className="site-header">
      <div className="site-header__inner container">

        {/* ── Logo ── */}
        <Link to="/" className="site-header__logo" aria-label="Airbnb home">
          <AirbnbLogoSvg />
          <span>airbnb</span>
        </Link>

        {/* ════════════════════════════════════════════
            Segmented search pill
            Segment 1: Where  |  Segment 2: Check in
            Segment 3: Check out  |  🔍 button
            ════════════════════════════════════════════ */}
        <form
          className="site-header__search"
          onSubmit={handleSearch}
          role="search"
          aria-label="Search accommodations"
        >

          {/* ── Segment 1 — Where ── */}
          <div className="site-header__seg site-header__seg--where">
            <label htmlFor="hdr-where" className="site-header__seg-label">Where</label>
            <input
              id="hdr-where"
              type="text"
              className="site-header__seg-input"
              placeholder="Search destinations"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoComplete="off"
              aria-label="Search destinations"
            />
          </div>

          {/* ── Segment 2 — Check in ── */}
          <div className="site-header__seg site-header__seg--date">
            <label htmlFor="hdr-checkin" className="site-header__seg-label">Check in</label>
            <input
              id="hdr-checkin"
              type="date"
              className="site-header__seg-date"
              value={checkIn}
              min={todayStr()}
              onChange={handleCheckInChange}
              aria-label="Check-in date"
            />
            {/* Show friendly text when no date is chosen yet */}
            {!checkIn && (
              <span className="site-header__seg-placeholder" aria-hidden="true">
                Add dates
              </span>
            )}
          </div>

          {/* ── Segment 3 — Check out ── */}
          <div className="site-header__seg site-header__seg--date">
            <label htmlFor="hdr-checkout" className="site-header__seg-label">Check out</label>
            <input
              id="hdr-checkout"
              type="date"
              className="site-header__seg-date"
              value={checkOut}
              min={checkIn || todayStr()}
              onChange={(e) => setCheckOut(e.target.value)}
              aria-label="Check-out date"
            />
            {!checkOut && (
              <span className="site-header__seg-placeholder" aria-hidden="true">
                Add dates
              </span>
            )}
          </div>

          {/* ── Search button ── */}
          <button
            type="submit"
            className="site-header__search-btn"
            aria-label="Search"
          >
            <SearchIcon />
            {/* Show "Search" text when both destination and dates are filled */}
            {query && checkIn && checkOut && (
              <span className="site-header__search-btn-text">Search</span>
            )}
          </button>

        </form>

        {/* ── Right-hand actions ── */}
        <div className="site-header__actions" ref={menuRef}>

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

          <button
            className="site-header__globe-btn"
            type="button"
            aria-label="Change language"
          >
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

          {/* Dropdown */}
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
