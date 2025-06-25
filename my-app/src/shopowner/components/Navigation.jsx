import React, { useState } from "react";
import { Link as ScrollLink } from "react-scroll";
import { HiMenu, HiX } from "react-icons/hi";
import Logo from "../../assets/Lion.jpg";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: "Home", to: "header" },
    { label: "About", to: "about" },
    { label: "Contact", to: "contact" },
  ];

  const { user, logout, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  // Always display the user's name, NOT the shop name
  const displayName = user?.name || user?.email || "";

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
    navigate("/login");
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
          <img
            src={Logo}
            alt="Logo"
            className="h-10 w-10 rounded-full object-cover shadow-teal-200 shadow-sm"
          />
          <span className="text-2xl font-extrabold text-gray-800 tracking-tight">
            Ceylon Calling
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          <ul className="flex gap-6 text-gray-700 font-medium text-lg">
            {navLinks.map(({ label, to }) => (
              <li key={to}>
                <ScrollLink
                  to={to}
                  smooth
                  duration={500}
                  spy
                  activeClass="text-teal-500"
                  className="cursor-pointer hover:text-gray-400 transition-all"
                >
                  {label}
                </ScrollLink>
              </li>
            ))}
          </ul>

          {isAuthenticated && (
            <div className="flex items-center gap-4 ml-8">
              <span className="text-gray-600 font-semibold">Hi, {displayName}</span>
              <button
                onClick={handleLogout}
                className="bg-black text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition"
              >
                Logout
              </button>
            </div>
          )}
        </nav>

        {/* Mobile Hamburger */}
        <button
          onClick={toggleMenu}
          className="lg:hidden text-3xl text-gray-700 focus:outline-none"
        >
          {menuOpen ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white shadow-md px-6 py-4">
          <ul className="flex flex-col gap-4 text-gray-700 font-medium text-lg">
            {navLinks.map(({ label, to }) => (
              <li key={to}>
                <ScrollLink
                  to={to}
                  smooth
                  duration={500}
                  spy
                  onClick={() => setMenuOpen(false)}
                  activeClass="text-teal-500"
                  className="block cursor-pointer hover:text-gray-500"
                >
                  {label}
                </ScrollLink>
              </li>
            ))}
          </ul>

          {isAuthenticated && (
            <div className="mt-6 border-t pt-4 flex justify-between items-center">
              <span className="text-gray-600 font-semibold">Hi, {displayName}</span>
              <button
                onClick={handleLogout}
                className="bg-black text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}