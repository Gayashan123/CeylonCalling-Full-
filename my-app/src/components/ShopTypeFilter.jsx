import { FaStore, FaHome, FaHotel, FaUtensils } from "react-icons/fa";

const SHOP_TYPES = [
  {
    key: "all",
    label: "All",
    icon: <FaUtensils className="text-blue-400" />,
    pill: "bg-blue-50 text-blue-700",
    active: "bg-blue-500 text-white shadow-lg",
  },
  {
    key: "small food shops",
    label: "Small Food Shops",
    icon: <FaStore className="text-green-400" />,
    pill: "bg-green-50 text-green-700",
    active: "bg-green-500 text-white shadow-lg",
  },
  {
    key: "restaurant",
    label: "Restaurants",
    icon: <FaHome className="text-purple-400" />,
    pill: "bg-purple-50 text-purple-700",
    active: "bg-purple-500 text-white shadow-lg",
  },
  {
    key: "hotel",
    label: "Hotel",
    icon: <FaHotel className="text-pink-400" />,
    pill: "bg-pink-50 text-pink-700",
    active: "bg-pink-500 text-white shadow-lg",
  },
  
];

function ShopTypeFilter({ value, onChange }) {
  return (
    <section className="w-full mb-8">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-5 text-center sm:text-left">Filter by Shop Type</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 justify-center">
        {SHOP_TYPES.map((type) => {
          const isActive = value === type.key;
          return (
            <button
              key={type.key}
              type="button"
              onClick={() => onChange(type.key)}
              className={`flex items-center justify-center sm:justify-start gap-2 px-4 py-2
                rounded-full font-medium shadow border border-transparent
                focus:outline-none focus:ring-2 focus:ring-blue-300
                transition-all duration-200 text-sm sm:text-base
                ${isActive
                  ? type.active + " scale-105 ring-2 ring-offset-2"
                  : type.pill + " hover:bg-opacity-80 hover:shadow-md"
                }
              `}
              aria-pressed={isActive}
            >
              {type.icon}
              <span className="whitespace-nowrap">{type.label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default ShopTypeFilter;
