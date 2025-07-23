import mongoose from "mongoose";
const {Schema, model}=mongoose;

const orderSchema=new Schema({
    userId:[
        {
            type:Schema.ObjectId,
            ref:"User"
        }
    ],
    orderId:{
        type:String,
        required:[true, "Provide orderId"],
        unique:true
    },
    productId:{
        type:Schema.ObjectId,
        ref:"Product"
    },
    product_details:{
        name:String,
        image:Array
    },
    payment_id:{
        type:String,
        default:""
    },
    payment_status:{
        type:String,
        default:""
    },
    delivery_address:{
        type:Schema.ObjectId,
        ref:"Address"
    },
    subTotalAmt:{
        type:Number,
        default:null
    },
    totalAmt:{
        type:Number,
        default:0
    },
    invoice_receipt:{
        type:String,
        default:""
    }
},{
    timestamps:true
})

const OrderModel=model("Order",orderSchema);
export default OrderModel