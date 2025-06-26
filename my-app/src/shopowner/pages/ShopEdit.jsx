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
    <div className="min-h-screen bg-[#f9fafa] flex flex-col items-center py-6 px-2 sm:px-4 md:px-8 relative font-sans">
      {/* Back Button */}
      <div className="w-full max-w-full sm:max-w-2xl mb-4">
        <button
          onClick={goBack}
          className="flex items-center text-blue-600 hover:text-blue-800 transition text-xs sm:text-sm md:text-base lowercase sm:normal-case"
        >
          <FaArrowLeft className="mr-2" />
          back to settings
        </button>
      </div>

      {/* Heading */}
      <div className="w-full max-w-full sm:max-w-2xl text-center mb-4">
        <h1 className="text-lg sm:text-2xl md:text-3xl font-semibold text-gray-800 lowercase sm:normal-case">
          edit your shop
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 lowercase sm:normal-case">
          update shop profile, image, and contact info
        </p>
      </div>

      {/* Shop Form */}
      <div className="w-full max-w-full sm:max-w-2xl bg-white rounded-2xl shadow-xl p-3 sm:p-6 md:p-8">
        {loading ? (
          <p className="text-gray-500 text-center text-xs sm:text-base lowercase sm:normal-case">loading shop data...</p>
        ) : shop ? (
          <ShopEditModal shop={shop} onClose={goBack} />
        ) : (
          <p className="text-red-500 text-center text-xs sm:text-base lowercase sm:normal-case">failed to load shop information.</p>
        )}
      </div>
    </div>
  );
};

export default ShopEditPage;