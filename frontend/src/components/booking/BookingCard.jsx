import React from 'react';
import { MapPin, Calendar, Users, XCircle, Download, Clock, Tag } from 'lucide-react';
import { formatDate, isEventStarted } from '../../utils/dateFormatter';
import toast from 'react-hot-toast';

const BookingCard = ({ booking, onCancel }) => {
  const event = booking.event;
  const eventDate = new Date(event.date);
  const canCancel = !isEventStarted(event.date) && booking.status === 'confirmed';
  const isUpcoming = eventDate > new Date();

  const handleCancel = async () => {
    if (window.confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
      try {
        await onCancel(booking._id);
        toast.success('Booking cancelled successfully');
      } catch (error) {
        toast.error('Failed to cancel booking');
      }
    }
  };

  const downloadTicket = () => {
    toast.success('Your ticket is being downloaded...');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return isUpcoming ? 'bg-green-100 text-green-800 border-green-200' : 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed':
        return isUpcoming ? 'Confirmed' : 'Attended';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 p-6 group hover:border-blue-200">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        
        <div className="flex gap-4 flex-1">
          {/* Event Image */}
          <div className="flex-shrink-0">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-sm text-center p-2">
              {event.title.split(' ').map(word => word[0]).join('').toUpperCase()}
            </div>
          </div>

          {/* Event Details */}
          <div className="flex-1 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {event.title}
                </h3>
                <p className="text-gray-600 mt-1 text-sm line-clamp-2">
                  {event.description}
                </p>
              </div>
              
              <div className="flex flex-col items-end gap-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(booking.status)}`}>
                  {getStatusText(booking.status)}
                </span>
                <div className="text-xs text-gray-500 font-mono">
                  #{booking.bookingId}
                </div>
              </div>
            </div>

            {/* Event Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center text-gray-700">
                <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                <span className="font-medium">{formatDate(event.date)}</span>
              </div>

              <div className="flex items-center text-gray-700">
                <Clock className="h-4 w-4 mr-2 text-blue-500" />
                <span>{new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>

              <div className="flex items-center text-gray-700">
                <Users className="h-4 w-4 mr-2 text-blue-500" />
                <span><strong>{booking.seats}</strong> {booking.seats === 1 ? 'Seat' : 'Seats'}</span>
              </div>

              <div className="flex items-center text-gray-700">
                <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                <span>{event.locationType === 'Online' ? '🌐 Online Event' : event.location}</span>
              </div>
            </div>

            {/* Price and Type */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-gray-700">
                  <Tag className="h-4 w-4 mr-1 text-orange-500" />
                  <span className="font-medium">{event.category}</span>
                </div>
                <div className="text-lg font-bold text-gray-900">
                  {event.price === 0 ? 'FREE' : `$${booking.totalAmount}`}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
          {booking.status === 'confirmed' && (
            <>
              <button
                onClick={downloadTicket}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg transform hover:scale-105 transition-all"
              >
                <Download className="h-4 w-4" />
                Download Ticket
              </button>

              {canCancel && (
                <button
                  onClick={handleCancel}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-red-500 to-pink-600 text-white hover:shadow-lg transform hover:scale-105 transition-all"
                >
                  <XCircle className="h-4 w-4" />
                  Cancel Booking
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Cancellation Info */}
      {booking.status === 'cancelled' && booking.cancellationDate && (
        <div className="mt-4 pt-4 border-t border-red-200 bg-red-50 rounded-xl p-3">
          <div className="flex items-center text-red-700 text-sm">
            <XCircle className="h-4 w-4 mr-2" />
            <span>Cancelled on {formatDate(booking.cancellationDate)}</span>
          </div>
        </div>
      )}

      {/* Event Date Warning */}
      {booking.status === 'confirmed' && !isUpcoming && (
        <div className="mt-4 pt-4 border-t border-blue-200 bg-blue-50 rounded-xl p-3">
          <div className="flex items-center text-blue-700 text-sm">
            <Clock className="h-4 w-4 mr-2" />
            <span>This event has already taken place. We hope you enjoyed it!</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingCard;