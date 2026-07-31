import React from "react";
import "./Categories.css";
import { FaPen } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import axios from "axios";
import CategoryService from "../../services/user-api-service/CategoryService";
function Categories() {

const [allCategories, setAllCategories] = useState([]);
const [search, setSearch] = useState("");
const [statusFilter, setStatusFilter] = useState("all");

const { getCategories, toggleCategoryBlock,deleteCategory } = CategoryService();
const navigate = useNavigate();

const fetchCategories = async () => {
  try {
    const data = await getCategories();
    setAllCategories(data);
  } catch (error) {
    console.log(error);
  }
};
useEffect(() => {

  fetchCategories();

}, []);

const filteredCategories = allCategories.filter((category)=>{

    const matchesSearch =
        category.name
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesStatus =
        statusFilter === "all"
        ? true
        : statusFilter === "blocked"
        ? category.isBlocked
        : !category.isBlocked;

    return matchesSearch && matchesStatus;

});

const toggleBlock = async (id) => {
  try {
    await toggleCategoryBlock(id);
    fetchCategories();
  } catch (error) {
    console.log(error);
  }
};
const handleDelete = async (id) => {
  try {
    await deleteCategory(id);
    fetchCategories(); // refresh list
  } catch (error) {
    console.log(error);
  }
};

  return (
    <div className="category-page">

      <div className="category-card">

        {/* Top Buttons */}

        <div className="category-top">

          <div className="topleft-btns">
            <button>Export</button>
            <button>Import</button>
          </div>

         <Link to="/admin/addcategory"><button className="right-btn">
            + Add Category
          </button></Link> 

        </div>

        {/* Filters */}

        <div className="category-filters">

         <input
    type="text"
    placeholder="Search Categories..."
    value={search}
    onChange={(e)=>setSearch(e.target.value)}
/>

          <select
    value={statusFilter}
    onChange={(e)=>setStatusFilter(e.target.value)}
>
    <option value="all">All</option>
    <option value="active">Active</option>
    <option value="blocked">Blocked</option>
</select>


        </div>

        {/* Table */}

        <div className="table-wrapper">

          <table>

            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Actions</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>

  {
    filteredCategories.length > 0 ? (

      filteredCategories.map((category) => (

        <tr key={category._id}>

          <td>{category.name}</td>

          <td>{category.description}</td>

          <td className="special-btn">

 <button
  className="edit-btn-category"
  onClick={() => navigate(`/admin/editcategory/${category._id}`)}
>
  Edit
</button>
           <button
  className="delete-btn-category"
  onClick={() => handleDelete(category._id)}
>
  Delete
</button>
          </td>

          <td>
  <button
  className={category.isBlocked ? "unblock-btn" : "block-btn"}
  onClick={() => toggleBlock(category._id)}
>
  {category.isBlocked ? "Unblock" : "Block"}
</button>
</td>

        </tr>

      ))

    ) : (

      <tr>

        <td
          colSpan="5"
          className="empty-text"
        >

          No Categories Available

        </td>

      </tr>

    )
  }

</tbody>

           
          </table>

        </div>

        

      </div>

    </div>
  );
}

export default Categories;