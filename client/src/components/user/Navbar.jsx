import { useState } from 'react'
import { Link } from "react-router-dom";
import { HiOutlineShoppingBag, HiOutlineBars3, HiOutlineXMark } from "react-icons/hi2"; 
import { CiSearch, CiBellOn } from "react-icons/ci";             
import { FaUserCircle } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import "../../style/navbar.css";
import { useNavigate } from "react-router-dom";





const Navbar = () => {
    const navigate = useNavigate();
    const [cartItem, setcartItem] = useState([]);
    const [cartOpen, setCartOpen] = useState(false);
    const [showMsg, setShowMsg] = useState(false);
    const [search, setSearch] = useState("");

    const [menuOpen, setMenuOpen] = useState(false);

    const handleSearch = (value) => {
      setSearch(value);
      localStorage.setItem("search", value);
    };

    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        setMenuOpen(false);
        navigate(`/product?search=${encodeURIComponent(search)}`);
      }
    };

    const closeMenu = () => setMenuOpen(false);

    return (
        <>
        <nav>
        <div className="nav-head">
          <Link to="/" onClick={closeMenu} style={{ textDecoration: "none", color: "inherit" }}>
            <h2>Fragranzia</h2>
          </Link>
        </div>

        {/* Mobile quick actions + hamburger button */}
        <div className="nav-mobile-actions">
          <button className="nav-mobile-cart" aria-label="Cart">
            <Link to="/cart" onClick={closeMenu}><HiOutlineShoppingBag /></Link>
          </button>
          <button 
            className="nav-hamburger" 
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <HiOutlineXMark /> : <HiOutlineBars3 />}
          </button>
        </div>

        {/* Collapsible nav items (inline on desktop, drawer/dropdown on mobile) */}
        <div className={`nav-items ${menuOpen ? "open" : ""}`}>
          <div className="nav-list">
              <ul>
                  <li><button onClick={closeMenu}><Link to="/"> Home </Link></button></li>
                  <li><button onClick={closeMenu}><Link to="/product"> Product </Link></button></li>
                  <li><button onClick={closeMenu}><Link to="/about"> About </Link></button></li>
              </ul>
          </div>
          <div className="nav-search">
               <CiSearch
    className="search-icon"
    onClick={() => {
      closeMenu();
      navigate(`/product?search=${encodeURIComponent(search)}`);
    }}
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
             <button title="Cart"><Link to="/cart" onClick={closeMenu}> <HiOutlineShoppingBag /></Link></button> 
             <button title="Wishlist"><Link to="/wishlist" onClick={closeMenu}><FaRegHeart /></Link></button>
             <button title="Profile"><Link to="/profile" onClick={closeMenu}> <FaUserCircle /></Link></button> 
          </div>
        </div>
        </nav>

        {menuOpen && <div className="nav-backdrop" onClick={closeMenu} />}


             {showMsg && (
  <div className="toast">
    Item added to cart 
  </div>
)}
     
 

        


     </>
    )
     
}

export default Navbar