import React from "react";
import { FaStar } from "react-icons/fa";

const ReviewList = ({ reviews }) => {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-xl space-y-4">
      <h2 className="text-2xl font-semibold text-center">Customer Reviews</h2>

      {reviews.length === 0 ? (
        <p className="text-gray-500 text-center">No reviews yet.</p>
      ) : (
        reviews.map((review, index) => (
          <div key={index} className="border-b pb-4">
            <div className="flex items-center justify-between">
              <p className="font-semibold">{review.name || "Anonymous"}</p>
              <p className="text-sm text-gray-400">{review.date}</p>
            </div>

            <div className="flex items-center mt-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={`mr-1 ${i < review.rating ? "text-yellow-500" : "text-gray-300"}`}
                />
              ))}
              <span className="ml-2 text-sm text-gray-600">{review.rating}/5</span>
            </div>

            <p className="text-gray-700">{review.comment}</p>

            {/* Optional reply button */}
            <button className="text-blue-500 hover:underline mt-2 text-sm">Reply</button>
          </div>
        ))
      )}
    </div>
  );
};

export default ReviewList;
