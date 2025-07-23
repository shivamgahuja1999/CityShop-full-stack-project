import mongoose, { mongo } from "mongoose";
const {Schema,model}=mongoose;

const userSchema=new Schema({
    name:{
        type:String,
        required:[true,"Povide name"]
    },
    email:{
        type:String,
        required:[true,"Provide email"],
        unique:true
    },
    password:{
        type:String,
        required:[true,"Provide password"]
    },
    avatar:{
        type:String,
        default:""
    },
    mobile:{
        type:Number,
        default:null
    },
    refresh_token:{
        type:String,
        default:""
    },
    verify_email:{
        type:Boolean,
        default:false
    },
    last_login_date:{
        type:Date,
        default:""
    },
    status:{
        type:String,
        enum:["Active","Inactive","Suspended"],
        default:"Active"
    },
    address_details:[
        {
            type:Schema.ObjectId,
            ref:"Address"
        }
    ],
    shopping_cart:[
        {
            type:Schema.ObjectId,
            ref:"CartProduct"
        }
    ],
    orderHistory:[
        {
            type:Schema.ObjectId,
            ref:"Order"
        }
    ],
    forgot_password_otp:{
        type:String,
        default:null
    },
    forgot_password_expiry:{
        type:Date,
        default:null
    },
    role:{
        type:String,
        enum:["ADMIN","USER"],
        default:"USER"
    }
 },{
    timestamps:true
 });

 const UserModel=model("User",userSchema);
 export default UserModel;