import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, Users, Star, ArrowRight, MapPin, Clock, Ticket } from 'lucide-react';

const Home = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <Calendar className="h-12 w-12 text-white" />,
      title: 'Discover Events',
      description: 'Find concerts, workshops, conferences, and more happening near you or online.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <Users className="h-12 w-12 text-white" />,
      title: 'Easy Booking',
      description: 'Book your seats in just a few clicks with our seamless booking system.',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: <Star className="h-12 w-12 text-white" />,
      title: 'Track Your Events',
      description: 'Keep all your bookings organized and get reminders for upcoming events.',
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Events Hosted', icon: <Calendar className="h-6 w-6" /> },
    { number: '50K+', label: 'Happy Attendees', icon: <Users className="h-6 w-6" /> },
    { number: '100+', label: 'Event Organizers', icon: <Star className="h-6 w-6" /> },
    { number: '24/7', label: 'Support', icon: <Clock className="h-6 w-6" /> }
  ];

  const trendingEvents = [
    {
      title: "Summer Music Festival",
      date: "2024-07-15",
      location: "Central Park, NYC",
      price: 45,
      type: "Concert"
    },
    {
      title: "Tech Innovation Summit",
      date: "2024-08-20",
      location: "Online Event",
      price: 0,
      type: "Conference"
    },
    {
      title: "Food & Wine Expo",
      date: "2024-09-05",
      location: "Convention Center",
      price: 75,
      type: "Workshop"
    }
  ];

  return (
    <div className="min-h-screen">
      <section className="relative bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight">
                Discover{' '}
                <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  Amazing
                </span>{' '}
                Events
              </h1>
              <p className="text-xl lg:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                From concerts to conferences, find and book your next unforgettable experience with EventEase
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                to="/events" 
                className="group bg-white text-blue-600 font-bold px-8 py-4 rounded-2xl flex items-center space-x-3 hover:scale-105 transform transition-all duration-300 shadow-2xl"
              >
                <span className="text-lg">Explore Events</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              {!isAuthenticated && (
                <Link 
                  to="/register" 
                  className="border-2 border-white text-white font-bold px-8 py-4 rounded-2xl hover:bg-white hover:text-blue-600 transition-all duration-300 backdrop-blur-sm"
                >
                  Join Now
                </Link>
              )}
            </div>
          </div>
        </div>
        
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/10 animate-pulse"
              style={{
                width: Math.random() * 100 + 50,
                height: Math.random() * 100 + 50,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 10 + 10}s`
              }}
            />
          ))}
        </div>
      </section>

      <section className="relative -mt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div 
              key={idx}
              className="bg-white rounded-2xl p-6 shadow-2xl border border-gray-100 hover:shadow-3xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl mb-4 mx-auto">
                <div className="text-white">
                  {stat.icon}
                </div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-2xl lg:text-3xl font-bold text-gray-900">{stat.number}</div>
                <div className="text-gray-600 font-medium text-sm">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
              Why Choose <span className="text-blue-600">EventEase</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We make event discovery and booking simple, secure, and enjoyable for everyone
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div 
                key={idx}
                className="group relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-4"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-3xl opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                <div className={`p-4 bg-gradient-to-br ${feature.gradient} rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 text-lg leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
              Trending <span className="text-orange-500">Events</span>
            </h2>
            <p className="text-xl text-gray-600">Discover what's hot right now</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {trendingEvents.map((event, idx) => (
              <div key={idx} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                    {event.type}
                  </span>
                  <div className="text-2xl font-bold text-gray-900">
                    {event.price === 0 ? 'FREE' : `$${event.price}`}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{event.title}</h3>
                <div className="space-y-2 text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link 
              to="/events" 
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold px-8 py-4 rounded-2xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <Ticket className="h-5 w-5" />
              <span>View All Events</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 space-y-8">
          <h2 className="text-4xl lg:text-5xl font-bold text-white">
            Ready to Explore Amazing Events?
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Join thousands of users who trust EventEase for their event booking needs
          </p>
          <Link 
            to="/events" 
            className="inline-flex items-center space-x-3 bg-white text-blue-600 font-bold px-8 py-4 rounded-2xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            <span>Get Started Today</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;