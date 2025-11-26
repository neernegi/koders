import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import CreateEvent from './CreateEvent';
import ManageEvents from './ManageEvents';
import EventAttendees from './EventAttendees';
import { Plus, Calendar, Users, BarChart3, Settings, Shield } from 'lucide-react';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('create');
  const { user } = useAuth();

  const tabs = [
    { id: 'create', label: 'Create Event', icon: Plus, color: 'text-green-600', bgColor: 'bg-green-100' },
    { id: 'manage', label: 'Manage Events', icon: Calendar, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { id: 'attendees', label: 'View Attendees', icon: Users, color: 'text-purple-600', bgColor: 'bg-purple-100' },
  ];

  const stats = [
    { label: 'Total Events', value: '24', change: '+12%', color: 'text-blue-600' },
    { label: 'Total Attendees', value: '1,234', change: '+8%', color: 'text-green-600' },
    { label: 'Revenue', value: '$12,456', change: '+23%', color: 'text-purple-600' },
    { label: 'Avg. Rating', value: '4.8/5', change: '+0.2', color: 'text-orange-600' },
  ];

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-pink-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <Shield className="h-12 w-12 text-white" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Access Denied
          </h3>
          <p className="text-xl text-gray-600 max-w-md mx-auto mb-8">
            You need administrator privileges to access this panel.
          </p>
          <button 
            onClick={() => window.history.back()}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold px-8 py-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-xl text-gray-600 mt-2">
                Manage events, view analytics, and track attendees
              </p>
            </div>
            <div className="flex items-center gap-3 bg-white rounded-2xl shadow-lg border border-gray-200 px-4 py-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="font-semibold text-gray-900">{user.name}</div>
                <div className="text-sm text-gray-600">Administrator</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl lg:text-3xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                </div>
                <div className={`text-sm font-semibold ${stat.color}`}>
                  {stat.change}
                </div>
              </div>
              <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.random() * 70 + 30}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
            <nav className="flex overflow-x-auto">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-3 py-6 px-8 border-b-2 font-semibold text-lg transition-all flex-shrink-0 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600 bg-white shadow-sm'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-white/50'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${tab.bgColor} ${tab.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-8">
            {activeTab === 'create' && <CreateEvent />}
            {activeTab === 'manage' && <ManageEvents />}
            {activeTab === 'attendees' && <EventAttendees />}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 text-center hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <BarChart3 className="h-6 w-6 text-green-600" />
            </div>
            <div className="font-semibold text-gray-900">Analytics</div>
            <div className="text-sm text-gray-600">View reports</div>
          </button>
          
          <button className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 text-center hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Settings className="h-6 w-6 text-blue-600" />
            </div>
            <div className="font-semibold text-gray-900">Settings</div>
            <div className="text-sm text-gray-600">Configure system</div>
          </button>
          
          <button className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 text-center hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div className="font-semibold text-gray-900">Users</div>
            <div className="text-sm text-gray-600">Manage users</div>
          </button>
          
          <button className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 text-center hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Calendar className="h-6 w-6 text-orange-600" />
            </div>
            <div className="font-semibold text-gray-900">Calendar</div>
            <div className="text-sm text-gray-600">View schedule</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;