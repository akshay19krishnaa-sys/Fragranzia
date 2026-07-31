import React from 'react'
import { NavLink, useNavigate } from "react-router-dom";
import { MdOutlineDashboard } from "react-icons/md";
import { AiOutlineProduct } from "react-icons/ai";
import { MdCategory } from "react-icons/md";
import { MdLocalOffer } from "react-icons/md";
import { RiCoupon2Line } from "react-icons/ri";
import { MdManageAccounts } from "react-icons/md";
import { FiShoppingCart } from "react-icons/fi";
import "../admin/adminside.css";

const AdminSidebar = () => {
    const navigate = useNavigate();

 const handleLogout = () => {
  const confirmLogout = window.confirm(
    "Are you sure you want to logout?"
  );

  if (!confirmLogout) return;

  // Clear all login data
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("role");

  navigate("/login");
};
  return (
    <div>

        <div className="dashtar">
                <h3>Dashtar</h3>
                <div className="dashtar-list">
                    <div className="dashtar-list1">
                    <NavLink to= "/admin/dashboard"><MdOutlineDashboard />Dashboard</NavLink>

                    </div>
                    <div className="dashtar-list1">
                       <NavLink to= "/admin/adminpage"><AiOutlineProduct />Products</NavLink> 

                    </div>
                    <div className="dashtar-list1">  
                       <NavLink to="/admin/categories"> <MdCategory /> Categories </NavLink>
         

                    </div>
                    
                    <div className="dashtar-list1">
                        <NavLink to ="/admin/customers"><MdManageAccounts />Customers</NavLink>

                    </div>
                    <div className="dashtar-list1">
                      <NavLink to="/admin/orders"><FiShoppingCart />Orders</NavLink>

                    </div>
                </div>
                <div className="logout-btn-admin">
  <button onClick={handleLogout}>
    Log Out
  </button>
</div>  

            </div>
      
    </div>
  )
}

export default AdminSidebar
