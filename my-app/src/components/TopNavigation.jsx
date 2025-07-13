import React from "react";
import {
  FaMapMarkerAlt,
  FaTags,
  FaPlaneDeparture,
  FaStore,
  FaHome,
  FaCog,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function TopNavigation({
  setShowAddPlaceModal,
  setShowAddCategoryModal,
}) {
  const navigate = useNavigate();

  const navItems = [
    {
      icon: <FaHome size={20} />,
      label: "Home",
      onClick: () => navigate("/"),
      color: "border-purple-400 text-purple-500",
    },
    {
      icon: <FaMapMarkerAlt size={20} />,
      label: "Add Place",
      onClick: () => setShowAddPlaceModal(true),
      color: "border-green-400 text-green-500",
    },
    {
      icon: <FaTags size={20} />,
      label: "Add Category",
      onClick: () => setShowAddCategoryModal(true),
      color: "border-blue-400 text-blue-500",
    },
    {
      icon: <FaPlaneDeparture size={20} />,
      label: "Travel",
      onClick: () => navigate("/user/placepage"),
      color: "border-pink-400 text-pink-500",
    },
    {
      icon: <FaStore size={20} />,
      label: "Shop",
      onClick: () => navigate("/user/dashboard"),
      color: "border-yellow-400 text-yellow-500",
    },
    {
      icon: <FaCog size={20} />,
      label: "Settings",
      onClick: () => navigate("/usersettings"),
      color: "border-gray-400 text-gray-500",
    },
  ];

  return (
    <div className="w-full sticky top-0 z-50 bg-white py-2 border-b border-gray-200 shadow-sm pb-1">
      <div className="max-w-screen-lg mx-auto px-2 sm:px-4">
        <div className="flex justify-between items-center">
          {/* Brand */}
          <h1 className="text-xl font-bold text-blue-500 tracking-wide">Ceylon Calling</h1>

          {/* Navigation Icons */}
          <div className="flex items-center gap-3 sm:gap-5 overflow-x-auto scrollbar-hide px-1 sm:px-2 py-2">
            {navItems.map((item, idx) => (
              <button
                key={idx}
                onClick={item.onClick}
                title={item.label}
                className={`flex-shrink-0 flex flex-col items-center hover:text-purple-600 transition transform hover:scale-105 relative ${item.color}`}
              >
                <div
                  className={`w-11 h-11 rounded-full border-2 ${item.color} p-2 flex items-center justify-center`}
                >
                  {item.icon}
                </div>
                <span className="text-[10px] sm:text-xs mt-1 font-medium text-gray-600">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
