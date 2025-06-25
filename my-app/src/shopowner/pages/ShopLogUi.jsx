import { useState } from "react";
import Quiz from "../../assets/Restaurent.jpg";
import { FaSignInAlt, FaUserPlus, FaHome } from "react-icons/fa";
import Login from "../components/ShopLogin";
import AdminLogin from "../components/CreateShop";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

function Home() {
  const [showLogin, setShowLogin] = useState(false);
  const [adminLog, setAdminLog] = useState(false);
  const navigate = useNavigate();

  // Background section animation
  const backgroundVariants = {
    hidden: { opacity: 0, scale: 1.05 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
  };

  // Card fade-in animation
  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, type: "spring", stiffness: 180, damping: 20 },
    },
  };

  // Button animation (hover/tap)
  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  // Modal animation
  const modalVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 250, damping: 25 },
    },
    exit: { opacity: 0, y: 40, scale: 0.95, transition: { duration: 0.2 } },
  };

  return (
    <>
      {/* Main Section */}
      <motion.div
        className="min-h-screen bg-cover bg-center flex items-center justify-center px-4"
        style={{ backgroundImage: `url(${Quiz})` }}
        variants={backgroundVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="bg-white/60 backdrop-blur-lg p-8 rounded-2xl shadow-2xl text-center max-w-md w-full"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <h1 className="text-4xl font-semibold text-gray-900 mb-3 tracking-tight">Welcome</h1>
          <p className="text-gray-700 mb-6 text-base font-light">
            Create your own shop to increase your food selling
          </p>

          <div className="flex flex-col gap-4">
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => navigate("/login")}
              className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-2xl shadow-sm hover:shadow-lg transition duration-300 ease-in-out"
            >
              <FaSignInAlt /> Shop Login
            </motion.button>

            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
               onClick={() => navigate("/signup")}
              className="w-full flex items-center justify-center gap-3 bg-gray-900 hover:bg-gray-800 text-white py-2.5 rounded-2xl shadow-sm hover:shadow-lg transition duration-300 ease-in-out"
            >
              <FaUserPlus /> Create Shop Account
            </motion.button>

            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => navigate("/")}
              className="w-full flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-2xl shadow-sm hover:shadow-lg transition duration-300 ease-in-out"
            >
              <FaHome /> Back to Home
            </motion.button>
          </div>
        </motion.div>
      </motion.div>

      {/* Login / Admin Modal with AnimatePresence */}
      <AnimatePresence>
        {(showLogin || adminLog) && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {showLogin && (
              <motion.div
                key="login"
                className="z-50"
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <Login closeLogin={() => setShowLogin(false)} />
              </motion.div>
            )}
            {adminLog && (
              <motion.div
                key="admin"
                className="z-50"
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <AdminLogin closeLogin={() => setAdminLog(false)} />
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Home;
