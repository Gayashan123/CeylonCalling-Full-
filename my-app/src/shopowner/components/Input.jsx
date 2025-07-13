const Input = ({ icon: Icon, ...props }) => {
  return (
    <div className="relative mb-6">
      {/* Icon container */}
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        <Icon className="h-5 w-5 text-green-500" />
      </div>
      {/* Input field */}
      <input
        {...props}
        className="
          w-full
          pl-10
          pr-3
          py-2
          rounded-3xl
          border
          border-gray-300
          bg-white
          text-gray-900
          placeholder-gray-400
          focus:outline-none
          focus:ring-2
          focus:ring-green-500
          focus:border-green-500
          transition
          duration-200
          ease-in-out
          shadow-sm
        "
      />
    </div>
  );
};

export default Input;
