import uploadImageCLoudinary from "../utils/uploadImageCloudinary.js"

export async function uploadImageController(request,response) {
    try {
        const file=request.file
        const upload=await uploadImageCLoudinary(file)
        return response.json({
            message:"Upload done",
            data:upload,
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