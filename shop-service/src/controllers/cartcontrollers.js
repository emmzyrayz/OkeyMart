const UserShopping = require("../models/UserShopping");

exports.addToCart = async (req, res) => {
  try {
    const {id: userId} = req.user;
    const {productId, name, price, image, quantity, additionalData} = req.body;

    // Validate required fields
    if (!productId || !name || !price) {
      return res.status(400).json({
        message: "Product ID, name, and price are required",
      });
    }

    // Find or create user shopping document
    let userShopping = await UserShopping.findOne({user: userId});

    if (!userShopping) {
      userShopping = new UserShopping({user: userId});
    }

    // Check if product already in cart
    const existingCartItemIndex = userShopping.cart.findIndex(
      (item) => item.productId === productId
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
        productId,
        name,
        price,
        image,
        quantity,
        additionalData,
        addedAt: new Date(),
      });
    }

    // Log user activity
    userShopping.userActivities.push({
      type: "ADD_TO_CART",
      details: {
        productId,
        name,
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

exports.removeFromCart = async (req, res) => {
  try {
    const {id: userId} = req.user;
    const {productId} = req.params;

    // Find user shopping document
    let userShopping = await UserShopping.findOne({user: userId});

    if (!userShopping) {
      return res.status(404).json({message: "No cart found for user"});
    }

    // Remove item from cart
    const initialCartLength = userShopping.cart.length;
    userShopping.cart = userShopping.cart.filter(
      (item) => item.productId !== productId
    );

    // Check if item was actually removed
    if (userShopping.cart.length === initialCartLength) {
      return res.status(404).json({message: "Product not found in cart"});
    }

    // Log user activity
    userShopping.userActivities.push({
      type: "REMOVE_FROM_CART",
      details: {productId},
    });

    await userShopping.save();

    res.status(200).json(userShopping);
  } catch (error) {
    res.status(500).json({
      message: "Error removing from cart",
      error: error.message,
    });
  }
};

exports.updateCartItemQuantity = async (req, res) => {
  try {
    const {id: userId} = req.user;
    const {productId} = req.params;
    const {quantity} = req.body;

    // Validate quantity
    if (quantity <= 0) {
      return res.status(400).json({message: "Quantity must be positive"});
    }

    // Find user shopping document
    let userShopping = await UserShopping.findOne({user: userId});

    if (!userShopping) {
      return res.status(404).json({message: "No cart found for user"});
    }

    // Find and update cart item
    const cartItemIndex = userShopping.cart.findIndex(
      (item) => item.productId === productId
    );

    if (cartItemIndex === -1) {
      return res.status(404).json({message: "Product not found in cart"});
    }

    // Update quantity
    userShopping.cart[cartItemIndex].quantity = quantity;

    // Log user activity
    userShopping.userActivities.push({
      type: "UPDATE_CART_QUANTITY",
      details: {
        productId,
        quantity,
      },
    });

    await userShopping.save();

    res.status(200).json(userShopping);
  } catch (error) {
    res.status(500).json({
      message: "Error updating cart item quantity",
      error: error.message,
    });
  }
};

exports.getCart = async (req, res) => {
  try {
    const {id: userId} = req.user;

    // Find user shopping document
    const userShopping = await UserShopping.findOne({user: userId});

    if (!userShopping) {
      return res.status(200).json({cart: []});
    }

    res.status(200).json({
      cart: userShopping.cart,
      total: userShopping.cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      ),
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching cart",
      error: error.message,
    });
  }
};
exports.clearCart = async (req, res) => {
  try {
    const {id: userId} = req.user;

    // Find and update user shopping document
    const userShopping = await UserShopping.findOneAndUpdate(
      {user: userId},
      {
        cart: [],
        $push: {
          userActivities: {
            type: "CLEAR_CART",
            details: {
              timestamp: new Date(),
            },
          },
        },
      },
      {new: true}
    );

    if (!userShopping) {
      return res.status(404).json({message: "No cart found for user"});
    }

    res.status(200).json({
      message: "Cart cleared successfully",
      cart: [],
    });
  } catch (error) {
    res.status(500).json({
      message: "Error clearing cart",
      error: error.message,
    });
  }
};

exports.bulkAddToCart = async (req, res) => {
  try {
    const {id: userId} = req.user;
    const {items} = req.body;

    // Validate input
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "Invalid input. Provide an array of items",
      });
    }

    // Validate each item
    const validatedItems = items.map((item) => {
      if (!item.productId || !item.name || !item.price) {
        throw new Error("Each item must have productId, name, and price");
      }
      return {
        productId: item.productId,
        name: item.name,
        price: item.price,
        image: item.image || "",
        quantity: item.quantity || 1,
        additionalData: item.additionalData || {},
        addedAt: new Date(),
      };
    });

    // Find or create user shopping document
    let userShopping = await UserShopping.findOne({user: userId});

    if (!userShopping) {
      userShopping = new UserShopping({user: userId});
    }

    // Merge new items with existing cart
    const mergedCart = [...userShopping.cart];

    validatedItems.forEach((newItem) => {
      const existingItemIndex = mergedCart.findIndex(
        (item) => item.productId === newItem.productId
      );

      if (existingItemIndex > -1) {
        // Update existing item
        mergedCart[existingItemIndex].quantity += newItem.quantity;
      } else {
        // Add new item
        mergedCart.push(newItem);
      }
    });

    // Update user shopping document
    userShopping.cart = mergedCart;

    // Log bulk add activity
    userShopping.userActivities.push({
      type: "BULK_ADD_TO_CART",
      details: {
        itemsAdded: validatedItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      },
    });

    await userShopping.save();

    res.status(200).json(userShopping);
  } catch (error) {
    res.status(500).json({
      message: "Error adding items to cart",
      error: error.message,
    });
  }
};