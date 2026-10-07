import axios from "axios";

const PaymentService = () => {

  const createRazorpayOrder = async (amount) => {
    const res = await axios.post(
      "https://fragranzia-rf6r.onrender.com/api/payment/create-order",
      { amount }
    );

    return res.data;
  };

  return {
    createRazorpayOrder,
  };
};

export default PaymentService;