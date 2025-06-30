import { FiSearch } from "react-icons/fi";

function SearchBar({ value, onChange, onSubmit, placeholder = "Search shops...." }) {
  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        onSubmit?.();
      }}
      className="w-full flex justify-center"
      role="search"
      aria-label="Search"
    >
      <div
        className="
          relative
          w-full
          max-w-lg
          sm:max-w-md
          md:max-w-xl
          lg:max-w-2xl
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
            py-3 pl-12 pr-5
            text-gray-800
            text-base
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
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xl">
          <FiSearch />
        </span>
        <button
          type="submit"
          className="
            absolute right-2 top-1/2 -translate-y-1/2
            bg-blue-500 hover:bg-blue-600
            text-white
            rounded-full
            px-4 py-1
            text-sm font-semibold
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