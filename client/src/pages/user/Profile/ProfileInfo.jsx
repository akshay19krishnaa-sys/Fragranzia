import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import UserService from "../../../services/user-api-service/UserService";


function ProfileInfo() {
  const { getProfile, updateProfile } = UserService();

  const [editMode, setEditMode] = useState(false);

  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await getProfile();
      setUser(res);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async () => {
    try {
      const updatedUser = await updateProfile(user);
      setUser(updatedUser);
      setEditMode(false);
      toast.success("profile updated");
    } catch (error) {
      console.log(error);
      toast.error("something error");
    }
  };

  return (
    <div className="profile-card">
      <h3>Profile Details</h3>

      <div className="form-grid">
        <input
          type="text"
          name="name"
          value={user.name}
          onChange={handleChange}
          disabled={!editMode}
        />

        <input
          type="text"
          name="email"
          value={user.email}
          onChange={handleChange}
          disabled={!editMode}
        />

        <div>
          <label>Phone</label>
          <input
            type="text"
            name="phone"
            value={user.phone || ""}
            onChange={handleChange}
            disabled={!editMode}
          />
        </div>
      </div>

      {!editMode ? (
        <button className="edit-btn" onClick={() => setEditMode(true)}>
          Edit Profile
        </button>
      ) : (
        <button className="save-btn" onClick={handleUpdate}>
          Save Changes
        </button>
      )}
    </div>
  );
}

export default ProfileInfo;