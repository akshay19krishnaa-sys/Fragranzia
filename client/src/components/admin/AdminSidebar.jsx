import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import { MdOutlineDashboard } from "react-icons/md";
import { AiOutlineProduct } from "react-icons/ai";
import { MdCategory } from "react-icons/md";
import { MdLocalOffer } from "react-icons/md";
import { RiCoupon2Line } from "react-icons/ri";
import { MdManageAccounts } from "react-icons/md";
import { FiShoppingCart } from "react-icons/fi";
import { toast } from "react-toastify";
import "../admin/adminside.css";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && showLogoutModal) {
        setShowLogoutModal(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showLogoutModal]);

  const handleConfirmLogout = () => {
    // Clear all login data
    localStorage.removeItem("token");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("user");
    localStorage.removeItem("admin");
    localStorage.removeItem("role");

    setShowLogoutModal(false);
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div>
      <div className="dashtar">
        <h3>Dashtar</h3>
        <div className="dashtar-list">
          <div className="dashtar-list1">
            <NavLink to="/admin/dashboard">
              <MdOutlineDashboard />Dashboard
            </NavLink>
          </div>
          <div className="dashtar-list1">
            <NavLink to="/admin/adminpage">
              <AiOutlineProduct />Products
            </NavLink>
          </div>
          <div className="dashtar-list1">
            <NavLink to="/admin/categories">
              <MdCategory /> Categories
            </NavLink>
          </div>
          <div className="dashtar-list1">
            <NavLink to="/admin/customers">
              <MdManageAccounts />Customers
            </NavLink>
          </div>
          <div className="dashtar-list1">
            <NavLink to="/admin/orders">
              <FiShoppingCart />Orders
            </NavLink>
          </div>
        </div>

        <div className="logout-btn-admin">
          <button type="button" onClick={() => setShowLogoutModal(true)}>
            Log Out
          </button>
        </div>
      </div>

      {/* Custom Logout Confirmation Modal */}
      {showLogoutModal && (
        <div
          className="logout-modal-overlay"
          onClick={() => setShowLogoutModal(false)}
        >
          <div
            className="logout-modal-content"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-modal-title"
          >
            <div className="logout-modal-header">
              <h3 id="logout-modal-title">Confirm Logout</h3>
            </div>
            <div className="logout-modal-body">
              <p>Are you sure you want to log out of your account?</p>
            </div>
            <div className="logout-modal-actions">
              <button
                type="button"
                className="logout-modal-btn cancel"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="logout-modal-btn confirm"
                onClick={handleConfirmLogout}
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSidebar;
