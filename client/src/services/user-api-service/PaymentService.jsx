import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const PaymentService = () => {
  const axiosPrivate = useAxiosPrivate();

  const createRazorpayOrder = async (amount) => {
    try {
      const res = await axiosPrivate.post(
        "/api/orders/razorpay/create-order",
        { amount }
      );
      return res.data;
    } catch (error) {
      console.error("Razorpay Order Error:", error.response?.data || error.message);
      throw error;
    }
  };

  const verifyRazorpayPayment = async (paymentData) => {
    try {
      const res = await axiosPrivate.post(
        "/api/orders/razorpay/verify-payment",
        paymentData
      );
      return res.data;
    } catch (error) {
      console.error("Payment Verification Error:", error.response?.data || error.message);
      throw error;
    }
  };

  return {
    createRazorpayOrder,
    verifyRazorpayPayment,
  };
};

export default PaymentService;