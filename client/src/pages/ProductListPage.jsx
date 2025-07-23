import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { AxiosToastError } from "../utils/AxiosToastError";
import Loading from "../components/Loading";
import CardProduct from "../components/CardProduct";
import { useSelector } from "react-redux";
import { validURLConvert } from "../utils/validURLConvert";

const ProductListPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const params = useParams();
  const AllSubCategory = useSelector((state) => state.product.allSubCategory);
  const [displaySubCategory, setDisplaySubCategory] = useState([]);

  // console.log("AllSubCategory",AllSubCategory)

  const subCategoryLength = params?.subCategory?.split("-");
  const subCategoryName = subCategoryLength
    ?.slice(0, subCategoryLength?.length - 1)
    .join(" ");
  // console.log("subcategory name",subCategoryName)

  const categoryId = params.category.split("-").slice(-1)[0];
  const subCategoryId = params.subCategory.split("-").slice(-1)[0];
  // console.log("categoryid",categoryId)
  const fetchProductData = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getProductByCategoryAndSubCategory,
        data: {
          categoryId: categoryId,
          subCategoryId: subCategoryId,
          page: page,
          limit: 12,
        },
      });
      const { data: responseData } = response;
      if (responseData.success) {
        if (responseData.page == 1) {
          setData(responseData.data);
        } else {
          setData([...prev, ...responseData.data]);
        }
        // console.log("Product list page data",responseData)
        setTotalPage(responseData.totalCount);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProductData();
  }, [params]);

  useEffect(() => {
    const sub = AllSubCategory.filter((s) => {
      const filterData = s.category.some((elem) => {
        return elem._id == categoryId;
      });
      // console.log("sub",s)
      return filterData ? filterData : null;
    });
    setDisplaySubCategory(sub);
    // console.log("sub",sub)
  }, [params, AllSubCategory]);

  // console.log(data);

  return (
    <section className="sticky top-36 lg:top-20">
      <div className="container sticky top-36 mx-auto px-4 grid grid-cols-[90px,1fr] md:grid-cols-[200px,1fr] lg:grid-cols-[280px,1fr]">
        {/* Sub Category */}
        <div to className=" min-h-[68vh] lg:max-h-[80vh] overflow-y-scroll scrollbarCustom lg:py-4 lg:min-h-[80vh] p-2 grid gap-1 shadow-md bg-white py-2">
          {displaySubCategory.map((s, index) => {
            const link=`/${validURLConvert(s.category[0].name)}-${s.category[0]._id}/${validURLConvert(
      s.name
    )}-${s._id}`;
            return (
              <Link to={link}
                key={s._id+"subCategoryDisplay"+index}
                className={`w-full lg:flex items-center lg:h-20 box-border lg:gap-2 border-b-2 hover:bg-green-100 cursor-pointer
                ${subCategoryId == s._id ? "bg-green-100" : ""}`}
              >
                <div className="w-fit max-w-28 rounded mx-auto lg:mx-0 box-border">
                  <img
                    src={s.image}
                    alt={s.name}
                    className="w-14 h-full lg:h-14 lg:w-12 object-scale-down"
                  />
                </div>
                <p className="text-xs -mt-1 text-center lg:text-left lg:text-base lg:mt-0">
                  {s.name}
                </p>
              </Link>
            );
          })}
        </div>
        {/* Product */}
        <div className="sticky top-14">
          <div className="bg-white shadow-md p-4">
            <h3 className="font-semibold">{subCategoryName}</h3>
          </div>
          <div>
            <div className="min-h-[70vh] max-h-[70vh] overflow-auto relative">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 p-4 gap-4">
              {data.map((p, index) => {
                return (
                  <CardProduct
                    key={p._id + "productSubCategory" + index}
                    data={p}
                  />
                );
              })}
            </div>
            </div>
            {loading && <Loading />}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductListPage;
