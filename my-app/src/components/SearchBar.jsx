import { FiSearch } from "react-icons/fi";

function SearchBar({ value, onChange, onSubmit, placeholder = "Search......" }) {
  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        onSubmit?.();
      }}
      className="w-full flex justify-center px-4 sm:px-6 md:px-8 lg:px-0" // Responsive horizontal padding
      role="search"
      aria-label="Search"
    >
      <div
        className="
          relative
          w-full
          max-w-xs    // default max width for mobile
          sm:max-w-sm // small devices (≥640px)
          md:max-w-md // medium devices (≥768px)
          lg:max-w-lg // large devices (≥1024px)
          xl:max-w-xl // extra large (≥1280px)
          2xl:max-w-2xl // 2xl screens (≥1536px)
          transition-all
        "
      >
        <input
          type="search"
          value={value}
          onChange={e => onChange?.(e.target.value)}
          placeholder={placeholder}
          className="
            peer
            block
            w-full
            rounded-full
            border border-gray-200
            bg-white
            py-2        // smaller vertical padding on mobile
            sm:py-3     // increased padding on sm and above
            pl-10       // padding left to fit icon nicely
            pr-5
            text-gray-800
            text-sm      // smaller text on mobile
            sm:text-base // base text on sm and above
            shadow-sm
            transition
            focus:outline-none
            focus:ring-2
            focus:ring-blue-500
            focus:border-blue-500
            placeholder-gray-400
            hover:shadow-md
          "
          aria-label={placeholder}
        />
        <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-lg sm:text-xl">
          <FiSearch />
        </span>
        <button
          type="submit"
          className="
            absolute right-2 top-1/2 -translate-y-1/2
            bg-blue-500 hover:bg-blue-600
            text-white
            rounded-full
            px-3 py-1
            text-xs sm:text-sm
            font-semibold
            shadow
            transition-all
            focus:outline-none focus:ring-2 focus:ring-blue-400
            hidden sm:block
          "
          aria-label="Search"
        >
          Search
        </button>
      </div>
    </form>
  );
}

export default SearchBar;
