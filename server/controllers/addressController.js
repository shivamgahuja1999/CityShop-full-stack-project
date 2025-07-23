import AddressModel from "../models/addressModel.js";
import UserModel from "../models/userModel.js";

export async function AddAddressController(request,response) {
    try {
        const userId=request.userId
        const {address_line,city,state,pincode,country,mobile}=request.body
        
        const createAddress=new AddressModel({
            address_line,
            city,
            state,
            pincode,
            country,
            mobile,
            userId:userId
        })
        const saveAddress=await createAddress.save()
        const AddUserAddressId=await UserModel.findByIdAndUpdate({_id:userId},{
            $push:{
                address_details:saveAddress._id
            }}
        )
        return response.json({
            message:"Address created successfully",
            success:true,
            error:false,
            data:saveAddress
        })
    } catch (error) {
        return response.status(500).json({
            message:error.message || error,
            error:true,
            success:false
        })
    }
}

export async function GetAddressController(request,response) {
    try {
        const userId=request.userId
        const addressData=await AddressModel.find({userId:userId}).sort({createdAt:-1})
        return response.json({
            data:addressData,
            message:"List of addresses",
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

export async function UpdateAddressController(request,response) {
    try {
        const userId=request.userId
        const {_id,address_line,city,state,pincode,country,mobile}=request.body
        const updateAddress=await AddressModel.updateOne({_id:_id,userId:userId},{
            address_line,
            city,
            state,
            pincode,
            country,
            mobile
        })
        return response.json({
            message:"Address updated",
            data:updateAddress,
            success:true,
            error:false
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error:true,
            success:false
        })
    }
}

export async function DisableAddressController(request,response) {
    try {
        const userId=request.userId
        const {_id}=request.body
        const disableAddress=await AddressModel.updateOne({_id:_id,userId:userId},{
            status:false
        })
        return response.json({
            message:"Address removed",
            data:disableAddress,
            success:true,
            error:false
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error:true,
            success:false
        })
    }
}