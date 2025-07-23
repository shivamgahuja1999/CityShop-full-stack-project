import React, { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { Link, redirect, useLocation, useNavigate } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";
import { FaArrowLeft } from "react-icons/fa";
import { useMobile } from "../hooks/useMobile";

const Search = () => {
  const navigate = useNavigate();
  const redirectToSearchPage = () => {
    navigate("/search");
  };
  const location = useLocation();
  const [isSearchPage, setIsSearchPage] = useState(false);
  const [isMobile] = useMobile();
  useEffect(() => {
    const isSearch = location.pathname === "/search";
    setIsSearchPage(isSearch);
  }, [location]);
  // console.log("search", isSearchPage);
  const params=useLocation()
  const searchText=params.search.slice(3)

  const handleOnChange=(e)=>{
    const value=e.target.value
    const url=`/search?q=${value}`
    navigate(url)
  }
  return (
    <div className="w-full min-w-[300px] lg:min-w-[420px] h-11 lg:h-12 rounded-lg border overflow-hidden flex items-center text-neutral-500 bg-slate-50 group focus-within:border-primary-200">
      <div>
        {isMobile && isSearchPage ? (
          <Link to={"/"} className="flex justify-center items-center text-neutral-500 h-full p-2 m-1 group-focus-within:text-primary-200 bg-white rounded-full shadow-md">
            <FaArrowLeft size={20} />
          </Link>
        ) : (
          <button className="flex justify-center items-center text-neutral-500 h-full p-3 group-focus-within:text-primary-200">
            <IoSearch size={22} />
          </button>
        )}
      </div>

      <div className="w-full h-full">
        {!isSearchPage ? (
          // not in search page
          <div
            onClick={redirectToSearchPage}
            className="w-full h-full flex items-center"
          >
            <TypeAnimation
              sequence={[
                'Search "milk"',
                1000, // wait 1s before replacing "Mice" with "Hamsters"
                'Search "bread"',
                1000,
                'Search "personal care products"',
                1000,
                'Search "Fashion & Accessories"',
                1000,
                'Search "vegetables"',
                1000,
                'Search "munchies"',
                1000,
                'Search "Cold Drinks & Juices"',
                1000,
                'Search "Instant & Frozen Food"',
                1000,
                'Search "Baby Care"',
                1000,
                'Search "Home & Office"',
                1000,
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
            />
          </div>
        ) : (
          <div className="w-full h-full">
            <input
              type="text"
              placeholder="Search for baby care and more.."
              autoFocus
              defaultValue={searchText}
              className="bg bg-transparent outline-none w-full h-full"
              onChange={handleOnChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
