import React, { useState } from "react";
import { FaHome, FaUtensils, FaCog, FaPlus, FaStore, FaTags } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';

import AddFoodItem from "./AddFoodIte";
import AddCategory from "./AddCategory";

function Navbar({ onOpenSettings, onViewAllFoods }) {
  const [showShopForm, setShowShopForm] = useState(false);
  const [showAddFood, setShowAddFood] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();

  const handleAddCategory = (newCategory) => {
    setCategories((prev) => [...prev, newCategory]);
  };

  return (
    <>
      <aside className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-[95%] max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl bg-white shadow-xl rounded-3xl px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center z-50 border border-gray-200">
        {/* Home */}
         <button
          onClick={() => navigate("/shop")}
          className="group relative flex flex-col items-center justify-center gap-1 text-gray-600 hover:text-purple-600 transition cursor-pointer"
          aria-label="Home"
          type="button"
        >
          <FaHome className="text-xl sm:text-2xl" />
          <span className="tooltip">Home</span>
        </button>

        {/* My Shop */}
        <button
          onClick={() => navigate("/myshop")}
          className="group relative flex flex-col items-center justify-center gap-1 text-gray-600 hover:text-purple-600 transition cursor-pointer"
          aria-label="My Shop"
          type="button"
        >
          <FaStore className="text-xl sm:text-2xl" />
          <span className="tooltip">My Shop</span>
        </button>

        {/* Floating Add (+) */}
        <div className="relative">
          <button
            onClick={() => setShowAddMenu(!showAddMenu)}
            className="w-14 h-14 bg-purple-600 hover:bg-purple-700 text-white rounded-full flex items-center justify-center shadow-lg border-4 border-white -mt-10 transition"
            aria-label="Add Menu"
            type="button"
          >
            <FaPlus className="text-2xl" />
          </button>

          {showAddMenu && (
            <div
              className="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-white shadow-xl rounded-xl p-3 flex flex-col gap-2 z-50 w-44"
              role="menu"
              aria-label="Add Menu Options"
            >
              
              <button
                onClick={() => {
                  setShowAddFood(true);
                  setShowAddMenu(false);
                }}
                className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-md text-sm text-gray-700 transition"
                type="button"
                role="menuitem"
              >
                <FaUtensils /> Add Food
              </button>
              <button
                onClick={() => {
                  setShowAddCategory(true);
                  setShowAddMenu(false);
                }}
                className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-md text-sm text-gray-700 transition"
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
          onClick={() => navigate("/settings")}
          className="group relative flex flex-col items-center justify-center gap-1 text-gray-600 hover:text-purple-600 transition cursor-pointer"
          aria-label="Settings"
          type="button"
        >
          <FaCog className="text-xl sm:text-2xl" />
          <span className="tooltip">Settings</span>
        </button>
      </aside>

      {/* Modals */}
      {showShopForm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 px-4 sm:px-6">
          <ShopForm onClose={() => setShowShopForm(false)} />
        </div>
      )}

      {showAddFood && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 px-4 sm:px-6">
          <AddFoodItem onClose={() => setShowAddFood(false)} />
        </div>
      )}

      {showAddCategory && (
        <AddCategory
          onClose={() => setShowAddCategory(false)}
          onAddCategory={handleAddCategory}
        />
      )}
    </>
  );
}

export default Navbar;
