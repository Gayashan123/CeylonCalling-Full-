import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Loader, Home } from "lucide-react"; // Import Home icon
import { Link } from "react-router-dom";
import Input from "../components/Input";
import { useAuthStore } from "../store/authStore";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error } = useAuthStore();

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
      <div className="w-full max-w-md rounded-3xl bg-white/80 backdrop-blur-md shadow-2xl border border-gray-200 p-10 sm:p-12 relative">
        
        {/* Top Home Icon */}
        <Link
          to="/shopform"
          className="absolute top-4 left-4 text-gray-600 hover:text-black transition"
          title="Go to Shop Form"
        >
          <Home className="w-6 h-6" />
        </Link>

        <h1 className="text-4xl font-semibold text-gray-900 mb-8 text-center tracking-tight">
          Welcome Back
        </h1>

        <form onSubmit={handleLogin} className="space-y-6">
          <Input
            icon={Mail}
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="text-gray-900 placeholder-gray-400"
            autoComplete="email"
            required
          />

          <Input
            icon={Lock}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="text-gray-900 placeholder-gray-400"
            autoComplete="current-password"
            required
          />

          <div className="flex justify-end text-sm">
            <Link
              to="/forgot-password"
              className="text-gray-600 hover:text-blue-600 transition"
            >
              Forgot password?
            </Link>
          </div>

          {error && (
            <p className="text-center text-red-500 font-medium">{error}</p>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white font-medium rounded-xl py-3 shadow-md hover:bg-gray-900 transition duration-300 flex justify-center items-center"
          >
            {isLoading ? (
              <Loader className="w-6 h-6 animate-spin" />
            ) : (
              "Login"
            )}
          </motion.button>
        </form>

        <p className="mt-8 text-center text-gray-500">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="font-semibold text-blue-600 hover:text-blue-800 transition"
          >
            Sign up
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default LoginPage;
