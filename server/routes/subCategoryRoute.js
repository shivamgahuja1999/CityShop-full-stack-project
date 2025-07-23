import express from "express"
import auth from "../middleware/auth.js"
import { AddSubCategoryController, DeleteSubCategoryController, GetSubCategoryConroller, UpdateSubCategoryController } from "../controllers/subCategoryController.js";

const router=express.Router();
router.post('/add-subcategory',auth,AddSubCategoryController)
router.post('/getsubcategory',GetSubCategoryConroller)
router.put('/updatesubcategory',auth,UpdateSubCategoryController)
router.delete('/deletesubcategory',auth,DeleteSubCategoryController)

export default router