import React, { useState } from "react";
import { FaTimes, FaTrash, FaImage, FaCheck } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const getDisplayImage = (photo) => {
  if (!photo) return "https://via.placeholder.com/600x300?text=No+Image";
  if (photo.startsWith("http://") || photo.startsWith("https://")) return photo;
  if (photo.startsWith("/uploads")) return photo;
  if (photo.startsWith("uploads")) return "/" + photo;
  return photo;
};

const EditPlaceModal = ({ place, categories, onClose, onUpdate, onDelete }) => {
  const [form, setForm] = useState({
    title: place.title || "",
    description: place.description || "",
    location: place.location || "",
    categories: Array.isArray(place.categories) && place.categories.length
      ? place.categories.map((cat) => cat._id)
      : [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [existingImages, setExistingImages] = useState(
    Array.isArray(place.images) ? [...place.images] : []
  );
  const [newImages, setNewImages] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setForm(prev => ({
      ...prev,
      categories: prev.categories.includes(value)
        ? prev.categories.filter(v => v !== value)
        : [...prev.categories, value],
    }));
  };

  const handleRemoveExistingImage = (img) => {
    setExistingImages(prev => prev.filter(item => item !== img));
  };

  const handleRemoveNewImage = (index) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddImages = (e) => {
    const files = Array.from(e.target.files);
    const allowed = Math.max(0, 5 - (existingImages.length + newImages.length));
    setNewImages(prev => [...prev, ...files.slice(0, allowed)]);
    e.target.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("location", form.location);
      form.categories.forEach(catId => formData.append("categories", catId));
      formData.append("existingImages", JSON.stringify(existingImages));
      newImages.forEach(file => formData.append("images", file));
      
      const res = await fetch(`/api/place/${place._id}`, {
        method: "PUT",
        credentials: "include",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update place");
      }

      const data = await res.json();
      onUpdate?.(data.data);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to update place");
    } finally {
      setLoading(false);
    }
  };

  const totalImages = existingImages.length + newImages.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="relative bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white p-4 border-b border-gray-100 flex justify-between items-center z-10">
          <h2 className="text-xl font-bold text-gray-800">Edit Location</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition"
          >
            <FaTimes size={18} />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-start gap-2">
              <FiInfo className="mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title*</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                maxLength={100}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                maxLength={1000}
                rows={3}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location*</label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Categories */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <label key={cat._id} className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full transition cursor-pointer">
                    <input
                      type="checkbox"
                      value={cat._id}
                      checked={form.categories.includes(cat._id)}
                      onChange={handleCategoryChange}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Photos ({totalImages}/5)
              </label>
              
              {/* Image Grid */}
              <div className="grid grid-cols-3 gap-3 mb-3">
                {existingImages.map((img, idx) => (
                  <div key={img} className="relative aspect-square group">
                    <img
                      src={getDisplayImage(img)}
                      alt="Place"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingImage(img)}
                      className="absolute top-2 right-2 bg-white/80 text-red-500 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                ))}
                
                {newImages.map((file, idx) => (
                  <div key={idx} className="relative aspect-square group">
                    <img
                      src={URL.createObjectURL(file)}
                      alt="New"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveNewImage(idx)}
                      className="absolute top-2 right-2 bg-white/80 text-red-500 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Upload Button */}
              {totalImages < 5 && (
                <label className="flex flex-col items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                  <FaImage className="text-gray-400 text-xl mb-2" />
                  <p className="text-sm text-gray-500 text-center">
                    <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Max {5 - totalImages} more photos (5MB each)
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleAddImages}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  if (window.confirm("Are you sure you want to delete this place?")) {
                    onDelete(place._id);
                    onClose();
                  }
                }}
                className="px-4 py-2.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition flex items-center justify-center gap-2 sm:order-3 sm:ml-auto"
              >
                <FaTrash size={14} />
                <span>Delete</span>
              </button>
              
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <FaCheck size={14} />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default EditPlaceModal;