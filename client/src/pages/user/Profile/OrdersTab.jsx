import React, { useEffect, useState } from "react";
import "../../../style/ordertab.css";
import { toast } from "react-toastify";
import OrderService from "../../../services/user-api-service/OrderService";

function OrdersTab() {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [returnReason, setReturnReason] = useState("");

  // Expand / Collapse Order
  const [expandedOrder, setExpandedOrder] = useState(null);

  const {
    getUserOrders,
    cancelOrder,
    requestReturn,
  } = OrderService();

  useEffect(() => {

    const fetchOrders = async () => {

      try {

        const res = await getUserOrders();

        console.log("Orders :", res);

        setOrders(res || []);

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }

    };

    fetchOrders();

  }, []);



  // Cancel Order

  const handleCancelOrder = async (id) => {

    try {

      if (!window.confirm("Cancel this order?")) return;

      await cancelOrder(id);

      const updated = await getUserOrders();

      setOrders(updated);

      toast.success("Order cancelled successfully");

    } catch (error) {

      console.log(error);

      toast.error("Failed to cancel order");

    }

  };



  // Return Order

  const handleReturnOrder = async () => {

    if (!returnReason) {

      toast.warning("Please select a return reason");

      return;

    }

    try {

      await requestReturn(selectedOrderId, {
        reason: returnReason,
      });

      const updated = await getUserOrders();

      setOrders(updated);

      toast.success("Return request submitted");

      setShowReturnModal(false);
      setSelectedOrderId(null);
      setReturnReason("");

    } catch (error) {

      console.log(error);

      toast.error("Failed to submit return request");

    }

  };



  if (loading) {

    return <h3>Loading orders...</h3>;

  }

  return (

    <div className="orders-tab">

      <h2>My Orders</h2>

      {
        orders.length === 0 ? (

          <div className="no-orders">
            <h3>No Orders Found</h3>
          </div>

        ) : (

          orders.map((order) => (

            <div className="order-card" key={order._id}>

                            {/* ================= HEADER ================= */}

              <div className="order-header">

                <div className="order-left">

                  <h3>Order #{order._id.slice(-6)}</h3>

                  <p className="order-date">
                    Ordered on{" "}
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>

                </div>

                <div className="order-right">

                  <span
                    className={`status-badge ${order.status
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                  >
                    {order.status}
                  </span>

                  {order.returnStatus === "Requested" && (
                    <span className="return-requested">
                      Return Requested
                    </span>
                  )}

                  {order.returnStatus === "Approved" && (
                    <span className="return-approved">
                      Return Approved
                    </span>
                  )}

                  {order.returnStatus === "Rejected" && (
                    <span className="return-rejected">
                      Return Rejected
                    </span>
                  )}

                  {order.status !== "Delivered" &&
                    order.status !== "Cancelled" &&
                    order.returnStatus !== "Requested" &&
                    order.returnStatus !== "Approved" && (

                      <button
                        className="cancel-btn"
                        onClick={() => handleCancelOrder(order._id)}
                      >
                        Cancel Order
                      </button>

                    )}

                  {order.status === "Delivered" &&
                    order.returnStatus !== "Requested" &&
                    order.returnStatus !== "Approved" && (

                      <button
                        className="return-btn"
                        onClick={() => {

                          setSelectedOrderId(order._id);
                          setShowReturnModal(true);

                        }}
                      >
                        Return Order
                      </button>

                    )}

                </div>

              </div>

              {/* ================= ORDER SUMMARY ================= */}

              <div className="order-short-info">

                <div className="short-card">
                  <span>Total</span>
                  <h3>₹{order.totalAmount}</h3>
                </div>

                <div className="short-card">
                  <span>Items</span>
                  <h3>{order.items.length}</h3>
                </div>

                <div className="short-card">
                  <span>Payment</span>
                  <h3>{order.paymentMethod}</h3>
                </div>

              </div>

              {/* ================= VIEW DETAILS BUTTON ================= */}

              <button
                className="view-details-btn"
                onClick={() =>
                  setExpandedOrder(
                    expandedOrder === order._id
                      ? null
                      : order._id
                  )
                }
              >
                {expandedOrder === order._id
                  ? "Hide Details ▲"
                  : "View Details ▼"}
              </button>

              {expandedOrder === order._id && (

                <>
                                  {/* ================= PRODUCTS ================= */}

                  <div className="order-items">

                    <div className="order-table-header">
                      <span>Product</span>
                      <span>Qty</span>
                      <span>Price</span>
                    </div>

                    {order.items?.map((item, index) => (

                      <div className="order-row" key={index}>

                        <div className="product-cell">

                          <img
                            src={`http://localhost:5000/uploads/${item.productImage}`}
                            alt={item.productName}
                          />

                          <div className="item-details">
                            <h4>{item.productName}</h4>
                          </div>

                        </div>

                        <span>{item.quantity}</span>

                        <span>₹{item.salePrice}</span>

                      </div>

                    ))}

                  </div>

                  {/* ================= SUMMARY ================= */}

                  <div className="order-summary">

                    <div className="summary-card">
                      <h5>Payment</h5>
                      <h3>{order.paymentMethod}</h3>
                    </div>

                    <div className="summary-card">
                      <h5>Delivery</h5>
                      <h3>
                        {order.deliveryCharge === 0
                          ? "Free"
                          : `₹${order.deliveryCharge}`}
                      </h3>
                    </div>

                    <div className="summary-card">
                      <h5>Items</h5>
                      <h3>{order.items.length}</h3>
                    </div>

                    <div className="summary-card">
                      <h5>Total</h5>
                      <h3>₹{order.totalAmount}</h3>
                    </div>

                  </div>

                  {/* ================= ADDRESS ================= */}

                  <div className="shipping-address">

                    <h4>Delivery Address</h4>

                    <p>
                      <strong>
                        {order.shippingAddress?.fullName}
                      </strong>
                    </p>

                    <p>
                      {order.shippingAddress?.house},{" "}
                      {order.shippingAddress?.city},{" "}
                      {order.shippingAddress?.state}
                    </p>

                    <p>
                      {order.shippingAddress?.pincode}
                    </p>

                    <p>
                      Phone : {order.shippingAddress?.phone}
                    </p>

                  </div>

                </>

              )}

            </div>

          ))

        )

      }

      {/* ================= RETURN MODAL ================= */}

      {showReturnModal && (

        <div className="return-modal-overlay">

          <div className="return-modal">

            <h3>Return Order</h3>

            <select
              value={returnReason}
              onChange={(e) => setReturnReason(e.target.value)}
            >
              <option value="">Select Reason</option>
              <option value="Changed Mind">Changed Mind</option>
              <option value="Wrong Product">Wrong Product</option>
              <option value="Wrong Size">Wrong Size</option>
              <option value="Quality Issue">Quality Issue</option>
              <option value="Damaged">Damaged</option>
            </select>

            <div className="return-actions">

              <button
                onClick={() => {

                  setShowReturnModal(false);
                  setSelectedOrderId(null);
                  setReturnReason("");

                }}
              >
                Cancel
              </button>

              <button onClick={handleReturnOrder}>
                Submit
              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}

export default OrdersTab;