const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");

dotenv.config({ path: ".env.local" });
cloudinary.config({
  cloud_name: "do35a2aay",
  api_key: "619267614658392",
  api_secret: "e0C1Zv-6aXs43A3P7M0pks4mihk",
});

const createCloudinaryStorage = ({
  folder = "categoryImage",
  resourceType = "image",
  format = async (req, file) => {
    const mimeType = file.mimetype.split("/")[1];
    const allowedFormats = ["jpeg", "png", "jpg", "gif"];
    return allowedFormats.includes(mimeType) ? mimeType : "jpeg";
  },
  publicId,
}) => {
  return new CloudinaryStorage({
    cloudinary,
    params: {
      folder,
      resource_type: resourceType,
      format,
      public_id:
        publicId || ((req, file) => `${Date.now()}_${file.originalname}`),
    },
  });
};

module.exports = { createCloudinaryStorage };
