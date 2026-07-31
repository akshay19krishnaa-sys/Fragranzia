import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../admin/AdminSidebar";
import AdminNavbar from "../admin/AdminNavbar";

const AdminLayout = () => {
  return (
    <div>
      <AdminSidebar />
      <AdminNavbar />

      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;