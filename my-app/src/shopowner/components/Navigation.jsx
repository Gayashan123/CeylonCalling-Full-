import React, { useState, useEffect } from "react";
import { Link as ScrollLink } from "react-scroll";
import { HiMenu, HiX, HiMoon, HiSun } from "react-icons/hi";
import Logo from "../../assets/Lion.jpg";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { user, logout, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const navLinks = [
    { label: "Home", to: "header" },
    { label: "About", to: "about" },
    { label: "Contact", to: "contact" },
  ];

  const displayName = user?.name || user?.email || "";

  // Scroll handler for header background
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Dark mode toggle
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Disable body scroll when menu open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [menuOpen]);

  // Close mobile menu on link click
  const closeMenu = () => setMenuOpen(false);

  // Logout
  const handleLogout = async () => {
    await logout();
    closeMenu();
    navigate("/login");
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300
        ${
          scrolled
            ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-md"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-4 flex justify-between items-center relative">
          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => {
              navigate("/");
              setActiveIndex(0);
              closeMenu();
            }}
            aria-label="Navigate to home"
          >
            <img
              src={Logo}
              alt="Logo"
              className="h-10 w-10 rounded-full object-cover shadow-teal-300 shadow-md"
            />
            <span className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight select-text">
              Ceylon Calling
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-10 relative">
            <ul className="flex gap-10 text-gray-700 dark:text-gray-300 font-semibold text-lg relative">
              {navLinks.map(({ label, to }, i) => (
                <li key={to} className="relative">
                  <ScrollLink
                    to={to}
                    smooth
                    duration={600}
                    spy
                    offset={-80}
                    onSetActive={() => setActiveIndex(i)}
                    onClick={closeMenu}
                    tabIndex={0}
                    className={`cursor-pointer px-2 py-1 relative transition-colors
                      hover:text-teal-500 dark:hover:text-teal-400
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 rounded`}
                    activeClass="text-teal-500 dark:text-teal-400 font-bold"
                  >
                    {label}
                  </ScrollLink>
                  {activeIndex === i && (
                    <span
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-500 dark:bg-teal-400 rounded-full transition-all"
                      style={{ transform: "scaleX(1)" }}
                    />
                  )}
                </li>
              ))}
            </ul>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              aria-label="Toggle dark mode"
              className="ml-6 p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              {darkMode ? <HiSun size={24} /> : <HiMoon size={24} />}
            </button>

            {/* Profile Dropdown */}
            {isAuthenticated && (
              <div className="relative group">
                <button
                  aria-haspopup="true"
                  aria-expanded="false"
                  className="flex items-center gap-3 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 rounded"
                >
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                      displayName
                    )}&background=14b8a6&color=fff&rounded=true&size=32`}
                    alt="User avatar"
                    className="w-8 h-8 rounded-full shadow-sm"
                  />
                  <span className="text-gray-800 dark:text-gray-200 font-semibold">
                    {displayName}
                  </span>
                </button>

                <ul
                  className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 invisible group-hover:visible group-focus-within:visible transition-opacity duration-300 z-50"
                  tabIndex={-1}
                  aria-label="User menu"
                >
                  <li>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left hover:bg-red-600 hover:text-white rounded-b-lg transition"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </nav>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className={`lg:hidden relative w-10 h-10 flex flex-col justify-center items-center gap-1 cursor-pointer focus:outline-none z-50`}
          >
            <span
              className={`block h-1 w-7 bg-gray-700 dark:bg-gray-300 rounded-full transform transition duration-300 ease-in-out ${
                menuOpen ? "rotate-45 translate-y-2.5" : ""
              }`}
            />
            <span
              className={`block h-1 w-7 bg-gray-700 dark:bg-gray-300 rounded-full transition-all duration-300 ease-in-out ${
                menuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`block h-1 w-7 bg-gray-700 dark:bg-gray-300 rounded-full transform transition duration-300 ease-in-out ${
                menuOpen ? "-rotate-45 -translate-y-2.5" : ""
              }`}
            />
          </button>
        </div>
      </header>

      {/* Mobile Sliding Menu + Overlay */}
      <div
        aria-hidden={!menuOpen}
        className={`fixed inset-0 z-40 pointer-events-none transition-opacity duration-300 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0"
        }`}
      >
        {/* Overlay with blur */}
        <div
          onClick={closeMenu}
          className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm"
          aria-hidden="true"
        />
        {/* Sliding sidebar */}
        <aside
          role="dialog"
          aria-modal="true"
          aria-label="Mobile menu"
          className={`absolute top-0 left-0 bottom-0 w-72 bg-white dark:bg-gray-900 shadow-xl p-6 flex flex-col
            transform transition-transform duration-300 ease-in-out
            ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          {/* Logo + close button */}
          <div className="flex justify-between items-center mb-8">
            <div
              className="flex items-center gap-3 cursor-pointer select-none"
              onClick={() => {
                navigate("/");
                setActiveIndex(0);
                closeMenu();
              }}
              aria-label="Navigate to home"
            >
              <img
                src={Logo}
                alt="Logo"
                className="h-10 w-10 rounded-full object-cover shadow-teal-300 shadow-md"
              />
              <span className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight select-text">
                Ceylon Calling
              </span>
            </div>

            <button
              onClick={closeMenu}
              aria-label="Close menu"
              className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition focus:outline-none"
            >
              <HiX size={28} />
            </button>
          </div>

          {/* Navigation links */}
          <nav className="flex flex-col gap-6 text-gray-800 dark:text-gray-300 font-semibold text-lg flex-grow">
            {navLinks.map(({ label, to }, i) => (
              <ScrollLink
                key={to}
                to={to}
                smooth
                duration={600}
                spy
                offset={-80}
                onClick={() => {
                  setActiveIndex(i);
                  closeMenu();
                }}
                tabIndex={0}
                className="block cursor-pointer py-3 px-4 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
                activeClass="bg-teal-100 dark:bg-teal-800 text-teal-700 dark:text-teal-300 font-bold"
              >
                {label}
              </ScrollLink>
            ))}
          </nav>

          {/* User info and logout */}
          {isAuthenticated && (
            <div className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-700 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                    displayName
                  )}&background=14b8a6&color=fff&rounded=true&size=40`}
                  alt="User avatar"
                  className="w-10 h-10 rounded-full shadow-sm"
                />
                <span className="text-gray-900 dark:text-gray-100 font-semibold">
                  {displayName}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-3 rounded-xl hover:bg-red-700 transition font-semibold"
              >
                Logout
              </button>
            </div>
          )}
        </aside>
      </div>
    </>
  );
}
