import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  FaHome,
  FaCog,
  FaHeart,
  FaFilter,
  FaLocationArrow,
} from "react-icons/fa";
import { Link } from "react-scroll";

import FavoritesModal from "./AddCart";
import ContactModal from "./ContactModel";

function Navbar() {
  const navigate = useNavigate();
  const [showFavorites, setShowFavorites] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const favoriteRestaurants = [
    { name: "Upali's by Nawaloka" },
    { name: "Chooti Restaurant" },
    { name: "The Curry Leaf" },
  ];

  const navItems = [
    {
      icon: <FaHome />,
      label: "Home",
      onClick: () => navigate("/"),
    },
    {
      icon: <FaHeart />,
      label: "Favorites",
      onClick: () => setShowFavorites(true),
    },
    {
      icon: <FaFilter />,
      label: "Filter",
      link: "filter",
    },
    {
      icon: <FaLocationArrow />,
      label: "Contact",
      onClick: () => setShowContact(true),
    },
    {
      icon: <FaCog />,
      label: "Settings",
      onClick: () => navigate("/usersetting"),
    },
  ];

  return (
    <>
      {/* Bottom Navbar */}
      <aside className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white/70 backdrop-blur-lg border border-gray-200 shadow-2xl rounded-full px-6 py-4 z-50 flex gap-4 md:gap-6 lg:gap-8">
        {navItems.map((item, index) =>
          item.link ? (
            <Link
              key={index}
              to={item.link}
              smooth
              duration={500}
              spy
              offset={-80}
              className="group relative"
              aria-label={item.label}
            >
              <div className="p-3 bg-white rounded-full hover:shadow-xl transition-all duration-300 group-hover:scale-110 border border-gray-300 hover:border-purple-500 hover:bg-purple-50">
                <span className="text-gray-600 group-hover:text-purple-600 text-xl">
                  {item.icon}
                </span>
              </div>
              <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-sm text-gray-700 bg-white px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition duration-200 pointer-events-none">
                {item.label}
              </span>
            </Link>
          ) : (
            <button
              key={index}
              onClick={item.onClick}
              className="group relative"
              aria-label={item.label}
            >
              <div className="p-3 bg-white rounded-full hover:shadow-xl transition-all duration-300 group-hover:scale-110 border border-gray-300 hover:border-purple-500 hover:bg-purple-50">
                <span className="text-gray-600 group-hover:text-purple-600 text-xl">
                  {item.icon}
                </span>
              </div>
              <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-sm text-gray-700 bg-white px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition duration-200 pointer-events-none">
                {item.label}
              </span>
            </button>
          )
        )}
      </aside>

      {/* Modals */}
      {showFavorites && (
        <FavoritesModal
          favorites={favoriteRestaurants}
          onClose={() => setShowFavorites(false)}
        />
      )}

      {showContact && <ContactModal onClose={() => setShowContact(false)} />}

      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Settings</h2>
            <button
              onClick={() => setShowSettings(false)}
              className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
