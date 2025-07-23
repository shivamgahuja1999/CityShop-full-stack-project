import React from "react";
import banner from "../assets/banner.jpg";
import mobileBanner from "../assets/banner-mobile.jpg";
import { useSelector } from "react-redux";
import { validURLConvert } from "../utils/validURLConvert";
import { Link, useNavigate } from "react-router-dom";
import CategoryWiseProductDisplay from "../components/CategoryWiseProductDisplay";

const Home = () => {
  const navigate = useNavigate();
  const loadingCategory = useSelector((state) => state.product.loadingCategory);
  const categoryData = useSelector((state) => state.product.allCategory);
  const subCategoryData = useSelector((state) => state.product.allSubCategory);

  const handleRedirectProductListPage = (id, cat) => {
    // console.log(id, cat);
    const subCategory = subCategoryData.find((sub) => {
      const filterData = sub.category.some((c) => {
        return c._id == id;
      });
      return filterData ? true : null;
    });
    const url = `/${validURLConvert(cat)}-${id}/${validURLConvert(
      subCategory.name
    )}-${subCategory._id}`;
    navigate(url);
    //  console.log(url)
  };

  return (
    <section className="bg-white">
      <div className="\container mx-auto">
        <div
          className={`h-full w-full min-h-48 bg-green-100 rounded ${
            !banner && "animate-pulse"
          }`}
        >
          <img
            src={banner}
            alt="banner"
            className="w-full h-52 hidden lg:block"
          />

          <img
            src={mobileBanner}
            alt="banner"
            className="w-full h-full md:h-80 lg:hidden"
          />
        </div>

        {/* Display category part */}
        <div className="container mx-auto px-5 my-2 grid grid-cols-5 md:grid-cols-7 lg:grid-cols-10 gap-4">
          {loadingCategory
            ? new Array(10).fill(null).map((cat, index) => {
                return (
                  <div
                    key={index + "loadingcategory"}
                    className="bg-white rounded py-4 min-h-36 grid gap-2 shadow animate-pulse"
                  >
                    <div className="bg-blue-100 min-h-24 rounded"></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-100 h-8 rounded"></div>
                      <div className="bg-blue-100 h-8 rounded"></div>
                    </div>
                  </div>
                );
              })
            : categoryData.map((cat, index) => {
                return (
                  <div
                    key={cat._id + "displaycategory"}
                    className=""
                    onClick={() =>
                      handleRedirectProductListPage(cat._id, cat.name)
                    }
                  >
                    <div>
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-full h-full object-scale-down"
                      />
                    </div>
                  </div>
                );
              })}
        </div>
        {/* Category wise product */}
        {
          categoryData.map((c,index)=>{
            return(
              <CategoryWiseProductDisplay key={c?._id+"categoryWiseProduct"} id={c._id} name={c.name}/>
            )
          })
        }
      </div>
    </section>
  );
};

export default Home;
