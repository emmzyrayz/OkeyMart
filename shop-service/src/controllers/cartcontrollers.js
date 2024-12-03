const UserShopping = require("../models/UserShopping");
const Product = require("../models/Product"); // Adjust as needed

exports.addToCart = async (req, res) => {
  try {
    const {id: userId} = req.user;
    const {product, quantity, additionalData} = req.body;

    // Validate product exists
    const productExists = await Product.findById(product);
    if (!productExists) {
      return res.status(404).json({message: "Product not found"});
    }

    // Find or create user shopping document
    let userShopping = await UserShopping.findOne({user: userId});

    if (!userShopping) {
      userShopping = new UserShopping({user: userId});
    }

    // Check if product already in cart
    const existingCartItemIndex = userShopping.cart.findIndex(
      (item) => item.product.toString() === product
    );

    if (existingCartItemIndex > -1) {
      // Update existing cart item
      userShopping.cart[existingCartItemIndex].quantity += quantity;
      userShopping.cart[existingCartItemIndex].additionalData = {
        ...userShopping.cart[existingCartItemIndex].additionalData,
        ...additionalData,
      };
    } else {
      // Add new cart item
      userShopping.cart.push({
        product,
        quantity,
        additionalData,
        addedAt: new Date(),
      });
    }

    // Log user activity
    userShopping.userActivities.push({
      type: "ADD_TO_CART",
      details: {
        productId: product,
        quantity,
        additionalData,
      },
    });

    await userShopping.save();

    res.status(200).json(userShopping);
  } catch (error) {
    res.status(500).json({
      message: "Error adding to cart",
      error: error.message,
    });
  }
};

// Similar methods for removeFromCart, updateCartItem, etc.
