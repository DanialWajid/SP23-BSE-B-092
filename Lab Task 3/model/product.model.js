const mongoose = require("mongoose");
const productSchema = mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
    },
    description: { type: String, lowercase: true, trim: true },
    price: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

const product = mongoose.model("product", productSchema);
module.exports = product;
