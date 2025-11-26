import React, { useState, useEffect } from 'react';
import { eventsAPI } from '../../services/api';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import { Edit, Trash2, Eye, Users, Calendar, Search, Filter, BarChart3 } from 'lucide-react';
import { formatDate, formatTime, getStatusColor } from '../../utils/dateFormatter';
import toast from 'react-hot-toast';

const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await eventsAPI.get('/');
      console.log('Fetched events:', response.data.data.events);
      setEvents(response.data.data.events);
    } catch (error) {
      console.error('Failed to fetch events:', error);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }

    try {
      await eventsAPI.delete(`/${eventId}`);
      toast.success('🗑️ Event deleted successfully');
      fetchEvents();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete event';
      toast.error(message);
    }
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setShowEditModal(true);
  };

  const handleUpdateEvent = async (updatedData) => {
    try {
      await eventsAPI.put(`/${editingEvent._id}`, updatedData);
      toast.success('✅ Event updated successfully');
      setShowEditModal(false);
      setEditingEvent(null);
      fetchEvents();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update event';
      toast.error(message);
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.organizer.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === 'all') return matchesSearch;
    
    return matchesSearch && event.status.toLowerCase() === statusFilter.toLowerCase();
  });

  const eventStats = {
    total: events.length,
    upcoming: events.filter(e => e.status === 'Upcoming').length,
    ongoing: events.filter(e => e.status === 'Ongoing').length,
    completed: events.filter(e => e.status === 'Completed').length,
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-gray-600">Loading your events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{eventStats.total}</div>
              <div className="text-blue-100 text-sm">Total Events</div>
            </div>
            <Calendar className="h-8 w-8 text-blue-200" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{eventStats.upcoming}</div>
              <div className="text-green-100 text-sm">Upcoming</div>
            </div>
            <Calendar className="h-8 w-8 text-green-200" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{eventStats.ongoing}</div>
              <div className="text-orange-100 text-sm">Ongoing</div>
            </div>
            <Calendar className="h-8 w-8 text-orange-200" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{eventStats.completed}</div>
              <div className="text-purple-100 text-sm">Completed</div>
            </div>
            <Calendar className="h-8 w-8 text-purple-200" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Manage Events</h2>
            <p className="text-gray-600">
              Showing {filteredEvents.length} of {events.length} events
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all w-64"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              >
                <option value="all">All Status</option>
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Events Table */}
      {filteredEvents.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg border-2 border-dashed border-gray-300 py-16 text-center">
          <div className="text-7xl text-gray-300 mb-4">📅</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            {searchTerm || statusFilter !== 'all' ? 'No Events Found' : 'No Events Created'}
          </h3>
          <p className="text-gray-600 text-lg mb-6 max-w-md mx-auto">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'Create your first event to get started with event management'
            }
          </p>
          {!searchTerm && statusFilter === 'all' && (
            <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold px-8 py-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all">
              Create First Event
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Event Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Attendance
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEvents.map((event) => {
                  const availableSeats = event.capacity - event.bookedSeats;
                  const attendanceRate = event.capacity > 0 ? (event.bookedSeats / event.capacity) * 100 : 0;
                  
                  return (
                    <tr key={event._id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold overflow-hidden">
                            {event.image ? (
                              <img
                                className="h-12 w-12 object-cover"
                                src={event.image}
                                alt={event.title}
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                            ) : null}
                            <div className={`${event.image ? 'hidden' : 'flex'} items-center justify-center w-full h-full`}>
                              <span className="text-lg">🎭</span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                              {event.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {event.category} • {event.locationType}
                            </div>
                            <div className="text-xs text-gray-400">
                              By {event.organizer}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          {event.formattedDate || formatDate(event.date)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatTime(event.startTime)} - {formatTime(event.endTime)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-gray-900">
                              {event.bookedSeats} / {event.capacity}
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full transition-all duration-500 ${
                                  attendanceRate >= 80 ? 'bg-red-500' :
                                  attendanceRate >= 50 ? 'bg-orange-500' :
                                  attendanceRate >= 20 ? 'bg-yellow-500' : 'bg-green-500'
                                }`}
                                style={{ width: `${Math.min(attendanceRate, 100)}%` }}
                              ></div>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {availableSeats} seats available
                            </div>
                          </div>
                          <div className="text-sm font-semibold text-gray-700 whitespace-nowrap">
                            {Math.round(attendanceRate)}%
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(event.status)}`}>
                          {event.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEditEvent(event)}
                            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors hover:scale-110 transform"
                            title="Edit Event"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(event._id)}
                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors hover:scale-110 transform"
                            title="Delete Event"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <button
                            className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors hover:scale-110 transform"
                            title="View Analytics"
                          >
                            <BarChart3 className="h-4 w-4" />
                          </button>
                          <button
                            className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors hover:scale-110 transform"
                            title="View Attendees"
                          >
                            <Users className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showEditModal && (
        <EditEventModal
          event={editingEvent}
          onClose={() => {
            setShowEditModal(false);
            setEditingEvent(null);
          }}
          onSave={handleUpdateEvent}
        />
      )}
    </div>
  );
};

const EditEventModal = ({ event, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: event.title,
    description: event.description,
    category: event.category,
    location: event.location,
    locationType: event.locationType,
    date: event.date.split('T')[0],
    startTime: event.startTime,
    endTime: event.endTime,
    capacity: event.capacity,
    price: event.price,
    organizer: event.organizer,
    image: event.image || ''
  });
  const [loading, setLoading] = useState(false);

  const categories = [
    'Music', 'Tech', 'Business', 'Workshop', 'Webinar', 'Conference', 'Sports', 'Arts', 'Food', 'Health', 'Other'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSave(formData);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Edit className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Edit Event</h3>
                <p className="text-blue-100">Update your event details</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-colors text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 max-h-[60vh] overflow-y-auto">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Event Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Location Type *
              </label>
              <select
                name="locationType"
                value={formData.locationType}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              >
                <option value="Online">Online</option>
                <option value="In-Person">In-Person</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Start Time *
              </label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                End Time *
              </label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Capacity *
              </label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                required
                min="1"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Price ($)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Image URL
            </label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            />
          </div>

          <div className="flex justify-end space-x-4 pt-6 mt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all border-2 border-transparent hover:border-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-3"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span>Saving...</span>
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManageEvents;