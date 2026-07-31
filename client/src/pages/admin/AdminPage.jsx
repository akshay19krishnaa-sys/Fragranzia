import React, { useEffect, useState } from "react";
import "./adminpage.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import UserService from "../../services/user-api-service/UserService";


function AdminPage() {
  

  
  const {deleteProducts,getProducts,toggleProductBlock} = UserService ();
 

  const [allProducts, setAllProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const [showProduct, setShowProduct] = useState(null);

  


  const fetchProducts = async() =>{
    
    try {
      // const res = await axios.get( "http://localhost:5000/api/fragranzia");
     const res = await getProducts(); 


      console.log(res);

      setAllProducts(res)
      const uniqueCategories = [
      ...new Set(res.map((item) => item.category))
    
    ];
       setCategories(uniqueCategories);      
      
    } catch (error) {

          console.log(error);
      
    }

}

useEffect(() => {

  fetchProducts();

}, []);

const deleteProduct = async (id) => {

  try {
const res = await deleteProducts(id); 

    toast.success("Product Deleted");

    fetchProducts();

  } catch (error) {

    console.log(error);

  }

};
const filteredProducts = allProducts.filter((product) => {

  const matchesCategory = selectedCategory

    ? product.category === selectedCategory

    : true;

  const matchesSearch = product.title
    .toLowerCase()
    .includes(search.toLowerCase());

  return matchesCategory && matchesSearch;

});

const handleToggleBlock = async (productId) => {
  try {
    await toggleProductBlock(productId);

    // refresh list
    fetchProducts();
  } catch (error) {
    console.log(error);
  }
};




  return (
    <div className="admin-content">

      {/* Main Card */}
      <div className="product-card">

        {/* Buttons */}
        <div className="top-actions">
          <div className="left-btns">
            <button className="light-btn">Export</button>
            <button className="light-btn">Import</button>
          </div>

         <Link to= "/admin/addproduct"> <button className="add-btn" >+ Add Product</button>
         </Link>
        </div>

        {/* Filters */}
        <div className="filters">
          <input
  type="text"
  placeholder="Search Products..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
/>
<select
  value={selectedCategory}
  onChange={(e) => setSelectedCategory(e.target.value)}
>
  <option value="">All Categories</option>

  {categories.map((cat, index) => (
    <option key={index} value={cat}>
      {cat}
    </option>
  ))}
</select>


        </div>

        {/* Table */}
        <div className="table-wrapper">
          <table>
            <thead>
  <tr>
    <th>Product Name</th>
    <th>Category</th>
    <th>Price</th>
    <th>Sale Price</th>
    <th>Stock</th>
    <th>Actions</th>
    <th>Status</th>
  </tr>
</thead>

  <tbody>
  {filteredProducts.length > 0 ? (
    filteredProducts.map((product) => (
      <tr key={product._id}>
        <td>{product.title}</td>

        <td>{product.category}</td>

        <td>₹ {product.price}</td>

        <td>₹ {product.salePrice}</td>

        <td>{product.quantity}</td>

        <td className="action-btns">

          <Link to={`/admin/editproduct/${product._id}`}>
            <button className="proedit-btn">
              Edit
            </button>
          </Link>

         <button
  className="show-btn"
  onClick={() => {
    console.log(product);
    setShowProduct(product);
  }}
>
  Show
</button>

        </td>

        <td>

         <button className="block-btn-product"
  onClick={() => handleToggleBlock(product._id)}
>
  {product.isBlocked ? "Unblock" : "Block"}
</button>
          <button
            className="product-delete-btn"
            onClick={() => deleteProduct(product._id)}
          >
            Delete
          </button>

        </td>

      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="7" className="empty-text">
        No Products Found
      </td>
    </tr>
  )}
</tbody>
          </table>
          {showProduct && (
  <div
    className="modal-overlay"
    onClick={() => setShowProduct(null)}
  >
    <div
      className="product-modal"
      onClick={(e) => e.stopPropagation()}
    >

      <button
        className="close-btn"
        onClick={() => setShowProduct(null)}
      >
        ✕
      </button>

      <h2>{showProduct.title}</h2>

      <div className="image-grid">

        {showProduct.images?.map((img, index) => (

          <img
            key={index}
            src={`http://localhost:5000/uploads/${img}`}
           alt={showProduct.title}
          />

        ))}

      </div>

     <div className="product-details">

  <p>
    <strong>Category :</strong> {showProduct.category}
  </p>

  <p>
    <strong>Price :</strong> ₹ {showProduct.price}
  </p>

  <p>
    <strong>Sale Price :</strong> ₹ {showProduct.salePrice}
  </p>

  <p>
    <strong>Quantity :</strong> {showProduct.quantity}
  </p>

  <p>
    <strong>Offer :</strong> {showProduct.offer || "No Offer"}
  </p>

  <div className="description-box">
    <strong>Description :</strong>
    <p>{showProduct.description || "No Description"}</p>
  </div>

</div>

    </div>
  </div>
)}
        </div>

        {/* Pagination */}
        <div className="pagination">
          <button className="page-btn">Previous</button>

          <p>Page 1 of 1</p>

          <button className="page-btn">Next</button>
        </div>

      </div>
    </div>
  );
}

export default AdminPage;