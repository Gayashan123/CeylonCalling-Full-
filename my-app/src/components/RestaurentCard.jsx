import {
  FaHeart,
  FaMapMarkerAlt,
  FaUtensils,
  FaPhoneAlt,
  FaClock,
  FaInfoCircle,
} from "react-icons/fa";

function RestaurantCard({ shop, onViewMenu }) {
  return (
    <div className="flex flex-col md:flex-row bg-white/70 backdrop-blur-lg border border-gray-100 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-all duration-300 overflow-hidden w-full max-w-5xl mx-auto mt-8 group hover:scale-[1.01]">
      
      {/* Image */}
      <div className="md:w-1/3 w-full h-48 sm:h-60 md:h-auto overflow-hidden">
        <img
          src={shop.photo ? `http://localhost:5000${shop.photo}` : "/default-shop.jpg"}
          alt={shop.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="md:w-2/3 w-full p-5 sm:p-6 md:p-8 flex flex-col justify-between">
        {/* Title & Basic Info */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">{shop.name}</h2>

          <div className="flex items-center text-sm text-gray-600 mb-2">
            <FaClock className="mr-2 text-purple-500" />
            {shop.openingHours || "Open: 9 AM - 10 PM"}
          </div>

          <div className="flex items-center text-sm text-gray-600 mb-2">
            <FaPhoneAlt className="mr-2 text-green-500" />
            {shop.phone || "+94 77 123 4567"}
          </div>

          <div className="flex items-start text-sm text-gray-600 mt-4 leading-relaxed">
            <FaInfoCircle className="mt-1 mr-2 text-blue-500 flex-shrink-0" />
            <p>
              {shop.description || "No description available."}
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap mt-4 gap-2">
            {[shop.category || "General", "Local", "Veg Friendly"].map((tag, index) => (
              <span
                key={index}
                className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 text-xs px-3 py-1 rounded-full shadow-sm hover:scale-105 transition"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mt-6">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-red-50 hover:text-red-500 hover:border-red-300 transition-all">
            <FaHeart className="text-red-400" />
            Favourite
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-green-50 hover:text-green-600 hover:border-green-300 transition-all">
            <FaMapMarkerAlt className="text-green-500" />
            Directions
          </button>
          <button
            onClick={() => onViewMenu(shop)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-all"
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