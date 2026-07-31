import React from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import axios from "axios";

const UserService = () => {

    const axiosPrivate = useAxiosPrivate()

    // ======================================== product management ========================================

    const getProducts = async () => {
        const response = await axiosPrivate.get("/api/products");
        return response.data;
    };

    const getProductById = async (id) => {
  const response = await axiosPrivate.get(`/api/products/${id}`);
  return response.data;
};

    const postProducts = async (formData) => {
        const response = await axiosPrivate.post("/api/products",formData);
        return response.data;
    };

    const deleteProducts = async (id) => {
       const response = await axiosPrivate.delete(`/api/products/${id}`);
        return response.data;
    };

    const updateProduct = async (productId, data) => {
        const response = await axiosPrivate.put(`/api/products/${productId}`, data);
        return response.data;
    };

    // const deleteBranchesData = async (branchId) => {
    //     const response = await axiosPrivate.delete(`/api/branches/${branchId}`);
    //     return response.data;
    // };
   const getProfile = async () => {
    const response = await axiosPrivate.get("/api/users");
    return response.data;
};

const updateProfile = async (data) => {
  const res = await axiosPrivate.put("/api/users/profile", data);
  return res.data;
};

const toggleProductBlock = async (id) => {
  const res = await axiosPrivate.put(
    `/api/products/toggle-block/${id}`
  );
  return res.data;
};

const getUserProducts = async () => {
  const res = await axiosPrivate.get("/api/products/user");
  return res.data;
};



   return {
    getProducts,
    getProductById,
    postProducts,
    deleteProducts,
    updateProduct,
    toggleProductBlock,
    getUserProducts,
    

    // Profile
    getProfile,
    updateProfile,
};
};

export default UserService;