import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../../style/product.css";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import UserService from "../../services/user-api-service/UserService";
import CartService from "../../services/user-api-service/CartService";
import WishlistService from "../../services/user-api-service/WishlistService";
import { toast } from "react-toastify";

const Product = () => {
  const { getUserProducts } = UserService();

const { addToCart } = CartService();

const {
  getWishlist,
  toggleWishlist,
} = WishlistService();


  const navigate = useNavigate();

  const [params] = useSearchParams();
  const urlSearch = params.get("search") || "";

  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  // LOAD PRODUCTS
  
const fetchWishlist = async () => {

  try {

    const data = await getWishlist();

    setWishlist(data || []);

  } catch(error){

    console.log(error);

  }

};
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getUserProducts ();
        setProducts(res);

        const savedWishlist =
          JSON.parse(localStorage.getItem("wishlist")) || [];
        setWishlist(savedWishlist);
      } catch (err) {
        console.log(err);
      }
    };

    fetchProducts();
     fetchWishlist();
  }, []);

  // SEARCH VALUE (URL + fallback)
  const searchValue = urlSearch || "";

  // FILTER PRODUCTS
  const filteredProducts = products.filter((item) =>
    item.title.toLowerCase().includes(searchValue.toLowerCase())
  );

  // SORT LOW TO HIGH
  const handleLowToHigh = () => {
    const sorted = [...products].sort((a, b) => a.price - b.price);
    setProducts(sorted);
  };

  // SORT HIGH TO LOW
  const handleHighToLow = () => {
    const sorted = [...products].sort((a, b) => b.price - a.price);
    setProducts(sorted);
  };

  // ================= CART =================
const handleAddToCart = async (product) => {

  const token = localStorage.getItem("token");

  if(!token){
    toast.info("Please login first");
    navigate("/login");
    return;
  }

  try {

    const res = await addToCart(
      product._id,
      1
    );

    toast.success("Added to Cart ");

  } catch(error){
    console.log(error);
  }

};
  // ================= WISHLIST =================
 const isInWishlist = (id) => {
  return wishlist.some((item) => item._id === id);
};

const handleWishlist = async (productId) => {

  const token = localStorage.getItem("token");

  if(!token){
    toast.info("Please login first");
    navigate("/login");
    return;
  }


  try {

    await toggleWishlist(productId);

    fetchWishlist();

  } catch(error){
    console.log(error);
  }

};


  return (
    <div className="main-product">
      {/* HEADER */}
      <div className="offer-bar">
        <p>ENJOY FESTIVE DISCOUNTS! FREE SHIPPING ABOVE 999!</p>
      </div>

      {/* SEARCH INFO */}
      {searchValue && (
        <div style={{ padding: "10px" }}>
          Searching for: <b>{searchValue}</b>
        </div>
      )}

      {/* FILTER */}
      <div className="filter-product">
        <button onClick={handleLowToHigh}>Low → High</button>
        <button onClick={handleHighToLow}>High → Low</button>
      </div>

      {/* PRODUCTS */}
      <div className="products-product">
        {filteredProducts.length === 0 ? (
          <p>No products found</p>
        ) : (
          filteredProducts.map((item) => (
            <div
              key={item._id}
              className="product-item-product"
              onClick={() => navigate(`/product/${item._id}`)}
            >
              {/* WISHLIST */}
              <div className="wishlist-icon">
                {isInWishlist(item._id) ? (
                  <FaHeart
                    color="red"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleWishlist(item._id);
                    }}
                  />
                ) : (
                  <FaRegHeart
                    onClick={(e) => {
                      e.stopPropagation();
                      handleWishlist(item._id);
                    }}
                  />
                )}
              </div>

              <img
                src={`http://localhost:5000/uploads/${item.images[0]}`}
                alt=""
              />

              <h5>{item.title}</h5>
              <p>₹ {item.price}</p>

             {item.quantity > 0 ? (
  <button
    className="add-cart-btn"
    onClick={(e) => {
      e.stopPropagation();
      handleAddToCart(item);
    }}
  >
    Add to Cart
  </button>
) : (
  <button
    className="add-cart-btn"
    disabled
  >
    Out of Stock
  </button>
)}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Product;