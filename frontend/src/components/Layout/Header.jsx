import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  Menu,
  X,
  Calendar,
  User,
  LogOut,
  Settings,
  Bell,
  Search,
} from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMenuOpen(false);
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-xl group-hover:scale-110 transition-transform">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              EventEase
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-1">
            <Link
              to="/events"
              className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                isActiveRoute("/events")
                  ? "bg-blue-50 text-blue-600 border border-blue-200"
                  : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              }`}
            >
              Browse Events
            </Link>
            {user && !isAdmin && (
              <Link
                to="/my-bookings"
                className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                  isActiveRoute("/my-bookings")
                    ? "bg-blue-50 text-blue-600 border border-blue-200"
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                My Bookings
              </Link>
            )}
            {isAdmin && (
              <Link
                to="/admin"
                className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                  isActiveRoute("/admin")
                    ? "bg-blue-50 text-blue-600 border border-blue-200"
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                Admin Panel
              </Link>
            )}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3 bg-gray-50 rounded-xl px-3 py-2 border border-gray-200">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-gray-700 font-medium text-sm">
                    {isAdmin ? "Admin" : `Hi, ${user.name}`}
                  </span>

                  <button
                    onClick={handleLogout}
                    className="text-gray-600 hover:text-red-600 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-6 py-2 text-gray-700 hover:text-blue-600 font-semibold rounded-xl hover:bg-gray-50 transition-all"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold px-6 py-2 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2 md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-all"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 bg-white/95 backdrop-blur-md rounded-b-2xl shadow-lg">
            <nav className="flex flex-col space-y-2">
              <Link
                to="/events"
                className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                  isActiveRoute("/events")
                    ? "bg-blue-50 text-blue-600 border border-blue-200"
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Browse Events
              </Link>

              {user && !isAdmin && (
                <Link
                  to="/my-bookings"
                  className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                    isActiveRoute("/my-bookings")
                      ? "bg-blue-50 text-blue-600 border border-blue-200"
                      : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Bookings
                </Link>
              )}

              {isAdmin && (
                <Link
                  to="/admin"
                  className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                    isActiveRoute("/admin")
                      ? "bg-blue-50 text-blue-600 border border-blue-200"
                      : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin Panel
                </Link>
              )}

              {user ? (
                <div className="pt-4 border-t border-gray-200 space-y-3">
                  <div className="flex items-center space-x-3 px-4 py-2 bg-gray-50 rounded-xl">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-gray-900 font-semibold">
                        {user.name}
                      </div>
                      <div className="text-gray-600 text-sm">{user.email}</div>
                      {isAdmin && (
                        <div className="text-blue-600 text-xs font-medium bg-blue-50 px-2 py-1 rounded-full mt-1">
                          Admin
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all text-left"
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="font-semibold">Logout</span>
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t border-gray-200 flex flex-col space-y-3">
                  <Link
                    to="/login"
                    className="px-4 py-3 text-gray-700 hover:text-blue-600 font-semibold rounded-xl hover:bg-gray-50 transition-all text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold px-4 py-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
