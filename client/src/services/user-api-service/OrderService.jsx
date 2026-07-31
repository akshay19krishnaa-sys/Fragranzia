import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const OrderService = () => {
  const axiosPrivate = useAxiosPrivate();

  // ================= USER =================

  const createOrder = async (data) => {
    const res = await axiosPrivate.post("/api/orders", data);
    return res.data;
  };

  const getUserOrders = async () => {
    const res = await axiosPrivate.get("/api/orders/myorders");
    return res.data;
  };

  const getOrderById = async (id) => {
    const res = await axiosPrivate.get(`/api/orders/${id}`);
    return res.data;
  };

  // ================= ADMIN =================

  const getAllOrders = async () => {
    const res = await axiosPrivate.get("/api/orders");
    return res.data;
  };

const updateOrderStatus = async(id,status)=>{

 const res = await axiosPrivate.put(
   `/api/orders/status/${id}`,
   {
     status
   }
 );

 return res.data;

};

  const cancelOrder = async(id)=>{

 const res = await axiosPrivate.put(
 `/api/orders/cancel/${id}`
 );

 return res.data;

};






const requestReturn = async (id, data) => {
  const response = await axiosPrivate.put(
    `/api/orders/return/${id}`,
    data
  );

  return response.data;
};
  return {
    createOrder,
    getUserOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus,
    cancelOrder,
    requestReturn
  };
};

export default OrderService;