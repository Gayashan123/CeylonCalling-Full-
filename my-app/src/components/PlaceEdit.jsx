import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";

const getDisplayImage = (photo) => {
  if (!photo) return "https://via.placeholder.com/600x300?text=No+Image";
  if (photo.startsWith("http://") || photo.startsWith("https://")) return photo;
  if (photo.startsWith("/uploads")) return photo;
  if (photo.startsWith("uploads")) return "/" + photo;
  return photo;
};

const EditPlaceModal = ({
  place,
  categories,
  onClose,
  onUpdate,
  onDelete,
}) => {
  const [form, setForm] = useState({
    title: place.title || "",
    description: place.description || "",
    location: place.location || "",
    categories:
      Array.isArray(place.categories) && place.categories.length
        ? place.categories.map((cat) => cat._id)
        : [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // Store URLs for existing images
  const [existingImages, setExistingImages] = useState(
    Array.isArray(place.images) ? [...place.images] : []
  );
  // Store new files
  const [newImages, setNewImages] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setForm((prev) => ({
      ...prev,
      categories: prev.categories.includes(value)
        ? prev.categories.filter((v) => v !== value)
        : [...prev.categories, value],
    }));
  };

  // Remove from existing images (URLs)
  const handleRemoveExistingImage = (img) => {
    setExistingImages((prev) => prev.filter((item) => item !== img));
  };

  // Remove from new images (files)
  const handleRemoveNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Add new images (FileList)
  const handleAddImages = (e) => {
    const files = Array.from(e.target.files);
    // Limit total images: existing + new <= 5
    const allowed = Math.max(0, 5 - (existingImages.length + newImages.length));
    setNewImages((prev) => [...prev, ...files.slice(0, allowed)]);
    // Reset file input so user can re-upload the same file if needed
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
      form.categories.forEach((catId) => formData.append("categories", catId));
      formData.append("existingImages", JSON.stringify(existingImages));
      newImages.forEach((file) => formData.append("images", file));
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
      onUpdate && onUpdate(data.data); // send updated place to parent
      onClose();
    } catch (err) {
      setError(err.message || "Failed to update place");
    }
    setLoading(false);
  };

  // Total images
  const totalImages = existingImages.length + newImages.length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <form
        className="relative bg-white rounded-xl shadow-xl w-full max-w-lg p-6"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <button
          type="button"
          className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-lg"
          onClick={onClose}
          aria-label="Close"
        >
          <FaTimes />
        </button>
        <h2 className="text-xl font-bold mb-4">Edit Place</h2>
        {error && (
          <div className="mb-4 text-red-600 text-xs font-medium">{error}</div>
        )}
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            maxLength={100}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            maxLength={1000}
            className="w-full border rounded px-3 py-2"
            rows={3}
          />
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Location</label>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Categories</label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <label key={cat._id} className="flex items-center gap-1">
                <input
                  type="checkbox"
                  value={cat._id}
                  checked={form.categories.includes(cat._id)}
                  onChange={handleCategoryChange}
                />
                <span>{cat.name}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Images</label>
          <div className="flex gap-2 flex-wrap mb-2">
            {existingImages.map((img, idx) => (
              <div key={img} className="relative">
                <img
                  src={getDisplayImage(img)}
                  alt="Place"
                  className="h-16 w-24 object-cover rounded"
                />
                <button
                  type="button"
                  className="absolute -top-2 -right-2 bg-white rounded-full text-red-600 p-1 shadow"
                  onClick={() => handleRemoveExistingImage(img)}
                  title="Remove image"
                >
                  <FaTimes />
                </button>
              </div>
            ))}
            {newImages.map((file, idx) => (
              <div key={idx} className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt="New"
                  className="h-16 w-24 object-cover rounded"
                />
                <button
                  type="button"
                  className="absolute -top-2 -right-2 bg-white rounded-full text-red-600 p-1 shadow"
                  onClick={() => handleRemoveNewImage(idx)}
                  title="Remove new image"
                >
                  <FaTimes />
                </button>
              </div>
            ))}
          </div>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleAddImages}
            disabled={totalImages >= 5}
          />
          <div className="text-xs text-gray-400 mt-1">
            {totalImages}/5 images. (You can only have up to 5 images)
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="ml-auto bg-red-100 text-red-700 px-4 py-2 rounded hover:bg-red-200 transition"
            onClick={() => {
              if (
                window.confirm("Are you sure you want to delete this place?")
              ) {
                onDelete(place._id);
                onClose();
              }
            }}
          >
            Delete
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPlaceModal;