import express from "express"
import auth from "../middleware/auth.js"
import {CashOnDeliveryOrderController, GetOrderDetailsController, OnlinePaymentOrderController, WebhookStripe} from "../controllers/orderController.js"

const router =express.Router()

router.post("/cash-on-delivery",auth,CashOnDeliveryOrderController)
router.post("/checkout",auth,OnlinePaymentOrderController)
router.post("/webhook",WebhookStripe)
router.get("/order-list",auth,GetOrderDetailsController)

export default router