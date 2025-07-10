import React from "react";
import { FaQuestionCircle, FaTags, FaMapMarkedAlt, FaPlusCircle } from "react-icons/fa";
import { FiPhoneCall, FiSend } from "react-icons/fi";
import { HiOutlineMail } from "react-icons/hi";
import Con from "../assets/contact.jpg";

const Help = () => {
  const helpSteps = [
    {
      icon: <FaPlusCircle className="text-4xl text-purple-600" />,
      title: "Step 1: Click Add Button",
      desc: "Click the '+' button to begin. This lets you add a new place or category.",
    },
    {
      icon: <FaTags className="text-4xl text-blue-600" />,
      title: "Step 2: Create Category",
      desc: "You must create categories before adding places. Categories help you organize locations easily.",
    },
    {
      icon: <FaMapMarkedAlt className="text-4xl text-green-600" />,
      title: "Step 3: Add Locations",
      desc: "Now add your locations under the relevant categories to showcase places effectively.",
    },
  ];

  const contactDetails = [
    {
      icon: <FiPhoneCall className="text-3xl text-teal-600" />,
      label: "Call Us",
      value: "+94 75 206 9762",
    },
    {
      icon: <HiOutlineMail className="text-3xl text-teal-600" />,
      label: "Email",
      value: "support@placeapp.com",
    },
  ];

  return (
    <section className="bg-white py-10 px-4 sm:px-8 md:px-16 lg:px-24 max-w-7xl mx-auto">
      {/* Help Header */}
     

      {/* Contact Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Contact Image */}
        <div className="rounded-3xl overflow-hidden shadow-lg hover:scale-[1.02] transition-transform">
          <img
            src={Con}
            alt="Contact"
            className="w-full h-80 object-cover"
          />
        </div>

        {/* Contact Info and Form */}
        <div className="bg-gray-100 p-6 sm:p-8 rounded-3xl shadow-lg">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">Need More Help?</h2>
          <p className="text-gray-600 mb-6">
            If you have any questions or issues, feel free to reach out through the form or contact details below.
          </p>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            {contactDetails.map((item, index) => (
              <div key={index} className="flex items-start gap-4">
                {item.icon}
                <div>
                  <h4 className="text-md font-medium text-teal-700">{item.label}</h4>
                  <p className="text-gray-600">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Simple Form */}
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-purple-500"
            />
            <textarea
              rows="4"
              placeholder="Your Message"
              className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-purple-500"
            ></textarea>
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-md flex justify-center items-center gap-2"
            >
              <FiSend />
              Submit
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Help;
