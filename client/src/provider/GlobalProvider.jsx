import { Children, createContext, useContext, useEffect } from "react";
import SummaryApi from "../common/SummaryApi";
import Axios from "../utils/Axios";
import { useDispatch, useSelector } from "react-redux";
import { handleAddItemToCart } from "../store/cartProductSlice";
import { AxiosToastError } from "../utils/AxiosToastError";
import toast from "react-hot-toast";
import { useState } from "react";
import { PriceAfterDiscount } from "../utils/PriceAfterDiscount";
import { handleAddAddress } from "../store/addressSlice";
import { setOrder } from "../store/orderSlice";
// import {PriceAfterDiscount} from "../utils/DisplayPriceInRupees.js"

export const GlobalContext = createContext(null);
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const cartItem=useSelector((state)=>state.cartItem.cart)
  const [totalPriceBeforeDiscount,setTotalPriceBeforeDiscount]=useState(0)
  const [totalPrice,setTotalPrice]=useState(0);
  const [totalQty,setTotalQty]=useState(0)
  const dispatch = useDispatch();
  const user=useSelector(state=>state.user)

  const fetchCartItem = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getCartItem,
      });
      const { data: responseData } = response;
      if (responseData.success) {
        dispatch(handleAddItemToCart(responseData.data));
        // console.log("App.jsx cart item ", responseData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateCartItem = async (id, qty) => {
    try {
      const response = await Axios({
        ...SummaryApi.updateCartItemQuantity,
        data: {
          _id: id,
          quantity: qty,
        },
      });
      const { data: responseData } = response;
      if (responseData.success) {
        // toast.success(responseData.message);
        fetchCartItem();
        return responseData
      }
    } catch (error) {
      AxiosToastError(error);
      return error
    }
  };

  const deleteCartItem=async(cartId)=>{
    try {
      const response=await Axios({
        ...SummaryApi.deleteCartItem,
        data:{
          _id:cartId
        }
      })
      const {data:responseData}=response
      if(responseData.success){
        toast.success(responseData.message)
        fetchCartItem()
      }
    } catch (error) {
      
    }
  }

  const handleLogout=()=>{
    localStorage.clear()
    dispatch(handleAddItemToCart([]))
  }

  const fetchAddress=async()=>{
    try {
      const response=await Axios({
        ...SummaryApi.getAddress
      })
      const {data:responseData}=response
      if(responseData.success){
        dispatch(handleAddAddress(responseData.data))
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  const fetchOrders=async()=>{
    try {
      const response=await Axios({
        ...SummaryApi.getOrderItems
      })
      const {data:responseData}=response
      if(responseData.success){
        dispatch(setOrder(responseData.data))
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchCartItem()
    handleLogout()
    fetchAddress()
    fetchOrders()
  }, [user]);

  // Total item and total price
  useEffect(()=>{
    const totaQty=cartItem.reduce((prev,curr)=>{
      return prev+curr.quantity
    },0)
    const totalPrice=cartItem.reduce((prev,curr)=>{
      const {price,discount} =curr.productId
      const discountedPice=PriceAfterDiscount(price,discount)
      return prev+(discountedPice * curr.quantity)
    },0)
    setTotalQty(totaQty)
    setTotalPrice(totalPrice)
    const priceBeforeDiscount=cartItem.reduce((prev,curr)=>{
      return prev+(curr?.productId?.price *curr.quantity)
    },0)
    setTotalPriceBeforeDiscount(priceBeforeDiscount)
  },[cartItem])
  return (
    <GlobalContext.Provider value={{ fetchCartItem, updateCartItem ,deleteCartItem,totalPrice,totalQty,totalPriceBeforeDiscount,fetchAddress,fetchOrders}}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
