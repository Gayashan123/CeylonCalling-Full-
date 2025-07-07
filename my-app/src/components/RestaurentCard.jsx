import {
  FaHeart,
  FaMapMarkerAlt,
  FaUtensils,
  FaPhoneAlt,
  FaClock,
  FaInfoCircle,
 
} from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

function RestaurantCard({ shop, categories   }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row bg-white/80 backdrop-blur-lg border border-gray-100 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-all duration-300 overflow-hidden w-full max-w-5xl mx-auto mt-6 group hover:scale-[1.01]">
      {/* Image */}
      <div className="md:w-1/3 w-full h-44 sm:h-56 md:h-auto overflow-hidden">
        <img
          src={shop.photo ? `http://localhost:5000${shop.photo}` : "/default-shop.jpg"}
          alt={shop.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="md:w-2/3 w-full p-4 sm:p-6 md:p-8 flex flex-col justify-between">
        {/* Title & Basic Info */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg sm:text-2xl font-semibold text-gray-900">{shop.name}</h2>
            {shop.priceRange && (
              <span className="flex items-center gap-1 bg-gradient-to-r from-green-100 to-blue-100 text-green-700 text-xs sm:text-sm px-3 py-1 rounded-full shadow-sm font-medium">
  Price Range:
  <span className="text-green-500 font-semibold ml-1">Rs :</span>
  {shop.priceRange}
</span>

            )}
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-gray-600 text-xs sm:text-sm mb-2">
            <span className="flex items-center">
              <FaClock className="mr-2 text-purple-500" />
              {shop.openingHours || "Open: 9 AM - 10 PM"}
            </span>
            <span className="flex items-center">
              <FaPhoneAlt className="mr-2 text-green-500" />
              {shop.phone || "+94 77 123 4567"}
            </span>
          </div>
          <div className="flex items-start text-gray-600 text-xs sm:text-sm mt-3 leading-relaxed">
            <FaInfoCircle className="mt-1 mr-2 text-blue-500 flex-shrink-0" />
            <span>
              {shop.shopType || "No description available."}
            </span>
          </div>
          {/* Category Tags */}
          <div className="flex flex-wrap mt-4 gap-2">
            {categories.length > 0
              ? categories.map((cat) => (
                  <span
                    key={cat._id}
                    className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 text-xs sm:text-sm px-3 py-1 rounded-full shadow-sm hover:scale-105 transition"
                  >
                    {cat.name}
                  </span>
                ))
              : (
                <span className="bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full">
                  No categories
                </span>
              )
            }
          </div>
        </div>
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mt-6">
          <button className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-red-50 hover:text-red-500 hover:border-red-300 transition-all">
            <FaHeart className="text-red-400" />
            Favourite
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-green-50 hover:text-green-600 hover:border-green-300 transition-all">
            <FaMapMarkerAlt className="text-green-500" />
            Directions
          </button>
          <button
            onClick={() => navigate(`/foodpage/${shop._id}`)}
            className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-all"
          >
            <FaUtensils className="text-blue-500" />
            View Menu
          </button>
        </div>
      </div>
    </div>
  );
}

export default RestaurantCard;
