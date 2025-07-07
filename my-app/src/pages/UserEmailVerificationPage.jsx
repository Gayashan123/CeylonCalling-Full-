import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useSiteUserAuthStore } from "../store/siteUserAuthStore";
import toast from "react-hot-toast";

const SiteUserEmailVerificationPage = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const { error, isLoading, verifyEmail } = useSiteUserAuthStore();

  const handleChange = (index, value) => {
    const newCode = [...code];

    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        newCode[i] = pastedCode[i] || "";
      }
      setCode(newCode);
      const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
      const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
      inputRefs.current[focusIndex]?.focus();
    } else {
      newCode[index] = value;
      setCode(newCode);
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const verificationCode = code.join("");

    try {
      await verifyEmail(verificationCode);
      toast.success("Email verified successfully!");
      navigate("/user/dashboard");

      // Auto-refresh after short delay
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (error) {
      console.error("Verification failed:", error);
    }
  };

  // Auto-submit if all digits are filled
  useEffect(() => {
    if (code.every((digit) => digit !== "")) {
      handleSubmit(new Event("submit"));
    }
    // eslint-disable-next-line
  }, [code]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-gray-100 to-gray-200 px-4"
    >
      <div className="w-full max-w-md bg-white/80 backdrop-blur-lg border border-gray-200 shadow-2xl rounded-3xl p-10 sm:p-12">
        <h2 className="text-3xl font-semibold text-center text-gray-900 mb-6">Verify Your Email</h2>
        <p className="text-center text-gray-600 mb-6 text-sm">Enter the 6-digit code we sent to your email address.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-between gap-2">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-xl font-medium text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all"
              />
            ))}
          </div>

          {error && <p className="text-center text-red-500 font-medium text-sm">{error}</p>}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading || code.some((digit) => !digit)}
            className="w-full bg-black text-white font-medium rounded-xl py-3 shadow-md hover:bg-gray-900 transition duration-300 flex justify-center items-center disabled:opacity-50"
          >
            {isLoading ? "Verifying..." : "Verify Email"}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default SiteUserEmailVerificationPage;
