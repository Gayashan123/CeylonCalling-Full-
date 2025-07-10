import React, { useEffect, useState } from "react";
import { FaHeart, FaCommentDots, FaTrash, FaStar, FaRegStar, FaUser } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { toast } from "react-toastify";

const ShopStats = ({ shopId, isShopOwner = false }) => {
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!shopId) return;

    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [likesRes, commentsRes] = await Promise.all([
          fetch(`/api/shops/${shopId}/likes/count`, {
            credentials: "include",
          }),
          fetch(`/api/comments/shop/${shopId}`, {
            credentials: "include",
          }),
        ]);

        if (!likesRes.ok) throw new Error("Failed to fetch likes");
        if (!commentsRes.ok) throw new Error("Failed to fetch comments");

        const likesData = await likesRes.json();
        const commentsData = await commentsRes.json();

        if (likesData.success && likesData.data) {
          setLikeCount(likesData.data.likeCount);
        }
        
        setComments(Array.isArray(commentsData) ? commentsData : []);
      } catch (err) {
        console.error("Error fetching shop stats:", err);
        setError(err.message);
        toast.error("Failed to load comments");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [shopId]);

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    
    try {
      setDeletingId(commentId);
      const res = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete comment");
      }

      setComments((prev) => prev.filter((c) => c._id !== commentId));
      toast.success("Comment deleted successfully");
    } catch (err) {
      console.error("Delete error:", err);
      setError(err.message);
      toast.error(err.message || "Failed to delete comment");
    } finally {
      setDeletingId(null);
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }, (_, i) => (
          i < rating ? 
            <FaStar key={i} className="text-yellow-400 text-sm" /> : 
            <FaRegStar key={i} className="text-yellow-300 text-sm" />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Stats Overview */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Likes */}
          <div className="flex items-center p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-lg">
            <div className="p-3 bg-red-100 rounded-full mr-4">
              <FaHeart className="text-red-500 text-xl" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Likes</p>
              <p className="text-2xl font-semibold text-gray-800">{likeCount}</p>
            </div>
          </div>
          
          {/* Comments */}
          <div className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
            <div className="p-3 bg-blue-100 rounded-full mr-4">
              <FaCommentDots className="text-blue-500 text-xl" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Comments</p>
              <p className="text-2xl font-semibold text-gray-800">{comments.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">
          Customer Reviews
        </h3>
        
        <AnimatePresence>
          {comments.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-8 bg-gray-50 rounded-lg"
            >
              <p className="text-gray-500">No reviews yet. Be the first to share your experience!</p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <motion.div
                  key={comment._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow relative group"
                >
                  {/* Delete button - only shows for shop owner */}
                  {isShopOwner && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDeleteComment(comment._id)}
                      disabled={deletingId === comment._id}
                      className="absolute top-3 right-3 p-2 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors shadow-sm"
                      title="Delete comment"
                      aria-label="Delete comment"
                    >
                      {deletingId === comment._id ? (
                        <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <FaTrash className="text-sm" />
                      )}
                    </motion.button>
                  )}
                  
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3 flex-shrink-0">
                      {comment.user?.name ? (
                        <span className="font-medium">
                          {comment.user.name.charAt(0).toUpperCase()}
                        </span>
                      ) : (
                        <FaUser className="text-blue-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <p className="font-medium text-gray-800">
                          {comment.user?.name || "Anonymous"}
                        </p>
                        <div className="flex items-center text-xs text-gray-500 gap-2">
                          <span>
                            {format(new Date(comment.createdAt), 'MMM d, yyyy')}
                          </span>
                          <span className="hidden sm:inline">•</span>
                          {renderStars(comment.rating)}
                        </div>
                      </div>
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {comment.message}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ShopStats;