import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../admin/AdminSidebar";
import AdminNavbar from "../admin/AdminNavbar";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="admin-layout-root">
      <AdminSidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      <AdminNavbar onToggleSidebar={toggleSidebar} isSidebarOpen={sidebarOpen} />

      {sidebarOpen && (
        <div className="admin-sidebar-backdrop" onClick={closeSidebar} />
      )}

      <div className="admin-main-wrapper" onClick={closeSidebar}>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;