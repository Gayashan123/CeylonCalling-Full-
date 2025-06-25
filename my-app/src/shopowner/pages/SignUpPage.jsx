import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Lock, Loader, Home } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import PasswordStrengthMeter from "../../shopowner/components/PasswordStrengthMeter";
import Input from "../components/Input";
import { useAuthStore } from "../store/authStore";

const SignUpPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
<div className="max-w-md w-full bg-white bg-opacity-80 backdrop-filter backdrop-blur-md rounded-3xl shadow-2xl p-10 sm:p-12">
       
       
        {/* Top Home Icon */}
        <Link
          to="/shopform"
          className="absolute top-4 left-4 text-gray-600 hover:text-black transition"
          title="Go to Shop Form"
        >
          <Home className="w-6 h-6" />
        </Link>
       
       
       
       
        <h1 className="text-4xl font-semibold text-gray-900 mb-8 text-center tracking-wide select-none">
          Create Account
        </h1>

        <form onSubmit={handleSignUp} className="space-y-6">
          <Input
            icon={User}
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="text-gray-900 placeholder-gray-400"
            autoComplete="name"
            required
          />
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
            autoComplete="new-password"
            required
          />
          {error && (
            <p className="text-center text-red-600 font-semibold select-none">{error}</p>
          )}

          <PasswordStrengthMeter password={password} />

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={isLoading}
            className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl py-3 shadow-lg shadow-indigo-300/30 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:ring-opacity-50 transition duration-300 select-none flex justify-center items-center"
          >
            {isLoading ? <Loader className="w-6 h-6 animate-spin" /> : "Sign Up"}
          </motion.button>
        </form>

        <p className="mt-8 text-center text-gray-600 select-none">
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
