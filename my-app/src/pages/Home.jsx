import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "../components/NavigationPage";
import RestaurantCard from "../components/RestaurentCard";
import SearchBar from "../components/SearchBar";
import PriceFilter from "../components/FilterSection";
import ShopTypeFilter from "../components/ShopTypeFilter";
import Sidenav from "../components/SideNavbar"
import { useNavigate } from "react-router-dom";
import { useSiteUserAuthStore } from "../store/siteUserAuthStore"; 

const iosColors = [
  "from-[#ff9a9e] to-[#fad0c4]",
  "from-[#a18cd1] to-[#fbc2eb]",
  "from-[#fbc2eb] to-[#a6c1ee]",
  "from-[#fad0c4] to-[#ffd1ff]",
  "from-[#a1c4fd] to-[#c2e9fb]",
];

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

  const navigate = useNavigate();
  const scrollRef = useRef(null);
const user = useSiteUserAuthStore(state => state.user);
  const currentUserId = user?._id || null;
 

  // Fetch categories
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

  // Fetch shops and their categories
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

  // === FILTER LOGIC ===
  const filteredShops = shops.filter((shop) => {
    const matchType = shopTypeFilter === "all" || shop.shopType === shopTypeFilter;

    const searchLower = search.toLowerCase();
    const shopNameMatch = shop.name.toLowerCase().includes(searchLower);
    const categoryMatch = (shopCategories[shop._id] || []).some((cat) =>
      cat.name.toLowerCase().includes(searchLower)
    );
    const matchesSearch = !search || shopNameMatch || categoryMatch;

    const matchesCategory =
      !selectedCategory ||
      (shopCategories[shop._id] || []).some(
        (cat) => cat._id === selectedCategory || cat.name === selectedCategory
      );

    const priceRangeStr = shop.priceRange || "";
    const [minStr, maxStr] = priceRangeStr.split("-").map((s) => s.trim());
    const minPrice = parseInt(minStr, 10) || 0;
    const maxPrice = parseInt(maxStr, 10) || 0;
    const matchesPrice = minPrice <= priceFilter.max && maxPrice >= priceFilter.min;

    return matchType && matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-white pb-24">
      <Navigation />

     <Sidenav />

      <main className="max-w-screen-lg mt-20 mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        {/* Categories */}
       <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 tracking-tight">
  Explore Categories
</h2>

        <nav className="flex items-center  overflow-x-auto space-x-4 mb-6 no-scrollbar py-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`whitespace-nowrap px-5 py-2 rounded-full font-semibold transition ${
              selectedCategory === null
                ? "bg-pink-500 text-white shadow-lg scale-105"
                : "bg-pink-100 text-pink-600 hover:bg-pink-200"
            }`}
          >
            All
          </button>
          {allCategories.map((cat, idx) => {
            const isSelected = selectedCategory === cat._id || selectedCategory === cat.name;
            return (
              <button
                key={cat._id}
                onClick={() => setSelectedCategory(isSelected ? null : cat._id || cat.name)}
                className={`whitespace-nowrap px-5 py-2 rounded-full font-semibold transition bg-gradient-to-r ${
                  isSelected
                    ? "from-pink-500 to-pink-700 text-white shadow-lg scale-105"
                    : `${iosColors[idx % iosColors.length]} text-white hover:brightness-110`
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </nav>
        <hr className="my-6 border-t border-gray-100" />


        {/* Shop Type Filter */}
        <ShopTypeFilter value={shopTypeFilter} onChange={setShopTypeFilter} />

        {/* Price Filter */}
        <PriceFilter min={0} max={5000} value={priceFilter} onChange={setPriceFilter} />
<hr className="my-6 border-t border-gray-100" />

        {/* Search Bar */}
        <SearchBar
          value={search}
          onChange={setSearch}
          onSubmit={() => {}}
          className="mb-6 bg-white rounded-full border border-gray-300 shadow-sm px-5 py-3 placeholder-pink-300 focus-within:border-pink-500 focus-within:ring-pink-300 transition"
          placeholder="Search for shops..."
        />

        {/* Shops Grid */}
        {loadingShops ? (
          <p>Loading shops...</p>
        ) : filteredShops.length === 0 ? (
          <p className="text-gray-600 italic">No shops found matching your filters.</p>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}
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
      currentUserId={user?._id}  // Pass current user ID here
      className="rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition cursor-pointer"
    />
  </motion.div>
))}

          </motion.div>
        )}
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
              className="bg-white rounded-3xl shadow-xl max-w-3xl w-full p-6 relative"
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
              <h3 className="text-xl font-semibold mb-4">Foods at {selectedShop.name}</h3>
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
                        <div className="text-gray-600 text-sm">${food.price.toFixed(2)}</div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Home;