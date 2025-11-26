import React, { useState, useEffect } from 'react';
import { eventsAPI } from '../../services/api';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import { Search, Download, Mail, Users, Calendar, Filter } from 'lucide-react';
import { formatDate } from '../../utils/dateFormatter';
import toast from 'react-hot-toast';

const EventAttendees = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [attendeesLoading, setAttendeesLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await eventsAPI.get('/');
      setEvents(response.data.data.events);
    } catch (error) {
      console.error('Failed to fetch events:', error);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendees = async (eventId) => {
    try {
      setAttendeesLoading(true);
      const response = await eventsAPI.get(`/${eventId}/attendees`);
      setAttendees(response.data.data.attendees);
      setSelectedEvent(eventId);
    } catch (error) {
      console.error('Failed to fetch attendees:', error);
      toast.error('Failed to load attendees');
    } finally {
      setAttendeesLoading(false);
    }
  };

  const exportAttendees = () => {
    if (!attendees.length) return;

    const csvContent = [
      ['Name', 'Email', 'Seats', 'Booking Date', 'Status'],
      ...attendees.map(attendee => [
        attendee.user.name,
        attendee.user.email,
        attendee.seats,
        formatDate(attendee.bookingDate),
        attendee.status || 'Confirmed'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendees-${selectedEvent}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success('📊 Attendees exported successfully!');
  };

  const sendBulkEmail = () => {
    toast.success('📧 Bulk email feature coming soon!');
  };

  const filteredAttendees = attendees
    .filter(attendee =>
      attendee.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attendee.user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.user.name.localeCompare(b.user.name);
        case 'date':
          return new Date(b.bookingDate) - new Date(a.bookingDate);
        case 'seats':
          return b.seats - a.seats;
        default:
          return 0;
      }
    });

  const selectedEventData = events.find(e => e._id === selectedEvent);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-4 gap-8">
      <div className="lg:col-span-1">
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Your Events</h3>
              <p className="text-sm text-gray-600">{events.length} total events</p>
            </div>
          </div>
          
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
            {events.map(event => (
              <button
                key={event._id}
                onClick={() => fetchAttendees(event._id)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  selectedEvent === event._id
                    ? 'border-blue-500 bg-blue-50 shadow-sm'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                }`}
              >
                <div className="font-semibold text-gray-900 text-sm line-clamp-2">
                  {event.title}
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  {event.formattedDate || formatDate(event.date)}
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500">
                    {event.bookedSeats} attendees
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    event.bookedSeats === event.capacity 
                      ? 'bg-red-100 text-red-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {Math.round((event.bookedSeats / event.capacity) * 100)}%
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:col-span-3">
        {!selectedEvent ? (
          <div className="bg-white rounded-2xl shadow-lg border-2 border-dashed border-gray-300 p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Users className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Select an Event
            </h3>
            <p className="text-gray-600 text-lg max-w-md mx-auto">
              Choose an event from the list to view and manage its attendees
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 border-b border-gray-200">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {selectedEventData?.title}
                  </h3>
                  <p className="text-gray-600">
                    {selectedEventData?.formattedDate || formatDate(selectedEventData?.date)} • 
                    <span className="font-semibold text-gray-900 ml-1">
                      {attendees.length} attendee{attendees.length !== 1 ? 's' : ''}
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  >
                    <option value="name">Sort by Name</option>
                    <option value="date">Sort by Date</option>
                    <option value="seats">Sort by Seats</option>
                  </select>

                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      placeholder="Search attendees..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all w-64"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={sendBulkEmail}
                      disabled={!attendees.length}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Mail className="h-4 w-4" />
                      <span>Email</span>
                    </button>
                    <button
                      onClick={exportAttendees}
                      disabled={!attendees.length}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Download className="h-4 w-4" />
                      <span>Export</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {attendeesLoading ? (
              <div className="flex justify-center items-center py-16">
                <div className="text-center space-y-4">
                  <LoadingSpinner size="lg" />
                  <p className="text-gray-600">Loading attendees...</p>
                </div>
              </div>
            ) : filteredAttendees.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-7xl text-gray-300 mb-4">
                  {searchTerm ? '🔍' : '👥'}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {searchTerm ? 'No Matching Attendees' : 'No Attendees Yet'}
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  {searchTerm 
                    ? 'Try adjusting your search terms to find attendees'
                    : 'Attendees will appear here once they register for your event'
                  }
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Attendee
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Seats
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Booking Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredAttendees.map((attendee) => (
                      <tr key={attendee._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                              {attendee.user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-semibold text-gray-900">
                                {attendee.user.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {attendee.user.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                            {attendee.seats} {attendee.seats === 1 ? 'seat' : 'seats'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(attendee.bookingDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            Confirmed
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventAttendees;