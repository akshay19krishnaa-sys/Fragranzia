import { useState } from "react";
import "../../style/addaddress.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AddressService from "../../services/user-api-service/AddressService";

function AddAddress() {

    const { addAddress } = AddressService();


  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    house: "",
    city: "",
    state: "",
    pincode: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {

    await addAddress(formData);

    toast.success("Address Added Successfully");

    navigate("/profile");

  } catch (error) {

    console.log(error);
    toast.error("something went wrong!!");

  }
};

  return (
    <div className="add-address">
      <h2>Add Address</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          onChange={handleChange}
        />

        <input
          type="text"
          name="phone"
          placeholder="phone"
          onChange={handleChange}
        />

        <input
          type="text"
          name="house"
          placeholder="House / Street"
          onChange={handleChange}
        />

        <input
          type="text"
          name="city"
          placeholder="City"
          onChange={handleChange}
        />

        <input
          type="text"
          name="state"
          placeholder="State"
          onChange={handleChange}
        />

        <input
          type="text"
          name="pincode"
          placeholder="Pincode"
          onChange={handleChange}
        />

        <button type="submit">
          Save Address
        </button>
      </form>
    </div>
  );
}

export default AddAddress;