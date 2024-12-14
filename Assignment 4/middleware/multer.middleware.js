const multer = require("multer");
const { createCloudinaryStorage } = require("../util/cloudinary");

// Create a storage for category images
const categoryImageStorage = createCloudinaryStorage({
  folder: "categoryImage",
  resourceType: "image",
  format: async (req, file) => {
    const mimeType = file.mimetype.split("/")[1];
    const allowedFormats = ["jpeg", "png", "jpg", "gif"];
    return allowedFormats.includes(mimeType) ? mimeType : "jpeg";
  },
  publicId: (req, file) => `${Date.now()}_${file.originalname}`,
});

// Create a storage for product images
const productImageStorage = createCloudinaryStorage({
  folder: "productImage", // New folder for product images
  resourceType: "image",
  format: async (req, file) => {
    const mimeType = file.mimetype.split("/")[1];
    const allowedFormats = ["jpeg", "png", "jpg", "gif"];
    return allowedFormats.includes(mimeType) ? mimeType : "jpeg";
  },
  publicId: (req, file) => `${Date.now()}_${file.originalname}`,
});

// Create multer instances
const uploadCategoryImage = multer({ storage: categoryImageStorage });
const uploadProductImage = multer({ storage: productImageStorage });

module.exports = {
  uploadCategoryImage,
  uploadProductImage,
};
