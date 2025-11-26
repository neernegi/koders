import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { eventsAPI } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import LoadingSpinner from "../../components/Common/LoadingSpinner";
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  ArrowLeft,
  Share2,
  Bookmark,
  Heart,
  Star,
  Ticket,
  Shield,
  CheckCircle,
} from "lucide-react";
import {
  formatDate,
  formatTime,
  getEventStatus,
  getStatusColor,
} from "../../utils/dateFormatter";
import toast from "react-hot-toast";

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  const status = getEventStatus(event.date);
  const statusColor = getStatusColor(status);
  const availableSeats = event.capacity - event.bookedSeats;
  const canBook = availableSeats > 0 && status !== "Completed";
  const isSoldOut = availableSeats === 0;
  const isAlmostFull = availableSeats <= 5 && availableSeats > 0;

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const response = await eventsAPI.get(`/${id}`);
      setEvent(response.data.data.event);
    } catch (error) {
      console.error("Failed to fetch event:", error);
      toast.error("Failed to load event details");
    } finally {
      setLoading(false);
    }
  };

  const shareEvent = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: event.description,
          url: window.location.href,
        });
        toast.success("Event shared successfully!");
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("📋 Event link copied to clipboard!");
    }
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast.success(
      isBookmarked ? "Removed from saved events" : "Event saved to your list"
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-gray-600 text-lg">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center py-12">
          <div className="text-7xl text-gray-300 mb-4">❌</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Event Not Found
          </h3>
          <p className="text-gray-600 text-lg mb-6 max-w-md mx-auto">
            The event you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate("/events")}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold px-8 py-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all"
          >
            Browse Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate("/events")}
          className="flex items-center space-x-3 text-gray-600 hover:text-blue-600 mb-8 group transition-all"
        >
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold">Back to Events</span>
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${statusColor}`}
                    >
                      {status}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                      {event.category}
                    </span>
                  </div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3 leading-tight">
                    {event.title}
                  </h1>
                  <p className="text-lg text-gray-600 mb-4">
                    Organized by{" "}
                    <span className="font-semibold text-blue-600">
                      {event.organizer}
                    </span>
                  </p>

                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>4.8 (250 reviews)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-500" />
                      <span>{event.bookedSeats} attendees</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={shareEvent}
                    className="p-3 bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600 rounded-xl transition-all hover:scale-110"
                    title="Share event"
                  >
                    <Share2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={toggleBookmark}
                    className={`p-3 rounded-xl transition-all hover:scale-110 ${
                      isBookmarked
                        ? "bg-red-100 text-red-600"
                        : "bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600"
                    }`}
                    title="Save event"
                  >
                    {isBookmarked ? (
                      <Heart className="h-5 w-5 fill-current" />
                    ) : (
                      <Bookmark className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 relative">
                {event.image ? (
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-8xl">
                    🎭
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {event.locationType}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-8">
                  {["details", "agenda", "speakers", "reviews"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-4 px-1 font-semibold text-lg border-b-2 transition-all ${
                        activeTab === tab
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-8">
                {activeTab === "details" && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      About This Event
                    </h2>
                    <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
                      {event.description}
                    </p>

                    <div className="grid md:grid-cols-2 gap-4 mt-6">
                      <div className="flex items-center gap-3 text-gray-700">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span>Certificate of Participation</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-700">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span>Networking Opportunities</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-700">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span>Refreshments Included</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-700">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span>Q&A Session</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Event Details Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Event Details
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-gray-700">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold">Date & Time</div>
                      <div className="text-gray-600">
                        {event.formattedDate || formatDate(event.date)}
                        <br />
                        {formatTime(event.startTime)} -{" "}
                        {formatTime(event.endTime)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-gray-700">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <div className="font-semibold">Location</div>
                      <div className="text-gray-600">
                        {event.locationType === "Online"
                          ? "Online Event"
                          : event.location}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-gray-700">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <Users className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-semibold">Attendance</div>
                      <div className="text-gray-600">
                        {event.bookedSeats} of {event.capacity} seats booked
                        {isSoldOut && (
                          <span className="ml-2 text-red-600 font-medium">
                            (Sold Out)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-gray-700">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                      <Shield className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <div className="font-semibold">Safety</div>
                      <div className="text-gray-600">
                        COVID-19 guidelines apply
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 sticky top-8">
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {event.price === 0 ? "FREE" : `$${event.price}`}
                </div>
                <div className="text-gray-600">
                  per person •{" "}
                  {event.price === 0
                    ? "No payment required"
                    : "All fees included"}
                </div>
              </div>

              {canBook ? (
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-xl p-4 space-y-3 text-center">
                    <div className="text-sm text-gray-600">Starting from</div>
                    <div className="text-2xl font-bold text-blue-600">
                      {event.price === 0 ? "FREE" : `$${event.price}`}
                    </div>
                    <div className="text-xs text-gray-500">per person</div>
                  </div>

                  <Link
                    to={isAuthenticated ? `/booking/${event._id}` : "/login"}
                    state={
                      !isAuthenticated
                        ? { from: `/booking/${event._id}` }
                        : null
                    }
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-4 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all flex items-center justify-center gap-3"
                  >
                    <Ticket className="h-5 w-5" />
                    <span>Book This Event</span>
                  </Link>

                  {/* Low Stock Warning */}
                  {isAlmostFull && (
                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-center">
                      <div className="text-orange-600 font-semibold mb-1">
                        ⚠️ Only {availableSeats} seats left!
                      </div>
                      <div className="text-orange-500 text-sm">
                        Book now to secure your spot
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <div className="text-gray-500">
                    {isSoldOut ? (
                      <div>
                        <div className="text-6xl mb-2">😔</div>
                        <p className="font-semibold text-lg text-gray-900">
                          Sold Out
                        </p>
                        <p className="text-gray-600 mt-1">
                          This event is fully booked
                        </p>
                      </div>
                    ) : (
                      <div>
                        <div className="text-6xl mb-2">✅</div>
                        <p className="font-semibold text-lg text-gray-900">
                          Event {status.toLowerCase()}
                        </p>
                        <p className="text-gray-600 mt-1">
                          Registration is closed
                        </p>
                      </div>
                    )}
                  </div>
                  {!isAuthenticated && (
                    <Link
                      to="/login"
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all block"
                    >
                      Login for Updates
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
