import {
  FaHeart,
  FaRegHeart,
  FaMapMarkerAlt,
  FaDirections,
  FaUtensils,
  FaPhoneAlt,
  FaClock,
  FaInfoCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";

function RestaurantCard({ shop, categories = [] }) {
  const navigate = useNavigate();
  const mainImage = shop.photo ? `http://localhost:5000${shop.photo}` : "/default-shop.jpg";

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(shop.likeCount || 0);

  const handleLike = () => {
    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  return (
    <motion.article
      className="max-w-md bg-white rounded-3xl shadow-md mx-auto my-6 overflow-hidden cursor-default select-none"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(0,0,0,0.15)" }}
    >
      {/* Header */}
      <header className="flex items-center gap-4 p-4">
        <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-green-500 shadow-md">
          <img
            src={mainImage}
            alt={shop.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="flex flex-col overflow-hidden">
          <h3 className="text-lg font-semibold text-gray-900 truncate">{shop.name}</h3>
          <span className="text-xs text-gray-500 flex items-center gap-1 truncate">
            <FaMapMarkerAlt className="inline text-green-500" />
            {shop.location || "Location not provided"}
          </span>
        </div>
      </header>

      {/* Main Image */}
      <div className="relative group">
        <img
          src={mainImage}
          alt={shop.name}
          className="w-full aspect-square object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-300 rounded-b-3xl" />
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div className="flex flex-wrap gap-3 text-gray-600 text-sm">
          <span className="flex items-center">
            <FaClock className="mr-1 text-purple-500" />
            {shop.openingHours || "9 AM - 10 PM"}
          </span>
          <span className="flex items-center">
            <FaPhoneAlt className="mr-1 text-green-500" />
            {shop.phone || "+94 77 123 4567"}
          </span>
        </div>

        <div className="flex items-start text-gray-600 text-sm">
          <FaInfoCircle className="mr-2 mt-0.5 text-blue-500" />
          <p>{shop.shopType || "No description available."}</p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {categories.length > 0 ? (
            categories.map((cat) => (
              <span
                key={cat._id}
                className="text-green-600 text-xs font-semibold px-3 py-1 border border-green-400 rounded-full cursor-default select-none"
              >
                {cat.name}
              </span>
            ))
          ) : (
            <span className="text-gray-400 text-xs px-3 py-1 rounded-full select-none border border-gray-300">
              No categories
            </span>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <footer className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
        <button
          onClick={handleLike}
          aria-label="Like restaurant"
          aria-pressed={liked}
          className="flex items-center gap-2 text-red-500 hover:text-red-600 transition"
        >
          <motion.span
            animate={{ scale: liked ? [1, 1.3, 1] : 1 }}
            transition={{ duration: 0.3 }}
            className="text-xl"
          >
            {liked ? <FaHeart /> : <FaRegHeart />}
          </motion.span>
          <span className="text-sm font-medium select-none">{likeCount > 0 ? likeCount : ""}</span>
        </button>

        <button
          type="button"
          className="flex items-center gap-1 text-gray-700 hover:text-gray-900 transition"
        >
          <FaDirections className="text-lg" />
          <span className="text-sm font-medium">Directions</span>
        </button>

        <button
          type="button"
          onClick={() => navigate(`/foodpage/${shop._id}`)}
          className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition"
        >
          <FaUtensils className="text-lg text-blue-500" />
          <span className="text-sm font-medium">View Menu</span>
        </button>
      </footer>
    </motion.article>
  );
}

export default RestaurantCard;
