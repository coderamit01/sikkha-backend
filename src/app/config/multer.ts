import multer from "multer";

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp","image/avif"];
    if (!allowed.includes(file.mimetype)) {
      cb(new Error("Only JPEG, JPG, PNG, AVIF, and WebP images are allowed"));
      return;
    }
    cb(null, true);
  }
});