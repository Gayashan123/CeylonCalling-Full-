import { motion } from 'framer-motion';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';

const ChangePasswordModal = ({ onClose }) => {
  const { changePassword, isLoading } = useAuthStore();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.currentPassword) newErrors.currentPassword = 'Current password required';
    if (formData.newPassword.length < 6) newErrors.newPassword = 'Password must be at least 6 characters';
    if (formData.newPassword !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      await changePassword(formData.currentPassword, formData.newPassword);
      toast.success('Password updated successfully');
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Password update failed");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        className="bg-white rounded-xl p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold mb-4">Change Password</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Current Password</label>
            <input
              type="password"
              value={formData.currentPassword}
              onChange={e => setFormData({ ...formData, currentPassword: e.target.value })}
              className="w-full p-2 border rounded-md"
            />
            {errors.currentPassword && <p className="text-red-500 text-xs mt-1">{errors.currentPassword}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">New Password</label>
            <input
              type="password"
              value={formData.newPassword}
              onChange={e => setFormData({ ...formData, newPassword: e.target.value })}
              className="w-full p-2 border rounded-md"
            />
            {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Confirm Password</label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full p-2 border rounded-md"
            />
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
            >
              {isLoading ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ChangePasswordModal;