"use client";

import { useState } from "react";

export default function page() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError("Please enter a name to search.");
      setResults([]);
      return;
    }

    setError(""); // Clear previous errors
    try {
        

        const url = new URL("/api/register", window.location.origin);
        url.searchParams.append("query", searchQuery.trim());

        const response = await fetch(url.toString(), {
          method: "GET",
        });
      
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.statusText}`);
        }
      
        const data = await response.json();
        setResults(data);
        console.log("Search Results:", data); // Use the response data as needed
      } catch (error) {
        console.error("Error during search:", error.message); // Log and handle errors
      }
  };

  return (
    <div className="flex flex-col items-center justify-center  pt-20  ">
      {/* Centered Heading */}
      <h1 className="text-4xl font-bold text-blue-600 mb-8">Database Records</h1>

      {/* Search Field and Button */}
      <div className="flex items-center bg-white rounded-full shadow-md p-2 mb-8">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search records..."
          className="outline-none px-4 py-2 w-64 text-gray-700 rounded-l-full"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-colors"
        >
          Search
        </button>
      </div>

      {/* Display Error */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Search Results */}
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-4">
        {results.length === 0 && !error ? (
          <p className="text-gray-500 text-center">No results found.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {results.map((result) => (
              <li key={result._id} className="p-4 ">
                <div className="border-b border-blue-500 mb-2">
                <p className="text-lg font-semibold text-gray-800">{result.name}</p>
                <p className="text-sm text-gray-600">Email: {result.email}</p>
                <p className="text-sm text-gray-600">
                  Created At: {new Date(result.createdAt).toLocaleString()}
                </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
