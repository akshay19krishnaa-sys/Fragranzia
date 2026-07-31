import { useState } from 'react'
import { Link } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { HiOutlineShoppingBag } from "react-icons/hi2"; 
import { CiBellOn } from "react-icons/ci";             
import { FaUserCircle } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import "../../style/navbar.css";
import { useNavigate } from "react-router-dom";





const Navbar = () => {

     const[cartItem,setcartItem] = useState([])
        const [cartOpen, setCartOpen] = useState(false)
        const [showMsg, setShowMsg] = useState(false);
        const [search, setSearch] = useState("");

        const handleSearch = (value) => {
  setSearch(value);
  localStorage.setItem("search", value);
};

const handleKeyDown = (e) => {
  if (e.key === "Enter") {
    navigate(`/product?search=${search}`);
  }
};

    



    return (
        <>
        <nav>
            <div className="nav-head">
        <h2>Fragranzia</h2>
        </div>

        <div className="nav-items">

        <div className="nav-list">
            <ul>
                <button><li> <Link to="/"> Home </Link></li></button>
                <button><li><Link to="/product"> Product </Link></li></button>
                {/* <button><li><Link to="/Gifting"> Gifting </Link></li></button> */}
                <button><li><Link to="/About"> About </Link></li></button>
            </ul>
        </div>
        <div className="nav-search">
             <CiSearch
  className="search-icon"
  onClick={() => navigate(`/product?search=${search}`)}
/>
  <input
  type="text"
  placeholder="search here..."
  value={search}
  onChange={(e) => handleSearch(e.target.value)}
  onKeyDown={handleKeyDown}
/>
        </div>
        <div className="nav-icons">
           <button ><Link to="/Cart"> <HiOutlineShoppingBag /></Link></button> 
           <button><Link to="/wishlist"><FaRegHeart /></Link></button>
           {/* <button><Link to="/Notification"> <CiBellOn /></Link> </button>   */}
           <button><Link to="/Profile"> <FaUserCircle /></Link></button> 
        </div>
        </div>
        </nav>


             {showMsg && (
  <div className="toast">
    Item added to cart 
  </div>
)}
     
 

        


     </>
    )
     
}

export default Navbar