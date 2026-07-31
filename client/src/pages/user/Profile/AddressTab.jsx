import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddressService from "../../../services/user-api-service/AddressService";

function AddressTab() {
  const navigate = useNavigate();

  const {
  getAddresses,
  makePrimary,
  deleteAddress,
} = AddressService();

  const [addresses, setAddresses] = useState([]);

useEffect(() => {
  const fetchAddresses = async () => {
    try {
      const res = await getAddresses();
      setAddresses(res);
    } catch (error) {
      console.log(error);
    }
  };

  fetchAddresses();
}, []);

  

 const handleMakePrimary = async (id) => {
  try {
    await makePrimary(id);

    const res = await getAddresses();
    setAddresses(res);
  } catch (error) {
    console.log(error);
  }
};

  const handleDeleteAddress = async (id) => {
  try {
    await deleteAddress(id);

    const res = await getAddresses();
    setAddresses(res);
  } catch (error) {
    console.log(error);
  }
};

  return (
    <div className="profile-card">
      <div className="section-header">
        <h3>My Addresses</h3>

        <button
          className="add-address-btn"
          onClick={() => navigate("/addaddress")}
        >
          + Add New Address
        </button>
      </div>

      <div className="address-list">
        {addresses.length === 0 ? (
          <p>No address found.</p>
        ) : (
          addresses.map((addr) => (
            <div
              key={addr._id}
              className={`address-card ${addr.isPrimary ? "primary" : ""}`}
            >
              <h4>
                {addr.fullName}
                {addr.isPrimary && (
                  <span className="primary-badge">Primary</span>
                )}
              </h4>

              <p>{addr.phone}</p>
              <p>{addr.house}</p>
              <p>
                {addr.city}, {addr.state}
              </p>
              <p>{addr.pincode}</p>

              <div className="btn-group">
                {!addr.isPrimary && (
                  <button
                    className="primary-btn"
                    onClick={() => handleMakePrimary(addr._id)}
                  >
                    Set Primary
                  </button>
                )}

                <button
                  className="addressedit-btn"
                  onClick={() =>
                    navigate(`/editaddress/${addr._id}`)
                  }
                >
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() => handleDeleteAddress(addr._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AddressTab;