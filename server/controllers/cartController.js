import ProductModel from "../models/productModel.js"
import CartProductModel from "../models/cartProductModel.js"
import UserModel from "../models/userModel.js"

export async function AddToCartController(request,response) {
    try {
        const userId=request.userId
        const {productId}=request.body
        if(!productId){
            return response.status(402).json({
                message:"Provide productId",
                error:true,
                success:false
            })
        }
        const checkCartItem=await CartProductModel.findOne({
            userId:userId,
            productId:productId
        })
        if(checkCartItem){
            return response.status(400).json({
                message: "Item already in cart",
            })
        }
        const cartItem=new CartProductModel({
            quantity:1,
            userId:userId,
            productId:productId
        })
        const saveCart=await cartItem.save();
        const updateCartUser=await UserModel.updateOne({_id:userId},{
            $push:{
                shopping_cart:productId
            }
        })
        return response.json({
            message:"Item added to cart",
            data:saveCart,
            success:true,
            error:false
        })
    } catch (error) {
        return response.status(500).json({
            message:error.message || error,
            success:false,
            error:true
        })
    }
}

export async function GetCartItemController(request,response) {
    try {
        const userId=request.userId
        const cartItem=await CartProductModel.find({
            userId:userId
        }).populate("productId")
        return response.json({
            data:cartItem,
            success:true,
            error:false
        })
    } catch (error) {
        return response.status(500).json({
            message:error.message || error,
            success:false,
            error:true
        })
    }
}

export async function UpdateCartItemQtyController(request,response) {
    try {
        const userId=request.userId
        const {_id,quantity}=request.body
        if(!_id || !quantity){
            return response.status(400).json({
                message:"Provide _id, quantity",
                error:true,
                success:false
            })
        }
        const updateCartItem=await CartProductModel.updateOne({
            _id:_id,userId:userId
        },{
            $set: { quantity: quantity }
        })
        return response.json({
            message:"update cart",
            success:true,
            error:false,
            data:updateCartItem
        })
        
    } catch (error) {
        return response.status(500).json({
            message:error.message || error,
            success:false,
            error:true
        })
    }
}

export async function DeleteCartItemQtyController(request,response) {
    try {
        const userId=request.userId
        const {_id}=request.body
        if(!_id){
            return response.status(400).json({
                message:"Provide _id",
                error:true,
                success:false
            })
        }
        const deleteCartItem=await CartProductModel.deleteOne({_id:_id,userId:userId})
        return response.json({
            message:"item removed",
            error:false,
            success:true
        })
    } catch (error) {
        return response.status(500).json({
            message:error.message || error,
            success:false,
            error:true
        })
    }
}