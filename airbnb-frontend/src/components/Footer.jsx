import '../styles/footer.css';

const columns = [
  {
    heading: 'Support',
    links: ['Help Centre', 'AirCover', 'Anti-discrimination', 'Disability support', 'Cancellation options'],
  },
  {
    heading: 'Hosting',
    links: ['Airbnb your home', 'AirCover for Hosts', 'Hosting resources', 'Community forum', 'Hosting responsibly'],
  },
  {
    heading: 'Airbnb',
    links: ['Newsroom', 'New features', 'Careers', 'Investors', 'Gift cards'],
  },
  {
    heading: 'Company',
    links: ['Terms of service', 'Privacy policy', 'Sitemap', 'Your privacy choices'],
  },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__columns">
          {columns.map((col) => (
            <div key={col.heading} className="site-footer__col">
              <h4>{col.heading}</h4>
              <ul>
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#top">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="site-footer__bottom">
        <div className="container site-footer__bottom-inner">
          <p>&copy; {new Date().getFullYear()} Airbnb Clone, Inc. Built for the Zaio Capstone project.</p>
          <div className="site-footer__socials">
            <a href="#top" aria-label="Facebook">FB</a>
            <a href="#top" aria-label="Twitter">TW</a>
            <a href="#top" aria-label="Instagram">IG</a>
          </div>
          <div className="site-footer__selectors">
            <button type="button">🌐 English (ZA)</button>
            <button type="button">$ USD</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
