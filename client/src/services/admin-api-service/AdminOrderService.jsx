import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const AdminOrderService = () => {

  const axiosPrivate = useAxiosPrivate();


  const getAllOrders = async () => {

    const res = await axiosPrivate.get("/api/orders");

    return res.data;

  };


  const getOrderById = async (id) => {

    const res = await axiosPrivate.get(`/api/orders/${id}`);

    return res.data;

  };


  const updateOrderStatus = async (id, status) => {

    const res = await axiosPrivate.put(
      `/api/orders/status/${id}`,
      {
        status,
      }
    );

    return res.data;

  };

  const approveReturn = async (id) => {
    console.log("ID:", id);
  console.log("URL:", `/api/orders/return/approve/${id}`);

  const res = await axiosPrivate.put(`/api/orders/return/approve/${id}`);
  return res.data;
};

const rejectReturn = async (id) => {
  const res = await axiosPrivate.put(`/api/orders/return/reject/${id}`);
  return res.data;
};


  return {
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    approveReturn,
    rejectReturn
  };

};


export default AdminOrderService;