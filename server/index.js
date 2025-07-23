import express, { request, response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import dotenv from "dotenv";
import connectDB from "./config/connectDB.js";
dotenv.config();
import userRoute from "../server/routes/userRoute.js"
import categoryRoute from "../server/routes/categoryRoute.js"
import uploadRoute from "../server/routes/uploadRoute.js"
import subCategoryRoute from "../server/routes/subCategoryRoute.js"
import productRoute from "../server/routes/productRoute.js"
import cartRoute from "../server/routes/cartRoutes.js"
import addressRoute from "../server/routes/addressRoute.js"
import orderRoute from "../server/routes/orderRoute.js"

const app=express();
app.use(cors({
    credentials:true,
    origin:process.env.FRONTEND_URL
}));

app.use(express.json());
app.use(cookieParser());
app.use(morgan());
app.use(helmet({
    crossOriginResourcePolicy:false,
}));
const PORT=8080 || process.env.PORT;

app.get("/",(request,response)=>{
    // server to client
    response.json({
        message: "Server is running on port "+PORT
    })
})
app.use("/api/user",userRoute);
app.use("/api/category",categoryRoute);
app.use("/api/file",uploadRoute)
app.use("/api/subcategory",subCategoryRoute)
app.use("/api/product",productRoute)
app.use("/api/cart",cartRoute)
app.use("/api/address",addressRoute);
app.use("/api/order",orderRoute)
connectDB().then(()=>{
    app.listen(PORT,()=>{
    console.log("Server is listening on PORT: ",PORT);
})
});

