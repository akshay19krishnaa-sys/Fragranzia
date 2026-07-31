import React, { useEffect, useState } from "react";
import axios from "axios";
import "./editproduct.css";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import UserService from "../../services/user-api-service/UserService";

function EditProduct() {

   const {updateProduct,getProductById} = UserService ();
   const [image, setImage] = useState(null);

  const { id } = useParams();

  const navigate = useNavigate();

  const [productData, setProductData] = useState({

    title: "",
    price: "",
    salePrice: "",
    quantity: "",
    category: "",
    offer: "",
    description: "",
    img:""

  });



  // input handle

  const onHandleChange = (e) => {

    setProductData({

      ...productData,

      [e.target.name]: e.target.value,

    });

  };
    const onImageChange = (e) => {
    setImage(e.target.files[0]); 
  };



  // fetch single product

  const fetchSingleProduct = async () => {

    try {

       const res = await getProductById(id); 

      // const res = await axios.get(

      //   // `http://localhost:5000/api/products/${id}`

      // );

      setProductData(res);

    } catch (error) {

      console.log(error);

    }

  };



  useEffect(() => {

    fetchSingleProduct();

  }, []);




  // update product

  const updateProducts = async () => {
  try {
    const formData = new FormData();

    formData.append("title", productData.title);
    formData.append("price", productData.price);
    formData.append("salePrice", productData.salePrice);
    formData.append("quantity", productData.quantity);
    formData.append("category", productData.category);
    formData.append("offer", productData.offer);
    formData.append("description", productData.description);

    if (image) {
      formData.append("images", image);
    }

    await updateProduct(id, formData);

    toast.success("Product Updated");
    navigate("/adminpage");

  } catch (error) {
    console.log(error);
    toast.error("something error")
  }
};



 return (

  <div className="edit-product-page">

    <div className="edit-product-card">

      <h1>Edit Product</h1>

      <div className="edit-form">
         
        <input
          type="text"
          name="title"
          value={productData.title}
          onChange={onHandleChange}
          placeholder="Product Title"
        />

        <input
          type="text"
          name="price"
          value={productData.price}
          onChange={onHandleChange}
          placeholder="Product Price"
        />

        <input
          type="text"
          name="salePrice"
          value={productData.salePrice}
          onChange={onHandleChange}
          placeholder="Sale Price"
        />

        <input
          type="text"
          name="quantity"
          value={productData.quantity}
          onChange={onHandleChange}
          placeholder="Quantity"
        />

        <select
          name="category"
          value={productData.category}
          onChange={onHandleChange}
        >

          <option value="">
            Select Category
          </option>

          <option value="Perfume">
            Perfume
          </option>

          <option value="Attar">
            Attar
          </option>

        </select>

        <input
          type="text"
          name="offer"
          value={productData.offer}
          onChange={onHandleChange}
          placeholder="Offer"
        />

        <textarea
          rows="6"
          name="description"
          value={productData.description}
          onChange={onHandleChange}
          placeholder="Product Description"
        />

            <input
            type="file"
            onChange={onImageChange}
          />

        <button
          className="update-btn"
          onClick={updateProducts}
        >
          Update Product
        </button>

      </div>

    </div>

  </div>

);

}

export default EditProduct;