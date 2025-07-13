import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSiteUserAuthStore } from "../store/siteUserAuthStore";
import { useNavigate } from "react-router-dom";
import {
  FaUserCircle,
  FaStore,
  FaCog,
  FaPlaneDeparture,
  FaHome,
  FaPlus,
  FaMapMarkerAlt,
  FaTags,
  FaEdit,
  FaTrash,
  FaChartLine,
} from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import TopNavigation from "../components/TopNavigation";
import SearchBar from "../components/SearchBar";
import AddPlace from "../components/AddPlace";
import AddCategory from "../components/AddLocationCategory";
import PlaceEdit from "../components/PlaceEdit";
import PlaceInsightsCard from "../components/PlaceInsightCard";
import axios from "axios";

const categoryColors = [
  "bg-gradient-to-r from-indigo-500 to-purple-600",
  "bg-gradient-to-r from-pink-500 to-rose-500",
  "bg-gradient-to-r from-amber-500 to-orange-500",
  "bg-gradient-to-r from-emerald-500 to-teal-600",
  "bg-gradient-to-r from-blue-500 to-cyan-500",
  "bg-gradient-to-r from-violet-500 to-fuchsia-500",
  "bg-gradient-to-r from-sky-500 to-blue-500",
];

const getDisplayImage = (photo) => {
  if (!photo) return "https://via.placeholder.com/600x300?text=No+Image";
  if (photo.startsWith("http://") || photo.startsWith("https://")) return photo;
  if (photo.startsWith("/uploads")) return `http://localhost:5000${photo}`;
  if (photo.startsWith("uploads")) return `http://localhost:5000/${photo}`;
  return photo;
};

