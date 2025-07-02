import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaSignInAlt, FaUserPlus, FaHome } from "react-icons/fa";
import Quiz from "../assets/Restaurent.jpg";

function UserLogUi() {
  const navigate = useNavigate();

  // Animations
  const backgroundVariants = {
    hidden: { opacity: 0, scale: 1.05 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, type: "spring", stiffness: 180, damping: 20 },
    },
  };

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  return (
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
        <h1 className="text-4xl font-semibold text-gray-900 mb-3 tracking-tight">Welcome Customer</h1>
        <p className="text-gray-700 mb-6 text-base font-light">
          Log in or sign up to place orders and enjoy your food experience!
        </p>

        <div className="flex flex-col gap-4">
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => navigate("/user/login")}
            className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-2xl shadow-sm hover:shadow-lg transition duration-300 ease-in-out"
          >
            <FaSignInAlt /> User Login
          </motion.button>

          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => navigate("/user/signup")}
            className="w-full flex items-center justify-center gap-3 bg-gray-900 hover:bg-gray-800 text-white py-2.5 rounded-2xl shadow-sm hover:shadow-lg transition duration-300 ease-in-out"
          >
            <FaUserPlus /> User Signup
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
  );
}

export default UserLogUi;