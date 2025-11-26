import React, { useState } from 'react';
import { eventsAPI } from '../../services/api';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import { Calendar, MapPin, Users, DollarSign, Image, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

const CreateEvent = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Music',
    location: '',
    locationType: 'Online',
    date: '',
    startTime: '',
    endTime: '',
    capacity: '',
    price: '',
    organizer: '',
    image: ''
  });

  const categories = [
    'Music', 'Tech', 'Business', 'Workshop', 'Webinar', 'Conference', 'Art', 'Sports', 'Food', 'Other'
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

    try {
      const submitData = {
        ...formData,
        capacity: parseInt(formData.capacity),
        price: parseFloat(formData.price) || 0
      };

      const response = await eventsAPI.post('/', submitData);
      toast.success('🎉 Event created successfully!');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: 'Music',
        location: '',
        locationType: 'Online',
        date: '',
        startTime: '',
        endTime: '',
        capacity: '',
        price: '',
        organizer: '',
        image: ''
      });
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create event';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Create New Event</h2>
        <p className="text-gray-600 text-lg">Fill in the details below to create your amazing event</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Basic Information</h3>
              <p className="text-gray-600">Tell us about your event</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Event Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                placeholder="Enter event title"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
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
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              placeholder="Describe your event in detail..."
            />
          </div>

          <div className="mt-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Organizer *
            </label>
            <input
              type="text"
              name="organizer"
              value={formData.organizer}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              placeholder="Enter organizer name"
            />
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-lg border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <MapPin className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Location & Date</h3>
              <p className="text-gray-600">When and where your event will happen</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Location Type *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, locationType: 'Online' }))}
                  className={`p-4 rounded-xl border-2 text-center font-semibold transition-all ${
                    formData.locationType === 'Online'
                      ? 'border-green-500 bg-green-50 text-green-600'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Online
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, locationType: 'In-Person' }))}
                  className={`p-4 rounded-xl border-2 text-center font-semibold transition-all ${
                    formData.locationType === 'In-Person'
                      ? 'border-green-500 bg-green-50 text-green-600'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  In-Person
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                {formData.locationType === 'Online' ? 'Online Platform' : 'Venue Address'} *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                placeholder={
                  formData.locationType === 'Online' 
                    ? 'e.g., Zoom, Google Meet, Microsoft Teams' 
                    : 'Enter full venue address'
                }
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <Calendar className="h-4 w-4 inline mr-2 text-blue-500" />
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
              <label className="block text-sm font-semibold text-gray-700 mb-3">
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
              <label className="block text-sm font-semibold text-gray-700 mb-3">
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
        </div>

        <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-lg border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Capacity & Pricing</h3>
              <p className="text-gray-600">Set attendance limits and pricing</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <Users className="h-4 w-4 inline mr-2 text-purple-500" />
                Capacity *
              </label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                required
                min="1"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                placeholder="Maximum number of attendees"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <DollarSign className="h-4 w-4 inline mr-2 text-green-500" />
                Price ($)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                placeholder="0.00 for free events"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <Image className="h-4 w-4 inline mr-2 text-orange-500" />
              Event Image URL (Optional)
            </label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
              placeholder="https://example.com/event-image.jpg"
            />
            <p className="text-sm text-gray-500 mt-2">
              Provide a high-quality image URL for your event (recommended: 1200x600px)
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => {
              setFormData({
                title: '',
                description: '',
                category: 'Music',
                location: '',
                locationType: 'Online',
                date: '',
                startTime: '',
                endTime: '',
                capacity: '',
                price: '',
                organizer: '',
                image: ''
              });
              toast.success('Form cleared');
            }}
            className="px-8 py-4 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all border-2 border-transparent hover:border-gray-300"
          >
            Clear Form
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-3"
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" />
                <span>Creating Event...</span>
              </>
            ) : (
              <>
                <span>Create Event</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEvent;