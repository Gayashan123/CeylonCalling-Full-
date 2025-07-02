// components/FavouritesModal.jsx
import { motion, AnimatePresence } from "framer-motion";

function FavouritesModal({ isOpen, favourites, onClose, onRemove }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-transparent bg-opacity-50 z-50 flex justify-center items-center p-4 overflow-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white dark:bg-[#1c1c1e] rounded-3xl shadow-xl max-w-3xl w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.95, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="favourites-modal-title"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              aria-label="Close favourites modal"
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-full p-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header */}
            <h2
              id="favourites-modal-title"
              className="text-center text-2xl font-semibold text-gray-900 dark:text-white mb-6 select-none"
            >
              Your Favourites
            </h2>

            {/* Content */}
            {favourites.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400">
                No items in favourites.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {favourites.map((fav) => (
                  <motion.div
                    key={fav._id}
                    className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-yellow-100 to-yellow-200 dark:from-yellow-900 dark:to-yellow-800 shadow hover:shadow-lg transition cursor-default"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    layout
                  >
                    <img
                      src={`http://localhost:5000${fav.picture}`}
                      alt={fav.name}
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex flex-col flex-grow min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                        {fav.name}
                      </h3>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        ${fav.price?.toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => onRemove(fav._id)}
                      className="text-red-600 dark:text-red-400 font-semibold text-sm hover:underline focus:outline-none focus:ring-2 focus:ring-red-400 rounded"
                      aria-label={`Remove ${fav.name} from favourites`}
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
