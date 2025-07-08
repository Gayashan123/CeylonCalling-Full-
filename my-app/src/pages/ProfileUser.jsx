import React, { useState, useEffect } from "react";
import { useSiteUserAuthStore } from "../store/siteUserAuthStore";
import { FaEdit, FaSearch, FaTrash, FaSyncAlt } from "react-icons/fa";
import Navigation from "../components/BottomNav";
import { motion, AnimatePresence } from "framer-motion";
import EditPlaceModal from "../components/PlaceEdit";

const getDisplayImage = (photo) => {
  if (!photo) return "https://via.placeholder.com/600x300?text=No+Image";
  if (photo.startsWith("http://") || photo.startsWith("https://")) return photo;
  if (photo.startsWith("/uploads")) return photo;
  if (photo.startsWith("uploads")) return "/" + photo;
  return photo;
};

const ProfileUser = () => {
  const user = useSiteUserAuthStore((state) => state.user);
  const isLoadingUser = useSiteUserAuthStore((state) => state.isLoading);

  const [categories, setCategories] = useState([]);
  const [places, setPlaces] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingPlace, setEditingPlace] = useState(null);

  const placesPerPage = 6;

  // Fetch categories and places
  const fetchAllData = async () => {
    setLoading(true);
    setError("");
    try {
      const [categoriesRes, placesRes] = await Promise.all([
        fetch("/api/placecat", { credentials: "include" }),
        fetch("/api/place", { credentials: "include" }),
      ]);
      const categoriesData = await categoriesRes.json();
      const placesData = await placesRes.json();
      setCategories(categoriesData?.data || categoriesData); // support both {data:[]} and []
      setPlaces(placesData?.data || placesData);
    } catch {
      setError("Failed to load data. Please try again.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAllData();
    // eslint-disable-next-line
  }, []);

  const handleUpdatePlace = (updatedPlace) => {
    setPlaces((prev) =>
      prev.map((p) => (p._id === updatedPlace._id ? updatedPlace : p))
    );
    setEditingPlace(null);
  };

  if (isLoadingUser || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 text-xs sm:text-xl font-medium lowercase sm:normal-case">
        loading your places...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 text-xs sm:text-xl font-medium lowercase sm:normal-case">
        {error}
      </div>
    );
  }

  // Get all category names from backend
  const allCategoryNames = Array.from(new Set(categories.map((c) => c.name)));
  const filteredPlaces = places.filter(
    (place) =>
      (selectedCategory === "All" ||
        (place.categories &&
          Array.isArray(place.categories) &&
          place.categories.some((cat) => cat.name === selectedCategory))) &&
      (place.title || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const indexOfLast = currentPage * placesPerPage;
  const indexOfFirst = indexOfLast - placesPerPage;
  const currentPlaces = filteredPlaces.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredPlaces.length / placesPerPage);

  const handleDeletePlace = async (id) => {
    if (!window.confirm("Are you sure you want to delete this place?")) return;
    try {
      const res = await fetch(`/api/place/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Delete failed");
      setPlaces((prev) => prev.filter((p) => p._id !== id));
      if (editingPlace && editingPlace._id === id) setEditingPlace(null);
    } catch {
      alert("Failed to delete place.");
    }
  };

  const handleDeleteCategory = async (categoryName) => {
    if (
      !window.confirm(
        `Are you sure you want to delete the category "${categoryName}"? This will remove the category from all places.`
      )
    )
      return;
    try {
      const categoryObj = categories.find((c) => c.name === categoryName);
      if (!categoryObj) throw new Error("Category not found");

      const res = await fetch(`/api/placecat/${categoryObj._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Delete failed");

      setCategories((prev) => prev.filter((c) => c._id !== categoryObj._id));
      setPlaces((prev) =>
        prev.map((p) => ({
          ...p,
          categories: Array.isArray(p.categories)
            ? p.categories.filter((cat) => cat.name !== categoryName)
            : [],
        }))
      );
      if (selectedCategory === categoryName) setSelectedCategory("All");
    } catch {
      alert("Failed to delete category.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7f8fa] to-[#eef1f6] text-[#1f2937]">
      <div className="max-w-6xl mx-auto px-2 sm:px-6 py-8">
        <motion.div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
          <div className="relative bg-white/60 backdrop-blur-md border border-gray-200 rounded-2xl shadow-lg px-4 py-3 sm:px-6 sm:py-4 flex items-center gap-4 group transition hover:shadow-2xl">
            <div className="relative">
              <img
                src={
                  user?.photo ||
                  "https://ui-avatars.com/api/?name=" +
                    encodeURIComponent(user?.name || user?.username || "User")
                }
                alt="User"
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-4 border-white shadow-md group-hover:scale-105 transition"
              />
            </div>
            <div>
              <h1 className="text-lg sm:text-2xl font-bold tracking-tight lowercase sm:normal-case text-gray-800">
                {user?.name || user?.username || "My Places"}
              </h1>
              {/* Optional tagline */}
              <span className="block text-xs sm:text-sm text-gray-500 mt-1 italic">
                welcome to your dashboard
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            {/* Refresh Button */}
            <button
              onClick={fetchAllData}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-200 text-xs sm:text-base text-gray-700 hover:bg-gray-300 transition lowercase sm:normal-case"
            >
              <FaSyncAlt className={loading ? "animate-spin" : ""} /> {loading ? "refreshing..." : "refresh"}
            </button>
          </div>
        </motion.div>

        {/* Search & Filters */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-100 p-4 sm:p-7 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Bar */}
            <div className="relative w-full md:w-1/3">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <FaSearch className="text-base sm:text-lg" />
              </span>
              <input
                type="text"
                placeholder="Search places…"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-11 pr-4 py-2.5 w-full rounded-xl border border-gray-200 bg-gray-50/60 shadow-inner text-xs sm:text-base lowercase sm:normal-case placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                style={{ WebkitBackdropFilter: "blur(8px)" }}
              />
            </div>
            {/* Category Pills */}
            <div className="flex flex-wrap gap-1.5 sm:gap-3 mt-3 md:mt-0">
              {["All", ...allCategoryNames].map((cat) => (
                <motion.div key={cat} className="flex items-center" whileHover={{ scale: 1.07 }}>
                  <button
                    onClick={() => {
                      setSelectedCategory(cat);
                      setCurrentPage(1);
                    }}
                    className={`
                      px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium border border-transparent
                      transition-all duration-200 shadow-sm
                      ${
                        selectedCategory === cat
                          ? "bg-gradient-to-r from-blue-600 to-indigo-500 text-white shadow-lg"
                          : "bg-white/60 text-gray-800 border-gray-200 hover:bg-blue-50 hover:border-blue-200"
                      }
                      lowercase sm:normal-case
                    `}
                    style={{ letterSpacing: selectedCategory === cat ? "0.05em" : undefined }}
                  >
                    {cat}
                  </button>
                  {cat !== "All" && (
                    <button
                      className="ml-2 p-1 rounded-full bg-transparent hover:bg-red-100 text-red-500 hover:text-red-700 transition"
                      onClick={() => handleDeleteCategory(cat)}
                      title="Delete category"
                    >
                      <FaTrash className="text-xs sm:text-sm" />
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Place Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
          {currentPlaces.map((place, index) => (
            <motion.div
              key={place._id}
              className="relative group rounded-3xl bg-white/60 backdrop-blur-lg border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden hover:ring-2 hover:ring-blue-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="relative w-full h-36 sm:h-44 overflow-hidden rounded-t-3xl">
                <img
                  src={getDisplayImage(place.images?.[0])}
                  alt={place.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 ease-in-out"
                />
                {(place.categories && place.categories.length > 0) && (
                  <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs px-2 sm:px-3 py-1 rounded-full shadow lowercase sm:normal-case">
                    {place.categories.map((cat) => cat.name).join(", ")}
                  </span>
                )}
              </div>
              <div className="px-3 py-3 sm:px-5 sm:py-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 truncate lowercase sm:normal-case">
                  {place.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-1 lowercase sm:normal-case">
                  {place.location}
                </p>
                <div className="mt-3 sm:mt-4 flex justify-between items-center text-xs sm:text-sm">
                  <button
                    onClick={() => setEditingPlace(place)}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-all lowercase sm:normal-case"
                  >
                    <FaEdit /> edit
                  </button>
                  <button
                    onClick={() => handleDeletePlace(place._id)}
                    className="flex items-center gap-1 text-red-600 hover:text-red-800 transition-all lowercase sm:normal-case"
                  >
                    <FaTrash /> delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div className="mt-8 flex justify-center gap-1 sm:gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-medium lowercase sm:normal-case ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-gray-300 hover:bg-blue-50"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </motion.div>
        )}

        {/* Navigation & Modals */}
        <div className="mt-10">
          <Navigation />
        </div>

        <AnimatePresence>
          {editingPlace && (
            <EditPlaceModal
              place={editingPlace}
              categories={categories}
              onClose={() => setEditingPlace(null)}
              onUpdate={handleUpdatePlace}
              onDelete={handleDeletePlace}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProfileUser;