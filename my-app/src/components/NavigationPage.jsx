import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { FiSearch, FiMapPin } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useSiteUserAuthStore } from '../store/siteUserAuthStore'; // Adjust the path as needed

function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const logout = useSiteUserAuthStore(state => state.logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleGetLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        alert(`Location detected:\nLatitude: ${latitude}\nLongitude: ${longitude}`);
      },
      () => {
        alert('Failed to get location. Please enable location services.');
      }
    );
  };

  // Navigate to home on logo click
  const goToHeader = () => {
    navigate('/');
  };

  return (
    <div className="fixed top-0 left-0 z-50 w-full bg-white shadow-lg backdrop-blur-lg">
      <div className="max-w-screen-xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo & Title */}
        <div
          onClick={goToHeader}
          className="flex items-center gap-3 cursor-pointer select-none"
          title="Go to Home"
        >
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
            onClick={handleLogout}
            className="px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-full hover:from-purple-600 hover:to-pink-600 transition"
          >
            Log out
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
            onClick={handleLogout}
            className="w-full px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-full hover:from-purple-600 hover:to-pink-600"
          >
            Log out
          </button>
        </div>
      )}
    </div>
  );
}

export default Navigation;