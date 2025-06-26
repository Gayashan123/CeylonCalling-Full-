import React, { useState, useRef, useEffect } from "react";
import { FaTrash, FaImage, FaTimes } from "react-icons/fa";

const EditFood = ({ food, onClose, onUpdate, onDelete }) => {
  const [name, setName] = useState(food.name);
  const [price, setPrice] = useState(food.price);
  const [categoryId, setCategoryId] = useState(
    food.categoryId?.toString() ||
    food.category?._id?.toString() ||
    ""
  );
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoriesError, setCategoriesError] = useState("");
  const [imageRemoved, setImageRemoved] = useState(false);
  const [preview, setPreview] = useState(food.picture || "");
  const [newImage, setNewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();

  // Load categories for the select dropdown
  useEffect(() => {
    setLoadingCategories(true);
    fetch("/api/categories/my-shop", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
        setLoadingCategories(false);
        // If initial category is missing, set to the first category
        if (!categoryId && data.length > 0) {
          setCategoryId(data[0]._id.toString());
        }
      })
      .catch(() => {
        setCategoriesError("Failed to load categories.");
        setLoadingCategories(false);
      });
    // eslint-disable-next-line
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImage(file);
      setPreview(URL.createObjectURL(file));
      setImageRemoved(false);
    }
  };

  const handleRemoveImage = () => {
    setImageRemoved(true);
    setNewImage(null);
    setPreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("categoryId", categoryId);
      if (newImage) {
        formData.append("picture", newImage);
      } else if (imageRemoved) {
        formData.append("picture", ""); // Signal backend to remove image
      }
      const res = await fetch(`/api/food/${food._id}`, {
        method: "PUT",
        body: formData,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update food item");
      const updatedFood = await res.json();
      onUpdate(updatedFood);
    } catch {
      alert("Failed to update food item.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{
        backdropFilter: "blur(20px)",
        backgroundColor: "rgba(255 255 255 / 0.7)",
        WebkitBackdropFilter: "blur(20px)",
      }}
      aria-modal="true"
      role="dialog"
      aria-labelledby="edit-food-title"
    >
      <div
        className="bg-white rounded-3xl shadow-xl p-6 max-w-xs w-full sm:max-w-md sm:w-[90vw] md:max-w-lg relative"
        style={{
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close Edit Food Modal"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-full p-2 transition"
        >
          <FaTimes size={24} />
        </button>

        <h2
          id="edit-food-title"
          className="text-center text-xl sm:text-2xl font-semibold text-[#1c1c1e] mb-6"
        >
          Edit Food Item
        </h2>

        {/* Image preview */}
        <div className="flex flex-col items-center sm:items-start">
          <div className="relative group rounded-xl overflow-hidden w-28 h-28 sm:w-36 sm:h-36 bg-gray-100 shadow-md border border-gray-300 flex items-center justify-center">
            {preview ? (
              <img
                src={preview}
                alt="Food preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <FaImage className="text-gray-300 text-5xl sm:text-6xl" />
            )}
            {preview && (
              <button
                onClick={handleRemoveImage}
                aria-label="Remove Image"
                className="absolute top-2 right-2 bg-black bg-opacity-30 hover:bg-opacity-60 text-white rounded-full p-1.5 transition"
              >
                <FaTrash size={16} />
              </button>
            )}
          </div>

          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            className="mt-4 bg-[#007AFF] hover:bg-[#005BBB] text-white rounded-xl px-5 py-3 font-semibold shadow-md flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-[#007AFF] transition"
          >
            <FaImage size={18} />
            {preview ? "Change Image" : "Upload Image"}
          </button>
        </div>

        {/* Inputs container */}
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:space-x-6">
          <div className="flex-1">
            <label className="block text-gray-700 font-medium mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
              className="w-full px-4 py-3 rounded-xl border border-gray-300 shadow-inner focus:ring-2 focus:ring-[#007AFF] focus:border-transparent outline-none text-lg"
              placeholder="Enter food name"
            />
          </div>

          <div className="flex-1">
            <label className="block text-gray-700 font-medium mb-1">
              Price (Rs) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={price}
              min="0"
              step="0.01"
              onChange={(e) => setPrice(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 shadow-inner focus:ring-2 focus:ring-[#007AFF] focus:border-transparent outline-none text-lg"
              placeholder="Enter price"
            />
          </div>
        </div>

        {/* Category select */}
        <div className="mt-5">
          <label className="block mb-1 text-gray-700 font-medium">Category <span className="text-red-500">*</span></label>
          {loadingCategories ? (
            <div className="text-sm text-gray-500">Loading categories...</div>
          ) : categoriesError ? (
            <div className="text-sm text-red-500">{categoriesError}</div>
          ) : (
            <select
              name="categoryId"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none bg-gray-50"
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id.toString()}>
                  {cat.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between mt-10">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#007AFF] transition"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="flex-1 py-3 rounded-xl bg-[#007AFF] text-white font-semibold shadow-md hover:bg-[#005BBB] focus:outline-none focus:ring-2 focus:ring-[#005BBB] transition"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
          <button
            onClick={() => onDelete(food._id)}
            disabled={loading}
            className="flex-1 py-3 rounded-xl bg-red-600 text-white font-semibold shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-700 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditFood;