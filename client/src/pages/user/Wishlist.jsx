import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../style/wishlist.css";
import { FaHeart } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

import WishlistService from "../../services/user-api-service/WishlistService";
import CartService from "../../services/user-api-service/CartService";
import { toast } from "react-toastify";

const Wishlist = () => {

  const [wishlist, setWishlist] = useState([]);

  const navigate = useNavigate();

  const {
    getWishlist,
    removeFromWishlist,
  } = WishlistService();


  const {
    addToCart,
  } = CartService();


  // GET WISHLIST
  const fetchWishlist = async () => {
    try {

      const data = await getWishlist();
        

      setWishlist(data || []);

    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token) {
      toast.info("Please Login First");
      navigate("/login");
      return;
    }

    fetchWishlist();

  }, [navigate]);



  // REMOVE WISHLIST
  const removeWishlist = async (id) => {

    try {

      await removeFromWishlist(id);

      fetchWishlist();

    } catch(error){

      console.log(error);

    }

  };



  // ADD TO CART
  const handleAddToCart = async (productId) => {

    try {

      await addToCart(productId,1);

      toast.success("Added to Cart ");

    } catch(error){

      console.log(error);

    }

  };


  return (

    <div className="wishlist-page">

      <div className="wishlist-container">


        <div className="wishlist-header">

          <h2>
            My Wishlist
          </h2>

          <p>
            {wishlist.length} Items
          </p>

        </div>



        {
          wishlist.length > 0 ? (

            <div className="wishlist-grid">


             {wishlist.map((item, index)=>(
  <div
  className="wishlist-card"
  key={`${item._id}-${index}`}
  onClick={() => navigate(`/product/${item._id}`)}
>
                    <div className="wishlist-heart">

                      <FaHeart
                        onClick={(e) =>{
                            e.stopPropagation();
                          removeWishlist(item._id)
                        }}
                      />

                    </div>



                    <img
                      src={`http://localhost:5000/uploads/${item.images[0]}`}
                      alt={item.title}
                    />

                        <div className="details-product">

                    <h3>
                      {item.title}
                    </h3>

                    <p className={item.quantity > 0 ? "stock-in" : "stock-out"}>
  {item.quantity > 0 ? "In Stock" : "Out of Stock"}
</p>



                    <div className="wishlist-price">

                      <h4>
                        ₹ {item.salePrice}
                      </h4>

                    </div>
                    



                    <div className="wishlist-btns">


                      <button
                        className="cart-btn"
                        onClick={(e) =>{
                            e.stopPropagation();
                          handleAddToCart(item._id)
                        }}
                      >
                        Add To Cart
                      </button>



                      <button
                        className="remove-btn"
                        onClick={(e) =>{
                            e.stopPropagation();
                          removeWishlist(item._id)
                        }}
                      >

                        <MdDelete />

                      </button>


                    </div>
                    </div>ch


                  </div>


                ))
              }


            </div>


          ) : (


            <div className="empty-wishlist">

              <h2>
                Wishlist is Empty
              </h2>

              <p>
                Save your favourite perfumes
              </p>

            </div>


          )
        }



      </div>

    </div>

  );

};


export default Wishlist;