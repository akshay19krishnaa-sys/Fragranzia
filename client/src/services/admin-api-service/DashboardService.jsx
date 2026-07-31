import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const DashboardService = () => {
  const axiosPrivate = useAxiosPrivate();

  const getDashboard = async () => {
    const response = await axiosPrivate.get("/api/admin/dashboard");
    return response.data;
  };

  return {
    getDashboard,
  };
};

export default DashboardService;