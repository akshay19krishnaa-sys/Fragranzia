import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../style/ordersuccess.css";


function OrderSuccess() {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className="success-container">
      <div className="success-card">

        <div className="success-icon">
          ✓
        </div>

        <h1>Order Placed Successfully!</h1>

        <p>
          Thank you for shopping with us.
        </p>

        <p className="order-id">
          Order ID : {id}
        </p>

        <div className="success-buttons">

          <button
            onClick={() => navigate("/product")}
          >
            Continue Shopping
          </button>
<button
  onClick={() =>
    navigate("/profile", {
      state: {
        activeTab: "orders",
      },
    })
  }
>
  View Orders
</button>

        </div>

      </div>
    </div>
  );
}

export default OrderSuccess;