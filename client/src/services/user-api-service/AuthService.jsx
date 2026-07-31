import axios from "axios";

const AuthService = () => {


  const login = async (data) => {

    const res = await axios.post(
      "http://localhost:5000/api/users/login",
      data
    );

    return res.data;
  };


  const register = async (data) => {

    const res = await axios.post(
      "http://localhost:5000/api/users/register",
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