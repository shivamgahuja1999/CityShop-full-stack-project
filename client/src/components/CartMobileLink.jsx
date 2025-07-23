import React from "react";
import { useGlobalContext } from "../provider/GlobalProvider";
import { FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import { FaChevronCircleRight } from "react-icons/fa";
import { useSelector } from "react-redux";

const CartMobileLink = () => {
  const { totalPrice, totalQty } = useGlobalContext();
  const cartItem = useSelector((state) => state.cartItem.cart);
  return (
    <>
      {cartItem[0] && (
        <div className="p-2 sticky bottom-4">
          <div className="bg-green-700 px-2 py-1 rounded text-neutral-200 text-sm flex items-center justify-between lg:hidden">
            <div className="flex items-center gap-2">
              <div className="bg-green-600 p-2 rounded w-fit">
                <FaShoppingCart size={25} />
              </div>
              <div className="">
                <p>{totalQty} items</p>
                <p>{DisplayPriceInRupees(totalPrice)}</p>
              </div>
            </div>
            <Link to={"/cart"} className="flex items-center gap-1">
              <span className="text-sm font-semibold">View Cart</span>
              <FaChevronCircleRight/>
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default CartMobileLink;
