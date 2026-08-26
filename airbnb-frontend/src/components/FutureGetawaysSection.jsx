import { useState } from 'react';
import { futureGetawaysTabs } from '../data/staticContent.js';
import '../styles/sections.css';

export default function FutureGetawaysSection() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className="section container">
      <h2 className="section__title">Inspiration for future getaways</h2>
      <div className="tabs" role="tablist">
        {futureGetawaysTabs.map((tab, i) => (
          <button
            key={tab.label}
            role="tab"
            aria-selected={activeTab === i}
            className={`tabs__btn ${activeTab === i ? 'tabs__btn--active' : ''}`}
            onClick={() => setActiveTab(i)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <ul className="tabs__list" role="tabpanel">
        {futureGetawaysTabs[activeTab].items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
