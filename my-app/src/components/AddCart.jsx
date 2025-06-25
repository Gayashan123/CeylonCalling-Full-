// Rename closeCart to onClose
const CartModal = ({ cartItems = [], onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-sm px-4">
      <div className="relative w-full max-w-md sm:max-w-lg md:max-w-xl rounded-3xl bg-white border border-white/20 shadow-xl shadow-black/40 p-6 sm:p-8 text-black backdrop-blur-xl transition-all duration-300 ease-in-out">
        
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-black hover:text-black"
          onClick={onClose} // <- updated here
          aria-label="Close cart"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-3xl font-semibold text-center mb-6 text-black/90">
          Selected Restaurants
        </h2>

        {/* Restaurant List */}
        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
          {cartItems.length === 0 ? (
            <p className="text-center text-white/60">No restaurants selected.</p>
          ) : (
            cartItems.map((restaurant, index) => (
              <div
                key={index}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 shadow-sm hover:shadow-md transition"
              >
                <p className="font-medium text-white">{restaurant.name}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CartModal;
