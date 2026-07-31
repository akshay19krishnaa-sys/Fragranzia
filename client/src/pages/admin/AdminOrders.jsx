import React, { useEffect, useMemo, useState } from "react";
import "./adminOrders.css";
import { toast } from "react-toastify";
import AdminOrderService from "../../services/admin-api-service/AdminOrderService";

function AdminOrders() {
 const {
  getAllOrders,
  updateOrderStatus,
  approveReturn,
  rejectReturn,
} = AdminOrderService();

  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, search, statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const data = await getAllOrders();

      setOrders(data);
      setFilteredOrders(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let temp = [...orders];

    if (statusFilter !== "All") {
      temp = temp.filter(
        (order) => order.status === statusFilter
      );
    }

    if (search.trim()) {
      temp = temp.filter((order) => {
        const keyword = search.toLowerCase();

        return (
          order._id.toLowerCase().includes(keyword) ||
          order.shippingAddress?.fullName
            ?.toLowerCase()
            .includes(keyword)
        );
      });
    }

    setFilteredOrders(temp);
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateOrderStatus(id, status);

      fetchOrders();
    } catch (error) {
      console.log(error);
    }
  };

  const openOrder = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  const handleApproveReturn = async (id) => {
  try {
    await approveReturn(id);
    toast.success("Return approved");
    fetchOrders();
  } catch (err) {
    console.log(err);
  }
};

const handleRejectReturn = async (id) => {
  try {
    await rejectReturn(id);
    toast.success("Return rejected");
    fetchOrders();
  } catch (err) {
    console.log(err);
  }
};



  if (loading) {
    return (
      <div className="admin-orders-loading">
        Loading Orders...
      </div>
    );
  }

  return (
    <div className="admin-orders-page">

      <div className="admin-orders-top">

        <div>
          <h2>Order Management</h2>
          <p>Total Orders : {filteredOrders.length}</p>
        </div>

        <div className="admin-order-filters">

          <input
            type="text"
            placeholder="Search Customer / Order ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
          >
            <option>All</option>
            <option>Pending</option>
            <option>Processing</option>
            <option>Shipped</option>
            <option>Delivered</option>
            <option>Cancelled</option>
            <option>Return Requested</option>
            <option>Returned</option>
          </select>

        </div>
      </div>

      <div className="orders-table">

        <table>

          <thead>

            <tr>

              <th>Order</th>

              <th>Customer</th>

              <th>Products</th>

              <th>Total</th>

              <th>Payment</th>

              <th>Status</th>

              <th>Action</th>

            </tr>

          </thead>

          <tbody>

            {filteredOrders.map((order) => (

              <tr key={order._id}>

                <td>

                  <h4>
                    #{order._id.slice(-6)}
                  </h4>

                  <small>
                    {new Date(
                      order.createdAt
                    ).toLocaleDateString()}
                  </small>

                </td>

                <td>

                  <strong>
                    {order.shippingAddress?.fullName}
                  </strong>

                  <br />

                  <small>
                    {order.shippingAddress?.phone}
                  </small>

                </td>

                <td>

                  {order.items.slice(0, 2).map((item) => (

                    <div
                      className="admin-product"
                      key={item._id}
                    >

                      <img
                        src={`http://localhost:5000/uploads/${item.productImage}`}
                        alt={item.productName}
                      />

                      <div>

                        <h5>{item.productName}</h5>

                        <p>
                          Qty : {item.quantity}
                        </p>

                        <p>
                          ₹{item.price}
                        </p>

                      </div>

                    </div>

                  ))}

                  {order.items.length > 2 && (
                    <span>
                      +{order.items.length - 2} More
                    </span>
                  )}

                </td>
                                <td>

                  <strong className="order-total">
                    ₹{order.totalAmount}
                  </strong>

                  <br />

                  <small>
                    Delivery :
                    {order.deliveryCharge === 0
                      ? " Free"
                      : ` ₹${order.deliveryCharge}`}
                  </small>

                </td>

                <td>

                  <span className="payment-method">
                    {order.paymentMethod.toUpperCase()}
                  </span>

                </td>

                <td>

{order.returnStatus === "Requested" && (
  <div className="return-actions">

    <span className="return-badge">
      Return Requested
    </span>

    <button
      className="approve-btn"
      onClick={() => handleApproveReturn(order._id)}
    >
      Approve
    </button>

    <button
      className="reject-btn"
      onClick={() => handleRejectReturn(order._id)}
    >
      Reject
    </button>

  </div>
)}

  <br />

  <select
    className={`status-select ${order.status
      .toLowerCase()
      .replace(/\s+/g, "-")}`}
    value={order.status}
    onChange={(e) =>
      handleStatusChange(order._id, e.target.value)
    }
  >
    <option value="Pending">Pending</option>
    <option value="Processing">Processing</option>
    <option value="Shipped">Shipped</option>
    <option value="Delivered">Delivered</option>
    <option value="Cancelled">Cancelled</option>
    <option value="Return Requested">Return Requested</option>
    <option value="Returned">Returned</option>
  </select>

</td>

                <td>

                  <button
                    className="view-btn"
                    onClick={() => openOrder(order)}
                  >
                    View
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {showModal && selectedOrder && (

        <div className="order-modal">

          <div className="order-modal-content">

            <div className="modal-header">

              <h2>
                Order Details
              </h2>

              <button
                className="close-btn"
                onClick={closeModal}
              >
                ×
              </button>

            </div>

            <div className="modal-body">

              <div className="customer-box">

                <h3>Customer</h3>

                <p>
                  <strong>Name :</strong>{" "}
                  {selectedOrder.shippingAddress.fullName}
                </p>

                <p>
                  <strong>Phone :</strong>{" "}
                  {selectedOrder.shippingAddress.phone}
                </p>

                <p>
                  <strong>Address :</strong>{" "}
                  {selectedOrder.shippingAddress.house},
                  {" "}
                  {selectedOrder.shippingAddress.city},
                  {" "}
                  {selectedOrder.shippingAddress.state}
                  {" - "}
                  {selectedOrder.shippingAddress.pincode}
                </p>

              </div>

              <div className="products-box">

                <h3>Products</h3>

                {selectedOrder.items.map((item, index) => (

                  <div
                    className="modal-product"
                    key={index}
                  >

                    <img
                      src={`http://localhost:5000/uploads/${item.productImage}`}
                      alt={item.productName}
                    />

                    <div>

                      <h4>
                        {item.productName}
                      </h4>

                      <p>
                        Quantity :
                        {" "}
                        {item.quantity}
                      </p>

                      <p>
                        Price :
                        {" "}
                        ₹{item.price}
                      </p>

                    </div>

                  </div>

                ))}

              </div>

              <div className="summary-box">

                <h3>Order Summary</h3>

                <p>
                  Status :
                  {" "}
                  <strong>
                    {selectedOrder.status}
                  </strong>
                </p>

                <p>
                  Payment :
                  {" "}
                  {selectedOrder.paymentMethod}
                </p>

                <p>
                  Delivery :
                  {" "}
                  {selectedOrder.deliveryCharge === 0
                    ? "Free"
                    : `₹${selectedOrder.deliveryCharge}`}
                </p>

                <h2>
                  Total :
                  {" "}
                  ₹{selectedOrder.totalAmount}
                </h2>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default AdminOrders;