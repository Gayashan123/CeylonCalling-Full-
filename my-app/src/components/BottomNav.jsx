import React, { useState } from "react";
import { FaHome, FaUtensils, FaCog, FaPlus, FaStore, FaTags } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from "framer-motion";

import AddPlace from "./AddPlace"; // Make sure this component exists
import AddCategory from "./AddLocationCategory"; // Make sure this component exists

function Navbar({ onOpenSettings, onViewAllFoods }) {
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showAddPlaceModal, setShowAddPlaceModal] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();

  const handleAddCategory = (newCategory) => {
    setCategories((prev) => [...prev, newCategory]);
    setShowAddCategoryModal(false);
  };

  const handleAddPlace = () => {
    setShowAddPlaceModal(false);
  };

  return (
    <>
      <aside className="fixed bottom-3 sm:bottom-4 left-1/2 transform -translate-x-1/2 w-[98%] max-w-xs sm:max-w-md md:max-w-xl lg:max-w-2xl bg-white shadow-xl rounded-3xl px-2 sm:px-6 py-2 sm:py-4 flex justify-between items-center z-40 border border-gray-200">
        {/* Home */}
        <button
          onClick={() => navigate("/user/dashboard")}
          className="group relative flex flex-col items-center justify-center gap-0.5 sm:gap-1 text-gray-600 hover:text-purple-600 transition cursor-pointer text-xs sm:text-sm lowercase sm:normal-case"
          aria-label="Home"
          type="button"
        >
          <FaHome className="text-lg sm:text-xl" />
          <span className="tooltip">home</span>
        </button>

        {/* Floating Add (+) */}
        <div className="relative">
          <button
            onClick={() => setShowAddMenu(!showAddMenu)}
            className="w-12 h-12 sm:w-14 sm:h-14 bg-purple-600 hover:bg-purple-700 text-white rounded-full flex items-center justify-center shadow-lg border-4 border-white -mt-8 sm:-mt-10 transition"
            aria-label="Add Menu"
            type="button"
          >
            <FaPlus className="text-xl sm:text-2xl" />
          </button>

          {showAddMenu && (
            <div
              className="absolute bottom-14 sm:bottom-16 left-1/2 transform -translate-x-1/2 bg-white shadow-xl rounded-xl p-2 sm:p-3 flex flex-col gap-1.5 sm:gap-2 z-50 w-36 sm:w-44"
              role="menu"
              aria-label="Add Menu Options"
            >
              <button
                onClick={() => {
                  setShowAddPlaceModal(true);
                  setShowAddMenu(false);
                }}
                className="flex items-center gap-2 hover:bg-gray-100 px-3 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm text-gray-700 transition lowercase sm:normal-case"
                type="button"
                role="menuitem"
              >
                <FaUtensils /> Add Place
              </button>
              <button
                onClick={() => {
                  setShowAddCategoryModal(true);
                  setShowAddMenu(false);
                }}
                className="flex items-center gap-2 hover:bg-gray-100 px-3 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm text-gray-700 transition lowercase sm:normal-case"
                type="button"
                role="menuitem"
              >
                <FaTags /> Add Category
              </button>
            </div>
          )}
        </div>

        {/* Settings */}
        <button
          onClick={() => navigate("/user/settings")}
          className="group relative flex flex-col items-center justify-center gap-0.5 sm:gap-1 text-gray-600 hover:text-purple-600 transition cursor-pointer text-xs sm:text-sm lowercase sm:normal-case"
          aria-label="Settings"
          type="button"
        >
          <FaCog className="text-lg sm:text-xl" />
          <span className="tooltip">settings</span>
        </button>
      </aside>

      {/* Modals */}
      <AnimatePresence>
        {showAddPlaceModal && (
          <AddPlace 
            onClose={() => setShowAddPlaceModal(false)}
            onAddPlace={handleAddPlace}
          />
        )}

        {showAddCategoryModal && (
          <AddCategory
            onClose={() => setShowAddCategoryModal(false)}
            onAddCategory={handleAddCategory}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;