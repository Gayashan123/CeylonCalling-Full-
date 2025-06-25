import React, { useState } from 'react';
import { FaUserCircle, FaLock, FaBell, FaPalette, FaSignOutAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from "../../shopowner/components/SideNavbar";
import shopownerImage from "../../assets/shopowner.jpg";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import axios from "axios";
import ShopEditModal from "../components/ShopEdit";

const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const buttonVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: 'easeOut' },
  }),
};

function Settings() {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const [shop, setShop] = useState(null);
  const [showShopEdit, setShowShopEdit] = useState(false);
  const [loadingShop, setLoadingShop] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const fetchShop = async () => {
    try {
      setLoadingShop(true);
      const res = await axios.get("/api/shops/my-shop", { withCredentials: true });
      setShop(res.data.shop);
    } catch (error) {
      console.error("Failed to fetch shop", error);
    } finally {
      setLoadingShop(false);
    }
  };

  const settingsOptions = [
    {
      icon: <FaUserCircle className="text-3xl text-blue-600" />,
      title: "Profile",
      description: "Update your shop information",
      ringColor: "focus:ring-blue-500",
      onClick: async () => {
        await fetchShop();
        setShowShopEdit(true);
      }
    },
    {
      icon: <FaLock className="text-3xl text-purple-600" />,
      title: "Change Password",
      description: "Update your password regularly",
      ringColor: "focus:ring-purple-500",
    },
    {
      icon: <FaBell className="text-3xl text-yellow-500" />,
      title: "Notifications",
      description: "Manage notification preferences",
      ringColor: "focus:ring-yellow-400",
    },
    {
      icon: <FaPalette className="text-3xl text-pink-500" />,
      title: "Theme",
      description: "Switch between light and dark mode",
      ringColor: "focus:ring-pink-500",
    },
    {
      icon: <FaSignOutAlt className="text-3xl text-red-600" />,
      title: "Logout",
      description: "Sign out of your account",
      ringColor: "focus:ring-red-500",
      isLogout: true,
      onClick: handleLogout,
    },
  ];

  return (
    <div className="relative min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <img
        src={shopownerImage}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover opacity-20 -z-10"
      />
      <motion.div
        className="w-full max-w-3xl bg-white bg-opacity-90 rounded-xl shadow-xl p-10 backdrop-blur-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-3xl font-extrabold mb-10 text-gray-900 text-center">Settings</h2>
        <div className="space-y-6">
          {settingsOptions.map((option, index) => (
            <motion.button
              key={option.title}
              type="button"
              custom={index}
              variants={buttonVariants}
              initial="hidden"
              animate="visible"
              onClick={option.onClick}
              disabled={loadingShop && option.title === "Profile"}
              className={`w-full flex items-center gap-6 p-5 rounded-lg hover:bg-gray-100 transition focus:outline-none focus:ring-2 ${option.ringColor} ${
                option.isLogout ? 'hover:bg-red-50' : ''
              } disabled:opacity-70 disabled:cursor-not-allowed`}
            >
              {option.icon}
              <div className="text-left">
                <p className={`text-lg font-semibold ${option.isLogout ? 'text-red-600' : 'text-gray-800'}`}>
                  {option.title}
                </p>
                <p className="text-sm text-gray-500">{option.description}</p>
                {loadingShop && option.title === "Profile" && (
                  <span className="text-xs text-blue-500 mt-1">Loading shop data...</span>
                )}
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
      <Navbar />
      <AnimatePresence>
        {showShopEdit && shop && (
          <ShopEditModal
            shop={shop}
            onClose={() => setShowShopEdit(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default Settings;
