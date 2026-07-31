import React from "react";
import { Navigate } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";

const AdminProtectRouter = () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const role = localStorage.getItem("role");

  if (!token || !user || role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return <AdminLayout />;
};

export default AdminProtectRouter;