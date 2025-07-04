import { useEffect, useState, useCallback } from "react";
import Navigation from "../components/NavigationPage";
import SideNavbar from "../components/SideNavbar";
import RestaurantCard from "../components/RestaurentCard";
import SearchBar from "../components/SearchBar";
import PriceFilter from "../components/FilterSection";
import ShopTypeFilter from "../components/ShopTypeFilter";
import { motion, AnimatePresence } from "framer-motion";
import { useSiteUserAuthStore } from "../store/siteUserAuthStore";
import FavouritesModal from "../components/Favourites";
import { Toaster } from "react-hot-toast";

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
  const [showFavourites, setShowFavourites] = useState(false);

  const {
    favourites,
    favouriteIds,
    addFavourite,
    removeFavourite,
    fetchFavourites,
    isAuthenticated,
    loading,
  } = useSiteUserAuthStore();

  // Fetch favourites when authenticated
  useEffect(() => {
    if (isAuthenticated) fetchFavourites();
  }, [isAuthenticated, fetchFavourites]);

  // Fetch all categories
  useEffect(() => {
    setLoadingCategories(true);
    fetch("http://localhost:5000/api/categories/all")
      .then((res) => res.json())
      .then((data) => {
        setAllCategories(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        setAllCategories([]);
      })
      .finally(() => setLoadingCategories(false));
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
        if (!isMounted) return;
        setShops(shopList);

        // Fetch categories for each shop in parallel
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
        if (!isMounted) return;
        setShopCategories(Object.fromEntries(categoriesEntries));
      } catch {
        if (!isMounted) return;
        setShops([]);
        setShopCategories({});
      } finally {
        if (!isMounted) return;
        setLoadingShops(false);
      }
    }

    fetchShopsAndCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  // Load foods for selected shop
  const handleViewFoods = (shopObj) => {
    setSelectedShop(shopObj);
    setLoadingFoods(true);
    fetch(`http://localhost:5000/api/food?shopId=${shopObj._id}`)
      .then((res) => res.json())
      .then((data) => {
        setFoods(Array.isArray(data) ? data : data.foods || []);
      })
      .catch(() => {
        setFoods([]);
      })
      .finally(() => setLoadingFoods(false));
  };

  // Efficient favourite check
  const isShopFavourited = useCallback(
    (shopId) => favouriteIds.has(shopId),
    [favouriteIds]
  );

  // Toggle favourite status
  const [favouriteLoadingId, setFavouriteLoadingId] = useState(null);
  const handleToggleFavourite = async (shopId) => {
    if (!isAuthenticated) {
      window.alert("You must be logged in to favourite a shop!");
      return;
    }
    setFavouriteLoadingId(shopId);
    if (isShopFavourited(shopId)) {
      await removeFavourite(shopId);
    } else {
      await addFavourite(shopId);
    }
    setFavouriteLoadingId(null);
  };

  // Shop filtering
  const filteredShops =
    shopTypeFilter === "all"
      ? shops
      : shops.filter((shop) => shop.shopType === shopTypeFilter);

  const searchedShops = filteredShops.filter((shop) => {
    const matchesSearch = shop.name
      .toLowerCase()
      .includes(search.toLowerCase());
    // Extend with price filter logic if your shops have price data
    return matchesSearch;
  });

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

  return (
    <div className="relative flex flex-col min-h-screen bg-white font-sans">
      <Toaster />
      <Navigation />
      <main className="flex-grow pb-24 px-4 sm:px-8">
        {/* Categories */}
        <section className="mt-10">
          <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-end mb-4">
            <h2 className="text-3xl font-bold text-gray-800">Explore Categories</h2>
            <p className="text-sm text-gray-500 mt-1 sm:mt-0">
              Find your favorite food by category!
            </p>
            <button
              className="ml-auto mt-3 sm:mt-0 bg-yellow-100 border border-yellow-300 text-yellow-800 px-4 py-1 rounded-full font-semibold shadow hover:bg-yellow-200 transition"
              onClick={() => setShowFavourites(true)}
            >
              View Favourites ({favourites.length})
            </button>
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
              {allCategories.map((cat, i) => (
                <motion.div
                  key={cat._id}
                  className={`bg-gradient-to-r ${
                    gradientColors[i % gradientColors.length]
                  } text-white text-sm px-4 py-2 rounded-full font-semibold shadow-md cursor-pointer hover:scale-105 transition`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.04 }}
                >
                  {cat.name}
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>

        <hr className="my-10 border-0 h-1 bg-gradient-to-r from-fuchsia-500 via-indigo-400 to-cyan-400 rounded-full shadow-xl opacity-70" />

        <ShopTypeFilter value={shopTypeFilter} onChange={setShopTypeFilter} />

        <PriceFilter min={0} max={5000} value={priceFilter} onChange={setPriceFilter} />

        <hr className="my-8 border-0 h-1 bg-gradient-to-r from-pink-400 via-blue-400 to-green-400 rounded shadow-lg" />

        <SearchBar value={search} onChange={setSearch} onSubmit={() => {}} />

        {/* Shops */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Shops</h2>
          {loadingShops ? (
            <p>Loading shops...</p>
          ) : searchedShops.length === 0 ? (
            <p>No shops found.</p>
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
              {searchedShops.map((shop, idx) => (
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
                    isFavourite={isShopFavourited(shop._id)}
                    onFavourite={handleToggleFavourite}
                    favouriteLoading={favouriteLoadingId === shop._id && loading.favourites}
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
              >
                &times;
              </button>
              <h3 className="text-xl font-semibold mb-4">
                Foods at {selectedShop.name}
              </h3>
              {loadingFoods ? (
                <p>Loading foods...</p>
              ) : foods.length === 0 ? (
                <p>No foods available.</p>
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

      {/* Favourites Modal */}
      <FavouritesModal
        isOpen={showFavourites}
        favourites={favourites}
        onClose={() => setShowFavourites(false)}
        onRemove={removeFavourite}
        loading={loading.favourites}
      />
    </div>
  );
}

export default Home;