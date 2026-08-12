import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ onBookTableClick }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Updated paths to point to separate page routes
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'About', path: '/about' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav
      data-testid="navbar"
      className={`fixed top-0 inset-x-0 z-50 w-full transition-all duration-500 ${
        scrolled || location.pathname !== '/'
          ? 'backdrop-blur-md bg-white/80 border-b border-stone-200/50 shadow-xs'
          : 'bg-transparent'
      }`}
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1
              data-testid="nav-logo"
              className={`text-xl sm:text-2xl font-serif font-bold tracking-tight transition-colors duration-300 ${
                scrolled || location.pathname !== '/' ? 'text-[#0A4D8C]' : 'text-white'
              }`}
            >
              The Cafe Heaven
            </h1>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              const isDarkText = scrolled || location.pathname !== '/';

              return (
                <Link
                  key={link.name}
                  to={link.path}
                  data-testid={`nav-link-${link.name.toLowerCase()}`}
                  className={`font-medium transition-colors duration-300 ${
                    isActive
                      ? 'text-[#6DBE45] font-semibold'
                      : isDarkText
                      ? 'text-[#05223D] hover:text-[#6DBE45]'
                      : 'text-white hover:text-[#6DBE45]'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            <button
              data-testid="nav-book-table-btn"
              onClick={onBookTableClick}
              className="bg-[#0A4D8C] text-white px-6 py-2.5 rounded-full font-medium hover:bg-[#073663] transition-all duration-300 hover:scale-105 shadow-md cursor-pointer"
            >
              Book a Table
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            data-testid="mobile-menu-toggle"
            className="md:hidden z-50 p-2 focus:outline-none cursor-pointer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? (
              <HiX className={`w-7 h-7 ${scrolled || location.pathname !== '/' ? 'text-[#0A4D8C]' : 'text-white'}`} />
            ) : (
              <HiMenuAlt3 className={`w-7 h-7 ${scrolled || location.pathname !== '/' ? 'text-[#0A4D8C]' : 'text-white'}`} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            data-testid="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden w-full bg-white/95 backdrop-blur-xl border-b border-stone-200 overflow-hidden shadow-xl"
          >
            <div className="px-6 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  data-testid={`mobile-nav-link-${link.name.toLowerCase()}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block w-full text-left font-medium text-base py-2 transition-colors ${
                    location.pathname === link.path
                      ? 'text-[#6DBE45] font-semibold'
                      : 'text-[#05223D] hover:text-[#6DBE45]'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <button
                data-testid="mobile-book-table-btn"
                onClick={() => {
                  onBookTableClick();
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-[#0A4D8C] text-white px-6 py-3 rounded-full font-medium hover:bg-[#073663] transition-all duration-300 shadow-md cursor-pointer"
              >
                Book a Table
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;