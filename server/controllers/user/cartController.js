const User = require("../../models/user/user");


const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // console.log(req.userId,"userid");
    

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

   
    const existingProduct = user.cart.find(
      (item) => item.product.toString() === productId
    );

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      user.cart.push({
        product: productId,
        quantity,
      });
    }

    await user.save();

    res.status(200).json({
      message: "Product added to cart",
      cart: user.cart,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getCart = async (req, res) => {
  const user = await User.findById(req.userId).populate("cart.product");

  user.cart = user.cart.filter(item => item.product);

  await user.save();

  res.json({
    cart: user.cart,
  });
};
const removeFromCart = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.cart = user.cart.filter(
      (item) => item.product.toString() !== req.params.productId
    );

    await user.save();

    res.status(200).json({
      message: "Product removed from cart",
      cart: user.cart,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const increaseQty = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    const item = user.cart.find(
      (item) => item.product.toString() === req.params.productId
    );

    if (!item) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    item.quantity += 1;

    await user.save();

    res.status(200).json({
      message: "Quantity increased",
      cart: user.cart,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};const decreaseQty = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    const item = user.cart.find(
      (item) => item.product.toString() === req.params.productId
    );

    if (!item) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (item.quantity > 1) {
      item.quantity -= 1;
    }

    await user.save();

    res.status(200).json({
      message: "Quantity decreased",
      cart: user.cart,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const clearCart = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    user.cart = [];

    await user.save();

    res.json({
      message: "Cart cleared successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = { addToCart, getCart,removeFromCart,increaseQty,decreaseQty,clearCart };