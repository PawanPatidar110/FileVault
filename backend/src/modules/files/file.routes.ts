import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import { downloadFile, downloadSharedFile, getFile, getFiles, getSharedFile, previewFile, removeFile, updateStarred, updateVisibility, uploadFile } from "./file.controller.js";
import { upload } from "./file.upload.js";

const router = Router();

router.get("/",authenticate,getFiles);
router.post("/",authenticate,upload.single("file"),uploadFile);
router.get("/share/:shareToken",getSharedFile);
router.get('/share/:shareToken/download',downloadSharedFile);
router.get("/:id/download",authenticate,downloadFile);
router.patch("/:id/starred",authenticate,updateStarred);
router.get("/:id/preview",authenticate,previewFile);
router.get('/:id',authenticate,getFile);
router.delete('/:id',authenticate,removeFile);
router.patch('/:id/visibility',authenticate,updateVisibility);

export default router; 