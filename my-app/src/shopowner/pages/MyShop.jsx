import React, { useState, useEffect } from "react";
import { useAuthStore } from "../../shopowner/store/authStore";
import { FaEdit, FaSearch, FaTrash } from "react-icons/fa";
import Navigation from "../../shopowner/components/SideNavbar";
import { motion, AnimatePresence } from "framer-motion";
import EditFood from "../components/EditFood";
import ShopEditModal from "../components/ShopEdit";

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

  useEffect(() => {
    if (!shop) return;
    setLoading(true);
    setError("");

    Promise.all([
      fetch("/api/categories/my-shop", { credentials: "include" }).then((res) => res.json()),
      fetch("/api/food/my-shop", { credentials: "include" }).then((res) => res.json()),
    ])
      .then(([categoriesData, foodsData]) => {
        setCategories(categoriesData);
        setFoods(foodsData);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load data. Please try again.");
        setLoading(false);
      });
  }, [shop]);

  if (isLoadingShop || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 text-xl font-medium">
        Loading shop data...
      </div>
    );
  }

  if (error || !shop) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 text-xl font-medium">
        {error || "No shop data found."}
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
    setFoods((prev) => prev.map((f) => (f._id === updated._id ? updated : f)));
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
    <div className="min-h-screen bg-[#f0f2f5] text-[#050505]">
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Shop Header */}
        <motion.div
          className="bg-white shadow-md rounded-lg p-4 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <img
            src={getDisplayImage(shop.photo)}
            alt="Shop"
            className="rounded-md w-full sm:w-1/3 h-48 object-cover"
          />
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-bold">{shop.name}</h1>
            <p className="text-sm text-gray-600 mt-1">📞 {shop.contact}</p>
            <button
              onClick={() => setShowShopEdit(true)}
              className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <FaEdit className="inline mr-2" /> Edit Profile
            </button>
          </div>
        </motion.div>

        {/* Search + Filter */}
        <motion.div
          className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="relative w-full md:w-1/3">
            <FaSearch className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search food..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {["All", ...allCategoryNames].map((cat) => (
              <motion.div key={cat} className="flex items-center" whileHover={{ scale: 1.05 }}>
                <button
                  onClick={() => {
                    setSelectedCategory(cat);
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-1 rounded-full text-sm font-medium border ${
                    selectedCategory === cat
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-800 border-gray-300 hover:bg-blue-100"
                  }`}
                >
                  {cat}
                </button>
                {cat !== "All" && (
                  <button
                    className="ml-1 text-red-600 hover:text-red-800"
                    onClick={() => handleDeleteCategory(cat)}
                    title="Delete category"
                  >
                    <FaTrash />
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Food Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentFoods.map((food, index) => (
            <motion.div
              key={food._id}
              className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <img
                src={getDisplayImage(food.picture)}
                alt={food.name}
                className="rounded-md w-full h-40 object-cover mb-2"
              />
              <h3 className="font-bold text-lg mb-1">{food.name}</h3>
              <p className="text-sm text-gray-500 mb-1">{food.category?.name}</p>
              <p className="text-blue-600 font-semibold text-lg">Rs.{parseFloat(food.price).toFixed(2)}</p>
              <div className="flex justify-between mt-3 text-sm">
                <button
                  onClick={() => setEditingFood(food)}
                  className="text-blue-600 hover:underline flex items-center"
                >
                  <FaEdit className="mr-1" /> Edit
                </button>
                <button
                  onClick={() => handleDeleteFood(food._id)}
                  className="text-red-600 hover:underline flex items-center"
                >
                  <FaTrash className="mr-1" /> Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            className="mt-6 flex justify-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-1 rounded-md text-sm font-medium ${
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

        {/* Navigation */}
        <div className="mt-10">
          <Navigation />
        </div>

        {/* Modals */}
        {editingFood && (
          <EditFood
            food={editingFood}
            onClose={() => setEditingFood(null)}
            onUpdate={handleUpdateFood}
            onDelete={handleDeleteFood}
          />
        )}

        <AnimatePresence>
          {showShopEdit && shop && (
            <ShopEditModal shop={shop} onClose={() => setShowShopEdit(false)} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MyShop;
