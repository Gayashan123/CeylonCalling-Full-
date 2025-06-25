import React, { useState } from 'react';
import { FaCamera, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
};

const modalVariants = {
  hidden: { y: "100%", opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", damping: 20, stiffness: 200 },
  },
  exit: {
    y: "100%",
    opacity: 0,
    transition: { duration: 0.3 },
  },
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
    setSuccessMsg("");
    setErrorMsg("");
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, val]) => formData.append(key, val));
      if (photo) formData.append("photo", photo);
      await axios.put(`/api/shops/${shop._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      setSuccessMsg("✅ Shop updated!");
      setTimeout(() => {
        setSuccessMsg("");
        onClose();
      }, 1200);
    } catch (err) {
      setErrorMsg(err.response?.data?.error || "Update failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        <div className="fixed inset-0 bg-black/30 backdrop-blur-md" onClick={onClose} />
        <motion.div
          className="relative w-full max-w-lg mx-auto bg-white/80 backdrop-blur-lg rounded-3xl p-6 sm:p-8 shadow-xl z-50"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition"
            aria-label="Close"
          >
            <FaTimes className="text-gray-600 w-5 h-5" />
          </button>

          <h2 className="text-center text-2xl font-bold text-purple-700 mb-6">Edit Shop Profile</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Image Upload */}
            <div className="flex justify-center">
              <label className="relative group w-24 h-24 rounded-full overflow-hidden ring-2 ring-teal-400 shadow-inner cursor-pointer">
                {preview ? (
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <FaCamera className="text-2xl" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <FaCamera className="text-white text-xl" />
                </div>
                <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
              </label>
            </div>

            {/* Grid Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Shop Name", name: "name", required: true },
                { label: "Location", name: "location", required: true },
                { label: "Price Range", name: "priceRange" },
                { label: "Active Hours", name: "activeTime" },
                { label: "Contact", name: "contact", required: true },
              ].map(({ label, name, required }) => (
                <div key={name}>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    {label}{required && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    required={required}
                    className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm bg-white shadow-inner focus:outline-none focus:ring-2 focus:ring-teal-400"
                  />
                </div>
              ))}

              {/* Shop Type */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Shop Type</label>
                <select
                  name="shopType"
                  value={form.shopType}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm bg-white shadow-inner focus:outline-none focus:ring-2 focus:ring-purple-400"
                >
                  <option value="restaurant">Restaurant</option>
                  <option value="small_food_shop">Small Food Shop</option>
                  <option value="hotel">Hotel</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Description</label>
              <textarea
                name="description"
                rows="3"
                value={form.description}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm bg-white shadow-inner resize-none focus:outline-none focus:ring-2 focus:ring-teal-400"
                placeholder="Tell something about your shop..."
              />
            </div>

            {/* Messages */}
            {successMsg && <p className="text-green-600 text-center">{successMsg}</p>}
            {errorMsg && <p className="text-red-500 text-center">{errorMsg}</p>}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full bg-gradient-to-r from-purple-500 to-teal-400 text-white font-semibold hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? "Saving..." : "Update Shop"}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
