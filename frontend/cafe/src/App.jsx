import './App.css';
import { Routes,Route,Navigate } from 'react-router-dom';
import { useState,useEffect } from 'react';
import CafeHeavenDashboard from './admin/dashboard';
import AdminLayout from './admin/adminLayout';
import MenuPage from './admin/menuPage';
import ReservationsPage from './admin/reservation';
import CustomerManagement from './admin/customers';
import AnalyticsPanel from './admin/analyticsPanel';
import UserProfileCard from './admin/profile';
import Signup from './validation/signup';
import Login from './validation/login';
import Lenis from '@studio-freight/lenis';
import Navbar from './components/navbar'
import Hero from './components/hero';
import About from './components/about';
import Menu from './components/menu';
import Gallery from './components/gallery';
import Testimonials from './components/testiMonial';
import Contact from './components/contact';
import Footer from './components/footer';
import BookTableDialog from './components/bookTable';


function App() {
  const [showBooking, setShowBooking] = useState(false);

  useEffect(() => {
    if (!window.lenis) return;

    if (showBooking) {
      window.lenis.stop();
    } else {
      window.lenis.start();
    }
  }, [showBooking]);

function AdminRoute({ children }) {
  const isAdmin = localStorage.getItem("adminToken");
  return isAdmin ? children : <Navigate to="/login" />;
}

  return (
    <Routes>

      {/* ✅ Customer Website at "/" */}
      <Route
        path="/"
        element={
          <>
            <Navbar onBookTableClick={() => setShowBooking(true)} />
            <Hero onBookTableClick={() => setShowBooking(true)} />
            <About />
            <Menu />
            <Gallery />
            <Testimonials />
            <Contact />
            <Footer />
            <BookTableDialog
              isOpen={showBooking}
              onClose={() => setShowBooking(false)}
            />
          </>
        }
      />

      {/* ✅ Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* ✅ Admin Panel */}
      <Route path="/admin" element={
    <AdminRoute>
      <AdminLayout />
    </AdminRoute>
  }>
        <Route index element={<CafeHeavenDashboard />} />
        <Route path="menu" element={<MenuPage />} />
        <Route path="reservations" element={<ReservationsPage />} />
        <Route path="customers" element={<CustomerManagement />} />
        <Route path="analyticsBoard" element={<AnalyticsPanel />} />
        <Route path="profile" element={<UserProfileCard />} />
      </Route>

    </Routes>
  );
}

export default App;