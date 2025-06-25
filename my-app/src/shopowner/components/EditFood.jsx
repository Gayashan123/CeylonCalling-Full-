import React, { useState, useRef } from "react";
import { FaTrash, FaImage, FaTimes } from "react-icons/fa";

const EditFood = ({ food, onClose, onUpdate, onDelete }) => {
  const [name, setName] = useState(food.name);
  const [price, setPrice] = useState(food.price);
  const [imageRemoved, setImageRemoved] = useState(false);
  const [preview, setPreview] = useState(food.picture || "");
  const [newImage, setNewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();

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

      if (newImage) {
        formData.append("picture", newImage);
      } else if (imageRemoved) {
        formData.append("picture", ""); // Indicate to backend to remove the image
      }

      const res = await fetch(`/api/food/${food._id}`, {
        method: "PUT",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to update food item");

      const updatedFood = await res.json();
      onUpdate(updatedFood);
    } catch (err) {
      alert("Failed to update food item.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8 relative">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
          onClick={onClose}
          aria-label="Close"
        >
          <FaTimes className="text-2xl" />
        </button>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Edit Food Item
        </h2>
        <div className="mb-6 flex flex-col items-center">
          <div className="relative group">
            <div className="w-40 h-40 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200 shadow-sm">
              {preview ? (
                <img
                  src={preview}
                  alt="Food preview"
                  className="object-cover w-full h-full"
                />
              ) : (
                <FaImage className="text-gray-300 text-6xl" />
              )}
            </div>
            {preview && (
              <button
                className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-red-600 transition"
                onClick={handleRemoveImage}
                title="Remove image"
              >
                <FaTrash className="text-base" />
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
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition flex items-center gap-2"
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
          >
            <FaImage />
            {preview ? "Change Image" : "Upload Image"}
          </button>
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-400 outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
          />
        </div>
        <div className="mb-6">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Price (Rs) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-400 outline-none"
            value={price}
            min={0}
            step={0.01}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between mt-8">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-600 bg-white hover:bg-gray-50 font-medium transition"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 shadow transition"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
          <button
            onClick={() => onDelete(food._id)}
            className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 shadow transition"
            disabled={loading}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditFood;