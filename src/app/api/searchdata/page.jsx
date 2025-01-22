"use client";

import { useState } from "react";
import Link from 'next/link';

export default function Page() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [totalPages, setTotalPages] = useState(1); // Track total pages

  const handleSearch = async (page = 1) => {
    if (!searchQuery.trim()) {
      setError("Please enter a name to search.");
      setResults([]);
      return;
    }

    setError(""); // Clear previous errors
    try {
      const url = new URL("/api/register", window.location.origin);
      url.searchParams.append("query", searchQuery.trim());
      url.searchParams.append("page", page); // Send the current page number
      url.searchParams.append("limit", 10); // Limit to 10 results per page

      const response = await fetch(url.toString(), {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }

      const data = await response.json();
      setResults(data.users || []);
      setTotalPages(data.pagination.totalPages || 1); // Set total pages from the API response
      setCurrentPage(page); // Update the current page

      console.log("Search Results:", data); // Use the response data as needed
    } catch (error) {
      console.error("Error during search:", error.message);
      setError("An error occurred while fetching data.");
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      handleSearch(newPage); // Fetch data for the new page
    }
  };

  return (
    <div className="flex flex-col">
          <div className="flex flex-row justify-end p-4 ">  
            <div className="bg-blue-500  text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors">
              <Link href="/">HOME</Link>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center pt-20">
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
                onClick={() => handleSearch(1)} // Reset to page 1 on search
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
                <p className="text-gray-500 text-center">Search using Name,Email,DD/MM/YYYY</p>
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

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center space-x-4 mt-8 mb-8 ">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="bg-blue-500 w-28 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors"
                >
                  Previous
                </button>
                <span className="text-lg text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="bg-blue-500 w-28 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </div>
    </div>
  );
}
