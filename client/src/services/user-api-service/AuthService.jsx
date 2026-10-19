import axios from "axios";
import { BASE_URL } from "../../axios";

const AuthService = () => {


  const login = async (data) => {

    const res = await axios.post(
      `${BASE_URL}/api/users/login`,
      data
    );

    return res.data;
  };


  const register = async (data) => {

    const res = await axios.post(
      `${BASE_URL}/api/users/register`,
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