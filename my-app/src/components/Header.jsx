import React from "react";
import Navigation from "./Navigation";
import ximage from "../assets/Hero.jpg";
import { FaCompass, FaPhoneAlt } from "react-icons/fa";
import Typewriter from "typewriter-effect";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Header() {
  const navigate = useNavigate();

  const handleDiscoverClick = () => {
    navigate("/user/login");
  };

  return (
    <div
      id="header"
      className="relative w-full min-h-screen bg-cover bg-center overflow-hidden border-b border-neutral-200"
      style={{ backgroundImage: `url(${ximage})` }}
    >
      {/* Glassmorphic Overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-10" />

      {/* Navigation */}
      <Navigation />

      {/* Main Content with animation */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-20 flex flex-col items-center justify-center min-h-screen text-center px-4 pt-28 md:pt-36 pb-20"
      >
        {/* Title */}
        <h1 className="text-white font-bold text-4xl md:text-6xl leading-tight tracking-tight drop-shadow-lg">
          <Typewriter
            options={{
              strings: ["Discover the Best Places to Eat"],
              autoStart: true,
              loop: true,
              delay: 50,
            }}
          />
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-teal-200 text-lg md:text-xl max-w-2xl italic">
          Find your favorite food spots around the city with just a few clicks. Explore a variety of cuisines and hidden gems near you.
        </p>

        {/* Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
          {/* Discover Button */}
          <button
            onClick={handleDiscoverClick}
            className="group flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-lg border border-white/20 text-white font-medium rounded-full shadow-md hover:bg-white/20 hover:scale-105 hover:shadow-xl transition-all"
          >
            <FaCompass className="text-xl" />
            <span>Discover</span>
          </button>

          {/* Contact Us Scroll Button */}
          <Link to="/contact">
            <button className="group flex items-center gap-3 px-6 py-3 bg-white text-gray-900 font-medium rounded-full shadow-md hover:bg-gray-100 hover:scale-105 hover:shadow-xl transition-all">
              <FaPhoneAlt className="text-xl text-gray-800" />
              <span>Contact Us</span>
            </button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}