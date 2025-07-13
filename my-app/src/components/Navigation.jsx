import React, { useState } from 'react';
import { Link as ScrollLink } from 'react-scroll';
import { useNavigate } from 'react-router-dom';
import Logo from "../assets/Lion.jpg";

function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = ['header', 'about', 'contact', 'restaurants'];

  // Toggle mobile menu open/close
  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close mobile menu on navigation
  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white bg-opacity-90 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3 md:py-4">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <img
            src={Logo}
            alt="Logo"
            className="h-10 w-10 rounded-full object-cover shadow-md"
          />
          <span className="text-2xl font-bold text-gray-900 select-none">Ceylon Calling</span>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex items-center gap-8 text-gray-700 font-medium">
          {navLinks.map((section) => (
            <li key={section} className="capitalize cursor-pointer hover:text-gray-900 transition-colors">
              <ScrollLink
                to={section}
                smooth={true}
                duration={500}
                spy={true}
                offset={-80} // offset for fixed header height
                activeClass="text-pink-500 font-semibold"
                className="relative"
              >
                {section === 'restaurants' ? 'Restaurants' : section}
              </ScrollLink>
            </li>
          ))}
        </ul>

        {/* Desktop Buttons */}
        <div className="hidden lg:flex items-center gap-4">
          <button
            onClick={() => navigate('/user/login')}
            className="px-5 py-2 rounded-full bg-pink-500 text-white font-semibold hover:bg-pink-600 transition"
          >
            Log In
          </button>
          <button
            onClick={() => navigate('/shop')}
            className="px-5 py-2 rounded-full border border-pink-500 text-pink-500 font-semibold hover:bg-pink-50 transition"
          >
            Shop
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={handleMenuToggle}
          className="lg:hidden text-gray-700 focus:outline-none"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white bg-opacity-95 backdrop-blur-md shadow-lg rounded-b-lg px-6 py-6">
          <ul className="flex flex-col gap-6 text-gray-700 font-medium text-lg">
            {navLinks.map((section) => (
              <li key={section} className="capitalize cursor-pointer hover:text-pink-500 transition-colors">
                <ScrollLink
                  to={section}
                  smooth={true}
                  duration={500}
                  spy={true}
                  offset={-80}
                  onClick={handleLinkClick}
                  activeClass="text-pink-500 font-semibold"
                >
                  {section === 'restaurants' ? 'Restaurants' : section}
                </ScrollLink>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col gap-4">
            <button
              onClick={() => {
                navigate('/user/login');
                setIsMenuOpen(false);
              }}
              className="w-full px-5 py-3 rounded-full bg-pink-500 text-white font-semibold hover:bg-pink-600 transition"
            >
              Log In
            </button>
            <button
              onClick={() => {
                navigate('/shop');
                setIsMenuOpen(false);
              }}
              className="w-full px-5 py-3 rounded-full border border-pink-500 text-pink-500 font-semibold hover:bg-pink-50 transition"
            >
              Shop
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navigation;
