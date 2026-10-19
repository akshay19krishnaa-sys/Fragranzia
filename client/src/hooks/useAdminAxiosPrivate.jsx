import { useEffect } from "react";
import { axiosPrivate } from "../axios";

const useAdminAxiosPrivate = () => {
  useEffect(() => {
    const responseInterceptor = axiosPrivate.interceptors.response.use(
      (response) => response,
      (error) => Promise.reject(error)
    );

    return () => {
      axiosPrivate.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  return axiosPrivate;
};

export default useAdminAxiosPrivate;