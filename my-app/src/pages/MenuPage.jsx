import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import { FaArrowLeft, FaSearch } from "react-icons/fa";
import { MdOutlineFastfood } from "react-icons/md";
import { BiCategoryAlt } from "react-icons/bi";

function Menu() {
  const { shopId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const shopName = location.state?.shopName || "Shop";

  const [categories, setCategories] = useState([]);
  const [mealsByCategory, setMealsByCategory] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const mealsPerPage = 6;

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${shopId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.meals && data.meals.length > 0) {
          return fetch("https://www.themealdb.com/api/json/v1/1/categories.php");
        } else {
          throw new Error("Shop not found");
        }
      })
      .then((res) => res.json())
      .then((data) => {
        if (data.categories) {
          const categoryNames = data.categories.map((cat) => cat.strCategory);
          setCategories(categoryNames);
          setSelectedCategory(categoryNames[0]);

          return Promise.all(
            categoryNames.map((category) =>
              fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
                .then((res) => res.json())
                .then((data) => {
                  if (data.meals) {
                    return data.meals.map((meal) => ({
                      ...meal,
                      price: (Math.floor(Math.random() * 1500) + 500) / 100,
                    }));
                  }
                  return [];
                })
            )
          ).then((allMeals) => {
            const mealsByCat = {};
            categoryNames.forEach((cat, idx) => {
              mealsByCat[cat] = allMeals[idx];
            });
            setMealsByCategory(mealsByCat);
            setLoading(false);
          });
        } else {
          setCategories([]);
          setMealsByCategory({});
          setLoading(false);
        }
      })
      .catch((err) => {
        setError(err.message || "Failed to load menu");
        setLoading(false);
      });
  }, [shopId]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const filteredMeals =
    mealsByCategory[selectedCategory]?.filter((meal) =>
      meal.strMeal.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const indexOfLastMeal = currentPage * mealsPerPage;
  const indexOfFirstMeal = indexOfLastMeal - mealsPerPage;
  const currentMeals = filteredMeals.slice(indexOfFirstMeal, indexOfLastMeal);
  const totalPages = Math.ceil(filteredMeals.length / mealsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white p-4 sm:p-6 md:p-10 font-sans text-gray-800 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4 sm:gap-0">
        <button
          onClick={() => navigate("/user/dashboard")}
          className="flex items-center text-blue-600 hover:underline text-sm sm:text-base"
        >
          <FaArrowLeft className="mr-2" /> Back to Home
        </button>

        <div className="relative w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search meals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 px-4 py-2 pr-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black transition"
          />
          <FaSearch className="absolute right-3 top-2.5 text-gray-500 pointer-events-none" />
        </div>
      </div>

      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 flex items-center gap-2">
        <MdOutlineFastfood className="text-teal-600" /> {shopName} - Menu
      </h1>

      {loading && <p className="text-gray-500">Loading menu items...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && categories.length === 0 && (
        <p>No categories found for this shop.</p>
      )}

      <div className="flex flex-wrap gap-3 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryClick(category)}
            className={`px-4 py-2 rounded-full border text-sm sm:text-base ${
              selectedCategory === category
                ? "bg-black text-white"
                : "bg-white text-black border-gray-400"
            } hover:bg-black hover:text-white transition`}
          >
            {category}
          </button>
        ))}
      </div>

      <h2 className="text-xl sm:text-2xl font-semibold mb-4 flex items-center gap-2">
        <BiCategoryAlt className="text-indigo-500" /> {selectedCategory}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        {currentMeals.map((meal) => (
          <div
            key={meal.idMeal}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl p-4 flex flex-col items-center transition duration-200"
          >
            <img
              src={meal.strMealThumb}
              alt={meal.strMeal}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-xl object-cover mb-4"
            />
            <h3 className="text-lg font-semibold mb-2 text-center">
              {meal.strMeal}
            </h3>
            <p className="text-xl font-bold text-green-600">
              ${meal.price.toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mb-10 flex-wrap">
          {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((number) => (
            <button
              key={number}
              onClick={() => setCurrentPage(number)}
              className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium ${
                currentPage === number
                  ? "bg-black text-white"
                  : "bg-white text-black border border-gray-300"
              } hover:bg-black hover:text-white transition`}
            >
              {number}
            </button>
          ))}
        </div>
      )}

      <div className="mt-10 border-t pt-6 max-w-3xl mx-auto px-2 sm:px-0">
        <h3 className="text-xl font-semibold mb-4">Leave a Comment</h3>
        <textarea
          rows="4"
          placeholder="Write your thoughts about the meals..."
          className="w-full p-4 border rounded-xl border-gray-300 focus:outline-none focus:ring-2 focus:ring-black transition resize-none"
        />
        <button className="mt-4 bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition w-full sm:w-auto">
          Submit Comment
        </button>
      </div>
    </div>
  );
}

export default Menu;
