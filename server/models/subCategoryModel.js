import mongoose from "mongoose";
const {Schema,model}=mongoose;

const subCategorySchema=new Schema({
    name:{
        type:String,
        default:""
    },
    image:{
        type:String,
        default:""
    },
    category:[
        {
            type:Schema.ObjectId,
            ref:"Category"
        }
    ]
},{
    timestamps:true
})

const SubCategoryModel=model("SubCategory",subCategorySchema);
export default SubCategoryModel