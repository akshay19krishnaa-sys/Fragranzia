import axios from "axios";

const PaymentService = () => {

  const createRazorpayOrder = async (amount) => {
    const res = await axios.post(
      "http://localhost:5000/api/payment/create-order",
      { amount }
    );

    return res.data;
  };

  return {
    createRazorpayOrder,
  };
};

export default PaymentService;