import React, { useState } from "react";

const Create = ({ login, closeLogin }) => {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");

  const createAccount = (event) => {
    event.preventDefault();
    console.log("Creating account with", name, mobile, password);
  };

  return (
    <div className="relative  inset-0 z-50 flex items-center justify-center px-4 py-1 sm:px-6 md:px-10 bg-transparent bg-opacity-85">
     
        {/* Close Button */}
      
        <div className="w-full">
          <h2 className="mb-6 text-3xl font-semibold text-teal-400 text-center">
         
          </h2>
          <form onSubmit={createAccount} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-base font-medium text-white mb-1">
                User Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                autoComplete="username"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                className="w-full px-3 py-2 rounded-lg border border-gray-700 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                required
              />
            </div>
            <div>
              <label htmlFor="mobile" className="block text-base font-medium text-white mb-1">
                Email
              </label>
              <input
                type="email"
                id="mobile"
                name="email"
                autoComplete="email"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-3 py-2 rounded-lg border border-gray-700 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-base font-medium text-white mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="new-password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                className="w-full px-3 py-2 rounded-lg border border-gray-700 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 mt-2 text-white bg-teal-600 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
            >
              Create Account
            </button>
          </form>
          <div className="mt-6 text-center">
            <button
              type="button"
              className="text-teal-400 hover:underline"
              onClick={login}
              tabIndex={0}
            >
              Already have an account? Log in
            </button>
          </div>
        </div>
      
    </div>
  );
};

export default Create;