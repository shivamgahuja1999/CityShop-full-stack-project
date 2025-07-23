import express from "express";
import auth from "../middleware/auth.js"
import { uploadImageController } from "../controllers/uploadImageController.js";
import upload from "../middleware/multer.js";

const router=express.Router();

router.post("/upload",auth,upload.single('image'),uploadImageController)

export default router