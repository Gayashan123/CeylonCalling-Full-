import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Lock, Eye, EyeOff, Loader, Home } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import PasswordStrengthMeter from "../../shopowner/components/PasswordStrengthMeter";
import Input from "../components/Input";
import { useAuthStore } from "../store/authStore";

const SignUpPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { signup, error, isLoading } = useAuthStore();

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      alert("Please fill in all fields.");
      return;
    }
    try {
      await signup(email, password, name);
      navigate("/verify-email");
    } catch (err) {
      console.error("Signup failed:", err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-gray-50 via-white to-gray-100 px-6"
    >
      <div className="relative max-w-md w-full bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-10 sm:p-12">
        {/* Apple-style background light effect */}
        <div className="absolute -top-24 left-[60%] w-60 h-60 bg-gradient-to-br from-blue-400/10 to-purple-300/10 blur-2xl rounded-full pointer-events-none z-0" />

        {/* Top Home Icon */}
        <Link
          to="/shopform"
          className="absolute top-4 left-4 text-gray-600 hover:text-black transition z-10"
          title="Go to Shop Form"
        >
          <Home className="w-6 h-6" />
        </Link>

        <h1 className="text-4xl font-semibold text-gray-900 mb-8 text-center tracking-wide select-none z-10 relative">
          Create Account
        </h1>

        <form onSubmit={handleSignUp} className="space-y-6 z-10 relative">
          <Input
            icon={User}
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            required
          />
          <Input
            icon={Mail}
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
          <div className="relative">
            <Input
              icon={Lock}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {error && (
            <p className="text-center text-red-600 font-semibold select-none">
              {error}
            </p>
          )}

          <PasswordStrengthMeter password={password} />

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={isLoading}
            className="w-full mt-6 bg-black text-white font-semibold rounded-xl py-3 shadow-lg shadow-indigo-300/30 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:ring-opacity-50 transition duration-300 select-none flex justify-center items-center"
          >
            {isLoading ? <Loader className="w-6 h-6 animate-spin" /> : "Sign Up"}
          </motion.button>
        </form>

        <p className="mt-8 text-center text-gray-600 select-none z-10 relative">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-blue-600 hover:text-blue-800 transition-colors duration-200"
          >
            Login
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default SignUpPage;
