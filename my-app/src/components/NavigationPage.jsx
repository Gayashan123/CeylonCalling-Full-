import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { FiSearch, FiMapPin } from 'react-icons/fi';
import Login from './Login';
import Create from './Create';
import Logo from '../assets/Lion.jpg';
import { useNavigate } from 'react-router-dom';

function Navigation() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  const openLogin = () => {
    setShowLogin(true);
    setShowSignup(false);
    setMenuOpen(false);
  };

  const openSignup = () => {
    setShowSignup(true);
    setShowLogin(false);
    setMenuOpen(false);
  };

  const closeModals = () => {
    setShowLogin(false);
    setShowSignup(false);
  };

  const handleGetLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        alert(`Location detected:\nLatitude: ${latitude}\nLongitude: ${longitude}`);
      },
      () => {
        alert("Failed to get location. Please enable location services.");
      }
    );
  };

  // Navigate to home or Header component on logo click
  const goToHeader = () => {
    navigate('/'); // or any route you want, e.g. '/header'
  };

  return (
    <div
      className={`fixed top-0 left-0 z-50 w-full backdrop-blur-lg ${
        showLogin || showSignup ? 'bg-black/60' : 'bg-white shadow-lg'
      }`}
    >
      <div className="max-w-screen-xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo & Title */}
        <div
          onClick={goToHeader}
          className="flex items-center gap-3 cursor-pointer select-none"
          title="Go to Home"
        >
          <img
            src={Logo}
            alt="Logo"
            className="h-12 w-12 rounded-full object-cover shadow-teal-200 shadow-md"
          />
          <span className="text-2xl font-extrabold tracking-tight text-gray-900">
            Ceylon Calling
          </span>
        </div>

        {/* Search Input (Hidden on mobile) */}
        <div className="hidden lg:flex flex-grow justify-center">
          <div className="relative w-full max-w-2xl flex items-center rounded-full bg-white/60 backdrop-blur-md border border-white/40 shadow-sm transition-all">
            <FiSearch className="absolute left-4 text-gray-500 text-lg" />
            <input
              type="text"
              placeholder="Enter city, postal code..."
              className="w-full py-2.5 pl-12 pr-32 text-sm text-gray-800 rounded-full bg-transparent focus:outline-none placeholder-gray-500"
            />
            <button
              onClick={handleGetLocation}
              className="absolute right-1.5 text-xs font-medium bg-gray-900 text-white px-4 py-1.5 rounded-full hover:bg-black transition flex items-center gap-1"
            >
              <FiMapPin className="text-sm" />
              Location
            </button>
          </div>
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={openLogin}
            className="px-5 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition"
          >
            Log in
          </button>
          <button
            onClick={openSignup}
            className="px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-full hover:from-purple-600 hover:to-pink-600 transition"
          >
            Sign up
          </button>
        </div>

        {/* Hamburger Menu for Mobile */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-2xl text-gray-800 focus:outline-none"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Search Input (Mobile) */}
      <div className="block lg:hidden px-4 pb-2">
        <div className="relative w-full flex items-center rounded-full bg-white/60 backdrop-blur-md border border-white/40 shadow-sm transition-all">
          <FiSearch className="absolute left-4 text-gray-500 text-lg" />
          <input
            type="text"
            placeholder="Enter city, postal code..."
            className="w-full py-2.5 pl-12 pr-32 text-sm text-gray-800 rounded-full bg-transparent focus:outline-none placeholder-gray-500"
          />
          <button
            onClick={handleGetLocation}
            className="absolute right-1.5 text-xs font-medium bg-gray-900 text-white px-4 py-1.5 rounded-full hover:bg-black transition flex items-center gap-1"
          >
            <FiMapPin className="text-sm" />
            Location
          </button>
        </div>
      </div>

      {/* Mobile Menu Auth Buttons */}
      {menuOpen && (
        <div className="px-4 py-3 md:hidden bg-white border-t border-gray-100 shadow-md">
          <button
            onClick={openLogin}
            className="w-full mb-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200"
          >
            Log in
          </button>
          <button
            onClick={openSignup}
            className="w-full px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-full hover:from-purple-600 hover:to-pink-600"
          >
            Sign up
          </button>
        </div>
      )}

      {/* Modals */}
      {showLogin && <Login closeLogin={closeModals} signup={openSignup} />}
      {showSignup && <Create closeLogin={closeModals} login={openLogin} />}
    </div>
  );
}

export default Navigation;
