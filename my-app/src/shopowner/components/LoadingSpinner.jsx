import { motion } from "framer-motion";

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Spinner with shadow and glow */}
      <motion.div
        className="w-20 h-20 border-4 border-t-4 border-t-emerald-400 border-emerald-100 rounded-full shadow-lg"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Loading text below spinner */}
      <motion.p
        className="mt-6 text-emerald-200 text-lg font-medium tracking-wide"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      >
        Loading...
      </motion.p>
    </div>
  );
};

export default LoadingSpinner;
