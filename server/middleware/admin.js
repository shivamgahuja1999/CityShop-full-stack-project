import { response } from "express"
import UserModel from "../models/userModel.js"

const admin=async(request,response,next)=>{
    try {
        const userId=request.userId
        const user=await UserModel.findById(userId)
        if(user.role !== 'ADMIN'){
            return response.status(400).json({
                message:"Permission denied",
                success:false,
                error:true
            })
        }
        next()
    } catch (error) {
        return response.status(500).json({
            message:"Permission denied",
            error:true,
            success:false
        })
    }
}

export default admin