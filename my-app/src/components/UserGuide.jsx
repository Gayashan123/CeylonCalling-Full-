import React from "react";
import { FaPlusCircle, FaTags, FaMapMarkedAlt, FaEdit, FaTrash } from "react-icons/fa";

const steps = [
  {
    title: "Step 1: Click the Add Button",
    description: "Start by clicking the '+' button at the top to begin managing your places.",
    icon: <FaPlusCircle className="text-4xl text-purple-600" />,
  },
  {
    title: "Step 2: Create a Category",
    description: "If you're a new user or haven't created any categories, you need to add one to group your places effectively.",
    icon: <FaTags className="text-4xl text-blue-500" />,
  },
  {
    title: "Step 3: Add a Location",
    description: "Once categories are set, add your locations to start building your experience.",
    icon: <FaMapMarkedAlt className="text-4xl text-green-500" />,
  },
  {
    title: "Step 4: Edit or Delete",
    description: "You can edit or delete both categories and locations anytime to keep your content up to date.",
    icon: (
      <div className="flex gap-2 text-red-500 text-3xl">
        <FaEdit />
        <FaTrash />
      </div>
    ),
  },
];

function UserGuide() {
  return (
    <section className="bg-white min-h-screen py-10 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">User Guide</h1>
        <p className="mt-3 text-gray-600 max-w-xl mx-auto">
          Follow these simple steps to start managing your categories and locations with ease.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
        {steps.map((step, index) => (
          <div
            key={index}
            className="bg-gray-50 rounded-xl p-6 shadow-md border hover:shadow-lg transition"
          >
            <div className="flex items-center justify-center mb-4">
              {step.icon}
            </div>
            <h2 className="text-xl font-semibold text-gray-700 text-center">{step.title}</h2>
            <p className="mt-2 text-gray-600 text-center">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default UserGuide;
