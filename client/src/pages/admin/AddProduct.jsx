import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AddProduct.css";
import axios from "axios";
import { toast } from "react-toastify";
import UserService from "../../services/user-api-service/UserService";
import CategoryService from "../../services/user-api-service/CategoryService";

// const API_URL = "http://localhost:5000/api/products";

function AddProduct() {



    
    const {postProducts} = UserService ();
    const { getActiveCategories } = CategoryService();

      const navigate = useNavigate();

  const [productData, setProductData] = useState({
    title: "",
    price: "",
    salePrice: "",
    quantity: "",
    category: "",
    offer: "",
    description: "",
    images: [],
  });

  const [categories, setCategories] = useState([]);


  useEffect(() => {
  const fetchCategories = async () => {
    const data = await getActiveCategories();
    setCategories(data);
  };

  fetchCategories();
}, []);

  // input handle
  const onHandleChange = (e) => {

    setProductData({
      ...productData,
      [e.target.name]: e.target.value,
    });

  };

  // submit
  const onHandleSubmit = async (e) => {

  e.preventDefault();

  try {

    const formData = new FormData();

    formData.append("title", productData.title);

    formData.append("price", productData.price);

    formData.append("salePrice", productData.salePrice);

    formData.append("quantity", productData.quantity);

    formData.append("category", productData.category);

    formData.append("offer", productData.offer);

    formData.append("description", productData.description);

    // images

    for (let i = 0; i < productData.images.length; i++) {

      formData.append("images", productData.images[i]);

    }

   const res = await postProducts(formData);

    console.log(res.data);

    toast.success("Product Added Successfully");

     navigate("/adminpage");

  } catch (error) {

    console.log(error);

    toast.error("Something went wrong");

  }

};
  return (

    <div className="add-product-page">

      <div className="add-product-card">

        <h2>Add Product</h2>

        <p className="sub-text">
          Add your product and necessary information from here
        </p>

        {/* Top Toggle */}

        <div className="variant-section">
          <label>Does this product have variants?</label>

          <label className="switch">
            <input type="checkbox" />
            <span className="slider"></span>
          </label>
        </div>

        {/* Form */}

        <div className="product-form">

          <div className="form-group">
            <label>Product Title/Name</label>

            <input
              type="text"
              name="title"
              value={productData.title}
              onChange={onHandleChange}
            />

          </div>

          <div className="form-group">
            <label>Product Price</label>

            <input
              type="text"
              name="price"
              value={productData.price}
              onChange={onHandleChange}
            />

          </div>

          <div className="form-group">
            <label>Sale Price</label>

            <input
              type="text"
              name="salePrice"
              value={productData.salePrice}
              onChange={onHandleChange}
            />

          </div>

          <div className="form-group">
            <label>Product Quantity</label>

            <input
              type="text"
              name="quantity"
              value={productData.quantity}
              onChange={onHandleChange}
            />

          </div>

          <div className="form-group">
            <label>Category</label>

          <select
  name="category"
  value={productData.category}
  onChange={onHandleChange}
>
  <option value="">Select Category</option>

  {categories.map((category) => (
    <option
      key={category._id}
      value={category.name}
    >
      {category.name}
    </option>
  ))}
</select>

          </div>

          <div className="form-group">
            <label>Offer</label>

            <select
              name="offer"
              value={productData.offer}
              onChange={onHandleChange}
            >
              <option value="">Select Offers</option>
              <option value="10%">10%</option>
              <option value="20%">20%</option>
            </select>

          </div>

        </div>

        {/* Description */}

        <div className="description-box">

          <label>Product Description</label>

          <textarea
            rows="6"
            name="description"
            value={productData.description}
            onChange={onHandleChange}
          ></textarea>

        </div>

        {/* Upload */}

        <div className="upload-section">

  <label>Product Images</label>

  <input
    type="file"
    multiple
    onChange={(e) =>
      setProductData({
        ...productData,
        images: e.target.files,
      })
    }
  />

</div>
        {/* Button */}

        <div className="submit-btn">

          <button className="cancel-btn">
            Cancel
          </button>

          <button
            className="add-product-btn"
            onClick={onHandleSubmit}
          >
            Add Product
          </button>

        </div>

      </div>

    </div>

  );
}

export default AddProduct;