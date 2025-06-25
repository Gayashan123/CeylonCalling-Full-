import React, { useState } from "react";
import { FiSend } from "react-icons/fi";

const ContactModal = ({ onClose }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Sending message:", { name, email, message });
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent
     bg-opacity-73 backdrop-blur-sm">
      <div
        className="relative w-full max-w-xs sm:max-w-sm bg-white dark:bg-[#1c1c1e] rounded-3xl shadow-xl
          p-6 sm:p-8
          border border-gray-200 dark:border-gray-700
          ring-1 ring-gray-300 dark:ring-gray-600
          transition-transform transform
          hover:scale-[1.02]"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <h2 className="text-center text-2xl font-semibold text-gray-900 dark:text-white mb-6 select-none">
          Send Message
        </h2>

        <h5 className="text-center text-sm font-semibold text-gray-900 dark:text-white mb-6 select-none">
      Connect With Our Team
        </h5>
  

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="name"
              className="block mb-1 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide"
            >
              Your Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="John Appleseed"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700
                bg-gray-50 dark:bg-[#2c2c2e]
                text-gray-900 dark:text-white
                placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
                transition"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block mb-1 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide"
            >
              Your Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="john@apple.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700
                bg-gray-50 dark:bg-[#2c2c2e]
                text-gray-900 dark:text-white
                placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
                transition"
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="block mb-1 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide"
            >
              Your Message
            </label>
            <textarea
              id="message"
              rows="4"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              placeholder="Write your message here..."
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700
                bg-gray-50 dark:bg-[#2c2c2e]
                text-gray-900 dark:text-white
                placeholder-gray-400
                resize-none
                focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
                transition"
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2
              py-3 rounded-2xl
              bg-gradient-to-r from-teal-500 to-cyan-500
              text-white font-semibold
              shadow-lg
              hover:from-teal-600 hover:to-cyan-600
              focus:outline-none focus:ring-4 focus:ring-teal-300/70
              transition"
          >
            <span>Send</span>
            <FiSend className="text-xl" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactModal;
