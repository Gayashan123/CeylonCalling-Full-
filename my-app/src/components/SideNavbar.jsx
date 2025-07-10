// components/NavItems.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaUserCircle,
  FaStore,
  FaCog,
  FaPlaneDeparture,
  FaHome,
} from "react-icons/fa";

function NavItems() {
  const navigate = useNavigate();

  const navItems = [
   
    { icon: <FaUserCircle />, label: "Profile", path: "/user/profile" },
    { icon: <FaStore />, label: "Shops", path: "/user/dashboard" },
    { icon: <FaPlaneDeparture />, label: "Travel", path: "/user/placepage" },
    { icon: <FaCog />, label: "Settings", path: "/usersetting" },
  ];

  return (
    <div className="w-full mt-13 fixed top-0 z-10 bg-white py-4 border-b border-gray-200 mb-6">
      <div className="max-w-screen-lg mx-auto px-4">
        <div className="flex sm:justify-between overflow-x-auto no-scrollbar gap-10">
          {navItems.map((item, idx) => (
            <motion.button
              key={idx}
              onClick={() => navigate(item.path)}
              whileTap={{ scale: 0.9 }}
              className="flex flex-col items-center flex-shrink-0"
            >
              <div className="bg-gradient-to-tr from-pink-400 to-yellow-300 p-[3px] rounded-full">
                <div className="bg-white p-3 rounded-full shadow hover:shadow-md transition">
                  <span className="text-pink-500 text-xl">{item.icon}</span>
                </div>
              </div>
              <span className="mt-1 text-xs font-semibold text-gray-600">{item.label}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NavItems;
