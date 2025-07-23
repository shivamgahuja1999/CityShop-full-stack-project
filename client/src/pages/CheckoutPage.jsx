import React, { useState } from "react";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import { useGlobalContext } from "../provider/GlobalProvider";
import Divider from "../components/Divider";
import AddAddress from "../components/AddAddress";
import { useSelector } from "react-redux";
import { AxiosToastError } from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";

const CheckoutPage = () => {
  const {
    totalPrice,
    totalQty,
    totalPriceBeforeDiscount,
    fetchCartItem,
    fetchOrders,
  } = useGlobalContext();
  const [openAddress, setOpenAddress] = useState(false);
  const addressList = useSelector((state) => state.addresses.addressList);
  // console.log("addressList",addressList)
  const [selectedAddress, setSelectedAddress] = useState(0);
  // console.log(addressList[selectedAddress]);
  const cartItemList = useSelector((state) => state.cartItem.cart);
  const navigate = useNavigate();

  const handleCashOnDelivery = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.cashOnDeliveryOrder,
        data: {
          listOfItems: cartItemList,
          subTotalAmount: totalPrice,
          totalAmount: totalPrice,
          addressId: addressList[selectedAddress]?._id,
        },
      });
      const { data: responseData } = response;
      if (responseData.success) {
        toast.success(responseData.message);
        if (fetchCartItem) {
          fetchCartItem();
        }
        if (fetchOrders) {
          fetchOrders();
        }
        navigate("/success", {
          state: {
            text: "Order",
          },
        });
      }
      // else{
      //   navigate("/cancel")
      // }
    } catch (error) {
      AxiosToastError(error);
      navigate("/cancel");
    }
  };

  const handleOnlinePayment = async () => {
    try {
      toast.loading("Loading...");
      const stripePublicKey = import.meta.env.VITE_SOME_KEY;
      const stripePromise = await loadStripe(stripePublicKey);
      const response = await Axios({
        ...SummaryApi.payment_url,
        data: {
          listOfItems: cartItemList,
          subTotalAmount: totalPrice,
          totalAmount: totalPrice,
          addressId: addressList[selectedAddress]?._id,
        },
      });
      const { data: responseData } = response;
      stripePromise.redirectToCheckout({ sessionId: responseData.id });
      if (fetchCartItem) {
        fetchCartItem();
      }
      if (fetchOrders) {
        fetchOrders();
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <section className="bg-blue-50">
      <div className="container mx-auto p-4 w-full flex flex-col lg:flex-row justify-center gap-5">
        <div className="w-full ">
          {/* Address */}
          <h3 className="font-semibold text-lg">Choose you address</h3>
          <div className="bg-white p-2 grid gap-4">
            {addressList.map((adrs, index) => {
              return (
                <label
                  key={adrs._id + index + "addresslist"}
                  htmlFor={`address` + index}
                  className={`${!adrs.status && "hidden"}`}
                >
                  <div className="border rounded p-3 flex gap-3 hover:bg-blue-50">
                    <div>
                      <input
                        id={`address` + index}
                        type="radio"
                        name="address"
                        value={index}
                        onChange={(e) => setSelectedAddress(e.target.value)}
                      />
                    </div>
                    <div>
                      <p>{adrs.address_line}</p>
                      <p>{adrs.city}</p>
                      <p>
                        {adrs.city} - {adrs.pincode}
                      </p>
                      <p>{adrs.state}</p>
                      <p>{adrs.mobile}</p>
                    </div>
                  </div>
                </label>
              );
            })}
            <div
              onClick={() => setOpenAddress(true)}
              className="bg-blue-50 border-2 h-14 border-dashed flex justify-center items-center cursor-pointer"
            >
              Add address
            </div>
          </div>
        </div>

        <div className="w-full lg:w-3/5 bg-white py-4 px-2">
          {/* Billing Summary */}
          <h3 className="font-semibold text-lg">Summary</h3>
          <div className="bg-white p-4">
            <div className="flex gap-4 ml-1 justify-between">
              <p>Items total</p>
              <p className="flex items-center gap-2">
                <span className="line-through">
                  {DisplayPriceInRupees(totalPriceBeforeDiscount)}
                </span>
                {DisplayPriceInRupees(totalPrice)}
              </p>
            </div>
            <div className="flex gap-4 ml-1 justify-between">
              <p>Quantity total</p>
              <p className="flex items-center gap-2">{totalQty}</p>
            </div>
            <div className="flex gap-4 ml-1 justify-between">
              <p>Delivery Charge</p>
              <p className="flex items-center gap-2">Free</p>
            </div>
            <div>
              <Divider />
            </div>
            <div className="font-semibold flex items-center justify-between">
              <p>Grand Total</p>
              <p>{DisplayPriceInRupees(totalPrice)}</p>
            </div>
          </div>
          <div className="w-full flex flex-col gap-4">
            <button
              onClick={() => handleOnlinePayment()}
              className="bg-green-600 hover:bg-green-500 py-2 px-4 rounded text-white"
            >
              Online Payment
            </button>
            <button
              onClick={() => handleCashOnDelivery()}
              className="border-2 border-green-600 text-green-700 font-semibold hover:bg-green-600 hover:text-white py-2 px-4 rounded"
            >
              Cash On delivery
            </button>
          </div>
        </div>
      </div>
      {openAddress && <AddAddress close={() => setOpenAddress(false)} />}
    </section>
  );
};

export default CheckoutPage;
