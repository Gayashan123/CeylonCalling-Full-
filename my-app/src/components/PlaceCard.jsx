import { FaHeart, FaRegHeart, FaMapMarkerAlt, FaDirections, FaInfoCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

function PlaceCard({ place, categories = [] }) {
  const navigate = useNavigate();
  const mainImage = place.images?.length > 0 ? place.images[0] : "/default-place.jpg";

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(place.likeCount || 0);

  const handleLike = () => {
    if (liked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setLiked(!liked);
  };

  return (
    <motion.article
      className="max-w-md bg-white rounded-3xl shadow-md mx-auto my-6 overflow-hidden cursor-default select-none"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(0,0,0,0.15)" }}
      role="region"
      aria-label={`Instagram style card for ${place.title}`}
    >
      {/* Header */}
      <header className="flex items-center gap-4 p-4">
        <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-pink-500 shadow-md">
          <img
            src={mainImage.startsWith("/uploads/") ? `http://localhost:5000${mainImage}` : mainImage}
            alt={place.title}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="flex flex-col overflow-hidden">
          <h3 className="text-lg font-semibold text-gray-900 truncate">{place.title}</h3>
          <span className="text-xs text-gray-500 flex items-center gap-1 truncate">
            <FaMapMarkerAlt className="inline text-pink-500" aria-hidden="true" />
            {place.location || "Unknown location"}
          </span>
        </div>
      </header>

      {/* Main Image */}
      <div className="relative group">
        <img
          src={mainImage.startsWith("/uploads/") ? `http://localhost:5000${mainImage}` : mainImage}
          alt={place.title}
          className="w-full aspect-square object-cover"
          loading="lazy"
          decoding="async"
        />
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-300 rounded-b-3xl"></div>
      </div>

      {/* Description */}
      <div className="p-4 space-y-3">
        <p className="text-gray-700 text-sm line-clamp-3">{place.description || "No description available."}</p>

        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {categories.length > 0 ? (
            categories.map((cat) => (
              <span
                key={cat._id}
                className="text-pink-600 text-xs font-semibold px-3 py-1 border border-pink-400 rounded-full cursor-default select-none"
                title={cat.name}
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

      {/* Actions */}
      <footer className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
        {/* Like Button */}
        <button
          onClick={handleLike}
          aria-pressed={liked}
          aria-label="Like place"
          className="flex items-center gap-2 text-pink-500 hover:text-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-300 rounded transition"
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

        {/* Directions Button */}
        <button
          type="button"
          className="flex items-center gap-1 text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded transition"
          aria-label="Get directions"
        >
          <FaDirections className="text-lg" />
          <span className="text-sm font-medium">Directions</span>
        </button>

        {/* Details Button */}
        <button
          type="button"
          onClick={() => navigate(`/places/${place._id}`)}
          className="flex items-center gap-1 text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded transition"
          aria-label={`View details for ${place.title}`}
        >
          <FaInfoCircle className="text-lg" />
          <span className="text-sm font-medium">Details</span>
        </button>
      </footer>
    </motion.article>
  );
}

export default PlaceCard;
