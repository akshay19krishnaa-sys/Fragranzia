import React, { useEffect, useState } from "react";
import "./editCategory.css";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import UserService from "../../services/user-api-service/CategoryService";

function EditCategory() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { getCategoryById, updateCategory,deleteCategory } = UserService();

  const [category, setCategory] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    fetchCategory();
  }, []);

  const fetchCategory = async () => {
    try {
      const data = await getCategoryById(id);

      setCategory({
        name: data.name,
        description: data.description,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setCategory({
      ...category,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateCategory(id, category);
      toast.success("Category Updated Successfully");
      navigate("/categories");
    } catch (error) {
      console.log(error);
      toast.success("Failed to update category");
    }
  };

  return (
    <div className="add-category-page">
      <div className="add-category-card">
        <h2>Edit Category</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Category Name</label>

            <input
              type="text"
              name="name"
              value={category.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>

            <textarea
              name="description"
              rows="5"
              value={category.description}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="save-btn">
            Update Category
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditCategory;