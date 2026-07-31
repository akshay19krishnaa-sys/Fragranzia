import axios from "axios";
import useAdminAxiosPrivate from "../../hooks/useAdminAxiosPrivate";

const AdminService = () => {

  const axiosPrivate = useAdminAxiosPrivate();


  const registerAdmin = async (data) => {

    const response = await axios.post(
      "http://localhost:5000/api/admin/register",
      data
    );

    return response.data;

  };



  const loginAdmin = async (data) => {

    const response = await axios.post(
      "http://localhost:5000/api/admin/login",
      data
    );

    return response.data;

  };



  // Get Admin Profile
  const getAdminProfile = async () => {

    const response = await axiosPrivate.get(
      "/api/admin/profile"
    );

    return response.data;

  };



  // Update Admin Profile
  const updateAdminProfile = async (data) => {

    const response = await axiosPrivate.put(
      "/api/admin/profile",
      data
    );

    return response.data;

  };


 const getUsers = async () => {
  const res = await axiosPrivate.get("/api/admin/customers");
  return res.data;
};


const toggleBlock = async (id) => {
  const res = await axiosPrivate.put(
    `/api/admin/customers/block/${id}`
  );
  return res.data;
};


  return {

    registerAdmin,
    loginAdmin,
    getAdminProfile,
    updateAdminProfile,
    toggleBlock,
    getUsers

  };

};


export default AdminService;