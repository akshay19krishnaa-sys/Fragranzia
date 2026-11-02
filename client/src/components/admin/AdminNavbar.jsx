import React, { useEffect, useState } from "react";
import { IoMdNotifications } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { HiOutlineBars3, HiOutlineXMark } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import "../admin/adminnav.css";

function AdminNavbar({ onToggleSidebar, isSidebarOpen }) {
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState("");

  useEffect(() => {
    const admin = JSON.parse(localStorage.getItem("admin"));
    if (admin) {
      setAdminName(admin.name);
    }
  }, []);

  return (
    <div className="main-admin">
      <div className="control-panel">
        <div className="admin-left-header">
          <button
            className="admin-sidebar-toggle"
            onClick={onToggleSidebar}
            aria-label="Toggle admin sidebar"
          >
            {isSidebarOpen ? <HiOutlineXMark /> : <HiOutlineBars3 />}
          </button>
          <h3>Admin Control Panel</h3>
        </div>

        <div className="panel-icons">
          <div
            className="profile-icon"
            onClick={() => navigate("/admin/profile")}
            style={{ cursor: "pointer" }}
          >
            <button aria-label="Profile">
              <CgProfile />
            </button>
            <h5>{adminName}</h5>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminNavbar;