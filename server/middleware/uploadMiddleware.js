import multer from "multer";
import pkg from "multer-storage-cloudinary";
const { CloudinaryStorage } = pkg;
import cloudinary from "../config/cloudinary.js";
import dotenv from "dotenv";

dotenv.config();

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "social_media_posts",
        allowed_formats: ["jpg", "png", "jpeg"]
    }
});

const upload = multer({ storage });

export default upload;