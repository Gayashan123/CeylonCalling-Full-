import React, { useState } from "react";
import { FaTimes, FaUserPlus } from "react-icons/fa";

const CreateShopAccount = ({ closeLogin }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");

  // Example: handle shop account creation
  const handleCreateAccount = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!username || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    // TODO: Add actual API call here
    setSuccess("Account created successfully! (Implement actual API call)");
    // Optionally, reset form fields
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/20 transition-all duration-300 ease-in-out">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-white hover:text-gray-300 transition"
          onClick={closeLogin}
        >
          <FaTimes className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-semibold text-white flex justify-center items-center gap-2">
             Create Shop Account
          </h2>
          <p className="text-sm text-white/70 mt-1">
            Register your restaurant and start selling!
          </p>
        </div>

        {/* Error/Success message */}
        {error && (
          <div className="mb-3 text-red-200 text-center text-sm">{error}</div>
        )}
        {success && (
          <div className="mb-3 text-green-200 text-center text-sm">{success}</div>
        )}

        {/* Form */}
        <form onSubmit={handleCreateAccount} className="space-y-5">
          <div>
            <label className="block text-sm text-white mb-1">Restaurant Name / Username</label>
            <input
              type="text"
              value={username}
              autoFocus
              onChange={e => setUsername(e.target.value)}
              placeholder="e.g. The Tasty Spoon"
              className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-teal-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-white mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="yourshop@email.com"
              className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-teal-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-white mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-teal-400"
              required
              minLength={6}
            />
          </div>
          <div>
            <label className="block text-sm text-white mb-1">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-teal-400"
              required
              minLength={6}
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-semibold transition duration-300"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateShopAccount;