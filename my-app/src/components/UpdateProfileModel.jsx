import { motion } from 'framer-motion';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { FaUser, FaEnvelope } from 'react-icons/fa';
import { useSiteUserAuthStore } from '../store/siteUserAuthStore';

const backdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
};

const modal = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 15 }
  },
  exit: { opacity: 0, y: 30 }
};

const InputField = ({ icon: Icon, label, type, value, onChange }) => (
  <div className="w-full">
    <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
    <div className="relative">
      <span className="absolute inset-y-0 left-3 flex items-center text-purple-400">
        <Icon />
      </span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        required
        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-full shadow-inner focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
      />
    </div>
  </div>
);

const UpdateProfileModal = ({ onClose }) => {
  const { user, updateProfile, isLoading } = useSiteUserAuthStore();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData.name, formData.email);
      toast.success('🎉 Profile updated successfully');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-transparent bg-opacity-80 backdrop-blur-md z-50 flex items-center justify-center px-4"
      variants={backdrop}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={onClose}
    >
      <motion.div
        variants={modal}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl"
      >
        <h2 className="text-2xl font-bold text-center text-purple-700 mb-6">Update Profile </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <InputField
            icon={FaUser}
            label="Name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <InputField
            icon={FaEnvelope}
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <div className="flex justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 rounded-full bg-gradient-to-r from-purple-500 to-teal-400 text-white font-semibold hover:opacity-90 transition disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Update'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default UpdateProfileModal;
