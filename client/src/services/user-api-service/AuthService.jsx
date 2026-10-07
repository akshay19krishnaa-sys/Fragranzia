import axios from "axios";

const AuthService = () => {


  const login = async (data) => {

    const res = await axios.post(
      "https://fragranzia-rf6r.onrender.com/api/users/login",
      data
    );

    return res.data;
  };


  const register = async (data) => {

    const res = await axios.post(
      "https://fragranzia-rf6r.onrender.com/api/users/register",
      data
    );

    return res.data;
  };


  return {
    login,
    register,
  };

};


export default AuthService;