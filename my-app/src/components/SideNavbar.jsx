import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaHome, FaCog, FaHeart, FaLocationArrow } from "react-icons/fa";


import ContactModal from "./ContactModel";

function Navbar() {
  const navigate = useNavigate();
  const [showFavorites, setShowFavorites] = useState(false);
  const [showContact, setShowContact] = useState(false);

 

  const navItems = [
    {
      icon: <FaHome />,
      label: "Home",
      onClick: () => navigate("/user/dashboard"),
    },
    {
      icon: <FaHeart />,
      label: "Favorites",
      onClick: () => setShowFavorites(true),
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
        {navItems.map((item, index) => (
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
        ))}
      </aside>

    

      {showContact && <ContactModal onClose={() => setShowContact(false)} />}
    </>
  );
}

export default Navbar;
