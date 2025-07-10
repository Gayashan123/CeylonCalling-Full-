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
} from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import TopNavigation from "../components/TopNavigation";
import SearchBar from "../components/SearchBar";
import AddPlace from "../components/AddPlace";
import AddCategory from "../components/AddLocationCategory";
import PlaceEdit from "../components/PlaceEdit";
import PlaceInsightsCard from "../components/PlaceInsightCard";
import axios from "axios";

const iosColors = [
  "bg-gradient-to-r from-[#ff9a9e] to-[#fad0c4]",
  "bg-gradient-to-r from-[#a18cd1] to-[#fbc2eb]",
  "bg-gradient-to-r from-[#fbc2eb] to-[#a6c1ee]",
  "bg-gradient-to-r from-[#fad0c4] to-[#ffd1ff]",
  "bg-gradient-to-r from-[#a1c4fd] to-[#c2e9fb]",
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

  const [openInsightsId, setOpenInsightsId] = useState(null); // New state for insights modal

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
    <div className="min-h-screen bg-gray-50 pb-30">
      {/* Top Navigation */}
      <TopNavigation
        setShowAddPlaceModal={setShowAddPlaceModal}
        setShowAddCategoryModal={setShowAddCategoryModal}
        showAddMenu={showAddMenu}
        setShowAddMenu={setShowAddMenu}
      />

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Category Filter */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                !selectedCategory
                  ? "bg-purple-600 text-white shadow-md"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              All
            </button>
            {categories.map((category, index) => (
              <div key={category._id} className="relative group">
                <button
                  onClick={() =>
                    setSelectedCategory(
                      selectedCategory === category._id ? null : category._id
                    )
                  }
                  className={`px-4 py-2 rounded-full text-sm font-medium text-white shadow-sm transition ${
                    iosColors[index % iosColors.length]
                  } ${
                    selectedCategory === category._id
                      ? "ring-2 ring-purple-500 ring-offset-2"
                      : ""
                  }`}
                >
                  {category.name}
                </button>
                <button
                  onClick={() => handleDeleteCategory(category._id)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition"
                  title="Delete category"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search places..."
            className="bg-white border border-gray-200 rounded-full px-4 py-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Places Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : filteredPlaces.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {searchTerm || selectedCategory
                ? "No places match your search criteria"
                : "You haven't added any places yet"}
            </p>
            <button
              onClick={() => setShowAddPlaceModal(true)}
              className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition"
            >
              Add Your First Place
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredPlaces.map((place) => (
                <motion.div
                  key={place._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={getDisplayImage(place.images?.[0])}
                      alt={place.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-800 mb-1">{place.title}</h3>
                    <p className="text-sm text-gray-600 mb-3 flex items-center">
                      <FaMapMarkerAlt className="mr-2 text-purple-500" />
                      {place.location}
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="flex flex-wrap gap-1">
                        {place.categories?.slice(0, 2).map((catId, idx) => {
                          const category = categories.find((c) => c._id === catId);
                          return category ? (
                            <span
                              key={catId}
                              className={`text-xs px-2 py-1 rounded-full text-white ${iosColors[idx % iosColors.length]}`}
                            >
                              {category.name}
                            </span>
                          ) : null;
                        })}
                        {place.categories?.length > 2 && (
                          <span className="text-xs px-2 py-1 rounded-full bg-gray-200 text-gray-700">
                            +{place.categories.length - 2}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingPlace(place)}
                          className="text-purple-600 hover:text-purple-800 p-2"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeletePlace(place._id)}
                          className="text-red-500 hover:text-red-700 p-2"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                        <button
                          onClick={() => setOpenInsightsId(place._id)}
                          className="text-blue-500 hover:text-blue-700 p-2"
                          title="View Insights"
                        >
                          📊
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showAddPlaceModal && (
          <motion.div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-white rounded-xl w-full max-w-md p-4 overflow-y-auto max-h-[90vh]"
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
              <div className="flex justify-between items-center border-b pb-2">
                <h3 className="text-lg font-bold">Add New Place</h3>
                <button onClick={() => setShowAddPlaceModal(false)}><IoMdClose size={24} /></button>
              </div>
              <AddPlace onClose={() => setShowAddPlaceModal(false)} onPlaceAdded={(newPlace) => {
                setPlaces((prev) => [...prev, newPlace]);
                setShowAddPlaceModal(false);
              }} />
            </motion.div>
          </motion.div>
        )}

        {showAddCategoryModal && (
          <motion.div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-white rounded-xl w-full max-w-md p-4"
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
              <div className="flex justify-between items-center border-b pb-2">
                <h3 className="text-lg font-bold">Add New Category</h3>
                <button onClick={() => setShowAddCategoryModal(false)}><IoMdClose size={24} /></button>
              </div>
              <AddCategory onClose={() => setShowAddCategoryModal(false)} onCategoryAdded={(newCat) => {
                setCategories((prev) => [...prev, newCat]);
                setShowAddCategoryModal(false);
              }} />
            </motion.div>
          </motion.div>
        )}

        {editingPlace && (
          <motion.div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-white rounded-xl w-full max-w-md p-4 overflow-y-auto max-h-[90vh]"
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
              <div className="flex justify-between items-center border-b pb-2">
                <h3 className="text-lg font-bold">Edit Place</h3>
                <button onClick={() => setEditingPlace(null)}><IoMdClose size={24} /></button>
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
          <motion.div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-white max-w-2xl w-full rounded-xl p-6 shadow-xl relative"
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
              <button onClick={() => setOpenInsightsId(null)} className="absolute top-2 right-2 text-gray-500 hover:text-red-500">
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
