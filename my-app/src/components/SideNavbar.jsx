import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaStore, FaCog,  FaUserCircle,FaPlaneDeparture} from "react-icons/fa";
import ContactModal from "./ContactModel";

function Navbar() {
  const navigate = useNavigate();
  
  const [showContact, setShowContact] = useState(false);

  const navItems = [
     {
      icon: < FaUserCircle />,
      label: "Profile",
      onClick: () => navigate("/user/profile"),
    },
    {
     icon: <FaStore />,
      label: "Shops",
      onClick: () => navigate("/user/dashboard"),
    },
    {
      icon: <FaPlaneDeparture />,
      label: "Travel Locations",
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
      {/* Bottom Navbar - Fully Responsive */}
      <aside
        className="
          fixed bottom-4 left-1/2 transform -translate-x-1/2 
          bg-white/80 backdrop-blur-md border border-gray-200 shadow-xl 
          rounded-full 
          px-4 py-3 
          flex gap-3 
          sm:px-6 sm:py-4 sm:gap-4 
          md:px-8 md:py-5 md:gap-6 
          lg:px-10 lg:py-6 lg:gap-8 
          z-50"
      >
        {navItems.map((item, index) => (
          <button
            key={index}
            onClick={item.onClick}
            className="group relative"
            aria-label={item.label}
          >
            <div
              className="
                p-2 sm:p-3 md:p-3.5 lg:p-4
                bg-white rounded-full 
                hover:shadow-lg transition-all duration-300 group-hover:scale-110 
                border border-gray-300 hover:border-purple-500 hover:bg-purple-100"
            >
              <span
                className="
                  text-base sm:text-xl lg:text-2xl 
                  text-gray-600 group-hover:text-purple-600"
              >
                {item.icon}
              </span>
            </div>
            {/* Tooltip */}
            <span
              className="
                absolute -top-7 sm:-top-8 left-1/2 transform -translate-x-1/2 
                text-[10px] sm:text-xs md:text-sm 
                text-gray-700 bg-white px-2 py-1 rounded shadow 
                opacity-0 group-hover:opacity-100 transition duration-200 
                pointer-events-none"
            >
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
