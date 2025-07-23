import express from "express"
import auth from "../middleware/auth.js"
import { AddToCartController, DeleteCartItemQtyController, GetCartItemController, UpdateCartItemQtyController } from "../controllers/cartController.js"

const router=express.Router()

router.post("/create",auth,AddToCartController)
router.get("/get",auth,GetCartItemController)
router.put("/update-qty",auth,UpdateCartItemQtyController)
router.delete("/delete-cart-item",auth,DeleteCartItemQtyController)

export default router