import React from "react";
import { X, Calendar, MapPin, Tag, Filter } from "lucide-react";

const EventFilters = ({ filters, onFilterChange, onClose }) => {
  const categories = [
    "Music",
    "Tech",
    "Business",
    "Workshop",
    "Webinar",
    "Conference",
    "Art",
    "Sports",
    "Food",
    "Other",
  ];

  const handleFilterUpdate = (key, value) => {
    onFilterChange({
      ...filters,
      [key]: value,
    });
  };

  const clearFilters = () => {
    onFilterChange({
      category: "all",
      locationType: "all",
      dateFrom: "",
      dateTo: "",
      search: "",
    });
  };

  const hasActiveFilters =
    filters.category !== "all" ||
    filters.locationType !== "all" ||
    filters.dateFrom !== "" ||
    filters.dateTo !== "";

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sticky top-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <Filter className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Filters</h3>
            <p className="text-sm text-gray-600">Refine your search</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
            <Tag className="h-4 w-4 text-blue-500" />
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => handleFilterUpdate("category", e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
            <MapPin className="h-4 w-4 text-green-500" />
            Location Type
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleFilterUpdate("locationType", "all")}
              className={`p-3 rounded-xl border-2 text-center font-medium transition-all ${
                filters.locationType === "all"
                  ? "border-blue-500 bg-blue-50 text-blue-600"
                  : "border-gray-200 text-gray-700 hover:border-gray-300"
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleFilterUpdate("locationType", "Online")}
              className={`p-3 rounded-xl border-2 text-center font-medium transition-all ${
                filters.locationType === "Online"
                  ? "border-green-500 bg-green-50 text-green-600"
                  : "border-gray-200 text-gray-700 hover:border-gray-300"
              }`}
            >
              Online
            </button>
            <button
              onClick={() => handleFilterUpdate("locationType", "In-Person")}
              className={`p-3 rounded-xl border-2 text-center font-medium transition-all ${
                filters.locationType === "In-Person"
                  ? "border-purple-500 bg-purple-50 text-purple-600"
                  : "border-gray-200 text-gray-700 hover:border-gray-300"
              }`}
            >
              In-Person
            </button>
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
            <Calendar className="h-4 w-4 text-orange-500" />
            Date Range
          </label>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-500 mb-2 font-medium">
                From Date
              </label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterUpdate("dateFrom", e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-2 font-medium">
                To Date
              </label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterUpdate("dateTo", e.target.value)}
                min={filters.dateFrom}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              />
            </div>
          </div>
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="w-full bg-gray-100 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-200 transition-all border-2 border-transparent hover:border-gray-300"
          >
            Clear All Filters
          </button>
        )}

        <button
          onClick={onClose}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all lg:hidden"
        >
          Show Results
        </button>
      </div>
    </div>
  );
};

export default EventFilters;