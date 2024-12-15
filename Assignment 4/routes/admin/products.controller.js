const express = require("express");
const router = express.Router();
const Category = require("../../model/category.model");
const Product = require("../../model/product.model");
const { uploadProductImage } = require("../../middleware/multer.middleware");
const { authMiddleware } = require("../../middleware/verified");

router.get("/admin/product-details", authMiddleware, async (req, res) => {
  try {
    console.log("role:", req.session.userRole);

    const products = await Product.find();

    return res.render("admin/products", {
      layout: "adminLayout",
      pageTitle: "Products Management",
      products: products,
    });
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).send("Error fetching products from the database.");
  }
});

// Route to handle product creation with image upload
router.post(
  "/product-details",
  authMiddleware,
  uploadProductImage.single("productImage"), // Middleware to handle single image upload
  async (req, res) => {
    try {
      // Log incoming request for debugging
      console.log("Request Body:", req.body);
      console.log(
        "Uploaded file path:",
        req.file ? req.file.path : "No file uploaded"
      );

      const {
        name,
        price,
        sizesAvailable, // This will already be an array
        categoryType,
        itemType,
        colors, // This will also be an array
      } = req.body;

      // Ensure sizesAvailable and colors are arrays (if not selected, they will be empty arrays)
      const sizesArray = Array.isArray(sizesAvailable)
        ? sizesAvailable
        : sizesAvailable
        ? [sizesAvailable]
        : [];
      const colorsArray = Array.isArray(colors)
        ? colors
        : colors
        ? [colors]
        : [];

      // Get the uploaded product image file
      const productImage = req.file ? req.file.path : null;

      // Check if an image was uploaded
      if (!productImage) {
        return res.status(400).json({ error: "Product image is required" });
      }

      // Log the final data being saved
      console.log("Product Data:", {
        name,
        price,
        sizesAvailable: sizesArray,
        categoryType,
        itemType,
        colors: colorsArray,
        productImage,
      });

      // Create a new product instance using the form data
      const product = new Product({
        name,
        price,
        sizesAvailable: sizesArray, // Store the sizes array directly
        categoryType,
        itemType,
        colors: colorsArray, // Store the colors array directly
        productImage, // Store the uploaded image path
      });

      // Save the product to the database
      await product.save();

      // Log success and redirect
      console.log("Product successfully created:", product);
      res.redirect("/admin/product-details");
    } catch (error) {
      // Log error and send response
      console.error("Error creating product:", error);
      res.status(500).json({ error: "Error creating product" });
    }
  }
);

router.get("/admin/products/create", authMiddleware, (req, res) => {
  if (
    req.session.userRole !== "Admin" &&
    req.session.userRole !== "SuperAdmin"
  ) {
    return res.redirect("/"); // Redirect if not an admin or superadmin
  }
  return res.render("admin/createForm", {
    layout: "adminLayout",
    pageTitle: "Create Product",
  });
});

router.get("/admin/products/delete/:id", authMiddleware, async (req, res) => {
  if (
    req.session.userRole !== "Admin" &&
    req.session.userRole !== "SuperAdmin"
  ) {
    return res.redirect("/"); // Redirect if not an admin or superadmin
  }
  try {
    const productId = req.params.id;
    await Product.findByIdAndDelete(productId);
    res.redirect("/admin/product-details");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error: " + error.message });
  }
});

router.get("/admin/products/edit/:id", authMiddleware, async (req, res) => {
  if (
    req.session.userRole !== "Admin" &&
    req.session.userRole !== "SuperAdmin"
  ) {
    return res.redirect("/"); // Redirect if not an admin or superadmin
  }
  try {
    const productId = req.params.id;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).send("product not found");
    }

    res.render("admin/productEditForm", {
      layout: "adminLayout",
      pageTitle: "Edit Product",
      product,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving Product: " + err.message);
  }
});
router.post(
  "/admin/products/:id",
  uploadProductImage.single("productImage"),
  async (req, res) => {
    try {
      const productId = req.params.id;
      const { name, price, sizesAvailable, categoryType, itemType, colors } =
        req.body;
      console.log("File: ", req.file ? req.file.path : "No file uploaded");
      console.log("Body: ", req.body);

      let productImage;

      // Check if a new image is uploaded
      if (req.file) {
        // If a new image was uploaded
        productImage = req.file.path;
      } else {
        // If no new image was uploaded, keep the existing image
        const product = await Product.findById(productId); // Fetch the existing product
        if (!product) {
          return res.status(404).send("Product not found");
        }
        productImage = product.productImage; // Retain the current image
      }

      // Update the product details
      const updatedProduct = await Product.findByIdAndUpdate(
        productId, // Find product by ID
        {
          name,
          price,
          sizesAvailable, // assuming it's an array
          categoryType,
          itemType,
          colors, // assuming it's an array
          productImage, // updated image path
        },
        { new: true } // Return the updated product
      );

      if (!updatedProduct) {
        return res.status(404).send("Product not found");
      }

      // Redirect to the product details page
      res.redirect("/admin/product-details");
    } catch (err) {
      console.error(err);
      res.status(500).send("Error updating product: " + err.message);
    }
  }
);

router.get("/get-item-types", async (req, res) => {
  const { type } = req.query; // Get category type from the query string
  console.log("type", type); // Log to check if type is received correctly

  try {
    const categories = await Category.find({ type });

    const itemTypes = categories.map((category) => category.categoryName);

    res.json(itemTypes);
  } catch (error) {
    console.error("Error fetching item types:", error);
    res.status(500).json({ error: "Error fetching item types" });
  }
});
router.get("/products/:productId", async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);

    // Render the product detail page
    res.render("partials/productDetails", { product });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching product details: " + err.message);
  }
});

module.exports = router;
