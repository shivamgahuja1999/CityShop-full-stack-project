import jwt, { decode } from "jsonwebtoken"
import dotenv from "dotenv";
dotenv.config();

const auth=(request,response,next)=>{
    try {
        const token=request.cookies.accessToken || request?.headers?.authorization?.split(" ")[1] // ["Bearer","" Token]
        if(!token){
            return response.status(401).json({
                message:"You have not login"
            })
        }
        const decoded=jwt.verify(token,process.env.SECRET_KEY_ACCESS_TOKEN)
        if(!decoded){
            return response.status(401).json({
                message:"Unauthorize access",
                success:false,
                error:true
            })
        }
        request.userId=decoded.id;
        next();
        // console.log("token",token);
        // console.log("decode",decoded)
    } catch (error) {
        return response.status(500).json({
            message:"You have not login",//error.message || error,
            error:true,
            success:false
        })
    }
}

export default auth