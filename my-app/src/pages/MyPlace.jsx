import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PlaceCard from "../components/PlaceCard";
import Sidenav from "../components/SideNavbar";
import axios from "axios";
import Navigation from "../components/NavigationPage";
import SearchBar from "../components/SearchBar";
import { useSiteUserAuthStore } from "../store/siteUserAuthStore";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa";

const categoryColors = [
  "bg-gradient-to-r from-[#FF9A8B] to-[#FF6B95]",
  "bg-gradient-to-r from-[#667EEA] to-[#764BA2]",
  "bg-gradient-to-r from-[#FFD700] to-[#FFA500]",
  "bg-gradient-to-r from-[#4FACFE] to-[#00F2FE]",
  "bg-gradient-to-r from-[#6A11CB] to-[#2575FC]",
];

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
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <Sidenav />

      <main className="max-w-7xl mx-auto px-4 mt-39 sm:px-6 lg:px-8 py-6">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={
                  user?.photo ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=ff9a9e&color=fff`
                }
                alt="User"
                className="w-16 h-16 rounded-full border-4 border-white shadow-lg object-cover"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Discover Places</h1>
              <div className="flex items-center text-gray-600 mt-1">
                <FaMapMarkerAlt className="mr-2 text-pink-500" />
                <span>Colombo, Sri Lanka</span>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="w-full md:w-auto">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search places..."
              className="bg-white border border-gray-200 rounded-full px-5 py-3 shadow-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            />
          </div>
        </header>
         <hr className="my-6 border-t border-gray-100" />


        {/* Categories Filter */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Categories</h2>
          <div 
            ref={scrollRef} 
            className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar"
          >
            <button
              onClick={() => setSelectedCategory(null)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition ${
                selectedCategory === null
                  ? "bg-pink-600 text-white shadow-md"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              All Places
            </button>
            
            {categories.map((cat, idx) => {
              const isSelected = selectedCategory === cat._id;
              return (
                <button
                  key={cat._id}
                  onClick={() => setSelectedCategory(isSelected ? null : cat._id)}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium text-white transition ${
                    categoryColors[idx % categoryColors.length]
                  } ${isSelected ? "ring-2 ring-white ring-offset-2" : ""}`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </section>
         <hr className="my-6 border-t border-gray-100" />


        {/* Main Content */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">
                {selectedCategory 
                  ? `${categories.find(c => c._id === selectedCategory)?.name || ''} Places` 
                  : "All Places"}
              </h3>
              <span className="text-sm text-gray-500">
                {filteredPlaces.length} {filteredPlaces.length === 1 ? "place" : "places"} found
              </span>
            </div>

            {filteredPlaces.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">No places found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm 
                    ? "Try adjusting your search or filter to find what you're looking for."
                    : "There are currently no places available in this category."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {filteredPlaces.map((place) => (
                    <motion.div
                      key={place._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                     <PlaceCard
  place={place}
  categories={
    Array.isArray(place.categories)
      ? place.categories
          .filter(cat => typeof cat === "object" && cat?.name)
          .map(cat => ({
            ...cat,
            color: categoryColors[
              categories.findIndex(c => c._id === cat._id) % categoryColors.length
            ]
          }))
      : []
  }
  currentUserId={user?._id} // <<<< Pass the current user id
/>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default PlacesPage;