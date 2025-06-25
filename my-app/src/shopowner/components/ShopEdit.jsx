// File: components/ShopEditModal.jsx
import React, { useState } from 'react';
import { FaCamera, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const modalVariants = {
  hidden: { y: "100%", opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", damping: 25, stiffness: 200 },
  },
  exit: {
    y: "100%",
    opacity: 0,
    transition: { duration: 0.3 },
  },
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
};

export default function ShopEditModal({ shop, onClose }) {
  const [form, setForm] = useState({
    name: shop?.name || "",
    activeTime: shop?.activeTime || "",
    description: shop?.description || "",
    location: shop?.location || "",
    priceRange: shop?.priceRange || "",
    shopType: shop?.shopType || "restaurant",
    contact: shop?.contact || "",
  });
  const [preview, setPreview] = useState(shop?.photo || null);
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      if (photo) formData.append("photo", photo);
      await axios.put(`/api/shops/${shop._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      setSuccessMsg("Shop updated successfully!");
      setTimeout(() => {
        setSuccessMsg("");
        onClose();
      }, 1500);
    } catch (err) {
      setErrorMsg(err.response?.data?.error || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex mb-8 items-end sm:items-center justify-center"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-transparent bg-opacity-30 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Modal */}
        <motion.div
          className="relative w-full max-w-[95vw] sm:max-w-[480px] bg-white rounded-3xl shadow-lg p-4 sm:p-8 z-50 font-sf-pro text-gray-900"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          role="dialog"
          aria-modal="true"
          aria-labelledby="shop-edit-title"
          style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif' }}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition"
          >
            <FaTimes className="text-gray-600 w-5 h-5" />
          </button>

          {/* Title */}
          <h2
            id="shop-edit-title"
            className="text-lg sm:text-2xl font-semibold text-center mb-6 select-none"
          >
            Edit Your Shop Profile
          </h2>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Image */}
            <div className="flex justify-center mb-6">
              <label className="cursor-pointer relative group rounded-full shadow-inner ring-1 ring-gray-200 w-20 h-20 sm:w-24 sm:h-24 overflow-hidden bg-gray-50">
                {preview ? (
                  <img
                    src={preview}
                    alt="Shop preview"
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-gray-400">
                    <FaCamera className="w-6 h-6 sm:w-6 sm:h-6" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <FaCamera className="text-white w-5 h-5" />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                  aria-label="Upload shop photo"
                />
              </label>
            </div>

            {/* Responsive grid: 1 column on xs, 2 columns on sm+ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Left Column */}
              <div className="flex flex-col space-y-5">
                {[ 
                  { name: "name", label: "Shop Name", required: true },
                  { name: "location", label: "Location", required: true },
                  { name: "priceRange", label: "Price Range" },
                ].map(({ name, label, required }) => (
                  <div key={name} className="flex flex-col">
                    <label
                      htmlFor={name}
                      className="mb-1 text-sm sm:text-base font-medium text-gray-700"
                    >
                      {label}
                      {required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    <input
                      id={name}
                      name={name}
                      value={form[name]}
                      onChange={handleChange}
                      required={required}
                      className="rounded-xl border border-gray-300 bg-gray-50 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      autoComplete="off"
                      spellCheck={false}
                      type="text"
                      inputMode="text"
                    />
                  </div>
                ))}
              </div>

              {/* Right Column */}
              <div className="flex flex-col space-y-5">
                {[
                  { name: "activeTime", label: "Active Hours" },
                  { name: "contact", label: "Contact Number", required: true },
                  { name: "shopType", label: "Shop Type", isSelect: true },
                ].map(({ name, label, required, isSelect }) => (
                  <div key={name} className="flex flex-col">
                    <label
                      htmlFor={name}
                      className="mb-1 text-sm sm:text-base font-medium text-gray-700"
                    >
                      {label}
                      {required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    {isSelect ? (
                      <select
                        id={name}
                        name={name}
                        value={form[name]}
                        onChange={handleChange}
                        className="rounded-xl border border-gray-300 bg-gray-50 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        aria-label="Select shop type"
                      >
                        <option value="restaurant">Restaurant</option>
                        <option value="small_food_shop">Small Food Shop</option>
                        <option value="hotel">Hotel</option>
                      </select>
                    ) : (
                      <input
                        id={name}
                        name={name}
                        value={form[name]}
                        onChange={handleChange}
                        required={required}
                        className="rounded-xl border border-gray-300 bg-gray-50 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        autoComplete="off"
                        spellCheck={false}
                        type="text"
                        inputMode="text"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Description - full width */}
            <div className="flex flex-col">
              <label
                htmlFor="description"
                className="mb-1 text-sm sm:text-base font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="3"
                placeholder="Write something about your shop..."
                className="rounded-xl border border-gray-300 bg-gray-50 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
                spellCheck={false}
              />
            </div>

            {/* Messages */}
            {successMsg && (
              <p className="text-green-600 text-center font-medium">{successMsg}</p>
            )}
            {errorMsg && (
              <p className="text-red-600 text-center font-medium">{errorMsg}</p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 py-3 text-white font-semibold shadow-md hover:from-blue-700 hover:to-blue-600 transition disabled:opacity-60"
              aria-busy={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
