import React from "react";
import { useForm } from "react-hook-form";
import { AxiosToastError } from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";
import { useGlobalContext } from "../provider/GlobalProvider";

const AddAddress = ({close}) => {
  const { register, handleSubmit, reset } = useForm();
  const {fetchAddress} =useGlobalContext()
  const onSubmit = async (data) => {
    // console.log(data);
    try {
      const response = await Axios({
        ...SummaryApi.createAddress,
        data: {
          address_line: data.addressline,
          city: data.city,
          state: data.state,
          pincode: data.pincode,
          country: data.country,
          mobile: data.mobile,
        },
      });
      const { data: responseData } = response;
      if(responseData.success){
        toast.success(responseData.message)
        if(close){
          close()
          reset()
          fetchAddress()
        }
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };
  return (
    <section className="fixed top-0 bottom-0 left-0 right-0 bg-neutral-800 bg-opacity-70 z-50 overflow-auto">
      <div className="bg-white p-4 rounded mx-auto w-full max-w-lg mt-8">
        <div className="flex items-center justify-between gap-4">
        <h3 className="font-semibold">Add Address</h3>
        <button className="hover:text-red-500">
          <IoClose size={25} onClick={close}/>
        </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 grid gap-4">
          <div className="grid gap-1">
            <label htmlFor="addressline">Address Line: </label>
            <input
              type="text"
              id="addressline"
              className="border bg-blue-50 p-1"
              {...register("addressline", { required: "Address is required" })}
            />
          </div>
          <div className="grid gap-1">
            <label htmlFor="city">City: </label>
            <input
              type="text"
              id="city"
              className="border bg-blue-50 p-1"
              {...register("city", { required: "City is required" })}
            />
          </div>
          <div className="grid gap-1">
            <label htmlFor="state">State: </label>
            <input
              type="text"
              id="state"
              className="border bg-blue-50 p-1"
              {...register("state", { required: "State is required" })}
            />
          </div>
          <div className="grid gap-1">
            <label htmlFor="pincode">Pincode: </label>
            <input
              type="text"
              id="pincode"
              className="border bg-blue-50 p-1"
              {...register("pincode", { required: "Pincode is required" })}
            />
          </div>
          <div className="grid gap-1">
            <label htmlFor="country">Country: </label>
            <input
              type="text"
              id="country"
              className="border bg-blue-50 p-1"
              {...register("country", { required: "Country is required" })}
            />
          </div>
          <div className="grid gap-1">
            <label htmlFor="mobile">Mobile: </label>
            <input
              type="text"
              id="mobile"
              className="border bg-blue-50 p-1"
              {...register("mobile", { required: "Mobile is required" })}
            />
          </div>
          <button
            type="submit"
            className="bg-primary-200 hover:bg-primary-100 py-2 px-4 w-full font-semibold mt-4"
          >
            Submit
          </button>
        </form>
      </div>
    </section>
  );
};

export default AddAddress;
