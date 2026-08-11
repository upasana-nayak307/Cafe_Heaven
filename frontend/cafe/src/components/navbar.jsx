import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiMenuAlt3, HiX } from 'react-icons/hi';

const Navbar = ({ onBookTableClick }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Menu', href: '#menu' },
    { name: 'About', href: '#about' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Contact', href: '#contact' },
  ];

  const scrollToSection = (href) => {
    const element = document.querySelector(href);
    if (element && window.lenis) {
      window.lenis.scrollTo(element);
      setMobileMenuOpen(false);
    }
  };

  return (
    <nav
      data-testid="navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'backdrop-blur-md bg-white/70 border-b border-white/40 shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between h-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center"
          >
            <h1
              data-testid="nav-logo"
              className={`text-2xl font-serif font-bold ${
                scrolled ? 'text-[#0A4D8C]' : 'text-white'
              }`}
            >
              The Cafe Heaven
            </h1>
          </motion.div>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link, index) => (
              <motion.button
                key={link.name}
                data-testid={`nav-link-${link.name.toLowerCase()}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => scrollToSection(link.href)}
                className={`font-medium transition-colors duration-300 hover:text-[#6DBE45] ${
                  scrolled ? 'text-[#05223D]' : 'text-white'
                }`}
              >
                {link.name}
              </motion.button>
            ))}
            <motion.button
              data-testid="nav-book-table-btn"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              onClick={onBookTableClick}
              className="bg-[#0A4D8C] text-white px-6 py-2.5 rounded-full font-medium hover:bg-[#073663] transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Book a Table
            </motion.button>
          </div>

          <button
            data-testid="mobile-menu-toggle"
            className="md:hidden z-50"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <HiX className={`w-7 h-7 ${scrolled ? 'text-[#0A4D8C]' : 'text-white'}`} />
            ) : (
              <HiMenuAlt3 className={`w-7 h-7 ${scrolled ? 'text-[#0A4D8C]' : 'text-white'}`} />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <motion.div
          data-testid="mobile-menu"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden backdrop-blur-xl bg-white/95 border-b border-white/40"
        >
          <div className="px-6 py-6 space-y-4">
            {navLinks.map((link) => (
              <button
                key={link.name}
                data-testid={`mobile-nav-link-${link.name.toLowerCase()}`}
                onClick={() => scrollToSection(link.href)}
                className="block w-full text-left text-[#05223D] font-medium hover:text-[#6DBE45] transition-colors py-2"
              >
                {link.name}
              </button>
            ))}
            <button
              data-testid="mobile-book-table-btn"
              onClick={() => {
                onBookTableClick();
                setMobileMenuOpen(false);
              }}
              className="w-full bg-[#0A4D8C] text-white px-6 py-3 rounded-full font-medium hover:bg-[#073663] transition-all duration-300 shadow-lg"
            >
              Book a Table
            </button>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;