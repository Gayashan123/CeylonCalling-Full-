import { useEffect, useState } from "react";
import Navigation from "../components/NavigationPage";
import SideNavbar from "../components/SideNavbar";
import RestaurantCard from "../components/RestaurentCard";
import { FaFilter } from "react-icons/fa";
import SearchBar from "../components/SearchBar";
import PriceFilter from "../components/FilterSection";
import ShopTypeFilter from "../components/ShopTypeFilter";

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

  // ✅ Add filter state
  const [shopTypeFilter, setShopTypeFilter] = useState("all");

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

  // ✅ Filtered shops based on selection
  const filteredShops =
    shopTypeFilter === "all"
      ? shops
      : shops.filter((shop) => shop.type === shopTypeFilter);

  return (
    <div className="relative flex flex-col min-h-screen bg-white font-sans">
      <Navigation />
      <main className="flex-grow pb-24 px-4 sm:px-8">
        {/* Categories */}
        <section className="mt-35">
          <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-end mb-4">
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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
              {allCategories.map((cat, i) => (
                <div
                  key={cat._id}
                  className={`bg-gradient-to-r ${
                    gradientColors[i % gradientColors.length]
                  } text-white text-sm px-4 py-2 rounded-full font-semibold shadow-md cursor-pointer hover:scale-105 transition`}
                >
                  {cat.name}
                </div>
              ))}
            </div>
          )}
        </section>
<hr className="my-10 border-0 h-1 bg-gradient-to-r from-fuchsia-500 via-indigo-400 to-cyan-400 rounded-full shadow-xl opacity-70" />
        <ShopTypeFilter value={shopTypeFilter} onChange={setShopTypeFilter} />

        <PriceFilter
          min={0}
          max={5000}
          value={priceFilter}
          onChange={setPriceFilter}
        />
       <hr className="my-8 border-0 h-1 bg-gradient-to-r from-pink-400 via-blue-400 to-green-400 rounded shadow-lg" />
        <SearchBar
          value={search}
          onChange={setSearch}
          onSubmit={() => {
            /* handle search/filter logic here */
          }}
        />
        

        {/* Shops */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Shops</h2>
          {loadingShops ? (
            <p>Loading shops...</p>
          ) : (
            <div className="flex flex-col gap-6">
              {filteredShops.map((shop) => (
                <RestaurantCard
                  key={shop._id}
                  shop={shop}
                  categories={shopCategories[shop._id] || []}
                  onViewMenu={handleViewFoods}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Foods Modal */}
      {selectedShop && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 overflow-auto">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full p-6 relative">
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
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {foods.map((food) => (
                  <div
                    key={food._id}
                    className="border rounded-lg p-3 flex items-center gap-4 hover:shadow transition"
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
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <SideNavbar />
    </div>
  );
}

export default Home;
