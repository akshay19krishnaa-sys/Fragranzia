import { useEffect } from "react";
import useAuth from "./useAuth";
import { axiosPrivate } from "../axios";

const useAxiosPrivate = () => {
  const { auth } = useAuth();

  useEffect(() => {
    // Response interceptor to handle errors gracefully
    const responseInterceptor = axiosPrivate.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          console.warn("401 Unauthorized received on private request");
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.response.eject(responseInterceptor);
    };
  }, [auth]);

  return axiosPrivate;
};

export default useAxiosPrivate;