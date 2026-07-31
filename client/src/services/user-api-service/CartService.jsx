import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const CartService = () => {
  const axiosPrivate = useAxiosPrivate();

  // Get Cart
  const getCartItems = async () => {
    const res = await axiosPrivate.get("/api/cart/getcart");
    return res.data.cart;
  };

  // Add To Cart
  const addToCart = async (productId, quantity = 1) => {
    const res = await axiosPrivate.post("/api/cart/add", {
      productId,
      quantity,
    });

    return res.data;
  };

  // Increase Quantity
  const increaseQty = async (productId) => {
    const res = await axiosPrivate.put(
      `/api/cart/increase/${productId}`
    );

    return res.data;
  };

  // Decrease Quantity
  const decreaseQty = async (productId) => {
    const res = await axiosPrivate.put(
      `/api/cart/decrease/${productId}`
    );

    return res.data;
  };

  // Remove Item
  const removeFromCart = async (productId) => {
    const res = await axiosPrivate.delete(
      `/api/cart/remove/${productId}`
    );

    return res.data;
  };

  const clearCart = async () => {
  const res = await axiosPrivate.delete("/api/cart/clear");
  return res.data;
};

  return {
    getCartItems,
    addToCart,
    increaseQty,
    decreaseQty,
    removeFromCart,
    clearCart
  };
};

export default CartService;