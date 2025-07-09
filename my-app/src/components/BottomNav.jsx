import { useState } from "react";
import {
  FaPlus,
  FaCompass,
  FaUser,
  FaMapMarkerAlt,
  FaTags,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import AddPlace from "./AddPlace";
import AddCategory from "./AddLocationCategory";

function BottomNav() {
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showAddPlaceModal, setShowAddPlaceModal] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);

  const navigate = useNavigate();

  return (
    <>
      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-lg border-t border-gray-200">
        <div className="relative flex justify-around items-center max-w-md mx-auto py-3 px-6">
          {/* Explore Icon */}
          <button
            onClick={() => navigate("/user/explore")}
            className="text-gray-600 hover:text-purple-600 transition-all duration-200"
          >
            <FaCompass size={22} />
          </button>

          {/* Floating Plus Button */}
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
            <button
              onClick={() => setShowAddMenu((prev) => !prev)}
              className="w-16 h-16 bg-purple-600 hover:bg-purple-700 text-white rounded-full flex items-center justify-center shadow-xl border-4 border-white transition"
              type="button"
              aria-label="Add"
            >
              <FaPlus size={24} />
            </button>

            {/* Add Menu */}
            <AnimatePresence>
              {showAddMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="absolute -top-36 left-1/2 transform -translate-x-1/2 w-44 bg-white rounded-xl shadow-lg p-3 flex flex-col gap-2 z-50"
                >
                  <button
                    onClick={() => {
                      setShowAddPlaceModal(true);
                      setShowAddMenu(false);
                    }}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-800 hover:bg-gray-100 rounded-md transition"
                  >
                    <FaMapMarkerAlt /> Add Place
                  </button>
                  <button
                    onClick={() => {
                      setShowAddCategoryModal(true);
                      setShowAddMenu(false);
                    }}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-800 hover:bg-gray-100 rounded-md transition"
                  >
                    <FaTags /> Add Category
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile Icon */}
          <button
            onClick={() => navigate("/user/profile")}
            className="text-gray-600 hover:text-purple-600 transition-all duration-200"
          >
            <FaUser size={22} />
          </button>
        </div>
      </nav>

      {/* Modals */}
      <AnimatePresence>
        {showAddPlaceModal && (
          <AddPlace onClose={() => setShowAddPlaceModal(false)} />
        )}
        {showAddCategoryModal && (
          <AddCategory onClose={() => setShowAddCategoryModal(false)} />
        )}
      </AnimatePresence>
    </>
  );
}

export default BottomNav;
