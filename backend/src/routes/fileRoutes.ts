import { Router } from "express";
import {
  uploadFile,
  getFiles,
  downloadFile,
  deleteFile,
} from "../controllers/fileController";
import { protect } from "../middleware/authMiddleware";
import multer from "multer";
import { allowedMimeTypes, maxFileSize } from "../utils/constants";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: maxFileSize,
  },
  fileFilter: (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type."));
    }
  },
});

router
  .route("/")
  .post(protect, upload.single("file"), uploadFile)
  .get(protect, getFiles);

router.route("/:id").get(protect, downloadFile).delete(protect, deleteFile);

export default router;
