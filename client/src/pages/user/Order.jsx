import React, { useEffect, useMemo, useState } from "react";
import "../../style/order.css";
import OrderService from "../../services/user-api-service/OrderService";
import AddressService from "../../services/user-api-service/AddressService";
import CartService from "../../services/user-api-service/CartService";

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getImageUrl } from "../../axios";

function Order() {

    const navigate = useNavigate();

    console.log(
    "Razorpay Key:",
    import.meta.env.VITE_RAZORPAY_KEY_ID
);


  const {
    createOrder, createRazorpayOrder,
  verifyRazorpayPayment,
  } = OrderService();

  const {
    getAddresses
  } = AddressService();

  const {
    getCartItems,clearCart
  } = CartService();

  const [cartItems, setCartItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("gpay");
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Helper to ensure Razorpay SDK script is loaded reliably
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const existingScript = document.getElementById("razorpay-checkout-sdk");
      if (existingScript) {
        existingScript.onload = () => resolve(true);
        existingScript.onerror = () => resolve(false);
        return;
      }
      const script = document.createElement("script");
      script.id = "razorpay-checkout-sdk";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    loadOrderData();
    loadRazorpayScript();
  }, []);

  const loadOrderData = async () => {
    try {
      setLoading(true);

      const cart = await getCartItems();
      const address = await getAddresses();

      setCartItems(cart || []);
      setAddresses(address || []);

      const primaryAddress = address?.find(
        (item) => item.isPrimary === true
      );

      setSelectedAddress(primaryAddress || (address && address[0]) || null);
    } catch (err) {
      console.error("Failed to load order data:", err);
    } finally {
      setLoading(false);
    }
  };

  const increaseQty = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === id
          ? {
              ...item,
              quantity: item.quantity > 1 ? item.quantity - 1 : 1,
            }
          : item
      )
    );
  };

  const originalTotal = useMemo(() => {
    return cartItems.reduce((total, item) => {
      return total + (item.product?.salePrice || 0) * item.quantity;
    }, 0);
  }, [cartItems]);

  const subtotal = useMemo(() => {
    return cartItems.reduce((total, item) => {
      return total + (item.product?.price || 0) * item.quantity;
    }, 0);
  }, [cartItems]);

  const deliveryCharge = subtotal > 500 ? 0 : 40;
  const totalAmount = originalTotal + deliveryCharge;

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.warning("Please select a delivery address");
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      toast.warning("Your cart is empty");
      return;
    }

    if (totalAmount <= 0) {
      toast.warning("Invalid order total amount");
      return;
    }

    setIsProcessing(true);

    try {
      const orderData = {
        addressId: selectedAddress._id,
        paymentMethod,
        items: cartItems,
        subtotal,
        deliveryCharge,
        totalAmount,
      };

      // ================= COD =================
      if (paymentMethod === "cod") {
        const order = await createOrder(orderData);
        await clearCart();
        toast.success("Order placed successfully!");
        navigate(`/ordersuccess/${order._id}`);
        return;
      }

      // ================= RAZORPAY =================
      const scriptReady = await loadRazorpayScript();
      if (!scriptReady || !window.Razorpay) {
        toast.error("Razorpay SDK could not be loaded. Please check your internet connection.");
        setIsProcessing(false);
        return;
      }

      // 1. Create Razorpay order from backend
      const razorpayData = await createRazorpayOrder(totalAmount);

      if (!razorpayData || !razorpayData.success || !razorpayData.order) {
        toast.error(razorpayData?.message || "Unable to create payment order");
        setIsProcessing(false);
        return;
      }

      const razorpayKey = (
        import.meta.env.VITE_RAZORPAY_KEY_ID ||
        razorpayData.keyId ||
        ""
      ).trim();

      if (!razorpayKey) {
        toast.error("Razorpay Key ID is not configured");
        setIsProcessing(false);
        return;
      }

      // 2. Razorpay Checkout options
      const options = {
        key: razorpayKey,
        amount: razorpayData.order.amount,
        currency: razorpayData.order.currency || "INR",
        name: "Fragranzia",
        description: "Fragranzia Order Payment",
        order_id: razorpayData.order.id,

        handler: async function (response) {
          try {
            // 1. Verify payment with backend
            const verification = await verifyRazorpayPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (!verification || !verification.success) {
              toast.error("Payment verification failed on server");
              setIsProcessing(false);
              return;
            }

            // 2. Create final order
            const finalOrderData = {
              ...orderData,
              paymentStatus: "paid",
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            };

            const order = await createOrder(finalOrderData);

            // 3. Clear cart
            await clearCart();

            // 4. Success message & navigate
            toast.success("Payment Successful!");
            navigate(`/ordersuccess/${order._id}`);
          } catch (error) {
            console.error(
              "Payment Verification Error:",
              error.response?.data || error.message
            );
            toast.error(
              error.response?.data?.message || "Payment verification failed"
            );
            setIsProcessing(false);
          }
        },

        prefill: {
          name: selectedAddress.fullName || "",
          contact: selectedAddress.phone || "",
        },

        theme: {
          color: "#00354B",
        },

        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            toast.info("Payment cancelled");
          },
        },
      };

      // 3. Open Razorpay Checkout
      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", function (response) {
        console.error("Razorpay Payment Failed:", response.error);
        setIsProcessing(false);
        toast.error(response.error?.description || "Payment failed");
      });

      razorpay.open();
    } catch (err) {
      console.error("Payment Error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to initiate payment");
      setIsProcessing(false);
    }
  };

  if (loading) return <div className="order-loading">Loading...</div>;

  return (
    <div className="order-page">
      <div className="order-container">

        {/* LEFT */}
        <div className="order-left">

{cartItems.map((item) => (
  <div className="order-product-card" key={item._id}>
    <div className="order-image">
      <img
        src={getImageUrl(item.product?.images?.[0])}
        alt={item.product?.title}
      />
    </div>

    <div className="order-info">
      <h3>{item.product?.title}</h3>

      <div className="order-qty">
        <button onClick={() => decreaseQty(item._id)}>-</button>
        <span>{item.quantity}</span>
        <button onClick={() => increaseQty(item._id)}>+</button>
      </div>

      <div className="order-price">
        <h2>₹{item.product?.salePrice * item.quantity}</h2>

        {/* {item.product?.salePrice && (
          <del>₹{item.product.salePrice * item.quantity}</del>
        )} */}
      </div>
    </div>
  </div>
))}

          {/* ADDRESS */}
          <div className="address-section">
            <div className="address-header">
              <h2>Personal Details</h2>
             <button onClick={() => navigate("/addaddress")}>
  Add Address +
</button>
            </div>

            {selectedAddress && (
              <div
  onClick={() => setSelectedAddress(selectedAddress)}
  className="address-card active"
>
  <h4>{selectedAddress.fullName}</h4>
  <p>{selectedAddress.house}</p>
  <p>{selectedAddress.city}, {selectedAddress.state}</p>
  <p>{selectedAddress.pincode}</p>
  <p>{selectedAddress.phone}</p>
</div>
)}
            
          </div>
        </div>

        {/* RIGHT */}
        <div className="order-right">

          <div className="price-card">
            <h2>Price Details</h2>

            <div className="price-row">
              <span>Price</span>
              <span>₹{originalTotal}</span>
            </div>

            

            <div className="price-row">
              <span>Delivery</span>
              <span>{deliveryCharge === 0 ? "Free" : `₹${deliveryCharge}`}</span>
            </div>

            <hr />

            <div className="price-total">
              <span>Total</span>
              <span>₹{totalAmount}</span>
            </div>
          </div>

          <div className="payment-card">
            <h2>Payment Methods</h2>

            {["gpay", "cod", "upi", "card", "netbanking"].map((method) => (
              <label key={method}>
                <input
                  type="radio"
                  value={method}
                  checked={paymentMethod === method}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                {method.toUpperCase()}
              </label>
            ))}

            <button
              className="pay-btn"
              onClick={handlePlaceOrder}
              disabled={isProcessing}
              style={{
                opacity: isProcessing ? 0.7 : 1,
                cursor: isProcessing ? "not-allowed" : "pointer",
              }}
            >
              {isProcessing
                ? "Processing..."
                : paymentMethod === "cod"
                ? "Order Now"
                : "Pay Now"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Order;