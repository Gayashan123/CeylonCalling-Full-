import {
  FaHeart,
  FaRegHeart,
  FaMapMarkerAlt,
  FaDirections,
  FaInfoCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import axios from "axios";

function PlaceCard({ place, categories = [], currentUserId }) {
  const navigate = useNavigate();
  const mainImage = place.images?.length > 0 ? place.images[0] : "/default-place.jpg";

  const alreadyLiked =
    currentUserId && Array.isArray(place.likes)
      ? place.likes.some((id) =>
          typeof id === "object" && id._id
            ? id._id === currentUserId
            : id === currentUserId
        )
      : false;

  const [liked, setLiked] = useState(alreadyLiked);
  const [likeCount, setLikeCount] = useState(place.likeCount || 0);
  const [likeLoading, setLikeLoading] = useState(false);

  const handleLike = async () => {
    if (!currentUserId) {
      navigate("/user/login");
      return;
    }
    if (likeLoading) return;
    setLikeLoading(true);
    try {
      const res = await axios.post(`/api/place/${place._id}/like`, {}, { withCredentials: true });
      setLiked(res.data.data.liked);
      setLikeCount(res.data.data.likeCount);
    } catch (e) {
      console.error("Like error:", e);
    } finally {
      setLikeLoading(false);
    }
  };

  return (
    <motion.article
      className="max-w-md md:max-w-lg bg-gray-300 rounded-3xl shadow-lg shadow-white mx-auto my-6 overflow-hidden cursor-default select-none
        sm:hover:shadow-2xl transition-shadow duration-300"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.02 }}
      role="region"
      aria-label={`Place card for ${place.title}`}
    >
      {/* Header */}
      <header className="flex items-center gap-4 p-5">
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-pink-500 shadow-md flex-shrink-0">
          <img
            src={mainImage.startsWith("/uploads/") ? `http://localhost:5000${mainImage}` : mainImage}
            alt={place.title}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="flex flex-col overflow-hidden">
          <h3 className="text-xl font-semibold text-gray-900 truncate">{place.title}</h3>
          <span className="text-sm text-gray-500 flex items-center gap-1 truncate">
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-300 rounded-b-3xl" />
      </div>

      {/* Description & Categories */}
      <div className="p-5 space-y-4">
        <p className="text-gray-700 text-sm line-clamp-3">
          {place.description || "No description available."}
        </p>
        <div className="flex flex-wrap gap-2">
          {categories.length > 0 ? (
            categories.map((cat) => (
              <span
                key={cat._id}
                className="text-pink-600 text-xs font-semibold px-3 py-1 border border-pink-400 rounded-full select-none"
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

      {/* Footer */}
      <footer className="flex items-center justify-between px-5 py-4 border-t border-gray-200">
        {/* Like Button */}
        <button
          onClick={handleLike}
          aria-pressed={liked}
          aria-label={liked ? "Unlike this place" : "Like this place"}
          className={`flex items-center gap-2 text-pink-500 hover:text-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-300 rounded transition ${
            likeLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={likeLoading}
        >
          <motion.span
            animate={{ scale: liked ? [1, 1.3, 1] : 1 }}
            transition={{ duration: 0.3 }}
            className="text-2xl"
          >
            {liked ? <FaHeart /> : <FaRegHeart />}
          </motion.span>
          <span className="text-sm font-medium select-none">
            {likeCount} {likeCount === 1 ? "like" : "likes"}
          </span>
        </button>

        {/* Directions */}
        <button
          type="button"
          className="flex items-center gap-1 text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded transition px-2 py-1"
          aria-label="Get directions"
        >
          <FaDirections className="text-lg" />
          <span className="hidden sm:inline font-medium text-sm">Directions</span>
        </button>

        {/* Details */}
        <button
          type="button"
          onClick={() => navigate(`/places/${place._id}`)}
          className="flex items-center gap-1 text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded transition px-2 py-1"
          aria-label={`View details for ${place.title}`}
        >
          <FaInfoCircle className="text-lg" />
          <span className="hidden sm:inline font-medium text-sm">Details</span>
        </button>
      </footer>
    </motion.article>
  );
}

export default PlaceCard;
