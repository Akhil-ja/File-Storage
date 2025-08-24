import { Router } from "express";
import {
  uploadFile,
  getFiles,
  downloadFile,
  deleteFile,
} from "../controllers/fileController";
import { protect } from "../middleware/authMiddleware";
import multer from "multer";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router
  .route("/")
  .post(protect, upload.single("file"), uploadFile)
  .get(protect, getFiles);
router.route("/:id").get(protect, downloadFile).delete(protect, deleteFile);

export default router;
