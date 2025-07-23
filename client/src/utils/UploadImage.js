import Axios from "./Axios"
import SummaryApi from "../common/SummaryApi"
import { AxiosToastError } from "./AxiosToastError"

export async function UploadImage(image) {
    try {
        const formData=new FormData()  //convert image to formdata
        formData.append('image',image)
        const response=await Axios({
            ...SummaryApi.uploadImage,
            data:formData
        })
        return response
    } catch (error) {
        AxiosToastError();
    }
}