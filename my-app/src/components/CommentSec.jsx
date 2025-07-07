import { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { FiSend } from "react-icons/fi";
import { useSiteUserAuthStore } from "../store/siteUserAuthStore";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

// Helper: Generate initials from email or name
function getInitials(nameOrEmail = "") {
  const parts = nameOrEmail.trim().split(/[\s@.]+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

// Helper: Generate consistent color from string (email/name)
function stringToColor(str = "") {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00ffffff).toString(16).toUpperCase();
  return "#" + "00000".substring(0, 6 - c.length) + c;
}

export default function RestaurantComments({ shopId }) {
  const [input, setInput] = useState("");
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState(false);
  const { token } = useSiteUserAuthStore();

  // Fetch comments for the shop
  useEffect(() => {
    if (!shopId) return;
    setLoading(true);
    fetch(`/api/comments/shop/${shopId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setComments(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [shopId, token]);

  // Post a new comment
  const handlePost = async () => {
    if (!input.trim() || rating === 0) return;

    setPosting(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ shopId, message: input.trim(), rating }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to post comment");

      setComments((prev) => [data, ...prev]);
      setInput("");
      setRating(0);
      toast.success("Review posted successfully!");
    } catch (err) {
      toast.error(err.message);
    }
    setPosting(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 rounded-3xl shadow-xl">
      {/* Toast container */}
      <Toaster position="top-right" />

      <h2 className="text-2xl sm:text-3xl font-semibold mb-8 text-gray-900 text-center sm:text-left">
        Customer Reviews
      </h2>

      {/* Add a Review Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-3xl shadow-lg p-5 sm:p-8 mb-10"
      >
        <div className="flex items-center gap-4 mb-4">
          <div
            aria-hidden="true"
            className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-200 text-blue-700 font-semibold text-xl select-none"
          >
            You
          </div>
          <span className="text-lg font-medium text-gray-700 select-none"></span>
        </div>
        <textarea
          rows={4}
          placeholder="Share your experience..."
          className="w-full p-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 text-base resize-none placeholder-gray-400 transition disabled:bg-gray-100"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={posting}
          spellCheck={true}
          aria-label="Write your review"
        />
        <div className="flex flex-col sm:flex-row items-center justify-between mt-5 gap-4">
          {/* Star Rating UI */}
          <div className="flex gap-3">
            {[1, 2, 3, 4, 5].map((i) =>
              i <= rating ? (
                <AiFillStar
                  key={i}
                  className="text-yellow-400 cursor-pointer transition-transform hover:scale-125"
                  onClick={() => setRating(i)}
                  aria-label={`${i} star${i > 1 ? "s" : ""}`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") setRating(i);
                  }}
                />
              ) : (
                <AiOutlineStar
                  key={i}
                  className="text-gray-300 cursor-pointer transition-transform hover:scale-125"
                  onClick={() => setRating(i)}
                  aria-label={`${i} star${i > 1 ? "s" : ""}`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") setRating(i);
                  }}
                />
              )
            )}
          </div>

          {/* Submit button */}
          <motion.button
            onClick={handlePost}
            disabled={!input.trim() || rating === 0 || posting}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-3 rounded-full font-semibold shadow-lg transition disabled:cursor-not-allowed disabled:opacity-60 select-none"
            aria-label="Post your review"
          >
            <FiSend className="text-lg" />
            {posting ? (
              <svg
                className="animate-spin h-6 w-6 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            ) : (
              "Post"
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* Existing Reviews */}
      <div className="space-y-8">
        {loading ? (
          <div className="flex justify-center py-16">
            <svg
              className="animate-spin h-12 w-12 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-label="Loading comments"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
          </div>
        ) : comments.length === 0 ? (
          <p className="text-center text-gray-500 text-lg select-none">
            No reviews yet. Be the first to review!
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
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-3xl shadow-lg p-6 flex flex-col gap-4"
                >
                  <div className="flex items-center gap-4">
                    {/* Profile circle with initials */}
                    <div
                      className="flex items-center justify-center w-12 h-12 rounded-full font-semibold text-white text-lg select-none flex-shrink-0"
                      style={{ backgroundColor: bgColor }}
                      aria-label={`Profile image for ${userName}`}
                      title={userName}
                    >
                      {initials}
                    </div>
                    <span className="font-semibold text-gray-900 select-text text-base sm:text-lg">
                      {userName}
                    </span>
                  </div>
                  <div
                    className="flex gap-1"
                    aria-label={`Rating: ${c.rating} out of 5 stars`}
                    role="img"
                  >
                    {[1, 2, 3, 4, 5].map((i) =>
                      i <= c.rating ? (
                        <AiFillStar key={i} className="text-yellow-400" />
                      ) : (
                        <AiOutlineStar key={i} className="text-gray-300" />
                      )
                    )}
                  </div>
                  <p className="text-gray-800 text-base sm:text-lg whitespace-pre-wrap break-words">
                    {c.message}
                  </p>
                  <p className="text-xs text-gray-400 select-none">
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
    </div>
  );
}
