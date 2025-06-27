import { useEffect, useState } from "react";
import Navigation from "../components/NavigationPage";
import RestaurantCard from "../components/RestaurentCard";
import SideNavbar from "../components/SideNavbar";

function Home() {
  const [shops, setShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState(null);
  const [foods, setFoods] = useState([]);
  const [loadingShops, setLoadingShops] = useState(true);
  const [loadingFoods, setLoadingFoods] = useState(false);

  // Fetch all shops on mount
  useEffect(() => {
    setLoadingShops(true);
    fetch("http://localhost:5000/api/shops", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setShops(Array.isArray(data) ? data : data.shops || []);
        setLoadingShops(false);
      })
      .catch(() => setLoadingShops(false));
  }, []);

  // Fetch foods for a selected shop
  const handleViewFoods = (shopId) => {
    setSelectedShop(shopId);
    setLoadingFoods(true);
    fetch(`http://localhost:5000/api/food?shopId=${shopId}`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setFoods(Array.isArray(data) ? data : data.foods || []);
        setLoadingFoods(false);
      })
      .catch(() => setLoadingFoods(false));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white font-sans">
      <Navigation />
      <hr className="my-8 border-0 h-1 bg-gradient-to-r from-teal-400 via-sky-500 to-indigo-500 rounded" />
      <div className="mx-4 mt-10">
        <h1 className="text-xl font-bold text-gray-800">Shops</h1>
        {loadingShops && <p>Loading shops...</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          {shops.map((shop) => (
            <div key={shop._id} className="border rounded-xl p-4 bg-white">
              <h2 className="font-bold text-lg">{shop.name}</h2>
              {shop.photo && (
                <img
                  src={`http://localhost:5000${shop.photo}`}
                  alt={shop.name}
                  className="h-32 w-full object-cover rounded mt-2"
                />
              )}
              <p className="mt-2">{shop.description}</p>
              <button
                onClick={() => handleViewFoods(shop._id)}
                className="mt-3 px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
              >
                View Foods
              </button>
            </div>
          ))}
        </div>
      </div>
      {/* Foods Modal/Section */}
      {selectedShop && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 relative shadow-lg">
            <button
              onClick={() => setSelectedShop(null)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-3xl font-bold leading-none"
              aria-label="Close foods"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4">Foods</h2>
            {loadingFoods && <p>Loading foods...</p>}
            {!loadingFoods && foods.length === 0 && <p>No foods found.</p>}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {foods.map((food) => (
                <div
                  key={food._id}
                  className="border rounded-lg p-3 flex items-center gap-3 hover:shadow-md transition"
                >
                  {food.photo && (
                    <img
                      src={`http://localhost:5000${food.photo}`}
                      alt={food.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  )}
                  <span className="font-medium">{food.name}</span>
                  <span className="text-gray-600 ml-auto">${food.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <SideNavbar />
    </div>
  );
}

export default Home;