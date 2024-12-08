const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
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
    image1: {
      type: String, // URL or file path to the first image
    },
    image2: {
      type: String, // URL or file path to the second image
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
