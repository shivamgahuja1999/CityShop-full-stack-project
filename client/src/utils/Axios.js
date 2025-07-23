import axios from "axios";
import SummaryApi, { baseURL } from "../common/SummaryApi";

const Axios=axios.create({
    baseURL:baseURL,
    withCredentials:true  // Set cookies inside client browser
})
// sending access token in the header
Axios.interceptors.request.use(
    async(confg)=>{
        const accessToken=localStorage.getItem('CityShop accesstoken')

        if(accessToken){
            confg.headers.Authorization=`Bearer ${accessToken}`
        }
        return confg
    },
    (error)=>{
        return Promise.reject(error)
    }
)

//Extend the lifespan of access token with refresh token
Axios.interceptors.request.use(
    (response)=>{
        return response
    },
    async(error)=>{
        let originRequest=error.confg
        if(error.response.status === 401 && !originRequest.retry){
            originRequest.retry=true
            const refreshToken=localStorage.getItem("CityShop refreshtoken")

            if(refreshToken){
                const newAccessToken =await refreshAccessToken(refreshToken)
                if(newAccessToken){
                    originRequest.headers.Authorization=`Bearer ${newAccessToken}`
                    return Axios(originRequest)
                }
            }
        }
        return Promise.reject(error);
    }
)

const refreshAccessToken=async(refreshToken)=>{
    try {
        const response=await Axios({
            ...SummaryApi.refreshToken,
            headers:{
                Authorization:`Bearer ${refreshToken}`
            }
        })
        const accessToken=response.data.data.accessToken
        localStorage.setItem('CityShop accessToken',accessToken)
        console.log(response)
        return accessToken
    } catch (error) {
        console.log(error);
    }
}

export default Axios