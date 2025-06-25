import React, { useState, useEffect } from "react";
import { useAuthStore } from "../../shopowner/store/authStore";
import { FaEdit, FaSearch, FaTrash } from "react-icons/fa";
import Navigation from "../../shopowner/components/SideNavbar";
import { motion } from "framer-motion";
import EditFood from "../components/EditFood";

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

  const foodsPerPage = 6;

  useEffect(() => {
    if (!shop) return;
    setLoading(true);
    setError("");

    Promise.all([
      fetch("/api/categories/my-shop", { credentials: "include" }).then((res) =>
        res.json()
      ),
      fetch("/api/food/my-shop", { credentials: "include" }).then((res) =>
        res.json()
      ),
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
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading shop data...
      </div>
    );
  }

  if (error || !shop) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error || "No shop data found."}
      </div>
    );
  }

  const allCategoryNames = Array.from(new Set(categories.map((c) => c.name)));
  const filteredFoods = foods.filter(
    (food) =>
      (selectedCategory === "All" ||
        (food.category && food.category.name === selectedCategory)) &&
      food.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastFood = currentPage * foodsPerPage;
  const indexOfFirstFood = indexOfLastFood - foodsPerPage;
  const currentFoods = filteredFoods.slice(indexOfFirstFood, indexOfLastFood);
  const totalPages = Math.ceil(filteredFoods.length / foodsPerPage);

  // Update food handler
  const handleUpdateFood = (updated) => {
    setFoods((prev) => prev.map((f) => (f._id === updated._id ? updated : f)));
    setEditingFood(null);
  };

  // Delete food handler
  const handleDeleteFood = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this food item?"
    );
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

  // Delete category handler
  const handleDeleteCategory = async (categoryName) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the category "${categoryName}"? This will remove the category from all items.`
    );
    if (!confirmDelete) return;
    try {
      // Find category object by name
      const categoryObj = categories.find((c) => c.name === categoryName);
      if (!categoryObj) throw new Error("Category not found");

      const res = await fetch(`/api/categories/${categoryObj._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Delete failed");

      // Remove category from UI state
      setCategories((prev) => prev.filter((c) => c._id !== categoryObj._id));

      // Remove category from foods (set to null)
      setFoods((prev) =>
        prev.map((f) =>
          f.category && f.category.name === categoryName
            ? { ...f, category: null }
            : f
        )
      );

      // If the deleted category is selected, reset to "All"
      if (selectedCategory === categoryName) {
        setSelectedCategory("All");
      }
    } catch (err) {
      alert("Failed to delete category.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Shop Header */}
        <motion.div
          className="bg-white shadow-lg rounded-2xl p-6 mb-10 flex flex-col md:flex-row items-center gap-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <img
            src={getDisplayImage(shop.photo)}
            alt="Shop"
            className="rounded-xl w-full md:w-1/2 max-h-60 object-cover"
          />
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-800">{shop.name}</h1>
            <p className="text-gray-600 mt-2">📞 {shop.contact}</p>
            <button className="mt-4 inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
              <FaEdit className="mr-2" /> Edit Profile
            </button>
          </div>
        </motion.div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div className="relative w-full sm:w-1/3">
            <FaSearch className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search food..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-400 outline-none"
            />
          </div>
          <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
            {["All", ...allCategoryNames].map((cat) => (
              <div key={cat} className="flex items-center">
                <button
                  onClick={() => {
                    setSelectedCategory(cat);
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 rounded-full border transition text-sm font-medium ${
                    selectedCategory === cat
                      ? "bg-purple-600 text-white border-purple-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-purple-100"
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
              </div>
            ))}
          </div>
        </div>

        {/* Food Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {currentFoods.map((food, i) => (
            <motion.div
              key={food._id}
              className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition flex flex-col"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              <img
                src={getDisplayImage(food.picture)}
                alt={food.name}
                className="rounded-md mb-3 h-40 object-cover w-full"
              />
              <h2 className="text-lg font-semibold text-gray-800">{food.name}</h2>
              <p className="text-gray-500 text-sm">{food.category?.name}</p>
              <p className="text-purple-600 font-bold text-xl mt-2">
                Rs.{parseFloat(food.price).toFixed(2)}
              </p>
              <div className="mt-auto flex justify-between items-center">
                <button
                  className="text-purple-700 text-sm hover:underline flex items-center"
                  onClick={() => setEditingFood(food)}
                >
                  <FaEdit className="mr-1" /> Edit
                </button>
                <button
                  className="text-red-600 text-sm hover:underline flex items-center"
                  onClick={() => handleDeleteFood(food._id)}
                >
                  <FaTrash className="mr-1" /> Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  currentPage === i + 1
                    ? "bg-purple-600 text-white"
                    : "bg-white border border-gray-300 hover:bg-purple-100"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}

        {/* Navigation */}
        <div className="mt-10">
          <Navigation />
        </div>

        {/* EditFood Modal */}
        {editingFood && (
          <EditFood
            food={editingFood}
            onClose={() => setEditingFood(null)}
            onUpdate={handleUpdateFood}
            onDelete={handleDeleteFood}
          />
        )}
      </div>
    </div>
  );
};

export default MyShop;