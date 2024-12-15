const express = require("express");
const router = express.Router();
const Order = require("../model/order.model");

// Example cart (could be stored in the session or a database)
router.post("/add-to-cart", (req, res) => {
  const { productId, size, color, price, quantity, productImage } = req.body;

  // Ensure quantity is treated as an integer
  const parsedQuantity = parseInt(quantity, 10);

  // Check if user is logged in via session cookie (userEmail in this case)
  if (req.session.userEmail) {
    // Get user's email from session
    const userEmail = req.session.userEmail;

    // Initialize cart from session or empty array if not set
    let cart = req.session.cart || [];
    const newItem = {
      productId,
      size,
      color,
      price,
      quantity: parsedQuantity, // Ensure quantity is a number
      productImage, // Add the product image to the cart item
    };

    // Check if the product already exists in the cart
    const existingItem = cart.find(
      (item) =>
        item.productId === newItem.productId &&
        item.size === newItem.size &&
        item.color === newItem.color
    );

    if (existingItem) {
      // Make sure both quantities are numbers before adding them
      existingItem.quantity =
        parseInt(existingItem.quantity, 10) + parsedQuantity;
    } else {
      cart.push(newItem); // Add the new item to the cart
    }

    // Save the updated cart in session
    req.session.cart = cart;

    // Optionally, save the cart to localStorage for persistence on the frontend
    res.redirect("/cart"); // Redirect to the cart page
  } else {
    res.status(401).send("Please log in to add items to your cart.");
  }
});

router.get("/user/my-cart", (req, res) => {
  res.render("cart-page", {
    userEmail: req.session.userEmail,
  });
});
router.get("/user/checkout", (req, res) => {
  res.render("confirm-checkout", {
    userEmail: req.session.userEmail,
  });
});

router.post("/user/checkout", (req, res) => {
  const { name, email, phone, address, paymentMode, cartData } = req.body;

  // Parse the cart data (since it's sent as a JSON string)
  let cart;
  try {
    cart = JSON.parse(cartData);
  } catch (error) {
    console.error("Invalid cart data:", error);
    return res.status(400).send("Invalid cart data.");
  }

  // Check if cart is empty
  if (!cart || cart.length === 0) {
    return res.status(400).send("Cart is empty.");
  }

  // Calculate the total amount for the order
  let totalAmount = 0;
  cart.forEach((item) => {
    totalAmount += item.price * item.quantity;
  });

  // Create a new order object with customer and product details
  const newOrder = new Order({
    customerName: name,
    email,
    phone,
    address,
    paymentMode,
    products: cart.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
      price: item.price,
      productImage: item.productImage,
    })),
    totalAmount,
  });

  // Save the order to the database
  newOrder.save();
  res.redirect("/user/thank-you");
});

router.get("/user/thank-you", async (req, res) => {
  res.render("thank-you");
});
router.get("/user/order-history", async (req, res) => {
  try {
    const userEmail = req.session.userEmail; // Assuming user is authenticated, and user ID is available
    const orders = await Order.find({ email: userEmail }).sort({
      orderDate: -1,
    });
    res.render("order-history", { orders }); // Render the view with the orders
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
