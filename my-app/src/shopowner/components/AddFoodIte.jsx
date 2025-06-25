import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";

const backdropVariants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

const modalVariants = {
  hidden: { opacity: 0, y: "-100vh", scale: 0.8 },
  visible: { opacity: 1, y: "0", scale: 1, transition: { type: "spring", stiffness: 100, damping: 20 } },
  exit: { opacity: 0, y: "100vh", scale: 0.8, transition: { ease: "easeInOut" } }
};

const AddFoodItem = ({ onClose }) => {
  const fileInputRef = useRef();

  const [food, setFood] = useState({
    name: "",
    category: "",
    price: "",
    picture: null,
  });

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoriesError, setCategoriesError] = useState("");

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoadingCategories(true);
    fetch("/api/categories/my-shop", { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        setCategories(data);
        setLoadingCategories(false);
      })
      .catch(() => {
        setCategoriesError("Failed to load categories.");
        setLoadingCategories(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "picture") {
      setFood({ ...food, [name]: files[0] });
    } else {
      setFood({ ...food, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", food.name);
      formData.append("categoryId", food.category); // categoryId is expected on backend
      formData.append("price", food.price);
      if (food.picture) {
        formData.append("picture", food.picture);
      }

      const response = await fetch("/api/food", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      }

      if (!response.ok) {
        throw new Error((data && data.error) || "Failed to add food item.");
      }

      setSuccessMessage("Food item added successfully!");

      setFood({
        name: "",
        category: "",
        price: "",
        picture: null,
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setTimeout(() => {
        setSuccessMessage("");
        onClose();
      }, 1200);

    } catch (err) {
      setErrorMessage(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-2"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        <motion.div
          className="relative w-full max-w-md mx-auto bg-white rounded-3xl shadow-2xl p-8 transition-all duration-300"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <button
            aria-label="Close"
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 transition"
            disabled={submitting}
          >
            <FaTimes size={20} />
          </button>
          <h2 className="text-2xl font-semibold text-center mb-6 text-gray-900">Add New Food Item</h2>

          {successMessage && (
            <div className="mb-3 text-green-700 bg-green-100 border border-green-300 rounded px-3 py-2 text-center text-sm">
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="mb-3 text-red-700 bg-red-100 border border-red-300 rounded px-3 py-2 text-center text-sm">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              name="name"
              onChange={handleChange}
              value={food.name}
              placeholder="Food Name"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition bg-gray-50"
              autoComplete="off"
              required
              disabled={submitting}
            />

            {/* Category as select dropdown */}
            <div>
              <label className="block mb-1 text-gray-700 font-medium">Category</label>
              {loadingCategories ? (
                <div className="text-sm text-gray-500">Loading categories...</div>
              ) : categoriesError ? (
                <div className="text-sm text-red-500">{categoriesError}</div>
              ) : (
                <select
                  name="category"
                  value={food.category}
                  onChange={handleChange}
                  required
                  disabled={submitting}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition bg-gray-50"
                >
                  <option value="" disabled>
                    Select a category
                  </option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <input
              name="price"
              onChange={handleChange}
              value={food.price}
              placeholder="Price (e.g. Rs.450)"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition bg-gray-50"
              autoComplete="off"
              required
              type="number"
              min="0"
              inputMode="numeric"
              disabled={submitting}
            />
            <div>
              <label
                htmlFor="picture"
                className="block mb-1 text-gray-700 font-medium"
              >
                Food Picture
              </label>
              <input
                ref={fileInputRef}
                type="file"
                name="picture"
                accept="image/*"
                onChange={handleChange}
                className="block w-full text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 transition"
                disabled={submitting}
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-700 text-white font-semibold shadow-md hover:from-purple-600 hover:to-purple-800 transition text-lg"
              disabled={submitting}
            >
              {submitting ? "Adding..." : "Add Food"}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddFoodItem;