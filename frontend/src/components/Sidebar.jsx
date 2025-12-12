// src/components/Sidebar.jsx
import { NavLink, useLocation } from "react-router-dom";
import { Home as HomeIcon } from "lucide-react"; // <-- add this icon

import {
  BarChart3,
  Newspaper,
  Wallet,
  Brain,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const navItems = [
  { to: "/", label: "Home", icon: HomeIcon },
  { to: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { to: "/news", label: "News", icon: Newspaper },
  { to: "/portfolio", label: "Portfolio", icon: Wallet },
  { to: "/assistant", label: "AI Assistant", icon: Brain },
  { to: "/profile", label: "Account", icon: User },
];

export default function Sidebar({ collapsed, setCollapsed }) {
  return (
    <aside
      className={`fixed left-0 top-0 z-40 h-full bg-white border-r border-gray-200 shadow-sm transition-all duration-300 ${
        collapsed ? "w-20" : "w-72"
      }`}
    >
      {/* Logo & Header */}
      <div className="flex items-center justify-between px-6 py-6 border-b border-gray-200">
        <div className={`flex items-center gap-4 ${collapsed ? "justify-center" : ""}`}>
          <div className="w-11 h-11 bg-gradient-to-br from-blue-700 to-indigo-800 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-black text-xl tracking-tighter">A</span>
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-xl font-black text-gray-900 tracking-tight">Financial Market Intelligence</h1>
              <p className="text-xs text-gray-500 font-medium">Intelligence Platform</p>
            </div>
          )}
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-gray-100 transition hidden lg:block"
        >
          {collapsed ? <ChevronRight className="w-5 h-5 text-gray-600" /> : <ChevronLeft className="w-5 h-5 text-gray-600" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-blue-50 text-blue-700 border border-blue-200 font-semibold shadow-sm"
                    : "text-gray-700 hover:bg-gray-50"
                }`
              }
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Logout at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
        <button className="flex items-center gap-4 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition">
          <LogOut className="w-5 h-5" />
          {!collapsed && <span className="text-sm font-medium">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}