/**
 * Footer
 *
 * Site-wide footer consisting of two parts:
 *  1. Four-column link grid (Support, Hosting, Airbnb, Company)
 *  2. Copyright bar — social icon links, language selector, currency selector
 *
 * The language and currency selectors cycle through their available options
 * on click, persisting the choice in component state so the button label
 * updates to reflect the current selection.
 */
import { useState } from 'react';
import '../styles/footer.css';

// ── Footer link data ──────────────────────────────────────────────────────────

const columns = [
  {
    heading: 'Support',
    links: [
      { label: 'Help Centre', href: 'https://www.airbnb.com/help' },
      { label: 'AirCover', href: 'https://www.airbnb.com/aircover' },
      { label: 'Anti-discrimination', href: 'https://www.airbnb.com/against-discrimination' },
      { label: 'Disability support', href: 'https://www.airbnb.com/accessibility' },
      { label: 'Cancellation options', href: 'https://www.airbnb.com/help/article/2701' },
    ],
  },
  {
    heading: 'Hosting',
    links: [
      { label: 'Airbnb your home', href: 'https://www.airbnb.com/host/homes' },
      { label: 'AirCover for Hosts', href: 'https://www.airbnb.com/aircover-for-hosts' },
      { label: 'Hosting resources', href: 'https://www.airbnb.com/resources/hosting-homes' },
      { label: 'Community forum', href: 'https://community.withairbnb.com' },
      { label: 'Hosting responsibly', href: 'https://www.airbnb.com/help/article/1379' },
    ],
  },
  {
    heading: 'Airbnb',
    links: [
      { label: 'Newsroom', href: 'https://news.airbnb.com' },
      { label: 'New features', href: 'https://www.airbnb.com/features' },
      { label: 'Careers', href: 'https://careers.airbnb.com' },
      { label: 'Investors', href: 'https://investors.airbnb.com' },
      { label: 'Gift cards', href: 'https://www.airbnb.com/gift' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'Terms of service', href: 'https://www.airbnb.com/terms' },
      { label: 'Privacy policy', href: 'https://www.airbnb.com/terms/privacy_policy' },
      { label: 'Sitemap', href: 'https://www.airbnb.com/sitemaps/v2' },
      { label: 'Your privacy choices', href: 'https://www.airbnb.com/help/article/2855' },
    ],
  },
];

// ── Selector options ──────────────────────────────────────────────────────────

const LANGUAGES = ['English (ZA)', 'Español', 'Français', 'Deutsch', 'Português'];
const CURRENCIES = ['USD ($)', 'ZAR (R)', 'EUR (€)', 'GBP (£)', 'JPY (¥)'];

// Social links with accessible SVG icons
const socials = [
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/airbnb',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
      </svg>
    ),
  },
  {
    label: 'Twitter / X',
    href: 'https://twitter.com/airbnb',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/airbnb',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
      </svg>
    ),
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function Footer() {
  // Track the currently selected language and currency indices
  const [langIndex, setLangIndex] = useState(0);
  const [currIndex, setCurrIndex] = useState(0);

  /** Cycle to the next option in the given array. */
  const cycleLanguage = () => setLangIndex((i) => (i + 1) % LANGUAGES.length);
  const cycleCurrency = () => setCurrIndex((i) => (i + 1) % CURRENCIES.length);

  return (
    <footer className="site-footer">
      {/* ── 4-column link grid ── */}
      <div className="container">
        <div className="site-footer__columns">
          {columns.map((col) => (
            <div key={col.heading} className="site-footer__col">
              <h4>{col.heading}</h4>
              <ul>
                {col.links.map((link) => (
                  <li key={link.label}>
                    {/* Open in new tab; rel prevents opener exploitation */}
                    <a href={link.href} target="_blank" rel="noopener noreferrer">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── Copyright bar ── */}
      <div className="site-footer__bottom">
        <div className="container site-footer__bottom-inner">
          {/* Copyright */}
          <p>&copy; {new Date().getFullYear()} Airbnb Clone, Inc. Built for the Zaio Capstone.</p>

          {/* Social icon links */}
          <div className="site-footer__socials">
            {socials.map(({ label, href, icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="site-footer__social-link"
              >
                {icon}
              </a>
            ))}
          </div>

          {/* Language & currency selectors — cycle through options on click */}
          <div className="site-footer__selectors">
            <button
              type="button"
              onClick={cycleLanguage}
              aria-label="Change language"
              title="Click to change language"
            >
              🌐 {LANGUAGES[langIndex]}
            </button>
            <button
              type="button"
              onClick={cycleCurrency}
              aria-label="Change currency"
              title="Click to change currency"
            >
              {CURRENCIES[currIndex]}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
