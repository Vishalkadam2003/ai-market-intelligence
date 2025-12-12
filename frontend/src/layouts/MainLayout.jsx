// src/layouts/MainLayout.jsx
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 font-['Inter',system-ui,sans-serif] antialiased">
      
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Topbar - Fixed */}
        <Topbar collapsed={collapsed} />

        {/* Page Content - Pushed Below Topbar */}
        <main 
          className={`
            flex-1 overflow-y-auto bg-gray-50
            pt-10           /* This is the fix: 16 (h-16) + 4px shadow/buffer */
            transition-all duration-300
            ${collapsed ? "pl-20" : "pl-72"}
          `}
        >
          <div className="max-w-7xl mx-auto px-6 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}