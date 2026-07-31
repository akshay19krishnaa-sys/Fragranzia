import React, { useEffect, useState } from "react";
import DashboardCards from "../../components/admin/DashboardCards";
import SalesChart from "../../components/admin/SalesChart";
import CategoryChart  from "../../components/admin/CategoryChart";
import DashboardService from "../../services/admin-api-service/DashboardService";
import "./Dashboard.css";

const Dashboard = () => {

   const dashboardService = DashboardService();

const [dashboard, setDashboard] = useState({
  products: 0,
  orders: 0,
  users: 0,
  revenue: 0,
    categorySales: []
});

useEffect(() => {
  const fetchDashboard = async () => {
    try {
      const data = await dashboardService.getDashboard();
      console.log(data);
      setDashboard(data);
    } catch (error) {
      console.log(error);
    }
  };

  fetchDashboard();
}, []);

    return (
        <div className="dashboard-page">

            <h1 className="dashboard-title">
                Dashboard
            </h1>

            <div className="dashboard-content">

                <DashboardCards dashboard={dashboard} />

            </div>
            <div className="dashboard-row">

    <div className="left">

        <SalesChart />

    </div>

   <div className="right">
    <CategoryChart data={dashboard.categorySales} />
</div>

</div>

        </div>
    );
};

export default Dashboard;