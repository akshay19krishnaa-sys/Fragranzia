import React, { useEffect, useMemo, useState } from "react";
import "../../style/order.css";
import OrderService from "../../services/user-api-service/OrderService";
import AddressService from "../../services/user-api-service/AddressService";
import CartService from "../../services/user-api-service/CartService";

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Order() {

    const navigate = useNavigate();


  const {
    createOrder,
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

  useEffect(() => {
    loadOrderData();
  }, []);

  const loadOrderData = async () => {
    try {
      setLoading(true);

const cart = await getCartItems();
const address = await getAddresses();


      setCartItems(cart || []);
      setAddresses(address || []);

     const primaryAddress = address.find(
  (item) => item.isPrimary === true
);

setSelectedAddress(primaryAddress || address[0]);
    } catch (err) {
      console.log(err);
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
    return total + (item.product?.salePrice ||  0) * item.quantity;
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
      toast.warning("Select Address");
      return;
    }

    

    try {
      const orderData = {
        addressId: selectedAddress._id,
        paymentMethod,
        items: cartItems,
        subtotal,
        deliveryCharge,
        totalAmount,
      };

    const order = await createOrder(orderData);

console.log(order);

await clearCart();

navigate(`/ordersuccess/${order._id}`);
    } catch (err) {
      console.log(err);
      toast.error("error");
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
        src={`http://localhost:5000/uploads/${item.product?.images?.[0]}`}
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

            <button className="pay-btn" onClick={handlePlaceOrder}>
              Pay Now
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Order;