import React from "react";
import { IoClose } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { useGlobalContext } from "../provider/GlobalProvider";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import { FaCaretRight } from "react-icons/fa6";
import { useSelector } from "react-redux";
import AddToCartButton from "./AddToCartButton";
import { PriceAfterDiscount } from "../utils/PriceAfterDiscount";
import emptyCart from "../assets/empty_cart.webp";
import Divider from "./Divider";
import toast from "react-hot-toast";

const DisplayCartItem = ({ close }) => {
  const { totalPriceBeforeDiscount, totalPrice, totalQty } = useGlobalContext();
  const cartItem = useSelector((state) => state.cartItem.cart);
  const user=useSelector(state=>state.user)
  const navigate=useNavigate()
  
const handleRedirectCheckoutPage=()=>{
    if(user._id){
        navigate("/checkout")
        if(close){
            close()
        }
        return
    }
    toast("Please login")
}
  return (
    <section className="fixed top-0 bottom-0 left-0 right-0 bg-neutral-800 bg-opacity-70 z-50">
      <div className="bg-white w-full max-w-sm min-h-screen max-h-screen ml-auto">
        <div className="flex items-center justify-between p-4 gap-3 shadow-md">
          <h2 className="font-semibold">Cart</h2>
          <Link to={"/"} className="lg:hidden">
            <IoClose size={25} />
          </Link>
          <button onClick={close} className="hidden lg:block">
            <IoClose size={25} />
          </button>
        </div>
        <div className="min-h-[75vh] lg:min-h-[80vh] max-h-[calc(100vh-150px)] bg-blue-50 p-2 flex flex-col gap-4">
          {/* Display items */}
          {cartItem[0] ? (
            <>
              <div className="flex items-center justify-between py-2 px-4 bg-blue-100 text-blue-500 rounded-full">
                <p>Your total savings</p>
                <p>
                  {DisplayPriceInRupees(totalPriceBeforeDiscount - totalPrice)}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg overflow-y-auto grid gap-3">
                {cartItem[0] &&
                  cartItem.map((item, index) => {
                    return (
                      <div
                        key={item?._id + index + "12"}
                        className="flex w-full gap-4"
                      >
                        <div className="w-16 h-16 min-h-16 min-w-16 border rounded">
                          <img
                            src={item?.productId?.image[0]}
                            alt="item-image"
                            className="object-scale-down"
                          />
                        </div>
                        <div className="w-full text-xs">
                          <p className="text-xs text-ellipsis line-clamp-2">
                            {item?.productId?.name}
                          </p>
                          <p className="text-slate-400">
                            {item?.productId?.unit}
                          </p>
                          <p className="font-semibold">
                            {DisplayPriceInRupees(
                              PriceAfterDiscount(
                                item?.productId?.price,
                                item?.productId?.discount
                              )
                            )}
                          </p>
                        </div>
                        <div>
                          <AddToCartButton data={item?.productId} />
                        </div>
                      </div>
                    );
                  })}
              </div>
              <div>
                <div className="flex gap-4 ml-1 justify-between">
                    <p>Items total</p>
                    <p className="flex items-center gap-2"><span className="line-through">{DisplayPriceInRupees(totalPriceBeforeDiscount)}</span>{DisplayPriceInRupees(totalPrice)}</p>
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
                    <Divider/>
                </div>
                <div className="font-semibold flex items-center justify-between">
                    <p>Grand Total</p>
                    <p>{DisplayPriceInRupees(totalPrice)}</p>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white flex flex-col items-center justify-center">
              <img
                src={emptyCart}
                className="w-full h-full object-scale-down"
              />
              <Link onClick={close} to={"/"}
              className="bg-green-600 text-white py-2 px-4">Shop now
              </Link>
            </div>
          )}
        </div>
        {cartItem[0] && (
          <div className="p-2">
            <div className="bg-green-700 text-neutral-100 font-bold text-base py-4 px-4 static bottom-3 rounded flex items-center gap-4 justify-between">
              <div>{DisplayPriceInRupees(totalPrice)}</div>
              <button onClick={handleRedirectCheckoutPage} className="flex items-center gap-1">
                Proceed
                <span>
                  <FaCaretRight size={20} />
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default DisplayCartItem;
