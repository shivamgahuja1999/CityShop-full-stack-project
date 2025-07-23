import mongoose from "mongoose";
const {Schema,model}=mongoose;

const categorySchema=new Schema({
    name:{
        type:String,
        default:""
    },
    image:{
        type:String,
        default:""
    },
},{timestamps:true})

const CategoryModel=model("Category",categorySchema);
export default CategoryModel