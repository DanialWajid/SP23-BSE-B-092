const multer = require("multer");
const { createCloudinaryStorage } = require("../util/cloudinary");

const storage = createCloudinaryStorage({
  folder: "categoryImage",
  resourceType: "image",
  format: async (req, file) => {
    const mimeType = file.mimetype.split("/")[1];
    const allowedFormats = ["jpeg", "png", "jpg", "gif"];
    return allowedFormats.includes(mimeType) ? mimeType : "jpeg";
  },
  publicId: (req, file) => `${Date.now()}_${file.originalname}`,
});

const upload = multer({ storage });

module.exports = upload;
