import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { FiSearch, FiMapPin, FiMap, FiShoppingBag } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useSiteUserAuthStore } from '../store/siteUserAuthStore';

function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useSiteUserAuthStore();
  const navigate = useNavigate();

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

  const goToHome = () => navigate('/');
  const goToShop = () => navigate('/my-shop');
  const goToPlaces = () => navigate('/user/profile');

  const getInitials = (nameOrEmail) => {
    if (!nameOrEmail) return "U";
    const parts = nameOrEmail.trim().split(/\s+/);
    return parts.length === 1
      ? parts[0][0].toUpperCase()
      : parts[0][0].toUpperCase() + parts[1][0].toUpperCase();
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm">
      <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="text-2xl font-bold text-blue-700 cursor-pointer" onClick={goToHome}>
          Ceylon Calling
        </div>

        {/* Search (Desktop only) */}
        <div className="hidden lg:block w-full max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Search city, postal code..."
              className="w-full pl-10 pr-32 py-2 rounded-full bg-gray-100 text-sm outline-none"
            />
            <FiSearch className="absolute top-2.5 left-3 text-gray-500" />
            <button
              onClick={handleGetLocation}
              className="absolute right-2 top-1 bg-blue-700 text-white px-4 py-1.5 text-xs rounded-full flex items-center gap-1 hover:bg-blue-800 transition"
            >
              <FiMapPin /> Location
            </button>
          </div>
        </div>

        {/* Right side: Icons + Avatar + Menu */}
        <div className="flex items-center gap-4">
          

          

          {/* Mobile Menu Icon */}
          <div className="md:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-2xl text-gray-800">
              {menuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="block md:hidden px-4 py-3 bg-white border-t space-y-3">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search city, postal code..."
              className="w-full pl-10 pr-32 py-2 rounded-full bg-gray-100 text-sm outline-none"
            />
            <FiSearch className="absolute top-2.5 left-3 text-gray-500" />
            <button
              onClick={handleGetLocation}
              className="absolute right-2 top-1 bg-blue-700 text-white px-3 py-1.5 text-xs rounded-full flex items-center gap-1 hover:bg-blue-800 transition"
            >
              <FiMapPin /> Location
            </button>
          </div>

          

          {/* User Info */}
          
        </div>
      )}
    </header>
  );
}

export default Navigation;
