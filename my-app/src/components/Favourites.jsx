import { motion, AnimatePresence } from "framer-motion";

function FavouritesModal({ isOpen, favourites, onClose, onRemove, loading }) {
  const favs = Array.isArray(favourites) ? favourites : [];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-30 z-50 flex justify-center items-center p-4 overflow-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-3xl shadow-xl max-w-3xl w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.95, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            role="dialog"
            aria-modal="true"
          >
            <button
              onClick={onClose}
              aria-label="Close favourites modal"
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition rounded-full p-1"
            >
              &times;
            </button>
            <h2 className="text-center text-2xl font-semibold text-gray-900 mb-6">
              Your Favourites
            </h2>
            {loading ? (
              <div className="text-center text-gray-400">Loading...</div>
            ) : favs.length === 0 ? (
              <p className="text-center text-gray-500">No items in favourites.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {favs.map((fav) => (
                  <motion.div
                    key={fav._id || fav.id}
                    className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-yellow-100 to-yellow-200 shadow"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    layout
                  >
                    <img
                      src={fav.photo ? `http://localhost:5000${fav.photo}` : "/default-shop.jpg"}
                      alt={fav.name || "Shop"}
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex flex-col flex-grow min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{fav.name || "No Name"}</h3>
                      <p className="text-sm text-gray-700">{fav.description || "No description."}</p>
                    </div>
                    <button
                      onClick={() => onRemove(fav._id || fav.id)}
                      className="text-red-600 font-semibold text-sm hover:underline focus:outline-none rounded"
                      aria-label={`Remove ${fav.name || "shop"} from favourites`}
                    >
                      Remove
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default FavouritesModal;