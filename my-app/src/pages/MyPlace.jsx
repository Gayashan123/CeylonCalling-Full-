import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PlaceCard from "../components/PlaceCard";
import {
  FaUserCircle,
  FaStore,
  FaCog,
  FaPlaneDeparture,
  FaHome,
} from "react-icons/fa";
import axios from "axios";
import Navigation from "../components/NavigationPage";
import SearchBar from "../components/SearchBar";
import { useSiteUserAuthStore } from "../store/siteUserAuthStore";
import { useNavigate } from "react-router-dom";

const iosColors = [
  "from-[#ff9a9e] to-[#fad0c4]",
  "from-[#a18cd1] to-[#fbc2eb]",
  "from-[#fbc2eb] to-[#a6c1ee]",
  "from-[#fad0c4] to-[#ffd1ff]",
  "from-[#a1c4fd] to-[#c2e9fb]",
];

// ... [imports remain unchanged]

function PlacesPage() {
  const [places, setPlaces] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const user = useSiteUserAuthStore((state) => state.user);
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  const navItems = [
    { icon: <FaHome />, label: "Home", onClick: () => navigate("/") },
    { icon: <FaUserCircle />, label: "Profile", onClick: () => navigate("/user/profile") },
    { icon: <FaStore />, label: "Shops", onClick: () => navigate("/user/dashboard") },
    { icon: <FaPlaneDeparture />, label: "Travel", onClick: () => navigate("/user/placepage") },
   
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [placesRes, categoriesRes] = await Promise.all([
          axios.get("/api/place"),
          axios.get("/api/placecat"),
        ]);
        setPlaces(placesRes.data?.data || []);
        setCategories(categoriesRes.data || []);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredPlaces = places.filter((place) => {
    const matchesSearch =
      searchTerm === "" ||
      place.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      place.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      place.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      !selectedCategory ||
      (Array.isArray(place.categories) &&
        place.categories.some(
          (cat) =>
            (typeof cat === "string" && cat === selectedCategory) ||
            (typeof cat === "object" && cat._id === selectedCategory)
        ));
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen  bg- pb-24 transition-colors duration-300">
      <Navigation />

      {/* Nav Icons */}
      <div className="w-full mt-13 fixed top-0 z-10 bg-white py-4 border-b border-gray-200 mb-6">
        <div className="max-w-screen-lg mx-auto px-4">
          <div className="flex sm:justify-between overflow-x-auto no-scrollbar gap-10">
            {navItems.map((item, idx) => (
              <motion.button
                key={idx}
                onClick={item.onClick}
                whileTap={{ scale: 0.9 }}
                className="flex flex-col items-center flex-shrink-0"
              >
                <div className="bg-gradient-to-tr from-pink-400 to-yellow-300 p-[3px] rounded-full">
                  <div className="bg-white p-3 rounded-full shadow hover:shadow-md transition">
                    <span className="text-pink-500 text-xl">{item.icon}</span>
                  </div>
                </div>
                <span className="mt-1 text-xs font-semibold text-gray-600">{item.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Header */}
      <main className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8">
        <header className="flex items-center gap-5 mb-10">
          <img
            src={
              user?.photo ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=ff9a9e&color=fff`
            }
            alt="User"
            className="w-16 h-16 rounded-full border-4 border-pink-400 shadow-lg object-cover"
          />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1c1c1e]">
              📍 Colombo, Sri Lanka
            </h1>
            <p className="text-sm text-pink-500 italic">Find the most loved places here</p>
          </div>
        </header>

        {/* Categories */}
        <nav ref={scrollRef} className="flex items-center mt-30 overflow-x-auto space-x-4 mb-6 no-scrollbar py-2">
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
          {categories.map((cat, idx) => {
            const isSelected = selectedCategory === cat._id;
            return (
              <button
                key={cat._id}
                onClick={() => setSelectedCategory(isSelected ? null : cat._id)}
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

        {/* Search */}
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          onSubmit={() => {}}
          className="mb-6 bg-white rounded-full border border-gray-300 shadow-sm px-5 py-3 placeholder-pink-300 focus-within:border-pink-500 focus-within:ring-pink-300 transition"
          placeholder="Search for a place..."
        />

      
        

        {/* Places Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {filteredPlaces.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center py-12 text-gray-400"
              >
                {searchTerm ? "No places match your search." : "No places found."}
              </motion.div>
            ) : (
              filteredPlaces.map((place) => (
                <PlaceCard
                  key={place._id}
                  place={place}
                  categories={
                    Array.isArray(place.categories)
                      ? place.categories.filter(
                          (cat) => typeof cat === "object" && cat !== null && cat.name
                        )
                      : []
                  }
                  className="rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition cursor-pointer"
                  imageClassName="object-cover aspect-square rounded-3xl"
                />
              ))
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export default PlacesPage;
