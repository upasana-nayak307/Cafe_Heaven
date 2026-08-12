import './App.css';
import { Routes, Route, Navigate, Outlet, useOutletContext } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Admin Imports
import CafeHeavenDashboard from './admin/dashboard';
import AdminLayout from './admin/adminLayout';
import MenuPage from './admin/menuPage';
import ReservationsPage from './admin/reservation';
import CustomerManagement from './admin/customers';
import AnalyticsPanel from './admin/analyticsPanel';
import UserProfileCard from './admin/profile';
import Signup from './validation/signup';
import Login from './validation/login';

// Customer Components
import Navbar from './components/navbar';
import Hero from './components/hero';
import About from './components/about';
import Menu from './components/menu';
import Gallery from './components/gallery';
import Testimonials from './components/testiMonial';
import Contact from './components/contact';
import Footer from './components/footer';
import BookTableDialog from './components/bookTable';

// 🔹 Layout Wrapper for Customer Site
function CustomerLayout({ showBooking, setShowBooking }) {
  return (
    <div className="relative w-full max-w-full overflow-x-hidden min-h-screen bg-[#FAFAFA] flex flex-col justify-between">
      <Navbar onBookTableClick={() => setShowBooking(true)} />

      <main className="w-full max-w-full overflow-x-hidden flex-grow">
        <Outlet context={{ onBookTableClick: () => setShowBooking(true) }} />
      </main>

      <Footer />

      <BookTableDialog
        isOpen={showBooking}
        onClose={() => setShowBooking(false)}
      />
    </div>
  );
}

// 🔹 Full Home Landing Page
function HomePage() {
  const { onBookTableClick } = useOutletContext();
  return (
    <>
      <Hero onBookTableClick={onBookTableClick} />
      <About />
      <Menu />
      <Gallery />
      <Testimonials />
      <Contact />
    </>
  );
}

// 🔹 Sub-page Wrapper (Adds top padding to clear fixed Navbar)
function SubPageWrapper({ children }) {
  return <div className="pt-20 sm:pt-24 pb-16">{children}</div>;
}

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
      {/* ✅ Public Customer Website Routes */}
      <Route
        element={
          <CustomerLayout
            showBooking={showBooking}
            setShowBooking={setShowBooking}
          />
        }
      >
        <Route path="/" element={<HomePage />} />
        <Route
          path="/menu"
          element={
            <SubPageWrapper>
              <Menu />
            </SubPageWrapper>
          }
        />
        <Route
          path="/about"
          element={
            <SubPageWrapper>
              <About />
            </SubPageWrapper>
          }
        />
        <Route
          path="/gallery"
          element={
            <SubPageWrapper>
              <Gallery />
            </SubPageWrapper>
          }
        />
        <Route
          path="/contact"
          element={
            <SubPageWrapper>
              <Contact />
            </SubPageWrapper>
          }
        />
      </Route>

      {/* ✅ Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* ✅ Admin Panel Routes */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
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