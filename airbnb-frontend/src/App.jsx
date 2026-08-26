import { Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import HomePage from './pages/HomePage.jsx';
import LocationPage from './pages/LocationPage.jsx';
import LocationDetailsPage from './pages/LocationDetailsPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import ReservationsPage from './pages/ReservationsPage.jsx';
import HostDashboardPage from './pages/HostDashboardPage.jsx';

export default function App() {
  return (
    <div className="app-shell">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/locations/:location" element={<LocationPage />} />
          <Route path="/locations/:location/:id" element={<LocationDetailsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/reservations" element={<ReservationsPage />} />
          <Route path="/host" element={<HostDashboardPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
