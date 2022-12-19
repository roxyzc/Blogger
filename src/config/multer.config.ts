import multer from "multer";
import path from "path";

// multer config
export default multer({
  storage: multer.diskStorage({}),
  limits: {
    fileSize: 1048576,
  },
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
      return cb(new Error("file type is not supported"));
    }

    const fileSize = parseInt(req.headers["content-length"] as string);
    if (fileSize > 1048576) {
      return cb(new Error("file max 1 Mb"));
    }
    cb(null, true);
  },
});