export default function ProfileUserPage() {
  const user = useSiteUserAuthStore((state) => state.user);
  const navigate = useNavigate();

  const [places, setPlaces] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editingPlace, setEditingPlace] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showAddPlaceModal, setShowAddPlaceModal] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [openInsightsId, setOpenInsightsId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [placesRes, categoriesRes] = await Promise.all([
          axios.get("/api/place", { withCredentials: true }),
          axios.get("/api/placecat", { withCredentials: true }),
        ]);
        setPlaces(placesRes.data?.data || placesRes.data || []);
        setCategories(categoriesRes.data?.data || categoriesRes.data || []);
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDeletePlace = async (placeId) => {
    if (window.confirm("Are you sure you want to delete this place?")) {
      try {
        await axios.delete(`/api/place/${placeId}`, { withCredentials: true });
        setPlaces(prev => prev.filter(place => place._id !== placeId));
      } catch (error) {
        console.error("Failed to delete place:", error);
      }
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await axios.delete(`/api/placecat/${categoryId}`, { withCredentials: true });
        setCategories(prev => prev.filter(cat => cat._id !== categoryId));
      } catch (error) {
        console.error("Failed to delete category:", error);
      }
    }
  };

  const filteredPlaces = places.filter((place) => {
    const matchSearch =
      place.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      place.location?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchCategory =
      !selectedCategory ||
      place.categories?.includes(selectedCategory) ||
      place.categories?.some(
        (cat) => cat._id === selectedCategory || cat.name === selectedCategory
      );

    return matchSearch && matchCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-20">
      {/* Top Navigation */}
      <TopNavigation
        setShowAddPlaceModal={setShowAddPlaceModal}
        setShowAddCategoryModal={setShowAddCategoryModal}
        showAddMenu={showAddMenu}
        setShowAddMenu={setShowAddMenu}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Places Collection</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Manage all your favorite places and categories in one place
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-md shadow-black p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="w-full md:w-1/3">
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search places by name or location..."
                className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex-1">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    !selectedCategory
                      ? "bg-purple-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All Places
                </button>
                {categories.map((category, index) => (
                  <div key={category._id} className="relative group">
                    <button
                      onClick={() =>
                        setSelectedCategory(
                          selectedCategory === category._id ? null : category._id
                        )
                      }
                      className={`px-4 py-2 rounded-lg text-sm font-medium text-white shadow-sm transition-all ${
                        categoryColors[index % categoryColors.length]
                      } ${
                        selectedCategory === category._id
                          ? "ring-2 ring-white ring-offset-2 transform scale-105"
                          : "hover:scale-105"
                      }`}
                    >
                      {category.name}
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category._id)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-all shadow-sm hover:scale-110"
                      title="Delete category"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : filteredPlaces.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaMapMarkerAlt className="text-purple-500 text-3xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {searchTerm || selectedCategory
                  ? "No matching places found"
                  : "Your places collection is empty"}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || selectedCategory
                  ? "Try adjusting your search or filter criteria"
                  : "Start by adding your first place"}
              </p>
              <button
                onClick={() => setShowAddPlaceModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all transform hover:-translate-y-0.5"
              >
                <FaPlus className="inline mr-2" />
                Add New Place
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {filteredPlaces.map((place) => (
                <motion.div
                  key={place._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-300 shadow-md shadow-black rounded-xl overflow-hidden  hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative h-48 overflow-hidden group">
                    <img
                      src={getDisplayImage(place.images?.[0])}
                      alt={place.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <div className="absolute top-3 right-3 flex gap-2">
                      <button
                        onClick={() => setEditingPlace(place)}
                        className="bg-white/90 text-gray-800 p-2 rounded-full hover:bg-white transition-all hover:scale-110 shadow-sm"
                        title="Edit"
                      >
                        <FaEdit size={14} />
                      </button>
                      <button
                        onClick={() => handleDeletePlace(place._id)}
                        className="bg-white/90 text-red-500 p-2 rounded-full hover:bg-white transition-all hover:scale-110 shadow-sm"
                        title="Delete"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-bold text-gray-800 line-clamp-1">{place.title}</h3>
                      <button
                        onClick={() => setOpenInsightsId(place._id)}
                        className="text-purple-600 hover:text-purple-800 p-1 hover:scale-110 transition-all"
                        title="View Insights"
                      >
                        <FaChartLine size={16} />
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 mb-4 flex items-center">
                      <FaMapMarkerAlt className="mr-2 text-purple-500 flex-shrink-0" />
                      <span className="line-clamp-1">{place.location}</span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {place.categories?.slice(0, 3).map((catId, idx) => {
                        const category = categories.find((c) => c._id === catId);
                        return category ? (
                          <span
                            key={catId}
                            className={`text-xs px-3 py-1 rounded-full text-white ${categoryColors[idx % categoryColors.length]}`}
                          >
                            {category.name}
                          </span>
                        ) : null;
                      })}
                      {place.categories?.length > 3 && (
                        <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                          +{place.categories.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Floating Add Button */}
      <div className="fixed bottom-6 right-6 z-30">
        <button
          onClick={() => setShowAddMenu(!showAddMenu)}
          className="w-14 h-14 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-all transform hover:scale-110"
        >
          <FaPlus size={20} />
        </button>
        <AnimatePresence>
          {showAddMenu && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/30 z-20"
                onClick={() => setShowAddMenu(false)}
              />
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 20 }}
                transition={{ type: "spring", bounce: 0.4 }}
                className="absolute bottom-20 right-0 bg-white rounded-xl shadow-xl overflow-hidden z-30"
              >
                <button
                  onClick={() => {
                    setShowAddPlaceModal(true);
                    setShowAddMenu(false);
                  }}
                  className="flex items-center px-6 py-3 hover:bg-gray-50 w-full text-left"
                >
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <FaMapMarkerAlt className="text-purple-600" size={12} />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Add Place</div>
                    <div className="text-xs text-gray-500">Add a new location</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setShowAddCategoryModal(true);
                    setShowAddMenu(false);
                  }}
                  className="flex items-center px-6 py-3 hover:bg-gray-50 w-full text-left border-t border-gray-100"
                >
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                    <FaTags className="text-indigo-600" size={12} />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Add Category</div>
                    <div className="text-xs text-gray-500">Create a new category</div>
                  </div>
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showAddPlaceModal && (
          <motion.div 
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-2xl w-full max-w-2xl p-6 overflow-y-auto max-h-[90vh] shadow-2xl"
              initial={{ scale: 0.95, y: 20 }} 
              animate={{ scale: 1, y: 0 }} 
              exit={{ scale: 0.95, y: 20 }}
            >
              <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Add New Place</h3>
                <button 
                  onClick={() => setShowAddPlaceModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                >
                  <IoMdClose size={24} />
                </button>
              </div>
              <AddPlace 
                onClose={() => setShowAddPlaceModal(false)} 
                onPlaceAdded={(newPlace) => {
                  setPlaces((prev) => [...prev, newPlace]);
                  setShowAddPlaceModal(false);
                }} 
              />
            </motion.div>
          </motion.div>
        )}

        {showAddCategoryModal && (
          <motion.div 
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl"
              initial={{ scale: 0.95, y: 20 }} 
              animate={{ scale: 1, y: 0 }} 
              exit={{ scale: 0.95, y: 20 }}
            >
              <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Create New Category</h3>
                <button 
                  onClick={() => setShowAddCategoryModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                >
                  <IoMdClose size={24} />
                </button>
              </div>
              <AddCategory 
                onClose={() => setShowAddCategoryModal(false)} 
                onCategoryAdded={(newCat) => {
                  setCategories((prev) => [...prev, newCat]);
                  setShowAddCategoryModal(false);
                }} 
              />
            </motion.div>
          </motion.div>
        )}

        {editingPlace && (
          <motion.div 
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-2xl w-full max-w-2xl p-6 overflow-y-auto max-h-[90vh] shadow-2xl"
              initial={{ scale: 0.95, y: 20 }} 
              animate={{ scale: 1, y: 0 }} 
              exit={{ scale: 0.95, y: 20 }}
            >
              <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Edit Place</h3>
                <button 
                  onClick={() => setEditingPlace(null)}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                >
                  <IoMdClose size={24} />
                </button>
              </div>
              <PlaceEdit
                place={editingPlace}
                categories={categories}
                onClose={() => setEditingPlace(null)}
                onPlaceUpdated={(updatedPlace) => {
                  setPlaces((prev) =>
                    prev.map((p) => (p._id === updatedPlace._id ? updatedPlace : p))
                  );
                  setEditingPlace(null);
                }}
              />
            </motion.div>
          </motion.div>
        )}

        {openInsightsId && (
          <motion.div 
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white max-w-4xl w-full rounded-2xl p-8 shadow-2xl relative"
              initial={{ scale: 0.95, y: 20 }} 
              animate={{ scale: 1, y: 0 }} 
              exit={{ scale: 0.95, y: 20 }}
            >
              <button 
                onClick={() => setOpenInsightsId(null)} 
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
              >
                <IoMdClose size={24} />
              </button>
              <PlaceInsightsCard
                place={places.find(p => p._id === openInsightsId)}
                categories={categories}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}