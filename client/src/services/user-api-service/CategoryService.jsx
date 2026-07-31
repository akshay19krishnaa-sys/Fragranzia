import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const CategoryService = () => {

  const axiosPrivate = useAxiosPrivate();

  // Get all categories
  const getCategories = async () => {
    const response = await axiosPrivate.get("/api/categories");
    return response.data;
  };

  // Get category by id
  const getCategoryById = async (id) => {
    const response = await axiosPrivate.get(`/api/categories/${id}`);
    return response.data;
  };

  // Create category
  const createCategory = async (data) => {
    const response = await axiosPrivate.post("/api/categories", data);
    return response.data;
  };

  // Update category
  const updateCategory = async (id, data) => {
    const response = await axiosPrivate.put(`/api/categories/${id}`, data);
    return response.data;
  };

  // Delete category
  const deleteCategory = async (id) => {
    const response = await axiosPrivate.delete(`/api/categories/${id}`);
    return response.data;
  };

  // Block / Unblock category
  const toggleCategoryBlock = async (id) => {
    const response = await axiosPrivate.put(
      `/api/categories/toggle-block/${id}`
    );
    return response.data;
  };

  const getActiveCategories = async () => {

    const res = await axiosPrivate.get(
        "/api/categories/active"
    );

    return res.data;

};

  return {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    toggleCategoryBlock,
    getActiveCategories
  };
};

export default CategoryService;