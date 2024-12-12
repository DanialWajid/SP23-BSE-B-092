const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      lowercase: true,
    },
    price: {
      type: Number,
      required: true,
    },
    sizesAvailable: {
      type: [String], // Array of available sizes
      required: true,
    },
    categoryType: {
      type: String, // String for category type (e.g., "Men", "Women")
      required: true,
    },
    itemType: {
      type: String, // String for item type (e.g., "T-shirt", "Jeans")
      required: true,
    },
    colors: {
      type: [String], // Array of available colors
      required: true,
    },
    productImage: {
      type: String, // URL or file path to the first image
      required: true,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
