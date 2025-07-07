import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Loader, Eye, EyeOff, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { useSiteUserAuthStore } from "../store/siteUserAuthStore";

const SiteUserLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error } = useSiteUserAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-gray-100 to-gray-200 px-4"
    >
      <div className="w-full max-w-md rounded-3xl bg-white/80 backdrop-blur-xl shadow-2xl border border-gray-200 p-10 sm:p-12 relative">
        {/* Home icon link */}
        <Link
          to="/userlogui"
          className="absolute top-4 left-4 text-gray-600 hover:text-black transition"
          title="Go to Shop Form"
        >
          <Home className="w-6 h-6" />
        </Link>

        <h1 className="text-4xl font-semibold text-gray-900 mb-8 text-center tracking-tight">
          Welcome Back
        </h1>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email Input */}
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 text-gray-800 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
            />
          </div>

          {/* Password Input with toggle */}
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              className="w-full pl-10 pr-10 py-3 rounded-xl bg-gray-50 text-gray-800 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-800 focus:outline-none"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Forgot password */}
          <div className="flex justify-end text-sm">
            <Link
              to="/forgot-password"
              className="text-gray-600 hover:text-blue-600 transition"
            >
              Forgot password?
            </Link>
          </div>

          {/* Error */}
          {error && (
            <p className="text-center text-red-500 font-medium text-sm">
              {error}
            </p>
          )}

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white font-semibold rounded-xl py-3 shadow-md hover:bg-gray-900 transition duration-300 flex justify-center items-center"
          >
            {isLoading ? (
              <Loader className="w-6 h-6 animate-spin" />
            ) : (
              "Login"
            )}
          </motion.button>
        </form>

        {/* Footer */}
        <p className="mt-8 text-center text-gray-500 text-sm">
          Don’t have an account?{" "}
          <Link
            to="/user/signup"
            className="font-semibold text-blue-600 hover:text-blue-800 transition"
          >
            Sign up
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default SiteUserLoginPage;