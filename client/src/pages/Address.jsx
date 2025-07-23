import React, { useState } from "react";
import { useSelector } from "react-redux";
import AddAddress from "../components/AddAddress";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import EditAddressDetails from "../components/EditAddressDetails";
import { AxiosToastError } from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import { useGlobalContext } from "../provider/GlobalProvider";

const Address = () => {
  const addressList = useSelector((state) => state.addresses.addressList);
  const [openAddress, setOpenAddress] = useState(false);
  const [openEditAddress, setOpenEditAddress] = useState(false);
  const [editData, setEditData] = useState({});
  const {fetchAddress}=useGlobalContext()
  
  const handleDisableAddress=async(id)=>{
    try {
      const response=await Axios({
        ...SummaryApi.disableAddress,
        data:{
          _id:id
        }
      })
      const {data:responseData}=response
      if(responseData.success){
        toast.success(responseData.message)
        if(fetchAddress){
          fetchAddress()
        }
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }
  return (
    <div className="">
      <div className="p-2 bg-white shadow-lg flex justify-between items-center gap-4">
        <h2 className="font-semibold">Saved Address</h2>
        <button
          onClick={() => setOpenAddress(true)}
          className="border-primary-200 border-2 text-primary-200 hover:bg-primary-200 hover:text-black rounded-full py-1 px-2"
        >
          Add Address
        </button>
      </div>
      <div className="bg-blue-50 p-2 grid gap-4">
        {addressList.map((adrs, index) => {
          return (
            <div
              key={adrs._id + index + "addresslist"}
              className={`border rounded p-3 flex gap-3 bg-white ${!adrs.status && "hidden"}`}
            >
              <div className="w-full">
                <p>{adrs.address_line}</p>
                <p>{adrs.city}</p>
                <p>
                  {adrs.city} - {adrs.pincode}
                </p>
                <p>{adrs.state}</p>
                <p>{adrs.mobile}</p>
              </div>
              <div className="grid gap-10">
                <button
                  onClick={() => {
                    setOpenEditAddress(true);
                    setEditData(adrs);
                  }}
                  className="bg-green-200 rounded p-1 hover:bg-green-500 hover:text-white"
                >
                  <FaEdit size={20} />
                </button>
                <button onClick={()=>handleDisableAddress(adrs._id)} className="bg-red-200 rounded p-1 hover:bg-red-500 hover:text-white">
                  <MdDelete size={20} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {openAddress && <AddAddress close={() => setOpenAddress(false)} />}
        {
          openEditAddress &&(
            <EditAddressDetails close={()=>setOpenEditAddress(false)} data={editData}/>
          )
        }
    </div>
  );
};

export default Address;



