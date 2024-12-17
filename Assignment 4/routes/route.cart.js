const express = require("express");
const router = express.Router();
const Order = require("../model/order.model");

router.post("/add-to-cart", (req, res) => {
  const { productId, size, color, price, quantity, productImage } = req.body;

  const parsedQuantity = parseInt(quantity, 10);

  if (req.session.userEmail) {
    const userEmail = req.session.userEmail;

    let cart = req.session.cart || [];
    const newItem = {
      productId,
      size,
      color,
      price,
      quantity: parsedQuantity,
      productImage,
    };

    const existingItem = cart.find(
      (item) =>
        item.productId === newItem.productId &&
        item.size === newItem.size &&
        item.color === newItem.color
    );

    if (existingItem) {
      existingItem.quantity =
        parseInt(existingItem.quantity, 10) + parsedQuantity;
    } else {
      cart.push(newItem);
    }

    req.session.cart = cart;

    res.redirect("/cart");
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

  let cart;
  try {
    cart = JSON.parse(cartData);
  } catch (error) {
    console.error("Invalid cart data:", error);
    return res.status(400).send("Invalid cart data.");
  }

  if (!cart || cart.length === 0) {
    return res.status(400).send("Cart is empty.");
  }

  let totalAmount = 0;
  cart.forEach((item) => {
    totalAmount += item.price * item.quantity;
  });

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

  newOrder.save();
  res.redirect("/user/thank-you");
});

router.get("/user/thank-you", async (req, res) => {
  res.render("thank-you");
});
router.get("/user/order-history", async (req, res) => {
  try {
    const userEmail = req.session.userEmail;
    const orders = await Order.find({ email: userEmail }).sort({
      orderDate: -1,
    });
    res.render("order-history", { orders });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
