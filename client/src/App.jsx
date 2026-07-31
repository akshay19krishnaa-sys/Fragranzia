import { Routes, Route} from "react-router-dom";
import './App.css'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


import Signup from "./pages/user/Signup";
import Login from "./pages/user/Login";
import Home from "./pages/user/Home";
import Navbar from "./components/user/Navbar";
import Product from "./pages/user/Product";
import ProductDetails from "./pages/user/ProductDetails";
import Footer from "./components/user/Footer";
import Cart from "./pages/user/Cart"
import Wishlist from "./pages/user/Wishlist";
import Profile from "./pages/user/Profile/Profile";
import AddAddress from "./pages/user/AddAddress";
import EditAddress from "./pages/user/EditAddress";
import Order from "./pages/user/Order";
import OrderSuccess from "./pages/user/OrderSuccess";
import About from "./pages/user/About";


import AdminPage from "./pages/admin/AdminPage";
import AddProduct from "./pages/admin/AddProduct";
import EditProduct from "./pages/admin/EditProduct";
import Categories from "./pages/admin/categories";
import AddCategory from "./pages/admin/AddCategory"
import EditCategory from "./pages/admin/EditCategory"
import Adminorders from "./pages/admin/AdminOrders"
import AdminProfile from "./pages/admin/AdminProfile";
import Customers from "./pages/admin/Customers";
import Dashboard from "./pages/admin/Dashboard";

    
import AdminProtectRouter from "./components/protected-routes/AdminProtectRouter";
import UserProductRouter from "./components/protected-routes/UserProductRouter";
import PrivateRoute from "./components/protected-routes/PrivateRoute";


function App() {
  return (
    <>
      <Routes>

       

       <Route path="/admin" element={<AdminProtectRouter/>}>

  <Route path="adminpage" element={<AdminPage/>} />

  <Route path="addproduct" element={<AddProduct />} />

  <Route path="editproduct/:id" element={<EditProduct />} />

  <Route path="categories" element={<Categories />} />

  <Route path="addcategory" element={<AddCategory />} />

  <Route path="editcategory/:id" element={<EditCategory />} />

  <Route path="orders" element={<Adminorders/>} />

  <Route path="profile" element={<AdminProfile /> }/>

  <Route path="/admin/customers" element={<Customers /> }/>

  <Route path="/admin/dashboard" element={<Dashboard />} />

</Route>


       
      
      

<Route element={<UserProductRouter />}>
 <Route path="/login" element={<Login />} />
  <Route path="/signup" element={<Signup />} />
  <Route path="/" element={<Home />} />
  <Route path="/product" element={<Product />} />
  <Route path="/product/:id" element={<ProductDetails />} />
  <Route path="/about" element={<About />} />

</Route>

<Route element={<PrivateRoute />}>
  <Route element={<UserProductRouter />}>
    <Route path="/profile" element={<Profile />} />
    <Route path="/cart" element={<Cart />} />
    <Route path="/wishlist" element={<Wishlist />} />
    <Route path="/addaddress" element={<AddAddress />} />
    <Route path="/editaddress/:id" element={<EditAddress />} />
    <Route path="/order" element={<Order />} />
    <Route path="/ordersuccess/:id" element={<OrderSuccess />} />
  </Route>
</Route>
       


      </Routes>

       <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
      />

      
    </>
  );
}

export default App;