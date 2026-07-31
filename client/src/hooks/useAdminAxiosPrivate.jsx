import { useEffect } from "react";
import { axiosPrivate } from "../axios";

const useAdminAxiosPrivate = () => {

  useEffect(() => {

    const requestInterceptor = axiosPrivate.interceptors.request.use(
      (config) => {

        const token = localStorage.getItem("token");

if (token) {
  config.headers.Authorization = `Bearer ${token}`;
}

        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axiosPrivate.interceptors.response.use(
      (response) => response,
      (error) => Promise.reject(error)
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestInterceptor);
      axiosPrivate.interceptors.response.eject(responseInterceptor);
    };

  }, []);

  return axiosPrivate;
};

export default useAdminAxiosPrivate;