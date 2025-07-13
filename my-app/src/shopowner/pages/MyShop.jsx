import React, { useState, useEffect } from "react";
import { useAuthStore } from "../../shopowner/store/authStore";
import { FaEdit, FaSearch, FaTrash, FaSyncAlt } from "react-icons/fa";
import Navigation from "../../shopowner/components/SideNavbar";
import { motion, AnimatePresence } from "framer-motion";
import EditFood from "../components/EditFood";
import ShopEditModal from "../components/ShopEdit";
import ShopStats from "../components/ShopState";



const getDisplayImage = (photo) => {
  if (!photo) return "https://via.placeholder.com/600x300?text=No+Image";
  if (photo.startsWith("http://") || photo.startsWith("https://")) return photo;
  if (photo.startsWith("/uploads")) return photo;
  if (photo.startsWith("uploads")) return "/" + photo;
  return photo;
};

const MyShop = () => {
  const shop = useAuthStore((state) => state.shop);
  const isLoadingShop = useAuthStore((state) => state.isLoading);

  const [categories, setCategories] = useState([]);
  const [foods, setFoods] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingFood, setEditingFood] = useState(null);
  const [showShopEdit, setShowShopEdit] = useState(false);

  const foodsPerPage = 6;

  // Fetch categories and foods
  const fetchAllData = async () => {
    setLoading(true);
    setError("");
    try {
      const [categoriesRes, foodsRes] = await Promise.all([
        fetch("/api/categories/my-shop", { credentials: "include" }),
        fetch("/api/food/my-shop", { credentials: "include" }),
      ]);
      const categoriesData = await categoriesRes.json();
      const foodsData = await foodsRes.json();
      setCategories(categoriesData);
      setFoods(foodsData);
    } catch {
      setError("Failed to load data. Please try again.");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!shop) return;
    fetchAllData();
    // eslint-disable-next-line
  }, [shop]);

  if (isLoadingShop || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 text-xs sm:text-xl font-medium lowercase sm:normal-case">
        loading shop data...
      </div>
    );
  }

  if (error || !shop) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 text-xs sm:text-xl font-medium lowercase sm:normal-case">
        {error || "no shop data found."}
      </div>
    );
  }

  const allCategoryNames = Array.from(new Set(categories.map((c) => c.name)));
  const filteredFoods = foods.filter(
    (food) =>
      (selectedCategory === "All" || (food.category && food.category.name === selectedCategory)) &&
      food.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastFood = currentPage * foodsPerPage;
  const indexOfFirstFood = indexOfLastFood - foodsPerPage;
  const currentFoods = filteredFoods.slice(indexOfFirstFood, indexOfLastFood);
  const totalPages = Math.ceil(filteredFoods.length / foodsPerPage);

  const handleUpdateFood = (updated) => {
    const updatedCategory =
      categories.find(
        (c) =>
          c._id === updated.categoryId ||
          (updated.category && c._id === updated.category._id)
      ) || updated.category || null;

    setFoods((prev) =>
      prev.map((f) =>
        f._id === updated._id ? { ...updated, category: updatedCategory } : f
      )
    );
    setEditingFood(null);
  };

  const handleDeleteFood = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this food item?");
    if (!confirmDelete) return;
    try {
      const res = await fetch(`/api/food/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Delete failed");
      setFoods((prev) => prev.filter((f) => f._id !== id));
      if (editingFood && editingFood._id === id) {
        setEditingFood(null);
      }
    } catch (err) {
      alert("Failed to delete food item.");
    }
  };

  const handleDeleteCategory = async (categoryName) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the category "${categoryName}"? This will remove the category from all items.`
    );
    if (!confirmDelete) return;
    try {
      const categoryObj = categories.find((c) => c.name === categoryName);
      if (!categoryObj) throw new Error("Category not found");

      const res = await fetch(`/api/categories/${categoryObj._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Delete failed");

      setCategories((prev) => prev.filter((c) => c._id !== categoryObj._id));
      setFoods((prev) =>
        prev.map((f) => (f.category && f.category.name === categoryName ? { ...f, category: null } : f))
      );
      if (selectedCategory === categoryName) {
        setSelectedCategory("All");
      }
    } catch (err) {
      alert("Failed to delete category.");
    }
  };

  return (
    <div className="mt-15 min-h-screen bg-gradient-to-br from-[#f7f8fa] to-[#eef1f6] text-[#1f2937]">
      <div className="max-w-6xl mx-auto px-2 sm:px-6 py-8">
        <motion.div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
          <div className="relative bg-white/60 backdrop-blur-md border border-gray-200 rounded-2xl shadow-lg px-4 py-3 sm:px-6 sm:py-4 flex items-center gap-4 group transition hover:shadow-2xl">
  <div className="relative">
    <img
      src={getDisplayImage(shop.photo)}
      alt="Shop"
      className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-4 border-white shadow-md group-hover:scale-105 transition"
    />
    
  </div>
  <div>
    <h1 className="text-lg sm:text-2xl font-bold tracking-tight lowercase sm:normal-case text-gray-800">
      {shop.name}
    </h1>
    {/* Optional tagline, use shop.tagline or a string */}
    <span className="block text-xs sm:text-sm text-gray-500 mt-1 italic">
      {shop.tagline || "your trusted business hub"}
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
            {/* Edit Profile Button */}
            <button
              onClick={() => setShowShopEdit(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-xs sm:text-base text-white hover:scale-105 transition lowercase sm:normal-case"
            >
              <FaEdit /> edit profile
            </button>
          </div>
        </motion.div>

     {/* Search & Filters - Apple UI Inspired */}
<div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-100 p-4 sm:p-7 mb-8">
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
    {/* Search Bar */}
    <div className="relative w-full md:w-1/3">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
        <FaSearch className="text-base sm:text-lg" />
      </span>
      <input
        type="text"
        placeholder="Search food…"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
        className="pl-11 pr-4 py-2.5 w-full rounded-xl border border-gray-200 bg-gray-50/60 shadow-inner text-xs sm:text-base lowercase sm:normal-case placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        style={{ WebkitBackdropFilter: 'blur(8px)' }}
      />
    </div>
    {/* Category Pills */}
    <div className="flex flex-wrap gap-1.5 sm:gap-3 mt-3 md:mt-0">
      {["All", ...allCategoryNames].map((cat) => (
        <motion.div 
          key={cat} 
          className="flex items-center" 
          whileHover={{ scale: 1.07 }}
        >
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

        {/* Food Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
          {currentFoods.map((food, index) => (
            <motion.div
              key={food._id}
              className="relative group rounded-3xl bg-white/60 backdrop-blur-lg border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden hover:ring-2 hover:ring-blue-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="relative w-full h-36 sm:h-44 overflow-hidden rounded-t-3xl">
                <img
                  src={getDisplayImage(food.picture)}
                  alt={food.name}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 ease-in-out"
                />
                {food.category?.name && (
                  <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs px-2 sm:px-3 py-1 rounded-full shadow lowercase sm:normal-case">
                    {food.category.name}
                  </span>
                )}
              </div>
              <div className="px-3 py-3 sm:px-5 sm:py-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 truncate lowercase sm:normal-case">{food.name}</h3>
                <p className="text-xs sm:text-base font-bold text-blue-600 mt-1 lowercase sm:normal-case">rs.{parseFloat(food.price).toFixed(2)}</p>
                <div className="mt-3 sm:mt-4 flex justify-between items-center text-xs sm:text-sm">
                  <button
                    onClick={() => setEditingFood(food)}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-all lowercase sm:normal-case"
                  >
                    <FaEdit /> edit
                  </button>
                  <button
                    onClick={() => handleDeleteFood(food._id)}
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

        {editingFood && (
          <EditFood
            food={editingFood}
            onClose={() => setEditingFood(null)}
            onUpdate={handleUpdateFood}
            onDelete={handleDeleteFood}
          />
        )}

        <AnimatePresence>
          {showShopEdit && shop && <ShopEditModal shop={shop} onClose={() => setShowShopEdit(false)} />}
        </AnimatePresence>
      </div>


<ShopStats shopId={shop._id} isShopOwner={true} />

    </div>
  );
};

export default MyShop;