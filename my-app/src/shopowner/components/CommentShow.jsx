import { useEffect, useState } from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../store/authStore"; // Adjust path if needed

// 🎨 Helper: Get initials from name/email
function getInitials(nameOrEmail = "") {
  const parts = nameOrEmail.trim().split(/[\s@.]+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

// 🎨 Helper: Generate a soft color from string
function stringToColor(str = "") {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00ffffff).toString(16).toUpperCase();
  return "#" + "00000".substring(0, 6 - c.length) + c;
}

export default function ShopComments({ shopId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useAuthStore();

  useEffect(() => {
    if (!shopId) return;
    setLoading(true);
    fetch(`/api/comments/shop/${shopId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setComments(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [shopId, token]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h2 className="text-center text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-gray-100 mb-10">
        Customer Reviews
      </h2>

      {loading ? (
        <div className="flex justify-center py-16">
          <svg
            className="animate-spin h-10 w-10 text-blue-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
        </div>
      ) : comments.length === 0 ? (
        <p className="text-center text-gray-400 dark:text-gray-500 text-sm sm:text-base">
          No reviews yet for this shop.
        </p>
      ) : (
        <AnimatePresence>
          {comments.map((c) => {
            const userName = c.user?.name || c.user?.email || "Anonymous";
            const initials = getInitials(userName);
            const bgColor = stringToColor(userName);

            return (
              <motion.div
                key={c._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
                className="bg-white dark:bg-[#1E1E1E] backdrop-blur-md border border-gray-200 dark:border-gray-700 shadow-xl rounded-3xl p-6 sm:p-8 mb-6 transition-all"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center font-bold text-white text-lg sm:text-xl shadow-md"
                    style={{ backgroundColor: bgColor }}
                    title={userName}
                  >
                    {initials}
                  </div>
                  <div className="text-gray-800 dark:text-gray-100 font-medium text-base sm:text-lg">
                    {userName}
                  </div>
                </div>

                {/* ⭐ Rating */}
                <div className="flex gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((i) =>
                    i <= c.rating ? (
                      <AiFillStar key={i} className="text-yellow-400" />
                    ) : (
                      <AiOutlineStar key={i} className="text-gray-300 dark:text-gray-600" />
                    )
                  )}
                </div>

                {/* 💬 Message */}
                <p className="text-gray-700 dark:text-gray-200 text-sm sm:text-base whitespace-pre-wrap leading-relaxed">
                  {c.message}
                </p>

                {/* 📅 Date */}
                <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 mt-3">
                  {new Date(c.createdAt).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </motion.div>
            );
          })}
        </AnimatePresence>
      )}
    </div>
  );
}
