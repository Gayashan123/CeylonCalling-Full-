import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiUpload, FiTrash2, FiCheckCircle, FiMapPin, FiTag, FiEdit2, FiInfo } from "react-icons/fi";

const MAX_PHOTOS = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const AddLocation = ({ onClose }) => {
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    categories: [],
    photos: []
  });
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/placecat", {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        
        if (response.ok) {
          setCategories(data.data || data);
        } else {
          throw new Error(data.error || "Failed to load categories");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCategories();
    
    return () => {
      formData.photos.forEach(photo => {
        URL.revokeObjectURL(photo.preview);
      });
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e) => {
    const options = Array.from(e.target.selectedOptions);
    const selectedCategories = options.map(option => option.value);
    setFormData(prev => ({ ...prev, categories: selectedCategories }));
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handlePhotoUpload({ target: { files: e.dataTransfer.files } });
    }
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + formData.photos.length > MAX_PHOTOS) {
      setError(`You can upload maximum ${MAX_PHOTOS} photos`);
      return;
    }

    const invalidFiles = files.filter(file => file.size > MAX_FILE_SIZE);
    if (invalidFiles.length > 0) {
      setError(`Some files are too large (max ${MAX_FILE_SIZE / (1024 * 1024)}MB)`);
      return;
    }

    const validFiles = files.filter(file => 
      file.type.startsWith('image/') && 
      file.size <= MAX_FILE_SIZE
    );

    const newPhotos = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name
    }));

    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, ...newPhotos].slice(0, MAX_PHOTOS)
    }));
    setError("");
    e.target.value = "";
  };

  const removePhoto = (index) => {
    const updatedPhotos = [...formData.photos];
    URL.revokeObjectURL(updatedPhotos[index].preview);
    updatedPhotos.splice(index, 1);
    setFormData(prev => ({ ...prev, photos: updatedPhotos }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description || "");
      formDataToSend.append('location', formData.location);
      
      formData.categories.forEach(cat => 
        formDataToSend.append('categories', cat)
      );
      
      formData.photos.forEach(photo => 
        formDataToSend.append('images', photo.file)
      );

      const response = await fetch("/api/place", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: formDataToSend
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create location");
      }

      setSuccess("Location created successfully!");
  
      setTimeout(() => {
        setFormData({
          title: "",
          description: "",
          location: "",
          categories: [],
          photos: []
        });
        setSuccess("");
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const backdropVariants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 }
  };

  const modalVariants = {
    hidden: { opacity: 0, y: "20px", scale: 0.98 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      transition: { 
        type: "spring", 
        stiffness: 300,
        damping: 25,
        duration: 0.3
      } 
    },
    exit: { 
      opacity: 0, 
      y: "20px", 
      transition: { ease: "easeInOut", duration: 0.2 } 
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        <motion.div
          className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="sticky top-0 bg-white p-5 border-b border-gray-100 flex justify-between items-center z-10">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Add New Location</h2>
              <p className="text-sm text-gray-500 mt-1">Share your favorite places with the community</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition"
              disabled={isSubmitting}
            >
              <FiX size={24} />
            </button>
          </div>

          <div className="p-5">
            {success && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-green-50 border border-green-100 text-green-700 rounded-lg flex items-start gap-3"
              >
                <FiCheckCircle className="flex-shrink-0 mt-0.5 text-green-500" />
                <div>
                  <p className="font-medium">Success!</p>
                  <p className="text-sm">{success}</p>
                </div>
              </motion.div>
            )}
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-red-50 border border-red-100 text-red-700 rounded-lg flex items-start gap-3"
              >
                <FiInfo className="flex-shrink-0 mt-0.5 text-red-500" />
                <div>
                  <p className="font-medium">Error</p>
                  <p className="text-sm">{error}</p>
                </div>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Title*
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 transition"
                    placeholder="Enter location name"
                    required
                    disabled={isSubmitting}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <FiEdit2 className="text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 transition"
                  placeholder="Tell us about this place..."
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Location*
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 transition"
                    placeholder="Address or area"
                    required
                    disabled={isSubmitting}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <FiMapPin className="text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Categories*
                </label>
                {isLoading ? (
                  <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500"></div>
                    <span className="ml-2 text-sm text-gray-500">Loading categories...</span>
                  </div>
                ) : (
                  <>
                    <select
                      multiple
                      name="categories"
                      value={formData.categories}
                      onChange={handleCategoryChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[44px]"
                      required
                      disabled={isSubmitting || categories.length === 0}
                    >
                      {categories.length === 0 ? (
                        <option disabled>No categories available</option>
                      ) : (
                        categories.map(category => (
                          <option key={category._id} value={category._id}>
                            {category.name}
                          </option>
                        ))
                      )}
                    </select>
                    <div className="flex items-center mt-1 text-xs text-gray-500">
                      <FiInfo className="mr-1 flex-shrink-0" />
                      <span>Hold Ctrl/Cmd to select multiple categories</span>
                    </div>
                  </>
                )}
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Photos ({formData.photos.length}/{MAX_PHOTOS})
                </label>
                
                {formData.photos.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
                    {formData.photos.map((photo, index) => (
                      <motion.div 
                        key={index} 
                        className="relative group aspect-square"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <img
                          src={photo.preview}
                          alt={`Preview ${photo.name}`}
                          className="w-full h-full object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removePhoto(index)}
                          className="absolute top-2 right-2 bg-white/80 text-red-500 p-1.5 rounded-full shadow-sm hover:bg-white hover:scale-110 transition-all"
                          disabled={isSubmitting}
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
                
                {formData.photos.length < MAX_PHOTOS && (
                  <div 
                    className={`flex items-center justify-center w-full rounded-xl border-2 border-dashed ${
                      isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-400'
                    } transition-colors cursor-pointer`}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current.click()}
                  >
                    <label className="flex flex-col items-center justify-center w-full p-6 cursor-pointer">
                      <div className="p-3 mb-3 rounded-full bg-blue-50 text-blue-500">
                        <FiUpload size={24} />
                      </div>
                      <p className="text-sm text-gray-600 text-center mb-1">
                        {isDragging ? 'Drop your photos here' : 'Click to upload or drag and drop'}
                      </p>
                      <p className="text-xs text-gray-400">
                        {MAX_PHOTOS - formData.photos.length} photos remaining • Max {MAX_FILE_SIZE / (1024 * 1024)}MB each
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                        disabled={isSubmitting}
                      />
                    </label>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition font-medium"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 transition font-medium shadow-sm hover:shadow-md disabled:opacity-70 flex items-center justify-center gap-2"
                  disabled={isSubmitting || 
                    !formData.title || 
                    !formData.location || 
                    formData.categories.length === 0
                  }
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </>
                  ) : (
                    <>
                      <FiMapPin className="flex-shrink-0" />
                      Create Location
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddLocation;