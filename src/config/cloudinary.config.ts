import cloudinary from "cloudinary";
const cloud = cloudinary.v2;
import "dotenv/config";

cloud.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
  secure: true,
});

export default cloud;
