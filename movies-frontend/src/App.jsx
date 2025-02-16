import { useState } from "react";
import axios from "axios";

function App() {
  const [movieName, setMovieName] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState("");

  const fetchRecommendations = async () => {
    if (!movieName) {
      setError("Please enter a movie name.");
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:5000/recommend", {
        movie_name: movieName,
      });
      console.log("API Response:", response.data);

      setRecommendations(response.data.recommended_movies);
      setError("");
    } catch (err) {
      setError("No recommendations found. Try another movie.");
      setRecommendations([]);
    }
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <h1 className="text-3xl font-bold mb-4">Movie Recommendation System 🎬</h1>

      <div className="flex">
        <input
          type="text"
          placeholder="Enter movie name"
          value={movieName}
          onChange={(e) => setMovieName(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md w-80"
        />
        <button
          onClick={fetchRecommendations}
          className="ml-3 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Get Recommendations
        </button>
      </div>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {recommendations?.length > 0 && (
  <div className="mt-6 w-full max-w-4xl">
    <h2 className="text-2xl font-semibold mb-4 text-center">🎥 Recommended Movies</h2>
    <div className="overflow-x-auto shadow-lg rounded-lg">
      <table className="min-w-full bg-white border border-black-500 rounded-lg">
        <thead>
          <tr className="bg-gray-800 text-white text-left" >
            <th className="p-3">🎬 Title</th>
            <th className="p-3">📝 Description</th>
          </tr>
        </thead>
        <tbody>
          {recommendations.map((movie, index) => (
            <tr
              key={index}
              className="border-b transition duration-300 ease-in-out hover:bg-gray-100"
            >
              <td className="p-3 font-semibold flex items-center">
                <span className="mr-2">🎬</span> {movie.title}
              </td>
              <td className="p-3 text-gray-600">{movie.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}


    </div>
  );
}

export default App;
