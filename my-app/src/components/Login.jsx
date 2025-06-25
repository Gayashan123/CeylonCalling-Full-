import React, { useState, useEffect } from "react";
import Create from "./Create";

const Login = ({ closeLogin }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [text, setText] = useState("Log In");

  useEffect(() => {
    setText(isCreating ? "Create Account" : "Log In");
  }, [isCreating]);

  const createAcc = (e) => {
    e.preventDefault();
    setIsCreating(true);
  };

  const login = () => {
    setIsCreating(false);
  };

  return (
    <div className="relative inset-0 z-50 flex items-center justify-center px-4 py-6 sm:px-6 md:px-10 bg-transparent bg-opacity-85">
      <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-md xl:max-w-lg bg-black rounded-lg shadow-lg shadow-white p-6 sm:p-8 transition-all duration-500 ease-in-out">
        
        {/* Close Button */}
        <button
          className="absolute text-gray-300 top-4 right-4 hover:text-white"
          onClick={closeLogin}
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

        <div className="text-center mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-teal-500">Ceylon Calling</h1>
          <p className="mt-1 text-xl sm:text-2xl text-white font-medium">{text}</p>
        </div>

        {!isCreating ? (
          <div>
            <h2 className="mb-5 text-xl sm:text-2xl font-semibold text-white">
              Welcome!
            </h2>
            <form className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="example@mail.com"
                  className="mt-1 w-full p-3 text-white bg-transparent border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="********"
                  className="mt-1 w-full p-3 text-white bg-transparent border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="flex items-center justify-between text-sm text-white">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  Remember me
                </label>
                <a href="#" className="text-teal-400 hover:underline">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                className="w-full py-3 font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors"
              >
                Login
              </button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-300">
                Don’t have an account?{" "}
                <button
                  onClick={createAcc}
                  className="text-teal-400 hover:underline"
                >
                  Create one
                </button>
              </p>
            </div>
          </div>
        ) : (
          <Create login={login} />
        )}
      </div>
    </div>
  );
};

export default Login;
