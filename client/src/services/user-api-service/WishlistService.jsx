import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const WishlistService = () => {
  const axiosPrivate = useAxiosPrivate();

  // Get Wishlist
  const getWishlist = async () => {
    const res = await axiosPrivate.get("/api/wishlist/get");
    return res.data.wishlist;
  };

  // Add To Wishlist
  const addToWishlist = async (productId) => {
    const res = await axiosPrivate.post("/api/wishlist/addwish", {
      productId,
    });

    return res.data;
  };

  // Remove From Wishlist
  const removeFromWishlist = async (productId) => {
    const res = await axiosPrivate.delete(
      `/api/wishlist/remove/${productId}`
    );

    return res.data;
  };

  // Toggle Wishlist
  const toggleWishlist = async (productId) => {
    const res = await axiosPrivate.post("/api/wishlist/toggle", {
      productId,
    });

    return res.data;
  };

  return {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
  };
};

export default WishlistService;