import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AxiosToastError } from "../utils/AxiosToastError.js";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import CardLoading from "./CardLoading.jsx";
import CardProduct from "./CardProduct.jsx";
import { FaAngleLeft } from "react-icons/fa6";
import { FaAngleRight } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { validURLConvert } from "../utils/validURLConvert.js";

const CategoryWiseProductDisplay = ({ id, name }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef();
  const categoryData = useSelector((state) => state.product.allCategory);
  const subCategoryData = useSelector((state) => state.product.allSubCategory);

  const fetchCategoryWiseProduct = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getProductByCategory,
        data: {
          id: id,
        },
      });
      const { data: responseData } = response;
      if (responseData.success) {
        setData(responseData.data);
      }
      console.log(responseData);
    } catch (error) {
      AxiosToastError(error);
      // console.log(error)
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCategoryWiseProduct();
  }, []);

  const handleScrollRight = () => {
    containerRef.current.scrollBy({ left: 400, behavior: "smooth" });
  };

  const handleScrollLeft = () => {
    containerRef.current.scrollBy({ left: -400, behavior: "smooth" });
  };

  const loadingCardNumber = new Array(6).fill(null);

  const handleRedirectProductListPage = () => {
    // console.log(name,id)
    const subCategory = subCategoryData.find((sub) => {
      const filterData = sub.category.some((c) => {
        return c._id == id;
      });
      return filterData ? true : null;
    });
    const url = `/${validURLConvert(name)}-${id}/${validURLConvert(
      subCategory?.name
    )}-${subCategory?._id}`;
    return url;
  };
  const redirectURL=handleRedirectProductListPage()
  return (
    <div>
      <div className="container mx-auto p-4 flex items-center justify-between gap-4">
        <h3 className="font-semibold text-lg md:text-xl">{name}</h3>
        <Link
          to={redirectURL}
          className="text-green-800 hover:text-green-400"
        >
          See All
        </Link>
      </div>
      <div className="relative flex items-center">
        <div
          className="flex gap-4 md:gap-6 lg:gap-9 container mx-auto px-4 py-4 lg:overflow-hidden overflow-x-auto scrollbar-hide"
          ref={containerRef}
        >
          {loading &&
            loadingCardNumber.map((_, index) => {
              return (
                <CardLoading key={"categorywiseproductdisplay12" + index} />
              );
            })}
          {data.map((p, index) => {
            return (
              <CardProduct
                key={p._id + "categorywiseproductdisplay" + index}
                data={p}
              />
            );
          })}
        </div>
        <div className="w-full mx-auto container px-2 left-0 right-0 hidden lg:flex absolute justify-between">
          <button
            onClick={handleScrollLeft}
            className="z-10 relative bg-white hover:bg-gray-200 shadow-lg rounded-full p-3"
          >
            <FaAngleLeft size={20} />
          </button>
          <button
            onClick={handleScrollRight}
            className="z-10 relative bg-white hover:bg-gray-200 shadow-lg rounded-full p-3"
          >
            <FaAngleRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryWiseProductDisplay;
