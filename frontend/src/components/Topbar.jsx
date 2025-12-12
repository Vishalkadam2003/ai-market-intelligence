// src/components/Topbar.jsx
import { useState, useEffect, useRef } from "react";
import { Search, Bell, Settings, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Topbar({ collapsed }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const username = localStorage.getItem("username") || "Trader";

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <header
      className={`
        fixed top-0 right-0 h-16 bg-white border-b border-gray-200 
        flex items-center justify-between px-6 z-30 shadow-sm
        transition-all duration-300
        ${collapsed ? "left-20" : "left-72"}
      `}
    >
      {/* Left: Search Bar */}
      <div className="flex items-center gap-6">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search symbols, news, or strategies..."
            className="pl-10 pr-4 py-2.5 w-80 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent transition"
          />
        </div>
      </div>

      {/* Right: Actions & Profile */}
      <div className="flex items-center gap-5">
        {/* Notifications */}
        <button className="relative p-2 hover:bg-gray-100 rounded-lg transition">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Settings */}
        <button className="p-2 hover:bg-gray-100 rounded-lg transition">
          <Settings className="w-5 h-5 text-gray-600" />
        </button>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-3 hover:bg-gray-50 rounded-xl px-3 py-2 transition"
          >
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md">
              {username[0].toUpperCase()}
            </div>
            <div className="text-left hidden lg:block">
              <p className="text-sm font-semibold text-gray-900">{username}</p>
              <p className="text-xs text-gray-500">Institutional Pro</p>
            </div>
          </button>

          {/* Dropdown Menu */}
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-bold text-gray-900">{username}</p>
                <p className="text-xs text-gray-500">john.doe@domain.com</p>
              </div>

              <button
                onClick={() => {
                  setProfileOpen(false);
                  navigate("/profile");
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
              >
                <User className="w-4 h-4" />
                Account Center
              </button>

              <button
                onClick={() => {
                  setProfileOpen(false);
                  navigate("/profile");
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
              >
                <Settings className="w-4 h-4" />
                Security Settings
              </button>

              <div className="border-t border-gray-100 my-1"></div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition font-medium"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}