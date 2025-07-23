import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { AxiosToastError } from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { FaAngleLeft } from "react-icons/fa6";
import { FaAngleRight } from "react-icons/fa6";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import Divider from "../components/Divider";
import minuteDdelivery from "../assets/minute_delivery.png";
import BestPricesOffers from "../assets/Best_Prices_Offers.png";
import WideAssortment from "../assets/Wide_Assortment.png";
import EssentialsNearby from "../assets/EssentialsNearby.jpg";
import { PriceAfterDiscount } from "../utils/PriceAfterDiscount";
import AddToCartButton from "../components/AddToCartButton";

const ProductDisplayPage = () => {
  const params = useParams();
  const productId = params.product.split("-")?.slice(-1)[0];
  const [data, setData] = useState({
    name: "",
    image: [],
  });
  const [loading, setLoading] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const imageContainer = useRef();

  // console.log(productId)

  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      const response = await Axios({
        ...SummaryApi.getProductDetails,
        data: {
          productId: productId,
        },
      });
      const { data: responseData } = response;
      if (responseData.success) {
        setData(responseData.data);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProductDetails();
  }, [params]);

  const handleScrollRight = () => {
    imageContainer.current.scrollLeft += 100;
  };
  const handleScrollLeft = () => {
    imageContainer.current.scrollLeft -= 100;
  };

  console.log(data);
  return (
    <section className="container mx-auto p-4 grid lg:grid-cols-3 ">
      {/* Left portion */}
      <div className=" grid gap-2">
        <div className="bg-white lg:min-h-[66vh] lg:max-h-[66vh] rounded min-h-52 max-h-52 h-full w-full">
          <img
            src={data.image[activeImageIndex]}
            alt="image"
            className="h-full w-full object-scale-down p-4"
          />
        </div>
        <div className="grid gap-4">
          <div className="flex items-center justify-center gap-3">
            {data.image.map((img, index) => {
              return (
                <div
                  key={img + index + "point"}
                  className={`w-3 h-3 lg:w-5 lg:h-5 rounded-full ${
                    index === activeImageIndex ? "bg-slate-300" : "bg-slate-200"
                  }`}
                ></div>
              );
            })}
          </div>
          <div className="grid relative">
            <div
              ref={imageContainer}
              className="flex gap-3 w-full overflow-x-auto scrollbar-hide relative z-10"
            >
              {data.image.map((img, index) => {
                return (
                  <div
                    key={img + index}
                    className="w-24 h-24 min-h-20 min-w-20 shadow-md cursor-pointer"
                  >
                    <img
                      src={img}
                      alt="mini-product"
                      className="h-full w-full object-scale-down"
                      onClick={() => setActiveImageIndex(index)}
                    />
                  </div>
                );
              })}
            </div>
            <div className="absolute w-full h-full hidden lg:flex justify-between items-center">
              <button
                onClick={handleScrollLeft}
                className="z-10 bg-white p-2 rounded-full relative shadow-lg"
              >
                <FaAngleLeft />
              </button>
              <button
                onClick={handleScrollRight}
                className="z-10 bg-white p-2 rounded-full relative shadow-lg"
              >
                <FaAngleRight />
              </button>
            </div>
          </div>
        </div>
        <div className="my-4 hidden lg:grid gap-3">
          <div>
            <p className="font-semibold">Description</p>
            <p className="text-base">{data.description}</p>
          </div>
          <div>
            <p className="font-semibold">Unit</p>
            <p className="text-base">{data.unit}</p>
          </div>
          {data?.more_details &&
            Object.keys(data?.more_details).map((element, index) => {
              return (
                <div className="" key={index + "displayproductdescp"}>
                  <p className="font-semibold">{element}</p>
                  <p className="text-base">{data?.more_details[element]}</p>
                </div>
              );
            })}
        </div>
      </div>
      {/* Right portion */}
      <div className="p-4 lg:pl-7 lg:text-lg lg:col-span-2">
        <p className="bg-green-200 w-fit px-2 rounded-full">10 min</p>
        <h2 className="text-lg font-semibold lg:text-3xl">{data.name}</h2>
        <p className="">{data.unit}</p>
        <Divider />
        <div>
          <p className="">Price: </p>
          <div className="flex items-center gap-2 lg:gap-3">
            <div className="border border-green-600 bg-green-50 w-fit px-4 py-2">
              <p className="font-semibold text-lg lg:text-xl">
                {DisplayPriceInRupees(
                  PriceAfterDiscount(data.price, data.discount)
                )}
              </p>
            </div>
            {data.discount && (
              <p className="line-through">{DisplayPriceInRupees(data.price)}</p>
            )}
            {Boolean(data.discount) && (
              <p className="font-bold text-green-600 lg:text-2xl">
                {data.discount}%{" "}
                <span className="text-base text-neutral-500">Discount</span>
              </p>
            )}
          </div>
        </div>
        {data.stock === 0 ? (
          <p className="text-lg text-red-500">Out of Stock</p>
        ) : (
          // <button className="my-4 bg-green-600 hover:bg-green-700 px-4 py-1 text-white">
          //   Add
          // </button>
          <div className="my-4">
            <AddToCartButton data={data} />
          </div>
        )}
        <h2 className="font-semibold">Why shop from CityShop?</h2>
        <div>
          <div className="flex items-center gap-4 my-4">
            <img
              src={minuteDdelivery}
              alt="Fastest delivery"
              className="w-20 h-20"
            />
            <div className="">
              <div className="font-semibold">Superfast delivery</div>
              <p>
                Get your order delivered to your doorstep at the earliest from
                dark stores near you
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 my-4">
            <img
              src={BestPricesOffers}
              alt="Best prices offers"
              className="w-20 h-20"
            />
            <div className="">
              <div className="font-semibold">Best Proces & Offers</div>
              <p>
                Best price destination with offers directly from the
                manufactures
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 my-4">
            <img
              src={WideAssortment}
              alt="Wide Assortment"
              className="w-20 h-20"
            />
            <div className="">
              <div className="font-semibold">Wide Assortment</div>
              <p>
                Choose from 5000+ products across food, personal care, household
                & other categories
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 my-4">
            <img
              src={EssentialsNearby}
              alt="One-Stop"
              className="w-20 h-20 rounded-full"
            />
            <div className="">
              <div className="font-semibold">One-Stop Urban Shopping</div>
              <p>
                From groceries to gadgets, discover everything you need from
                trusted local outlets in your city.
              </p>
            </div>
          </div>
        </div>
        {/* Only for mobile */}
                <div className="my-4 grid lg:hidden gap-3">
          <div>
            <p className="font-semibold">Description</p>
            <p className="text-base">{data.description}</p>
          </div>
          <div>
            <p className="font-semibold">Unit</p>
            <p className="text-base">{data.unit}</p>
          </div>
          {data?.more_details &&
            Object.keys(data?.more_details).map((element, index) => {
              return (
                <div className="" key={index + "displayproductdescp"}>
                  <p className="font-semibold">{element}</p>
                  <p className="text-base">{data?.more_details[element]}</p>
                </div>
              );
            })}
        </div>
      </div>
    </section>
  );
};

export default ProductDisplayPage;
