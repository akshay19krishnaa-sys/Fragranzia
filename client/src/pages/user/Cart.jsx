import React, { useEffect, useState } from "react";
import "../../style/cart.css";
import axios from "axios";
import CartService from "../../services/user-api-service/CartService";
import { useNavigate } from "react-router-dom";



const Cart = () => {
  const [Products, setProducts] = useState([]);
  const navigate = useNavigate();


const {
  getCartItems,
  increaseQty,
  decreaseQty,
  removeFromCart,
} = CartService();

  useEffect(() => {
    fetchCart();
  }, []);


const fetchCart = async () => {
  try {
    const cart = await getCartItems();
    setProducts(cart || []);
  } catch (error) {
    console.log(error);
  }
};

  // Increment Quantity 
const inc = async (id) => {
  try {
    await increaseQty(id);
    fetchCart();
  } catch (error) {
    console.log(error);
  }
};

  // Decrement Quantity 
const dec = async (id) => {
  try {
    await decreaseQty(id);
    fetchCart();
  } catch (error) {
    console.log(error);
  }
};

  // Delete Product 
const deleteProduct = async (id) => {
  try {
    await removeFromCart(id);
    fetchCart();
  } catch (error) {
    console.log(error);
  }
};
const totalItems = Products.reduce((total, item) => {
  return total + (item.quantity || 0);
}, 0);
const totalAmount = Products.reduce((total, item) => {
  return total + ((item.product?.salePrice || 0) * (item.quantity || 0));
}, 0);

  return (
    <div className="cart-page">
      <div className="cart-container">

        <div className="cart-left">
          <h2 className="cart-title">Cart</h2>

          {Products.length > 0 ? (
            Products.map((item) => (
              <div
                className="cart-card"
                key={item.product._id}
              >
                <div className="cart-image">
                  <img
                    src={`http://localhost:5000/uploads/${item.product.images[0]}`}
                    alt={item.product.title}
                  />
                </div>

                <div className="cart-details">

                  <h3>{item.product.title}</h3>

                  <div className="quantity-box">
                    <button
                      className="btn"
                      onClick={() =>
                        dec(item.product._id)
                      }
                    >
                      -
                    </button>

                    <div className="count">
                      {item.quantity}
                    </div>

                    <button
                      className="btn"
                      onClick={() =>
                        inc(item.product._id)
                      }
                    >
                      +
                    </button>
                  </div>

                  <div className="price-section">
                    <h2>
                      ₹ {item.product.salePrice}
                    </h2>

                    <p className="old-price">
                      ₹ {item.product.price}
                    </p>

                    <span className="offer-text">
                      {item.product.offer} off
                    </span>
                  </div>

                  <div className="cart-btns">
                    <button
                      className="delete-btn"
                      onClick={() =>
                        deleteProduct(
                          item.product._id
                        )
                      }
                    >
                      Delete
                    </button>

                   
                  </div>

                </div>
              </div>
            ))
          ) : (
            <h2 className="empty-cart">
              Cart Is Empty
            </h2>
          )}
        </div>

        <div className="cart-right">

          <h3>Check Out</h3>

          <div className="checkout-details">

            <div className="checkout-row">
              <p>Total Items</p>
              <span>{totalItems}</span>
            </div>

            <div className="checkout-row">
              <p>Delivery Charge</p>
              <span className="green-text">
                Free
              </span>
            </div>

            <div className="checkout-row total-row">
              <h4>Total Amount</h4>
              <h4>₹ {totalAmount}</h4>
            </div>

          </div>

         <button
  className="checkout-btn"
  onClick={() => navigate("/order")}
>
  Proceed To Buy
</button>

        </div>

      </div>
    </div>
  );
};

export default Cart;