const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isUserRoute = req.originalUrl?.includes("/users") || req.baseUrl?.includes("/users");
    const folder = isUserRoute ? "fragranzia/users" : "fragranzia/products";

    return {
      folder,
      allowed_formats: ["jpg", "jpeg", "png", "webp", "avif", "jfif"],
      public_id: `${Date.now()}-${file.originalname.split(".")[0].replace(/[^a-zA-Z0-9]/g, "_")}`,
    };
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

module.exports = upload;
