import React, { useState, useEffect } from "react";
import { eventsAPI } from "../../services/api";
import EventCard from "../../components/events/EventCard";
import EventFilters from "../../components/events/EventFilters";
import LoadingSpinner from "../../components/Common/LoadingSpinner";
import { Filter, Grid3X3, List } from "lucide-react";

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: "all",
    locationType: "all",
    dateFrom: "",
    dateTo: "",
    search: "",
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    fetchEvents();
  }, [filters, pagination.current]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params = {
        ...filters,
        page: pagination.current,
        limit: viewMode === "grid" ? 9 : 6,
      };

      Object.keys(params).forEach((key) => {
        if (params[key] === "all" || params[key] === "") {
          delete params[key];
        }
      });

      const response = await eventsAPI.get("/", { params });
      setEvents(response.data.data.events);
      setPagination(response.data.data.pagination);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, current: page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading && events.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-gray-600 text-lg">Discovering amazing events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Discover Events
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find your next unforgettable experience from thousands of amazing
            events
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="text-gray-600 text-lg font-medium">
              Showing{" "}
              <span className="font-bold text-gray-900">{events.length}</span>{" "}
              of{" "}
              <span className="font-bold text-gray-900">
                {pagination.total}
              </span>{" "}
              events
            </div>

            <div className="flex items-center gap-4">
              <div className="flex bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === "grid"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Grid3X3 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === "list"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div
            className={`lg:w-80 transition-all duration-300 ${
              showFilters ? "block" : "hidden lg:block"
            }`}
          >
            <EventFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onClose={() => setShowFilters(false)}
            />
          </div>

          <div className="flex-1">
            {events.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg border-2 border-dashed border-gray-300 py-16 text-center">
                <div className="text-7xl text-gray-300 mb-4">🎭</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  No Events Found
                </h3>
                <p className="text-gray-600 text-lg mb-6 max-w-md mx-auto">
                  Try adjusting your filters to find more events
                </p>
                <button
                  onClick={() =>
                    handleFilterChange({
                      category: "all",
                      locationType: "all",
                      dateFrom: "",
                      dateTo: "",
                      search: "",
                    })
                  }
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold px-8 py-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                <div
                  className={
                    viewMode === "grid"
                      ? "grid md:grid-cols-2 xl:grid-cols-3 gap-6"
                      : "space-y-6"
                  }
                >
                  {events.map((event) => (
                    <EventCard
                      key={event._id}
                      event={event}
                      viewMode={viewMode}
                    />
                  ))}
                </div>

                {pagination.pages > 1 && (
                  <div className="flex justify-center mt-12 space-x-2">
                    <button
                      onClick={() => handlePageChange(pagination.current - 1)}
                      disabled={pagination.current === 1}
                      className="px-4 py-3 rounded-xl font-semibold bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-500 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      Previous
                    </button>

                    {Array.from(
                      { length: pagination.pages },
                      (_, i) => i + 1
                    ).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                          page === pagination.current
                            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                            : "bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-500 hover:text-blue-600"
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      onClick={() => handlePageChange(pagination.current + 1)}
                      disabled={pagination.current === pagination.pages}
                      className="px-4 py-3 rounded-xl font-semibold bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-500 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="mt-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl lg:text-3xl font-bold mb-4">
            Can't find what you're looking for?
          </h2>
          <p className="text-blue-100 text-lg mb-6">
            Sign up to get personalized event recommendations
          </p>
          <button className="bg-white text-blue-600 font-bold px-8 py-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all">
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
