import React from "react";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import { Link } from "react-router-dom";
import { validURLConvert } from "../utils/validURLConvert";
import { PriceAfterDiscount } from "../utils/PriceAfterDiscount";
import { AxiosToastError } from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import { useGlobalContext } from "../provider/GlobalProvider";
import AddToCartButton from "./AddToCartButton";

const CardProduct = ({ data }) => {
  const url = `/product/${validURLConvert(data.name)}-${data._id}`;
  
  return (
    <Link
      to={url}
      className="border p-2 grid gap-1 lg:gap-3 min-w-36 lg:min-w-52 rounded cursor-pointer bg-white"
    >
      <div className="min-h-20 max-h-28 lg:max-h-32 rounded overflow-hidden">
        <img
          src={data.image[0]}
          alt={data.name}
          className="w-full h-full object-scale-down lg:scale-110"
        />
      </div>
      {/* 10 min */}
      <div className="flex items-center gap-1">
        <div className="bg-green-50 text-green-800 rounded text-xs w-fit p-[1px] px-2">
          10 min
        </div>
        <div>
          {Boolean(data.discount) && (
            <p className="text-green-600 bg-green-100 px-2 w-fit text-xs rounded-full">
              {data.discount}% discount
            </p>
          )}
        </div>
      </div>
      {/* Name */}
      <div className="px-2 font-medium text-ellipsis line-clamp-2">
        {data?.name}
      </div>
      {/* Unit */}
      <div className="px-2 w-fit font-medium text-sm lg:text-base">
        {data?.unit}
      </div>
      <div className="px-2 lg:px-0 flex items-center justify-between gap-1 lg:gap-3 text-sm lg:text-base">
        {/* Price */}
        <div className="font-semibold">{DisplayPriceInRupees(PriceAfterDiscount(data.price,data.discount))}</div>
        {/* Add to Cart */}
        <div className="">
          {data.stock === 0 ? (
            <p className="text-sm text-red-500 text-center">Out of Stock</p>
          ) : (
            <AddToCartButton data={data}/>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CardProduct;
