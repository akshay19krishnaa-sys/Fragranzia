import React from "react";
import "./DashboardCards.css";

import { FaBoxOpen } from "react-icons/fa";
import { BsCartCheckFill } from "react-icons/bs";
import { FaUsers } from "react-icons/fa";
import { FaIndianRupeeSign } from "react-icons/fa6";

const DashboardCards = ({ dashboard }) => {
  return (
    <div className="dashboard-cards">

      <div className="dashboard-card">

        <div className="card-top">

          <div>
            <p>Products</p>
            <h2>{dashboard.products}</h2>
          </div>

          <div className="card-icon products">
            <FaBoxOpen />
          </div>

        </div>

        <span>Total Products</span>

      </div>

      <div className="dashboard-card">

        <div className="card-top">

          <div>
            <p>Orders</p>
            <h2>{dashboard.orders}</h2>
          </div>

          <div className="card-icon orders">
            <BsCartCheckFill />
          </div>

        </div>

        <span>Total Orders</span>

      </div>

      <div className="dashboard-card">

        <div className="card-top">

          <div>
            <p>Users</p>
            <h2>{dashboard.users}</h2>
          </div>

          <div className="card-icon users">
            <FaUsers />
          </div>

        </div>

        <span>Registered Users</span>

      </div>

      <div className="dashboard-card">

        <div className="card-top">

          <div>
            <p>Revenue</p>
            <h2>₹{dashboard.revenue}</h2>
          </div>

          <div className="card-icon revenue">
            <FaIndianRupeeSign />
          </div>

        </div>

        <span>Total Revenue</span>

      </div>

    </div>
  );
};

export default DashboardCards;