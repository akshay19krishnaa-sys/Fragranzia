import React, { useEffect, useState } from "react";
import { IoMdNotifications } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import "../admin/adminnav.css";

function AdminNavbar() {

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
        <h3>Admin Control Panel</h3>

        <div className="panel-icons">

          <div
            className="profile-icon"
            onClick={() => navigate("/admin/profile")}
            style={{ cursor: "pointer" }}
          >
            <button>
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