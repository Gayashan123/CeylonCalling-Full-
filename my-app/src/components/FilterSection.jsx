import { useState } from "react";
import { FaFilter } from "react-icons/fa";

/**
 * Simple, user-friendly price filter for a food/shop app.
 * - Clean, rounded, minimal UI.
 * - Responsive and accessible.
 */
function PriceFilter({ min = 0, max = 5000, value, onChange }) {
  const [localMin, setLocalMin] = useState(value?.min ?? min);
  const [localMax, setLocalMax] = useState(value?.max ?? max);

  // Handle apply
  const apply = () => {
    if (onChange) onChange({ min: Number(localMin), max: Number(localMax) });
  };

  return (
    <div className="w-full max-w-md mx-auto  mb-6 px-2">
      <div className="flex items-center gap-2 mb-3">
        <FaFilter className="text-blue-400 text-lg" />
        <h4 className="text-base sm:text-lg font-semibold text-gray-800">Price Range</h4>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex flex-col w-full">
            <label className="text-xs text-gray-600 mb-1">Min</label>
            <input
              type="number"
              min={min}
              max={localMax}
              value={localMin}
              onChange={e => setLocalMin(e.target.value)}
              placeholder="Min"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
              aria-label="Minimum price"
            />
          </div>
          <span className="text-gray-400">—</span>
          <div className="flex flex-col w-full">
            <label className="text-xs text-gray-600 mb-1">Max</label>
            <input
              type="number"
              min={localMin}
              max={max}
              value={localMax}
              onChange={e => setLocalMax(e.target.value)}
              placeholder="Max"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
              aria-label="Maximum price"
            />
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button
            type="button"
            onClick={apply}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow font-semibold transition-all"
          >
            <FaFilter />
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

export default PriceFilter;