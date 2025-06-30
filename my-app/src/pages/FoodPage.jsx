import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiArrowLeftCircle } from "react-icons/fi";
import { FaTag } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import SearchBar from "../components/SearchBar";




// Helper component for category pills
function CategoryPill({ category, selected, onClick }) {
  return (
    <button
      className={`
        flex items-center gap-1 px-4 py-1 rounded-full
        text-sm font-medium shadow
        border border-transparent
        transition-all
        ${selected
          ? "bg-blue-500 text-white scale-105 shadow-lg"
          : "bg-blue-50 text-blue-700 hover:bg-blue-100"
        }
      `}
      onClick={onClick}
      aria-pressed={selected}
    >
      <FaTag className="text-xs" />
      {category.name}
    </button>
  );
}

// Helper component for food cards, with a fade-in + slight pop animation per card
function FoodCard({ food, idx }) {
  const imageUrl = food.picture
    ? food.picture.startsWith("http")
      ? food.picture
      : `http://localhost:5000${food.picture}`
    : "https://via.placeholder.com/160x192?text=No+Image";
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, ease: "easeOut", delay: idx * 0.07 }}
      viewport={{ once: true }}
      className="flex flex-col sm:flex-row bg-white rounded-2xl shadow hover:shadow-lg transition-all overflow-hidden"
    >
      <img
        src={imageUrl}
        alt={food.name}
        className="w-full sm:w-40 h-48 object-cover sm:rounded-l-2xl"
        onError={e => {
          e.target.onerror = null;
          e.target.src = "https://via.placeholder.com/160x192?text=Error";
        }}
      />
      <div className="flex flex-col justify-between p-4 flex-1">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg font-bold text-gray-800">{food.name}</span>
            <span className="ml-auto text-blue-600 font-semibold">
              {Number(food.price).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
            </span>
          </div>
          <span className="inline-block mt-1 text-xs text-gray-400">
            {food.category?.name || 'Uncategorized'}
          </span>
        </div>
        <div className="mt-2 flex gap-2">
          <span className="text-xs text-gray-400">
            Added: {food.createdAt ? new Date(food.createdAt).toLocaleDateString() : 'N/A'}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// Search Bar (re-usable)


// Animate parent containers as a gentle fade/scale in
const containerVariants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

const categoryItemVariants = {
  hidden: { opacity: 0, y: -12 },
  visible: i => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.32, delay: i * 0.03 }
  })
};

// MAIN COMPONENT
export default function FoodList({ shopId }) {
  const [foods, setFoods] = useState([]);
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Fetch foods for the specific shop and categories
  useEffect(() => {
    if (!shopId) return;
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        // Correct API endpoint for fetching foods by shop
        const foodRes = await fetch(`http://localhost:5000/api/food/shop/${shopId}`);
        if (!foodRes.ok) throw new Error(`HTTP error! status: ${foodRes.status}`);
        const foodData = await foodRes.json();
        setFoods(Array.isArray(foodData) ? foodData : []);

        // Extract unique categories from foods
        const uniqueCategories = [];
        const seen = new Set();
        (Array.isArray(foodData) ? foodData : []).forEach(f => {
          if (f.category && f.category._id && !seen.has(f.category._id)) {
            uniqueCategories.push(f.category);
            seen.add(f.category._id);
          }
        });
        setCategories(uniqueCategories);

      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to load food items. Please try again later.");
        setFoods([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [shopId]);

  // Filter foods by search and category
  useEffect(() => {
    let result = foods;
    if (selectedCategory !== "all") {
      result = result.filter(f => f.category?._id === selectedCategory);
    }
    if (search.trim()) {
      const s = search.trim().toLowerCase();
      result = result.filter(f =>
        f.name.toLowerCase().includes(s) ||
        (f.category?.name || "").toLowerCase().includes(s)
      );
    }
    setFilteredFoods(result);
  }, [foods, search, selectedCategory]);

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-green-50 font-sans"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 230, damping: 24, delay: 0.07 }}
          className="flex"
        >
          <button
            onClick={() => navigate("/home")}
            className="group flex items-center gap-2 px-5 py-2 mb-8 bg-gradient-to-r from-blue-500 via-cyan-400 to-pink-400 text-white rounded-full shadow-xl hover:scale-105 hover:shadow-2xl transition-all font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400"
            style={{
              fontSize: "1.15rem",
              letterSpacing: "0.02em"
            }}
            aria-label="Back to home"
          >
            {/* Glowing animated circle */}
            <span className="relative flex items-center justify-center">
              <span className="absolute inline-flex h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 via-cyan-300 to-pink-400 opacity-70 blur-md group-hover:scale-125 transition-transform"></span>
              <FiArrowLeftCircle size={28} className="relative drop-shadow-lg group-hover:text-pink-100 transition-colors animate-pulse" />
            </span>
            <span className="tracking-wide drop-shadow-sm group-hover:text-pink-100 transition-colors">
              Back to Home
            </span>
          </button>
        </motion.div>

        <motion.h1
          className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6 text-center"
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.14, ease: "easeOut" }}
        >
          Food Menu
        </motion.h1>

        {/* Search Bar */}
        <SearchBar
          value={search}
          onChange={setSearch}
          onSubmit={() => {}}
          placeholder="Search foods, categories…"
        />

        {/* Categories */}
        <div className="flex flex-wrap gap-2 justify-center mb-8 mt-2">
          <AnimatePresence>
            <motion.div
              key="all"
              custom={-1}
              variants={categoryItemVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <CategoryPill
                category={{ name: "All", _id: "all" }}
                selected={selectedCategory === "all"}
                onClick={() => setSelectedCategory("all")}
              />
            </motion.div>
            {categories.map((cat, idx) => (
              <motion.div
                key={cat._id}
                custom={idx}
                variants={categoryItemVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <CategoryPill
                  category={cat}
                  selected={selectedCategory === cat._id}
                  onClick={() => setSelectedCategory(cat._id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* HR Line */}
        <hr className="my-8 border-0 h-1 bg-gradient-to-r from-blue-400 via-green-400 to-pink-400 rounded-full shadow" />

        {/* Food List */}
        {loading ? (
          <motion.div
            className="flex justify-center items-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="h-8 w-8 animate-spin border-4 border-blue-500 border-t-transparent rounded-full"></div>
            <p className="ml-3 text-gray-600">Loading foods...</p>
          </motion.div>
        ) : error ? (
          <motion.div
            className="text-center text-red-500 py-10 text-lg font-medium"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.32 }}
          >
            {error}
          </motion.div>
        ) : filteredFoods.length === 0 ? (
          <motion.div
            className="text-center text-gray-400 py-20 text-lg"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28 }}
          >
            No foods found matching your criteria.
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            <AnimatePresence>
              {filteredFoods.map((food, idx) => (
                <FoodCard key={food._id} food={food} idx={idx} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>




    







    </motion.div>
  );
}