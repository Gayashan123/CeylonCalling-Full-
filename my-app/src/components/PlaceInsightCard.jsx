import React, { useEffect, useState } from "react";
import { FaHeart, FaComment, FaTrash } from "react-icons/fa";
import axios from "axios";
import { IoMdClose } from "react-icons/io";

export default function PlaceInsightsCard({ place, categories }) {
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState([]);

  const displayImage = place.images?.[0]?.startsWith("http")
    ? place.images[0]
    : `http://localhost:5000${place.images?.[0]}`;

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const [likeRes, commentRes] = await Promise.all([
          axios.get(`/api/place/${place._id}/likes`),
          axios.get(`/api/placecomment/place/${place._id}`),
        ]);
        setLikeCount(likeRes.data?.data?.likeCount || 0);
        setComments(commentRes.data || []);
      } catch (error) {
        console.error("Failed to fetch insights", error);
      }
    };

    fetchInsights();
  }, [place._id]);

  const handleDeleteComment = async (commentId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        await axios.delete(`/api/placecomment/${commentId}`, {
          withCredentials: true,
        });
        setComments((prev) => prev.filter((c) => c._id !== commentId));
      } catch (error) {
        console.error("Failed to delete comment", error);
      }
    }
  };

  return (
    <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl p-6 w-full max-w-lg transition-all border border-gray-200">
      {/* Image */}
      <div className="overflow-hidden rounded-xl shadow-sm mb-4">
        <img
          src={displayImage}
          alt={place.title}
          className="w-full h-52 object-cover"
        />
      </div>

      {/* Title and Location */}
      <h3 className="text-xl font-semibold text-gray-800 mb-1">{place.title}</h3>
      <p className="text-sm text-gray-500 mb-4">{place.location}</p>

      {/* Stats */}
      <div className="flex items-center gap-6 mb-4">
        <span className="flex items-center gap-1 text-pink-600 text-sm font-medium">
          <FaHeart /> {likeCount} Likes
        </span>
        <span className="flex items-center gap-1 text-blue-500 text-sm font-medium">
          <FaComment /> {comments.length} Comments
        </span>
      </div>

      {/* Comments */}
      <div className="space-y-3 max-h-40 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300">
        {comments.length === 0 && (
          <p className="text-gray-400 text-sm italic">No comments yet.</p>
        )}
        {comments.slice(0, 5).map((comment) => (
          <div
            key={comment._id}
            className="bg-gray-100 rounded-lg p-3 flex justify-between items-start relative"
          >
            <div>
              <span className="text-sm font-medium text-gray-700">
                {comment.user?.name || comment.user?.email}:
              </span>{" "}
              <span className="text-sm text-gray-600">{comment.message}</span>
            </div>
            <button
              onClick={() => handleDeleteComment(comment._id)}
              title="Delete comment"
              className="text-red-400 hover:text-red-600 p-1 ml-2"
            >
              <FaTrash className="text-sm" />
            </button>
          </div>
        ))}
        {comments.length > 5 && (
          <p className="text-xs text-gray-400 text-right">
            +{comments.length - 5} more comments
          </p>
        )}
      </div>
    </div>
  );
}
