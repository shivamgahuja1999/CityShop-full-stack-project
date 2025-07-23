import express from "express"
import auth from "../middleware/auth.js"
import admin from "../middleware/admin.js"
import {CreateProductController, DeleteProductDetails, getProductByCategory, getProductByCategoyAndSubCategoy, GetProductController, GetProductDetails, SearchProduct, UpdateProductDetails} from "../controllers/productController.js"

const router =express.Router();

router.post("/add-product",auth,admin,CreateProductController)
router.post("/getproduct",GetProductController)
router.post('/get-product-by-category',getProductByCategory)
router.post('/get-producy-by-category-and-subcategory',getProductByCategoyAndSubCategoy)
router.post('/get-product-details',GetProductDetails)
router.put('/update-product',auth,admin,UpdateProductDetails)
router.delete('/delete-product',auth,admin,DeleteProductDetails)
router.post("/search-product",SearchProduct)

export default router