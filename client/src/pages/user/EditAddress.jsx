import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AddressService from "../../services/user-api-service/AddressService";
import { toast } from "react-toastify";

function EditAddress() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    house: "",
    city: "",
    state: "",
    pincode: "",
  });

  const { getAddressById, updateAddress } = AddressService();

  // GET single address
  const fetchAddress = async () => {
  try {
    const res = await getAddressById(id);
    setFormData(res);
  } catch (error) {
    console.log(error);
  }
};

  useEffect(() => {
    fetchAddress();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

 const handleUpdate = async (e) => {
  e.preventDefault();

  try {
    await updateAddress(id, formData);

    toast.success("Address Updated");
    navigate("/profile");
  } catch (error) {
    console.log(error);
  }
};
  

  return (
    <div className="add-address">
      <h2>Edit Address</h2>

      <form onSubmit={handleUpdate}>
        <input
          name="fullName"
          value={formData.fullName || ""}
          onChange={handleChange}
          placeholder="Full Name"
        />

        <input
          name="phone"
          value={formData.phone || ""}
          onChange={handleChange}
          placeholder="Phone"
        />

        <input
          name="house"
          value={formData.house || ""}
          onChange={handleChange}
          placeholder="House"
        />

        <input
          name="city"
          value={formData.city || ""}
          onChange={handleChange}
          placeholder="City"
        />

        <input
          name="state"
          value={formData.state || ""}
          onChange={handleChange}
          placeholder="State"
        />

        <input
          name="pincode"
          value={formData.pincode || ""}
          onChange={handleChange}
          placeholder="Pincode"
        />

        <button type="submit">Update Address</button>
      </form>
    </div>
  );
}

export default EditAddress;