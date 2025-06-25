import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import RestaurantInterior from "../assets/About.jpg";
import DeliciousFood from "../assets/Mission.jpg";
import DiningExperience from "../assets/vision.jpg";

function About() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <section id="about" className="bg-neutral-100 py-12 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32">
      {/* Header */}
      <div
        className="mb-10 sm:mb-12 text-center"
        data-aos="fade-down"
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-neutral-800 tracking-tight">
          About Us
        </h1>
        <p className="mt-3 sm:mt-4 text-base sm:text-lg md:text-xl text-neutral-500 max-w-xl mx-auto px-2 sm:px-0">
          Learn more about our purpose, goals, and story that inspires everything we do.
        </p>
      </div>

      {/* Content Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
        {/* Mission */}
        <div
          className="bg-white/80 backdrop-blur-lg shadow-lg rounded-3xl overflow-hidden p-5 sm:p-6 md:p-8 flex flex-col items-center transition-transform hover:scale-[1.03]"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <h2 className="text-xl sm:text-2xl font-medium text-teal-700 mb-3 sm:mb-4 text-center">
            Our Mission
          </h2>
          <img
            src={DeliciousFood}
            alt="Mission"
            className="w-full h-36 sm:h-44 md:h-48 object-cover rounded-xl mb-3 sm:mb-4"
          />
          <p className="text-center text-neutral-600 text-sm sm:text-base md:text-base">
            To serve delicious, freshly prepared dishes that bring people together and create lasting memories.
          </p>
        </div>

        {/* Vision */}
        <div
          className="bg-white/80 backdrop-blur-lg shadow-lg rounded-3xl overflow-hidden p-5 sm:p-6 md:p-8 flex flex-col items-center transition-transform hover:scale-[1.03]"
          data-aos="fade-up"
          data-aos-delay="300"
        >
          <h2 className="text-xl sm:text-2xl font-medium text-teal-700 mb-3 sm:mb-4 text-center">
            Our Vision
          </h2>
          <img
            src={DiningExperience}
            alt="Vision"
            className="w-full h-36 sm:h-44 md:h-48 object-cover rounded-xl mb-3 sm:mb-4"
          />
          <p className="text-center text-neutral-600 text-sm sm:text-base md:text-base">
            To become the go-to destination for food lovers seeking quality, authenticity, and warm ambiance.
          </p>
        </div>

        {/* Story */}
        <div
          className="bg-white/80 backdrop-blur-lg shadow-lg rounded-3xl overflow-hidden p-5 sm:p-6 md:p-8 flex flex-col items-center transition-transform hover:scale-[1.03]"
          data-aos="fade-up"
          data-aos-delay="500"
        >
          <h2 className="text-xl sm:text-2xl font-medium text-teal-700 mb-3 sm:mb-4 text-center">
            Our Story
          </h2>
          <img
            src={RestaurantInterior}
            alt="Story"
            className="w-full h-36 sm:h-44 md:h-48 object-cover rounded-xl mb-3 sm:mb-4"
          />
          <p className="text-center text-neutral-600 text-sm sm:text-base md:text-base">
            Born from a love of cooking and culture, we bring traditional recipes to life with a modern twist.
          </p>
        </div>
      </div>
    </section>
  );
}

export default About;
