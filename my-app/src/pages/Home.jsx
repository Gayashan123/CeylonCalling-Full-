import { useEffect, useState } from "react";
import Navigation from "../components/NavigationPage";
import SideNavbar from "../components/SideNavbar";
import RestaurantCard from "../components/RestaurentCard";
import { FaFilter } from "react-icons/fa";
import SearchBar from "../components/SearchBar";
import PriceFilter from "../components/FilterSection";
import ShopTypeFilter from "../components/ShopTypeFilter";

import { motion, AnimatePresence } from "framer-motion";

function Home() {
  const [allCategories, setAllCategories] = useState([]);
  const [shops, setShops] = useState([]);
  const [shopCategories, setShopCategories] = useState({});
  const [selectedShop, setSelectedShop] = useState(null);
  const [foods, setFoods] = useState([]);
  const [loadingShops, setLoadingShops] = useState(true);
  const [loadingFoods, setLoadingFoods] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [search, setSearch] = useState("");
  const [priceFilter, setPriceFilter] = useState({ min: 0, max: 5000 });
  const [shopTypeFilter, setShopTypeFilter] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    setLoadingCategories(true);
    fetch("http://localhost:5000/api/categories/all")
      .then((res) => res.json())
      .then((data) => {
        setAllCategories(Array.isArray(data) ? data : []);
        setLoadingCategories(false);
      })
      .catch(() => setLoadingCategories(false));
  }, []);

  useEffect(() => {
    let isMounted = true;
    async function fetchShopsAndCategories() {
      setLoadingShops(true);
      try {
        const res = await fetch("http://localhost:5000/api/shops/all");
        if (!res.ok) throw new Error("Failed to fetch shops");
        const data = await res.json();
        const shopList = Array.isArray(data) ? data : data.shops || [];
        if (isMounted) setShops(shopList);

        const categoriesEntries = await Promise.all(
          shopList.map(async (shop) => {
            try {
              const catRes = await fetch(
                `http://localhost:5000/api/categories/shop/${shop._id}`
              );
              if (!catRes.ok) throw new Error();
              const categories = await catRes.json();
              return [shop._id, categories];
            } catch {
              return [shop._id, []];
            }
          })
        );
        const categoriesMap = Object.fromEntries(categoriesEntries);
        if (isMounted) setShopCategories(categoriesMap);
      } catch {
        if (isMounted) setShops([]);
      } finally {
        if (isMounted) setLoadingShops(false);
      }
    }

    fetchShopsAndCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleViewFoods = (shopObj) => {
    setSelectedShop(shopObj);
    setLoadingFoods(true);
    fetch(`http://localhost:5000/api/food?shopId=${shopObj._id}`)
      .then((res) => res.json())
      .then((data) => {
        setFoods(Array.isArray(data) ? data : data.foods || []);
        setLoadingFoods(false);
      })
      .catch(() => setLoadingFoods(false));
  };

  const gradientColors = [
    "from-pink-400 to-pink-600",
    "from-purple-400 to-blue-400",
    "from-yellow-400 to-orange-500",
    "from-green-400 to-teal-500",
    "from-cyan-400 to-blue-500",
    "from-indigo-400 to-purple-500",
    "from-red-400 to-pink-500",
    "from-fuchsia-500 to-pink-500",
    "from-emerald-400 to-green-500",
    "from-sky-400 to-blue-500",
  ];

  // === FILTER LOGIC ===
  const filteredShops = shops.filter((shop) => {
    // 1. Shop Type Filter
    const matchType = shopTypeFilter === "all" || shop.shopType === shopTypeFilter;

    // 2. Search Filter
    const searchLower = search.toLowerCase();
    const shopNameMatch = shop.name.toLowerCase().includes(searchLower);
    const categoryMatch = (shopCategories[shop._id] || []).some((cat) =>
      cat.name.toLowerCase().includes(searchLower)
    );
    const matchesSearch = !search || shopNameMatch || categoryMatch;

    // 3. Category Filter
    const matchesCategory =
      !selectedCategory ||
      (shopCategories[shop._id] || []).some(
        (cat) => cat.name === selectedCategory
      );

    // ✅ 4. Price Range Filter (NEW logic for "100 - 600" format)
    const priceRangeStr = shop.priceRange || "";
    const [minStr, maxStr] = priceRangeStr.split("-").map((s) => s.trim());
    const minPrice = parseInt(minStr, 10) || 0;
    const maxPrice = parseInt(maxStr, 10) || 0;

   const matchesPrice =
  minPrice <= priceFilter.max && maxPrice >= priceFilter.min;


    // Final result:
    return matchType && matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <div className="relative flex flex-col min-h-screen bg-white font-sans">
      <Navigation />
      <main className="flex-grow pb-24 px-4 sm:px-8 max-w-screen-xl mx-auto">
        {/* Categories */}
        <section className="mt-10">
          <div className="flex flex-col sm:flex-row sm:justify-between mt-20 items-start sm:items-end mb-4">
            <h2 className="text-3xl font-bold text-gray-800">
              Explore Categories
            </h2>
            <p className="text-sm text-gray-500 mt-1 sm:mt-0">
              Find your favorite food by category!
            </p>
          </div>
          {loadingCategories ? (
            <div className="flex justify-center py-10">
              <div className="h-8 w-8 animate-spin border-4 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.05,
                  },
                },
              }}
            >
              {/* "All" Button */}
              <motion.div
                onClick={() => setSelectedCategory(null)}
                className={`cursor-pointer px-4 py-2 rounded-full font-semibold shadow-md transition select-none
    ${
      selectedCategory === null
        ? "bg-black text-white scale-105"
        : "bg-gray-300 text-gray-800 hover:bg-gray-400"
    }`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0 }}
              >
                All
              </motion.div>

              {/* Other categories */}
              {allCategories.map((cat, i) => {
                const isSelected = selectedCategory === cat.name;
                return (
                  <motion.div
                    key={cat._id}
                    onClick={() =>
                      setSelectedCategory(isSelected ? null : cat.name)
                    }
                    className={`cursor-pointer px-4 py-2 rounded-full font-semibold shadow-md transition select-none
        ${
          isSelected
            ? "bg-black text-white scale-105"
            : `bg-gradient-to-r ${
                gradientColors[i % gradientColors.length]
              } text-white`
        }`}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: (i + 1) * 0.04 }} // +1 for "All"
                  >
                    {cat.name}
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </section>

        <hr className="my-10 border-0 h-1 bg-gradient-to-r from-fuchsia-500 via-indigo-400 to-cyan-400 rounded-full shadow-xl opacity-70" />

        {/* Shop Type Filter */}
        <ShopTypeFilter value={shopTypeFilter} onChange={setShopTypeFilter} />

        {/* Price Filter */}
        <PriceFilter
          min={0}
          max={5000}
          value={priceFilter}
          onChange={setPriceFilter}
        />

        <hr className="my-8 border-0 h-1 bg-gradient-to-r from-pink-400 via-blue-400 to-green-400 rounded shadow-lg" />

        {/* Search Bar */}
        <SearchBar value={search} onChange={setSearch} onSubmit={() => {}} />

        {/* Shops Section */}
        <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
  {shopTypeFilter === "all"
    ? "All Shops"
    : `${shopTypeFilter.charAt(0).toUpperCase()}${shopTypeFilter.slice(1)} `}
</h2>


          {loadingShops ? (
            <p>Loading shops...</p>
          ) : filteredShops.length === 0 ? (
            <p className="text-gray-600 italic">
              No shops found matching your filters.
            </p>
          ) : (
            <motion.div
              className="flex flex-col gap-6"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.07 } },
              }}
            >
              {filteredShops.map((shop, idx) => (
                <motion.div
                  key={shop._id}
                  initial={{ opacity: 0, scale: 0.97, y: 24 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.12 + idx * 0.06 }}
                >
                  <RestaurantCard
                    shop={shop}
                    categories={shopCategories[shop._id] || []}
                    onViewMenu={handleViewFoods}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>
      </main>

      {/* Foods Modal */}
      <AnimatePresence>
        {selectedShop && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 overflow-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl shadow-xl max-w-3xl w-full p-6 relative"
              initial={{ scale: 0.92, y: 60, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.92, y: 60, opacity: 0 }}
              transition={{ type: "spring", stiffness: 270, damping: 24 }}
            >
              <button
                className="absolute top-4 right-4 text-2xl text-gray-600 hover:text-black"
                onClick={() => {
                  setSelectedShop(null);
                  setFoods([]);
                }}
                aria-label="Close food menu modal"
              >
                &times;
              </button>
              <h3 className="text-xl font-semibold mb-4">
                Foods at {selectedShop.name}
              </h3>
              {loadingFoods ? (
                <p>Loading foods...</p>
              ) : (
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.06 } },
                  }}
                >
                  {foods.map((food, idx) => (
                    <motion.div
                      key={food._id}
                      className="border rounded-lg p-3 flex items-center gap-4 hover:shadow transition"
                      initial={{ opacity: 0, y: 22 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.34, delay: idx * 0.05 }}
                    >
                      {food.picture && (
                        <img
                          src={`http://localhost:5000${food.picture}`}
                          alt={food.name}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                      )}
                      <div>
                        <div className="font-semibold">{food.name}</div>
                        <div className="text-gray-600 text-sm">
                          ${food.price.toFixed(2)}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <SideNavbar />
    </div>
  );
}

export default Home;
