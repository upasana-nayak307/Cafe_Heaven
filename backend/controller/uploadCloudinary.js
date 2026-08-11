// utils/uploadToCloudinary.js
const cloudinary = require("../config/cloudinary");

const uploadToCloudinary = (buffer, folder = "menu_items") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        // optional transforms:
        transformation: [{ width: 800, height: 800, crop: "limit", quality: "auto" }],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
};

module.exports = uploadToCloudinary;