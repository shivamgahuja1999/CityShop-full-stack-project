import mongoose from "mongoose";
const {Schema,model}=mongoose;

const cartProductSchema=new Schema({
    productId:{
        type:Schema.ObjectId,
        ref:"Product"
    },
    quantity:{
        type:Number,
        default:1
    },
    userId:{
        type:Schema.ObjectId,
        ref:"User"
    }
},{
    timestamps:true
})

const CartProductModel=model("CartProduct",cartProductSchema);
export default CartProductModel