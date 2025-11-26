import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventsAPI, bookingsAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  ArrowLeft,
  Ticket,
  Shield,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { formatDate, formatTime, isEventStarted } from '../../utils/dateFormatter';
import toast from 'react-hot-toast';

const CreateBooking = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [seats, setSeats] = useState(1);
  const [userBookings, setUserBookings] = useState([]);

  useEffect(() => {
    if (eventId) {
      fetchEvent();
      fetchUserBookings();
    }
  }, [eventId]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const response = await eventsAPI.get(`/${eventId}`);
      setEvent(response.data.data.event);
    } catch (error) {
      console.error('Failed to fetch event:', error);
      toast.error('Failed to load event details');
      navigate('/events');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserBookings = async () => {
    if (!isAuthenticated) return;
    
    try {
      const response = await bookingsAPI.get('/my-bookings');
      setUserBookings(response.data.data.bookings);
    } catch (error) {
      console.error('Failed to fetch user bookings:', error);
    }
  };

  const handleBookEvent = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to book events');
      navigate('/login', { state: { from: `/booking/${eventId}` } });
      return;
    }

    try {
      setBookingLoading(true);
      const response = await bookingsAPI.post('/', {
        eventId: event._id,
        seats: seats
      });

      toast.success('🎉 Booking confirmed successfully!');
      
      setTimeout(() => {
        navigate('/my-bookings');
      }, 1500);
      
    } catch (error) {
      const message = error.response?.data?.message || 'Booking failed';
      toast.error(message);
    } finally {
      setBookingLoading(false);
    }
  };

  const hasUserBookedEvent = userBookings.some(
    booking => booking.event._id === eventId && booking.status === 'confirmed'
  );

  const availableSeats = event ? event.capacity - event.bookedSeats : 0;
  const isSoldOut = availableSeats === 0;
  const canBook = availableSeats > 0 && !isEventStarted(event?.date) && !hasUserBookedEvent;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-gray-600">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center space-y-6">
          <div className="text-8xl text-gray-300">❌</div>
          <h3 className="text-2xl font-bold text-gray-900">Event Not Found</h3>
          <p className="text-gray-600 text-lg">The event you're looking for doesn't exist.</p>
          <button 
            onClick={() => navigate('/events')}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold px-8 py-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all"
          >
            Browse Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 group transition-all"
        >
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Event</span>
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Event Details */}
          <div className="lg:col-span-2 space-y-6">
            
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <div className="flex items-start justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                      event.status === 'Upcoming' 
                        ? 'bg-green-100 text-green-800 border border-green-200'
                        : event.status === 'Ongoing'
                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                        : 'bg-gray-100 text-gray-800 border border-gray-200'
                    }`}>
                      {event.status}
                    </span>
                    <span className="px-4 py-2 rounded-full text-sm font-bold bg-purple-100 text-purple-800 border border-purple-200">
                      {event.category}
                    </span>
                  </div>
                  
                  <h1 className="text-4xl font-bold text-gray-900 leading-tight">
                    {event.title}
                  </h1>
                  <p className="text-xl text-gray-600 leading-relaxed">
                    {event.description}
                  </p>
                  
                  <div className="flex items-center gap-2 text-gray-500">
                    <span>Organized by</span>
                    <span className="font-semibold text-gray-700">{event.organizer}</span>
                  </div>
                </div>
                
                <div className="hidden lg:block">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-4xl font-bold">
                    {event.title.split(' ').map(word => word[0]).join('').slice(0, 3)}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Event Information</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Calendar className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Date</div>
                      <div className="font-semibold text-gray-900">
                        {event.formattedDate || formatDate(event.date)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <Clock className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Time</div>
                      <div className="font-semibold text-gray-900">
                        {formatTime(event.startTime)} - {formatTime(event.endTime)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <MapPin className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Location</div>
                      <div className="font-semibold text-gray-900">
                        {event.locationType === 'Online' ? '🌐 Online Event' : event.location}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="p-3 bg-orange-100 rounded-lg">
                      <Users className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Availability</div>
                      <div className="font-semibold text-gray-900">
                        {availableSeats} of {event.capacity} seats available
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {hasUserBookedEvent && (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
                <div className="flex items-center gap-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-green-800">Already Booked!</h3>
                    <p className="text-green-700">
                      You have already booked this event. Check your bookings to view details.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {isSoldOut && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                <div className="flex items-center gap-4">
                  <XCircle className="h-8 w-8 text-red-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-red-800">Sold Out!</h3>
                    <p className="text-red-700">
                      This event is fully booked. Please check back later or explore other events.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              
              {/* Booking Card */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {event.price === 0 ? 'FREE' : `$${event.price}`}
                  </div>
                  <div className="text-gray-600">per person</div>
                </div>

                {canBook ? (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Number of Seats (Max 2)
                      </label>
                      <div className="flex gap-2">
                        {[1, 2].map(num => (
                          <button
                            key={num}
                            onClick={() => setSeats(num)}
                            disabled={num > availableSeats}
                            className={`flex-1 py-4 rounded-xl font-bold text-lg border-2 transition-all ${
                              seats === num
                                ? 'bg-blue-500 text-white border-blue-500 shadow-lg'
                                : num > availableSeats
                                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500 hover:shadow-md'
                            }`}
                          >
                            {num} {num === 1 ? 'Seat' : 'Seats'}
                          </button>
                        ))}
                      </div>
                      {seats > availableSeats && (
                        <p className="text-red-600 text-sm mt-2">
                          Only {availableSeats} seat{availableSeats !== 1 ? 's' : ''} available
                        </p>
                      )}
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                      <div className="flex justify-between text-gray-600">
                        <span>Seats:</span>
                        <span>{seats}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Price per seat:</span>
                        <span>{event.price === 0 ? 'Free' : `$${event.price}`}</span>
                      </div>
                      <hr className="border-gray-300" />
                      <div className="flex justify-between text-lg font-bold text-gray-900">
                        <span>Total Amount:</span>
                        <span>
                          {event.price === 0 ? 'Free' : `$${event.price * seats}`}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={handleBookEvent}
                      disabled={bookingLoading || seats > availableSeats}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-4 rounded-xl hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all flex items-center justify-center gap-3"
                    >
                      {bookingLoading ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        <>
                          <Ticket className="h-5 w-5" />
                          Confirm Booking
                        </>
                      )}
                    </button>

                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                      <Shield className="h-4 w-4" />
                      <span>Secure booking • Instant confirmation</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">
                      {hasUserBookedEvent ? '✅' : isSoldOut ? '😔' : '⏰'}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {hasUserBookedEvent 
                        ? 'Already Booked' 
                        : isSoldOut 
                        ? 'Sold Out' 
                        : 'Booking Closed'
                      }
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {hasUserBookedEvent
                        ? 'You have already booked this event.'
                        : isSoldOut
                        ? 'All seats for this event have been booked.'
                        : 'Booking is no longer available for this event.'
                      }
                    </p>
                    {!isAuthenticated && (
                      <button
                        onClick={() => navigate('/login')}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 rounded-xl hover:shadow-lg"
                      >
                        Login to Join Waitlist
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
                <h4 className="font-semibold text-yellow-800 mb-3">Important Information</h4>
                <ul className="text-yellow-700 text-sm space-y-2">
                  <li>• Maximum 2 seats per booking</li>
                  <li>• Booking confirmation will be sent via email</li>
                  <li>• Cancellation available until event start time</li>
                  <li>• Bring your booking confirmation to the event</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBooking;