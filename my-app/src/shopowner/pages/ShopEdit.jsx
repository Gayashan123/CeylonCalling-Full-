// File: pages/ShopEditPage.jsx
import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import axios from "axios";
import ShopEditModal from "../components/ShopEdit"; // reuse your existing form

const ShopEditPage = () => {
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);

  const goBack = () => window.history.back();

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const res = await axios.get("/api/shops/my-shop", {
          withCredentials: true,
        });
        setShop(res.data.shop);
      } catch (error) {
        console.error("Failed to fetch shop data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchShop();
  }, []);

  return (
    <div className="min-h-screen bg-[#f9fafa] flex flex-col items-center py-6 px-4 sm:px-8 relative font-sans">
      {/* Back Button */}
      <div className="w-full max-w-2xl mb-4">
        <button
          onClick={goBack}
          className="flex items-center text-blue-600 hover:text-blue-800 transition text-sm sm:text-base"
        >
          <FaArrowLeft className="mr-2" />
          Back to Settings
        </button>
      </div>

      {/* Heading */}
      <div className="w-full max-w-2xl text-center mb-4">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">Edit Your Shop</h1>
        <p className="text-sm text-gray-500">Update shop profile, image, and contact info</p>
      </div>

      {/* Shop Form */}
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        {loading ? (
          <p className="text-gray-500 text-center">Loading shop data...</p>
        ) : shop ? (
          <ShopEditModal shop={shop} onClose={goBack} />
        ) : (
          <p className="text-red-500 text-center">Failed to load shop information.</p>
        )}
      </div>
    </div>
  );
};

export default ShopEditPage;
