import { useState } from "react";
import { FaFilter } from "react-icons/fa";

/**
 * Responsive, accessible PriceFilter component with modern Apple-style UI.
 */
function PriceFilter({ min = 0, max = 5000, value, onChange }) {
  const [localMin, setLocalMin] = useState(value?.min ?? min);
  const [localMax, setLocalMax] = useState(value?.max ?? max);

  // Apply filter callback
  const apply = () => {
    if (onChange) onChange({ min: Number(localMin), max: Number(localMax) });
  };

  return (
    <section className="w-full max-w-md mx-auto mb-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <FaFilter className="text-blue-500 text-xl sm:text-2xl" aria-hidden="true" />
        <h4 className="text-lg sm:text-xl font-semibold text-gray-900 select-none">Price Range</h4>
      </div>

      {/* Filter Box */}
      <div className="bg-white shadow-gray-400 border border-gray-200 rounded-2xl shadow-md p-5 sm:p-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            apply();
          }}
          className="flex flex-col sm:flex-row items-center gap-4"
          aria-label="Price range filter form"
        >
          {/* Min Price */}
          <div className="flex flex-col w-full sm:w-1/2">
            <label
              htmlFor="min-price"
              className="mb-1 text-xs sm:text-sm font-medium text-gray-600"
            >
              Min Price
            </label>
            <input
              id="min-price"
              type="number"
              min={min}
              max={localMax}
              value={localMin}
              onChange={(e) => setLocalMin(e.target.value)}
              placeholder="0"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-800 text-sm sm:text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              aria-label="Minimum price"
            />
          </div>

          {/* Separator */}
          <span className="hidden sm:block text-gray-400 font-semibold text-xl select-none">—</span>

          {/* Max Price */}
          <div className="flex flex-col w-full sm:w-1/2">
            <label
              htmlFor="max-price"
              className="mb-1 text-xs sm:text-sm font-medium text-gray-600"
            >
              Max Price
            </label>
            <input
              id="max-price"
              type="number"
              min={localMin}
              max={max}
              value={localMax}
              onChange={(e) => setLocalMax(e.target.value)}
              placeholder={max.toString()}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-800 text-sm sm:text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              aria-label="Maximum price"
            />
          </div>

          {/* Apply Button */}
          <button
            type="submit"
            className="mt-4 sm:mt-0 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 focus:bg-blue-700 text-white font-semibold rounded-lg px-5 py-2.5 shadow-md transition-all text-sm sm:text-base select-none"
            aria-label="Apply price filter"
          >
            <FaFilter />
            Apply
          </button>
        </form>
      </div>
    </section>
  );
}

export default PriceFilter;
