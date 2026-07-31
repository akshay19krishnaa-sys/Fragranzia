import { useState,useEffect } from 'react'

import "../../style/home.css";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import { Autoplay } from "swiper/modules";
import { CiBellOn } from "react-icons/ci";
import { TbTruckDelivery } from "react-icons/tb"; 
import { RiSecurePaymentLine } from "react-icons/ri";
import { RiCustomerService2Line } from "react-icons/ri";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import UserService from "../../services/user-api-service/UserService";
import CartService from "../../services/user-api-service/CartService";
import WishlistService from "../../services/user-api-service/WishlistService";
import { toast } from 'react-toastify';
import { Link, useNavigate } from "react-router-dom";


const Home = () => {

    const { getUserProducts } = UserService();

    

const { addToCart} = CartService();

const {
  getWishlist,
  toggleWishlist,
} = WishlistService();

const navigate = useNavigate();


    const  [Products,setProducts] = useState([])
    const [wishlist, setWishlist] = useState([]);


useEffect(() => {
  const fetchProducts = async () => {
    try {
      const res = await getUserProducts ();
      setProducts(res);
    } catch (error) {
      console.log(error);
    }
  };

  fetchProducts();
  fetchWishlist(); 
}, []);



const handleWishlist = async (productId) => {

  try {

    const token = localStorage.getItem("token");

    if (!token) {
    toast.info("Please login first");
      return;
    }

    await toggleWishlist(productId);

    fetchWishlist();

  } catch(error){
    console.log(error);
  }

};

const handleAddCart = async (productId) => {

  try {

    const token = localStorage.getItem("token");

    if (!token) {
      toast.info("Please login first");
      return;
    }

    const res = await addToCart(productId, 1);

    toast.success("Added to cart ");

  } catch(error) {

    console.log(error);
    toast.error("something error");

  }

};


const isInWishlist = (id) => {
  return wishlist.some((item) => item._id === id);
};


const fetchWishlist = async () => {
  try {

    const data = await getWishlist();

    setWishlist(data || []);

  } catch(error){

    console.log(error);

  }
};

const token = localStorage.getItem("token");
const isLoggedIn = !!token;


    return (

        
        <div className="main-home">
            <div className="offer-bar">
                <p>ENJOY FESTIVE DISCOUNTS! FREE SHIPPING ABOVE 999!</p>
            </div>
      {!isLoggedIn && (
  <div className="auth-buttons-home">
    <Link to="/login">
      <button className="login-btn-home">Login</button>
    </Link>

    <Link to="/signup">
      <button className="signup-btn-home">Sign Up</button>
    </Link>
  </div>
)}
            <div className="content-home">
                <div className="carosel-box-home">
                      <Swiper
  modules={[ Autoplay]}
  autoplay={{ delay: 3000 }}
  loop={true}
>
  <SwiperSlide>
    <div className="slide">
            <div className="blueper-box">
                <div className="blueper-boxtext">
                    <h1>Discover perfumes that <br/> celebrate individuality</h1>
                    <p>every moment with an unforgettable <br/> essence.</p>
                    <button>Shop Now</button>
                </div>
                <div className="blueper-boximg">
                    <img className="blueper-img" src="blue-perfume.png"/>
                    <img className="blueper-imgg" src="blue-perfume.png"/>
                </div>
            </div>
        </div>
  </SwiperSlide>

  <SwiperSlide>
   <div className="slide1">
            <div className="orange-box">
                <div className="orange-boxtext">
                    <h1>Discover perfumes that <br/> celebrate individuality</h1>
                    <p>every moment with an unforgettable <br/> essence.</p>
                    <button>Shop Now</button>
                </div>
                <div className="orange-boximg">
                    <img className="orange-img" src="orange-perfume.png"/>
                    <img className="orange-imgg" src="orange-perfume.png"/>
                </div>
            </div>
        </div>
  </SwiperSlide>

</Swiper>
                </div>

                <div className="offers">
                    <div className="offer1">
                        <div>
                        <h3>Unlock Exclusive <br /> Offers</h3>
                        <p>Discover special deals <br /> tailored just for you!</p>
                        </div>
                        <img src="orange-removebg-preview.png" alt="" />
                    </div>
                      <div className="offer2">
                        <h3>Gift a Scants to your loved one</h3>
                        <p>Make your love more beautiful</p>
                        <img src="blackper.png" alt="" />
                    </div>
                      <div className="offer3">
                        <h3>luxury Scants <br />Starting at /4,000</h3>
                        <p>Shop <br />Now</p>
                        
                        <img src="whiteper.png" alt="" />
                    </div>
                </div>
                <div className="features">
                    <div className="feature1">
                        <TbTruckDelivery size={60}  />
                        <div className="feature-text">
                            <h4>Fast & Reliable Delivery</h4>
                            <p>Get your order delivered on time , every time</p>
                        </div>

                    </div>
                    <div className="feature1">
                        <RiSecurePaymentLine size={60}  />
                        <div className="feature-text">
                            <h4>Secure Payments</h4>
                            <p>Shop with confidance using our encrypted payment gateways</p>
                        </div>

                    </div>
                    <div className="feature1">
                       <RiCustomerService2Line size={60}  />
                        <div className="feature-text">
                            <h4>24/7 Customer Support</h4>
                            <p>We're here to assist anytime,everywhere</p>
                        </div>

                    </div>
                </div>
                <div className="productrow-home">
                <div className="product-heading">
                    <h2>Featured Collections</h2>
                </div>
                <div className='prdoducts-home'>
      {Products.map((item) => (
  <div
  key={item._id}
  className="product-item-home"
  onClick={() => navigate(`/product/${item._id}`)}
>

<div className="wishlist-icon">

  {
    isInWishlist(item._id) ? (

     <FaHeart 
  className='filled-heart'
  onClick={(e) =>{
     e.stopPropagation();
     handleWishlist(item._id)}}
  color='red'
/>

    ) : (

    <FaRegHeart
  className='empty-heart'
  onClick={(e) =>{
     e.stopPropagation();
     handleWishlist(item._id)}}
  color='black'
/>

    )
  }

</div>

  <img
    src={`http://localhost:5000/uploads/${item.images[0]}`}
    alt=""
  />

  <h5>{item.title}</h5>

  <p>₹ {item.salePrice}</p>

  <button
 onClick={(e) =>{
   e.stopPropagation();
  handleAddCart(item._id)}}
>
 Add to Cart
</button>

</div>
      ))}
    </div>
    </div>

    <div className="quote">
       " It's an art. A craft. A science. At Fragrenzia we're in <br />the bussiness of creating memories that last forever <br /> through our fragrances."
    </div>
    <div className="addbox-home">
       <div className='addbox1-home'> <p>New Arrivals</p></div>
       <div className='addbox2-home'> <p>Limited Editions</p></div>
        <div className='addbox3-home'><p>Best Sellers</p></div>
    </div>
      <div className="explore-home">
                <div className="explore-heading">
                    <h2>Explore Categories</h2>
                </div>
                <div className='exploreitem-home'>
      {Products.map((item) => (
        <div key={item._id} className='explore-item-home'>
            <img
  src={`http://localhost:5000/uploads/${item.images[0]}`}
  alt=""
/>
          <h5>{item.title}</h5>
        </div>
      ))}
    </div>
    </div>
        <div className="productrow-home">
                <div className="product-heading">
                    <h2>Offer Zone</h2>
                </div>
                <div className='prdoducts-home'>
      {Products.map((item) => (
       <div
  key={item._id}
  className="product-item-home"
  onClick={() => navigate(`/product/${item._id}`)}
>
           <img
  src={`http://localhost:5000/uploads/${item.images[0]}`}
  alt=""
/>
          <h5>{item.title}</h5>
          <p>₹ {item.price}</p>
          <button onClick={(e) =>{
           e.stopPropagation();
             handleAddCart(item._id)}}>
            Add to Cart
          </button>
        </div>
      ))}
    </div>
    </div>
    <div className="describe-home">
        <div className="describetext-home">
            <h2>Elegance in Every Bottle</h2>
            <p>Discover timeless fragrance crafted for every moments</p>
            <button>Shop Now</button>
        </div>
        <div>
             <img src="desper.jpg" alt="" />
        </div>
    </div>
            </div>
        </div>
    )
};


export default Home