export const validURLConvert=(name)=>{
    if(!name) return "";
    const url=name?.toString().replaceAll(" ","-").replaceAll(",","-").replaceAll("&","-")
    return url
}