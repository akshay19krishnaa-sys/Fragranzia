import React, { useEffect, useState } from "react";
import "./adminprofile.css";
import { toast } from "react-toastify";
import AdminService from "../../services/admin-api-service/AdminService";

function AdminProfile() {

  const { getAdminProfile, updateAdminProfile } = AdminService();

  const [admin, setAdmin] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await getAdminProfile();

      setAdmin({
        name: data.name,
        email: data.email,
      });

    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setAdmin({
      ...admin,
      [e.target.name]: e.target.value,
    });
  };

  
const handleSubmit = async (e) => {
  e.preventDefault();

  try {

    const res = await updateAdminProfile(admin);

    setAdmin({
      name: res.admin.name,
      email: res.admin.email,
    });

    // ✅ Update localStorage
    localStorage.setItem(
      "admin",
      JSON.stringify(res.admin)
    );

    toast.success("Profile Updated Successfully");

  } catch (error) {

    console.log(error);

    toast.error("Update Failed");
  }
};

  return (
    <div className="admin-profile-container">

      <div className="admin-profile-card">

        <h2>Admin Profile</h2>

        <form onSubmit={handleSubmit}>

          <div className="input-group">
            <label>Name</label>

            <input
              type="text"
              name="name"
              value={admin.name}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Email</label>

            <input
              type="email"
              name="email"
              value={admin.email}
              onChange={handleChange}
            />
          </div>

          <button type="submit">
            Update Profile
          </button>

        </form>

      </div>

    </div>
  );
}

export default AdminProfile;