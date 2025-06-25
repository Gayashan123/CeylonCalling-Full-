import { motion } from "framer-motion";
import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import Input from "../components/Input";
import { ArrowLeft, Loader, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { isLoading, forgotPassword } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await forgotPassword(email);
    setIsSubmitted(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-gray-100 to-gray-200 px-4"
    >
      <div className="w-full max-w-md bg-white/80 backdrop-blur-lg border border-gray-200 shadow-xl rounded-3xl overflow-hidden">
        <div className="p-10 sm:p-12">
          <h2 className="text-3xl font-semibold text-center text-gray-900 mb-6">
            Forgot Password
          </h2>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <p className="text-gray-600 text-center text-sm mb-4">
                Enter your email address and we’ll send you a link to reset your password.
              </p>

              <Input
                icon={Mail}
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 px-4 bg-black text-white font-medium rounded-xl shadow-md hover:bg-gray-900 transition duration-300 flex justify-center items-center"
                type="submit"
              >
                {isLoading ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  "Send Reset Link"
                )}
              </motion.button>
            </form>
          ) : (
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <Mail className="h-7 w-7 text-white" />
              </motion.div>
              <p className="text-gray-600 text-sm">
                If an account exists for <span className="font-medium text-black">{email}</span>, you'll receive a reset link shortly.
              </p>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 px-8 py-4 bg-white/60 backdrop-blur-sm flex justify-center">
          <Link
            to="/login"
            className="text-sm text-gray-700 hover:text-black flex items-center transition"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Login
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ForgotPasswordPage;
