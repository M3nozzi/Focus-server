const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

let storage = cloudinaryStorage({
  cloudinary,
  folder: "focus", 
  allowedFormats: ["jpg", "png", "jpeg"],
  
  filename: function (req, res, cb) {
    cb(null, res.originalname.split(".")[0]); 
  },
});

const uploader = multer({ storage });
module.exports = uploader;

