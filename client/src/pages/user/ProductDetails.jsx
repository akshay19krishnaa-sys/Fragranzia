import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "../../style/ProductDetails.css";
import { IoMdShare } from "react-icons/io";
import { FcLike } from "react-icons/fc";
import { CiHeart } from "react-icons/ci";
import CartService from "../../services/user-api-service/CartService";
import WishlistService from "../../services/user-api-service/WishlistService";
import UserService from "../../services/user-api-service/UserService";
import { toast } from "react-toastify";



function ProductDetails() {


  const {getProductById} = UserService ();
  const { addToCart } = CartService();
  const { getWishlist, toggleWishlist,} = WishlistService();

  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [likedItems, setLikedItems] = useState([]);
  const [wishItem, setwishItem] = useState([]);
  const [qty, setQty] = useState(1);



 useEffect(() => {


  const fetchProducts = async () => {
    try {
      // const res = await fetch("http://localhost:5000/api/products");
      // const data = await res.json();

       const res = await getProductById(id); 

      setProduct(res);

    } catch (error) {
      console.log(error);
    }
  };

  fetchProducts();
   fetchWishlist();
}, [id]);


const handleWishlist = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.info("Please login first");
      return;
    }

    await toggleWishlist(product._id);

    fetchWishlist();

    toast.success("Wishlist Updated");
  } catch (error) {
    console.log(error);
  }
};

  const fetchWishlist = async () => {
  try {
    const data = await getWishlist();
    setwishItem(data || []);
  } catch (error) {
    console.log(error);
  }
};

const handleAddCart = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.info("Please login first");
      return;
    }

    await addToCart(product._id, 1);

    toast.success("Added to Cart");
  } catch (error) {
    console.log(error);
    toast.error("Something went wrong");
  }
};



  if (!product) return <h2>Loading...</h2>;

  return (
    <div className="product-details">

      <div className="product-main">
                             <img
  src={`http://localhost:5000/uploads/${product.images[0]}`}
  alt="" width="200"
/>

        <div className="like-icon">
          <button onClick={handleWishlist}>
            {wishItem.some(item => item._id === product._id)
  ? <FcLike />
  : <CiHeart />
}
          </button>
          </div>

          <div className="share-icon">
          <button><IoMdShare /></button>
          </div>
          
          
        

        
      </div>

     <div className="product-deep">

  <h1>{product.title}</h1>

  <div className="price-box">
    <h2>₹ {product.salePrice}</h2>

  </div>

  <p className="stock">
    {product.quantity > 0 ? "In Stock" : "Out of Stock"} - {product.quantity}
  </p>

  <div className="cart-btn-detail">
    <button onClick={handleAddCart}>Add to Cart</button>
  </div>

  <div className="description-card">
    <h3>Description</h3>
    <p>{product.description}</p>
  </div>

</div>

    </div>
  );
}

export default ProductDetails;