const cloudinary = require("cloudinary").v2;
const fs = require("fs");
cloudinary.config({
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
});
//Hello
async function uploadOnCloudinary(filePath) {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
    });
    return result;
  } catch (error) {
  } finally {
    try {
      fs.unlinkSync(filePath);
    } catch (unlinkError) {
      console.warn("Failed to delete temp file:", unlinkError);
    }
  }
}
module.exports = { uploadOnCloudinary, cloudinary };
