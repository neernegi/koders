import React, { useState, useEffect } from "react";
import { bookingsAPI } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import BookingCard from "../../components/booking/BookingCard";
import LoadingSpinner from "../../components/Common/LoadingSpinner";
import { Calendar, List, Filter, Download, Users } from "lucide-react";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("list");
  const [filter, setFilter] = useState("all");

  const { user } = useAuth();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingsAPI.get("/my-bookings");
      setBookings(response.data.data.bookings);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      await bookingsAPI.put(`/${bookingId}/cancel`);
      fetchBookings();
    } catch (error) {
      console.error("Failed to cancel booking:", error);
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const now = new Date();
    const eventDate = new Date(booking.event.date);

    switch (filter) {
      case "upcoming":
        return eventDate > now && booking.status === "confirmed";
      case "past":
        return eventDate < now && booking.status === "confirmed";
      case "cancelled":
        return booking.status === "cancelled";
      default:
        return true;
    }
  });

  const stats = [
    {
      label: "Total Bookings",
      value: bookings.filter((b) => b.status === "confirmed").length,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-200",
    },
    {
      label: "Upcoming",
      value: bookings.filter(
        (b) => b.status === "confirmed" && new Date(b.event.date) > new Date()
      ).length,
      color: "text-green-600",
      bg: "bg-green-50",
      border: "border-green-200",
    },
    {
      label: "Past Events",
      value: bookings.filter(
        (b) => b.status === "confirmed" && new Date(b.event.date) < new Date()
      ).length,
      color: "text-purple-600",
      bg: "bg-purple-50",
      border: "border-purple-200",
    },
    {
      label: "Cancelled",
      value: bookings.filter((b) => b.status === "cancelled").length,
      color: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-200",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-gray-600">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            My Bookings
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Manage and track all your event bookings in one place
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className={`${stat.bg} ${stat.border} rounded-2xl p-6 border-2 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
            >
              <div className={`text-3xl font-bold ${stat.color} mb-2`}>
                {stat.value}
              </div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex bg-gray-100 rounded-xl p-1 shadow-inner">
              <button
                onClick={() => setView("list")}
                className={`flex items-center gap-3 px-6 py-3 rounded-xl text-sm font-semibold transition-all ${
                  view === "list"
                    ? "bg-white text-blue-600 shadow-lg border border-gray-200"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <List className="h-4 w-4" />
                List View
              </button>
              <button
                onClick={() => setView("calendar")}
                className={`flex items-center gap-3 px-6 py-3 rounded-xl text-sm font-semibold transition-all ${
                  view === "calendar"
                    ? "bg-white text-blue-600 shadow-lg border border-gray-200"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Calendar className="h-4 w-4" />
                Calendar
              </button>
            </div>

            <div className="flex items-center gap-3">
              <Filter className="h-5 w-5 text-gray-500" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              >
                <option value="all">All Bookings</option>
                <option value="upcoming">Upcoming Events</option>
                <option value="past">Past Events</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border-2 border-dashed border-gray-300 py-16 text-center">
            <div className="text-7xl text-gray-300 mb-4">📅</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              No Bookings Found
            </h3>
            <p className="text-gray-600 text-lg mb-6 max-w-md mx-auto">
              {filter === "all"
                ? "You haven't made any bookings yet. Start exploring amazing events!"
                : `No ${filter} bookings found.`}
            </p>
            <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold px-8 py-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all">
              Browse Events
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {filter === "all"
                  ? "All Bookings"
                  : filter === "upcoming"
                  ? "Upcoming Events"
                  : filter === "past"
                  ? "Past Events"
                  : "Cancelled Bookings"}
                <span className="text-blue-600 ml-2">
                  ({filteredBookings.length})
                </span>
              </h2>

              {filteredBookings.length > 0 && (
                <button className="flex items-center gap-2 bg-green-50 text-green-600 border border-green-200 px-4 py-2 rounded-xl hover:bg-green-100 transition-all">
                  <Download className="h-4 w-4" />
                  Export
                </button>
              )}
            </div>

            <div className="grid gap-6">
              {filteredBookings.map((booking) => (
                <BookingCard
                  key={booking._id}
                  booking={booking}
                  onCancel={handleCancelBooking}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
