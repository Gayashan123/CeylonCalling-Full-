import React, { useState } from 'react';
import {
  FaUserCircle,
  FaLock,
  FaBell,
  FaPalette,
  FaSignOutAlt,
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/SideNavbar';
import { useNavigate } from 'react-router-dom';
import { useSiteUserAuthStore } from '../store/siteUserAuthStore';
import ChangePassword from '../components/ChangePasswordModel';
import UpdateProfile from '../components/UpdateProfileModel';

const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

const buttonVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: 'easeOut' },
  }),
};

function UserSettings() {
  const { logout, user } = useSiteUserAuthStore();
  const navigate = useNavigate();

  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showUpdateProfile, setShowUpdateProfile] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const settingsOptions = [
    {
      icon: <FaUserCircle className="text-2xl sm:text-3xl text-blue-600" />,
      title: 'Profile',
      description: 'Update your user information',
      ringColor: 'focus:ring-blue-500',
      onClick: () => setShowUpdateProfile(true),
    },
    {
      icon: <FaLock className="text-2xl sm:text-3xl text-purple-600" />,
      title: 'Change Password',
      description: 'Update your password regularly',
      ringColor: 'focus:ring-purple-500',
      onClick: () => setShowChangePassword(true),
    },
    {
      icon: <FaBell className="text-2xl sm:text-3xl text-yellow-500" />,
      title: 'Notifications',
      description: 'Manage notification preferences',
      ringColor: 'focus:ring-yellow-400',
      onClick: () => {},
    },
    {
      icon: <FaPalette className="text-2xl sm:text-3xl text-pink-500" />,
      title: 'Theme',
      description: 'Switch between light and dark mode',
      ringColor: 'focus:ring-pink-500',
      onClick: () => {},
    },
    {
      icon: <FaSignOutAlt className="text-2xl sm:text-3xl text-red-600" />,
      title: 'Logout',
      description: 'Sign out of your account',
      ringColor: 'focus:ring-red-500',
      isLogout: true,
      onClick: handleLogout,
    },
  ];

  return (
    <div className="relative min-h-screen bg-gray-50 flex flex-col justify-center items-center py-8 px-2 sm:py-12 sm:px-6 lg:px-8 overflow-hidden">
      <motion.div
        className="w-full max-w-lg sm:max-w-2xl md:max-w-3xl bg-white bg-opacity-90 rounded-xl shadow-xl p-5 sm:p-10 backdrop-blur-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-xl sm:text-3xl font-extrabold mb-6 sm:mb-10 text-gray-900 text-center lowercase sm:normal-case">
          settings
        </h2>
        <div className="space-y-3 sm:space-y-6">
          {settingsOptions.map((option, index) => (
            <motion.button
              key={option.title}
              type="button"
              custom={index}
              variants={buttonVariants}
              initial="hidden"
              animate="visible"
              onClick={option.onClick}
              className={`w-full flex items-center gap-3 sm:gap-6 p-3 sm:p-5 rounded-lg hover:bg-gray-100 transition focus:outline-none focus:ring-2 ${option.ringColor} ${
                option.isLogout ? 'hover:bg-red-50' : ''
              }`}
            >
              {option.icon}
              <div className="text-left">
                <p
                  className={`text-sm sm:text-lg font-semibold ${
                    option.isLogout ? 'text-red-600' : 'text-gray-800'
                  } lowercase sm:normal-case`}
                >
                  {option.title}
                </p>
                <p className="text-xs sm:text-sm text-gray-500 lowercase sm:normal-case">{option.description}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      <Navbar />

      {/* Modals */}
      <AnimatePresence>
        {showUpdateProfile && (
          <UpdateProfile user={user} onClose={() => setShowUpdateProfile(false)} />
        )}
        {showChangePassword && (
          <ChangePassword onClose={() => setShowChangePassword(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default UserSettings;