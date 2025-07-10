import React from "react";
import {
  FaPlus,
  FaMapMarkerAlt,
  FaTags,
  FaBell,
  FaQuestionCircle,
  FaEnvelope,
  FaHome,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function TopNavigation({
  setShowAddPlaceModal,
  setShowAddCategoryModal,
  showAddMenu,
  setShowAddMenu,
}) {
  const navigate = useNavigate();

  return (
    <div className="w-full sticky top-0 z-50 bg-white py-2 border-b border-gray-200 shadow-sm">
      <div className="max-w-screen-lg mx-auto px-2 sm:px-4">
        <div className="flex justify-between items-center">
          {/* Brand / Title */}
         

          {/* Scrollable Icons */}
          <div className="flex items-center overflow-x-auto no-scrollbar gap-3 sm:gap-5 py-2 sm:py-3 px-1 sm:px-2">
            {/* Icon Button Template */}
            {[
              {
                icon: <FaHome size={20} />,
                label: "Home",
                action: () => navigate("/"),
                color: "border-purple-400",
              },
              {
                icon: <FaBell size={20} />,
                label: "Alerts",
                action: () => {},
                color: "border-pink-400",
                badge: 3,
              },
              {
                icon: <FaQuestionCircle size={20} />,
                label: "Guide",
                action: () => alert("Redirect to guide"),
                color: "border-blue-400",
              },
              {
                icon: <FaEnvelope size={20} />,
                label: "Contact",
                action: () => alert("Redirect to contact"),
                color: "border-green-400",
              },
            ].map((item, idx) => (
              <button
                key={idx}
                onClick={item.action}
                title={item.label}
                className="flex-shrink-0 flex flex-col items-center text-gray-700 hover:text-purple-600 transition transform hover:scale-105 relative"
              >
                <div className={`w-11 h-11 rounded-full border-2 ${item.color} p-2 flex items-center justify-center`}>
                  {item.icon}
                </div>
                <span className="text-[10px] sm:text-xs mt-1 font-medium">{item.label}</span>
                {item.badge && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] rounded-full px-1 leading-none">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}

            {/* Add Dropdown Button */}
            <div className="relative flex-shrink-0">
              <button
                onClick={() => setShowAddMenu(!showAddMenu)}
                className="flex flex-col items-center text-white transition transform hover:scale-105"
                title="Add New"
              >
                <div className="w-11 h-11 rounded-full bg-purple-600 hover:bg-purple-700 p-2 flex items-center justify-center">
                  <FaPlus size={20} />
                </div>
                <span className="text-[10px] sm:text-xs mt-1 font-medium text-purple-600">Add</span>
              </button>

              {/* Dropdown */}
              <AnimatePresence>
                {showAddMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-14 right-0 bg-white rounded-lg shadow-xl overflow-hidden z-50 w-48"
                  >
                    <button
                      onClick={() => {
                        setShowAddPlaceModal(true);
                        setShowAddMenu(false);
                      }}
                      className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <FaMapMarkerAlt className="text-purple-500" />
                      Add New Place
                    </button>
                    <button
                      onClick={() => {
                        setShowAddCategoryModal(true);
                        setShowAddMenu(false);
                      }}
                      className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2 border-t border-gray-100"
                    >
                      <FaTags className="text-purple-500" />
                      Add Category
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
