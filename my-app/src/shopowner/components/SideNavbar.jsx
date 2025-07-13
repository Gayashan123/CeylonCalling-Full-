import React, { useState } from "react";
import {
  FaHome,
  FaUtensils,
  FaCog,
  FaStore,
  FaTags,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AddFoodItem from "./AddFoodIte";
import AddCategory from "./AddCategory";

function TopNavbar() {
  const [showAddFood, setShowAddFood] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);

  const navigate = useNavigate();

  const handleAddCategory = (newCategory) => {
    console.log("Category Added: ", newCategory);
  };

  // Button data for easy mapping
  const buttons = [
    {
      label: "Home",
      icon: <FaHome />,
      onClick: () => navigate("/shop"),
      bgColor: "bg-purple-100",
      textColor: "text-purple-700",
      hoverBg: "hover:bg-purple-200",
    },
    {
      label: "My Shop",
      icon: <FaStore />,
      onClick: () => navigate("/myshop"),
      bgColor: "bg-purple-100",
      textColor: "text-purple-700",
      hoverBg: "hover:bg-purple-200",
    },
    {
      label: "Add Food",
      icon: <FaUtensils />,
      onClick: () => setShowAddFood(true),
      bgColor: "bg-teal-100",
      textColor: "text-teal-700",
      hoverBg: "hover:bg-teal-200",
    },
    {
      label: "Add Category",
      icon: <FaTags />,
      onClick: () => setShowAddCategory(true),
      bgColor: "bg-teal-100",
      textColor: "text-teal-700",
      hoverBg: "hover:bg-teal-200",
    },
    {
      label: "Settings",
      icon: <FaCog />,
      onClick: () => navigate("/settings"),
      bgColor: "bg-gray-100",
      textColor: "text-gray-700",
      hoverBg: "hover:bg-gray-200",
    },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Brand Name */}
            <div className="flex-shrink-0 text-purple-700 font-bold text-xl sm:text-2xl tracking-wide select-none">
              Ceylon Calling
            </div>

            {/* Scrollable Buttons */}
            <div className="flex-1 overflow-x-auto scrollbar-hide">
              <div className="flex space-x-3 sm:space-x-5 py-2">
                {buttons.map(({ label, icon, onClick, bgColor, textColor, hoverBg }) => (
                  <button
                    key={label}
                    onClick={onClick}
                    className={`flex items-center gap-2 whitespace-nowrap px-4 py-2 rounded-full font-semibold text-sm sm:text-base transition ${bgColor} ${textColor} ${hoverBg} focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-purple-400`}
                    aria-label={label}
                    type="button"
                  >
                    <span className="text-lg sm:text-xl">{icon}</span>
                    <span className="hidden sm:inline">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Modals */}
      {showAddFood && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4 sm:px-6">
          <AddFoodItem onClose={() => setShowAddFood(false)} />
        </div>
      )}

      {showAddCategory && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4 sm:px-6">
          <AddCategory
            onClose={() => setShowAddCategory(false)}
            onAddCategory={handleAddCategory}
          />
        </div>
      )}
    </>
  );
}

export default TopNavbar;
