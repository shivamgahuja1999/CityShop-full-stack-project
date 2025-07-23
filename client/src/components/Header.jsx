import React, { useEffect, useState } from "react";
import logo from "../assets/cityshoplogo.png";
import Search from "./Search";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaRegCircleUser } from "react-icons/fa6";
import { useMobile } from "../hooks/useMobile";
import { BsCart4 } from "react-icons/bs";
import { FaAngleDoubleDown, FaAngleDoubleUp } from "react-icons/fa";
import { useSelector } from "react-redux";
import UserMenu from "./UserMenu";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import { useGlobalContext } from "../provider/GlobalProvider";
import DisplayCartItem from "./DisplayCartItem";

const Header = () => {
  const [isMobile] = useMobile();
  const location = useLocation();
  const isSearchPage = location.pathname === "/search";
  const navigate = useNavigate();

  const user = useSelector((state) => state?.user);
  // console.log("user from store", user); 
  const [openUserMenu, setOpenUserMenu] = useState(false);

  const cartItem=useSelector((state)=>state.cartItem.cart)
  // console.log("cartitem",cartItem)
  // const [totalPrice,setTotalPrice]=useState(0);
  // const [totalQty,setTotalQty]=useState(0)
  const {totalPrice,totalQty}=useGlobalContext()
  const [openCartSection,setOpenCartSection]=useState(false)

  const redirectToLoginPage = () => {
    navigate("/login");
  };
  const handleCloseUserMenu=()=>{
    setOpenUserMenu(false);
  }
  const handleMobileUser=()=>{
    if(!user._id){
      navigate('/login')
      return
    }
    navigate('/user-menu');
  }
  // Total item and total price
  // useEffect(()=>{
  //   const totaQty=cartItem.reduce((prev,curr)=>{
  //     return prev+curr.quantity
  //   },0)
  //   const totalPrice=cartItem.reduce((prev,curr)=>{
  //     return prev+(curr.productId.price * curr.quantity)
  //   },0)
  //   setTotalQty(totaQty)
  //   setTotalPrice(totalPrice)
  // },[cartItem])
  return (
    <header className="h-36 lg:h-20 lg:shadow-md sticky z-30 top-0 flex flex-col justify-center bg-white">
      {!(isSearchPage && isMobile) && (
        <div className="container mx-auto flex justify-between items-center px-2">
          {/* Logo */}
          <div className="">
            <Link to={"/"} className="flex items-center">
              <img
                src={logo}
                alt="logo"
                width={150}
                height={30}
                className="hidden lg:block"
              />
              <img
                src={logo}
                alt="logo"
                width={110}
                height={30}
                className="lg:hidden"
              />
            </Link>
          </div>

          {/* Search */}
          <div className="">
            <div className="hidden lg:block">
              <Search />
            </div>
          </div>

          {/* login and my Cart */}
          <div className="">
            {/* User icon display only on mobile version */}

            <button className="text-neutral-600 pr-4 lg:hidden" onClick={handleMobileUser}>
              <FaRegCircleUser size={27} />
            </button>
            {/* Desktop */}
            <div className="hidden lg:flex pr-10 items-center gap-10">
              {user?._id ? (
                <div className="relative">
                  <div
                    className="flex flex-row gap-1 items-center select-none"
                    onClick={() => setOpenUserMenu((prev) => !prev)}
                  >
                    <p>Account</p>
                    {openUserMenu ? (
                      <FaAngleDoubleUp size={20} />
                    ) : (
                      <FaAngleDoubleDown size={20} />
                    )}
                  </div>
                  {openUserMenu && (
                    <div className="absolute right-0 top-16">
                      <div className="bg-white rounded p-4 min-w-52 lg:shadow-lg">
                        <UserMenu close={handleCloseUserMenu} />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button onClick={redirectToLoginPage} className="text-lg px-2">
                  Login
                </button>
              )}
              <button onClick={()=>setOpenCartSection(true)} className="flex items-center gap-2 bg-green-700 hover:bg-green-800 px-3 py-2 rounded text-white">
                {/* Add Cart icon */}
                <div className="animate-bounce">
                  <BsCart4 size={33} />
                </div>
                <div className="font-semibold text-sm">
                  {
                    cartItem.length >0 ?(
                      <div>
                        <p>{totalQty} items</p>
                        <p>{DisplayPriceInRupees(totalPrice)}</p>
                      </div>
                    ):(
                      <p>My cart</p>
                    )
                  }   
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-2 pb-2 lg:hidden">
        <Search />
      </div>
      {
        openCartSection &&(
          <DisplayCartItem close={()=>setOpenCartSection(false)}/>
        )
      }
    </header>
  );
};

export default Header;
