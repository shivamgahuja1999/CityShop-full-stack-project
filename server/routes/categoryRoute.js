import express from "express";
import auth from "../middleware/auth.js"
import { AddCategoryController, deleteCategoryController, GetCategoryController, UpdateCategoryController } from "../controllers/categoryController.js";

const router=express.Router();
router.post("/add-category",auth,AddCategoryController)
router.get('/getCategory',GetCategoryController)
router.put('/update',auth,UpdateCategoryController)
router.delete('/delete',auth,deleteCategoryController)

export default router