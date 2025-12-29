const multer = require("multer");
const multerS3 = require("multer-s3");
const { S3Client } = require("@aws-sdk/client-s3");

const s3 = new S3Client({
  region: "fsn1",
  endpoint: "https://fsn1.your-objectstorage.com",
  credentials: {
    accessKeyId: process.env.OBJECT_STORAGE_KEY,
    secretAccessKey: process.env.OBJECT_STORAGE_SECRET,
  },
});

const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.OBJECT_STORAGE_BUCKET,
    acl: "public-read",
    key: (req, file, cb) => {
      let folder = "others/";

      if (file.mimetype.startsWith("image/")) folder = "images/";
      else if (file.mimetype.startsWith("video/")) folder = "videos/";
      else if (file.mimetype.startsWith("audio/")) folder = "audios/";
      else if (
        file.mimetype === "application/pdf" ||
        file.mimetype.includes("msword") ||
        file.mimetype.includes("officedocument")
      )
        folder = "documents/";

      cb(null, `${folder}${Date.now()}-${file.originalname}`);
    },
  }),
});

module.exports = upload;
