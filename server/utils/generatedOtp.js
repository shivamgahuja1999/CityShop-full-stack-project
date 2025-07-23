export const generatedOtp=async()=>{
    return Math.floor(Math.random()*900000)+100000 // return 100000 to 999999
}