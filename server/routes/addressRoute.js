import express from "express"
import auth from "../middleware/auth.js"
import { AddAddressController, DisableAddressController, GetAddressController, UpdateAddressController } from "../controllers/addressController.js"

const router=express.Router()

router.post("/create-address",auth,AddAddressController)
router.get("/get",auth,GetAddressController)
router.put("/update",auth,UpdateAddressController)
router.delete("/disable",auth,DisableAddressController)

export default router