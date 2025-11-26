import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Users, Clock, Heart, Star, Ticket } from 'lucide-react';
import { formatDate, formatTime, getEventStatus, getStatusColor, isEventStarted } from '../../utils/dateFormatter';
import { useAuth } from '../../contexts/AuthContext';

const EventCard = ({ event, viewMode = 'grid' }) => {
  const { isAuthenticated } = useAuth();
  const status = getEventStatus(event.date);
  const statusColor = getStatusColor(status);
  const availableSeats = event.capacity - event.bookedSeats;
  const isAlmostFull = availableSeats <= event.capacity * 0.2;
  const isSoldOut = availableSeats === 0;
  const canBook = availableSeats > 0 && !isEventStarted(event.date);

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 group hover:border-blue-200">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-64 lg:h-40 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl overflow-hidden flex-shrink-0">
            {event.image ? (
              <img 
                src={event.image} 
                alt={event.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white text-4xl">
                🎭
              </div>
            )}
          </div>

          {/* Event Details */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${statusColor}`}>
                    {status}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {event.category}
                  </span>
                </div>
                <button className="text-gray-400 hover:text-red-500 transition-colors">
                  <Heart className="h-5 w-5" />
                </button>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                {event.title}
              </h3>
              
              <p className="text-gray-600 mb-4 line-clamp-2">
                {event.description}
              </p>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <span>{event.formattedDate || formatDate(event.date)}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-green-500" />
                  <span>{formatTime(event.startTime)}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-purple-500" />
                  <span className="truncate">
                    {event.locationType === 'Online' ? 'Online Event' : event.location}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-orange-500" />
                  <span>
                    {event.bookedSeats} booked •{' '}
                    {isSoldOut ? (
                      <span className="text-red-600 font-semibold">Sold Out</span>
                    ) : isAlmostFull ? (
                      <span className="text-orange-600 font-semibold">{availableSeats} left</span>
                    ) : (
                      <span className="text-green-600">{availableSeats} available</span>
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-4">
                <div className="text-2xl font-bold text-gray-900">
                  {event.price === 0 ? 'FREE' : `$${event.price}`}
                </div>
               
              </div>
              
              <div className="flex gap-3">
                <Link
                  to={`/events/${event._id}`}
                  className="bg-gray-100 text-gray-700 font-semibold px-6 py-2 rounded-xl hover:bg-gray-200 transition-all"
                >
                  View Details
                </Link>
                
                {canBook && !isSoldOut && (
                  <Link
                    to={isAuthenticated ? `/booking/${event._id}` : '/login'}
                    state={!isAuthenticated ? { from: `/booking/${event._id}` } : null}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold px-6 py-2 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all flex items-center gap-2"
                  >
                    <Ticket className="h-4 w-4" />
                    Book Now
                  </Link>
                )}
                
                {isSoldOut && (
                  <button
                    disabled
                    className="bg-gray-300 text-gray-500 font-semibold px-6 py-2 rounded-xl cursor-not-allowed"
                  >
                    Sold Out
                  </button>
                )}
                
                {!canBook && !isSoldOut && (
                  <button
                    disabled
                    className="bg-gray-300 text-gray-500 font-semibold px-6 py-2 rounded-xl cursor-not-allowed"
                  >
                    Event Ended
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 group hover:border-blue-200 hover:-translate-y-1">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${statusColor}`}>
            {status}
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {event.category}
          </span>
        </div>
        <button className="text-gray-400 hover:text-red-500 transition-colors">
          <Heart className="h-5 w-5" />
        </button>
      </div>

      <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl mb-4 overflow-hidden">
        {event.image ? (
          <img 
            src={event.image} 
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white text-5xl">
            🎭
          </div>
        )}
      </div>

      <div className="space-y-3">
        <h3 className="text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {event.title}
        </h3>
        
        <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
          {event.description}
        </p>

        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2 text-blue-500" />
            <span>{event.formattedDate || formatDate(event.date)}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-2 text-green-500" />
            <span>{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2 text-purple-500" />
            <span className="truncate">
              {event.locationType === 'Online' ? 'Online Event' : event.location}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-gray-600">
              <Users className="h-4 w-4 mr-2 text-orange-500" />
              <span>
                {event.bookedSeats} / {event.capacity}
              </span>
            </div>
            {isAlmostFull && availableSeats > 0 && (
              <span className="text-orange-600 font-semibold text-xs bg-orange-50 px-2 py-1 rounded-full">
                {availableSeats} left
              </span>
            )}
            {isSoldOut && (
              <span className="text-red-600 font-semibold text-xs bg-red-50 px-2 py-1 rounded-full">
                Sold Out
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <div className="text-2xl font-bold text-gray-900">
            {event.price === 0 ? 'FREE' : `$${event.price}`}
          </div>
         
        </div>
        
        <div className="flex gap-2">
          <Link
            to={`/events/${event._id}`}
            className="bg-gray-100 text-gray-700 font-semibold px-4 py-2 rounded-xl hover:bg-gray-200 transition-all text-sm"
          >
            Details
          </Link>
          
          {canBook && !isSoldOut && (
            <Link
              to={isAuthenticated ? `/booking/${event._id}` : '/login'}
              state={!isAuthenticated ? { from: `/booking/${event._id}` } : null}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold px-4 py-2 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all text-sm flex items-center gap-1"
            >
              <Ticket className="h-3 w-3" />
              Book
            </Link>
          )}
          
          {isSoldOut && (
            <button
              disabled
              className="bg-gray-300 text-gray-500 font-semibold px-4 py-2 rounded-xl cursor-not-allowed text-sm"
            >
              Sold Out
            </button>
          )}
          
          {!canBook && !isSoldOut && (
            <button
              disabled
              className="bg-gray-300 text-gray-500 font-semibold px-4 py-2 rounded-xl cursor-not-allowed text-sm"
            >
              Ended
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;