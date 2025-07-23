import React from "react";
import { useGlobalContext } from "../provider/GlobalProvider";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { AxiosToastError } from "../utils/AxiosToastError";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";
import { FaMinus } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";

const AddToCartButton = ({ data }) => {
  const { fetchCartItem, updateCartItem, deleteCartItem } = useGlobalContext();
  const cartItem = useSelector((state) => state.cartItem.cart);
  //   console.log("Add to cart button",cartItem)
  const [isAvailableCart, setIsAvailableCart] = useState(false);
  const [qty, setQty] = useState(0);
  const [cartItemdetails, setCartItemDetails] = useState();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const response = await Axios({
        ...SummaryApi.addToCart,
        data: {
          productId: data?._id,
        },
      });
      const { data: responseData } = response;
      if (responseData.success) {
        if (fetchCartItem) {
          fetchCartItem();
        }
        toast.success(responseData.message);
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };
  useEffect(() => {
    const checkingItem = cartItem.some(
      (item) => item.productId._id === data._id
    );
    // console.log(checkingItem)
    setIsAvailableCart(checkingItem);

    const product = cartItem.find((item) => item.productId._id === data._id);
    setQty(product?.quantity);
    setCartItemDetails(product);
    // console.log("product",product)
  }, [data, cartItem]);

  const increaseQty = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const response = await updateCartItem(cartItemdetails?._id, qty + 1);
    if (response.success) {
      toast.success("Item added");
    }
  };
  const decreaseQty = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (qty === 1) {
      deleteCartItem(cartItemdetails?._id);
    } else {
      const response = await updateCartItem(cartItemdetails?._id, qty - 1);
      if (response.success) {
        toast.success("Item removed");
      }
    }
  };
  return (
    <div className="w-full max-w-[150px]">
      {isAvailableCart ? (
        <div className="flex w-full h-full">
          <button
            onClick={decreaseQty}
            className="px-1 bg-green-600 hover:bg-green-700 text-white w-full flex items-center justify-center flex-1"
          >
            <FaMinus />
          </button>
          <p className="w-full flex items-center justify-center flex-1 font-semibold px-1">
            {qty}
          </p>
          <button
            onClick={increaseQty}
            className="px-1 bg-green-600 hover:bg-green-700 text-white w-full flex items-center justify-center flex-1"
          >
            <FaPlus />
          </button>
        </div>
      ) : (
        <button
          onClick={handleAddToCart}
          className="bg-green-600 hover:bg-green-700 text-white lg:px-4 px-2 py-1 rounded"
        >
          Add
        </button>
      )}
    </div>
  );
};

export default AddToCartButton;
