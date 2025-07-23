import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { UploadImage } from "../utils/UploadImage";
import { AxiosToastError } from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const UploadSubCategoryModel = ({ close, fetchData }) => {
  const [subCategoryData, setSubCategoryData] = useState({
    name: "",
    image: "",
    category: [],
  });

  const allCategory = useSelector((state) => state.product.allCategory);
  // console.log("all category sub category page",allCategory)
  const handleSubmitSubCategory = async (e) => {
    e.preventDefault()
    try {
      const response=await Axios({
        ...SummaryApi.createSubCategory,
        data:subCategoryData
      })
      const {data:responseData}=response
      if(responseData.success){
        toast.success(responseData.message)
        if(close){
          close()
        }
        if(fetchData){
          fetchData()
        }
      }
    } catch (error) {
      AxiosToastError(error)
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSubCategoryData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };
  //   console.log("Sub category data",subCategoryData)

  const handleDeleteCategorySelected=(categoryId)=>{
    const index=subCategoryData.category.findIndex(e1=>e1._id ===categoryId)
    // console.log("index",index)
    subCategoryData.category.splice(index,1)
    setSubCategoryData((prev)=>{
      return{
        ...prev
      }
    })
  }

  const handleUploadSubCategoryImage = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    const response = await UploadImage(file);
    const { data: ImageResponse } = response;
    setSubCategoryData((prev) => {
      return {
        ...prev,
        image: ImageResponse.data.url,
      };
    });
  };
  // console.log("subCategoryData", subCategoryData);
  return (
    <section className="fixed top-0 bottom-0 left-0 right-0 bg-neutral-800 bg-opacity-70 flex items-center justify-center mt-20 z-40">
      <div className="bg-white max-w-4xl w-full p-4 rounded">
        <div className="flex items-center justify-between">
          <h1 className="font-semibold">Add Sub Category</h1>
          <button onClick={close} className="w-fit block ml-auto">
            <IoClose size={25} />
          </button>
        </div>
        <form action="" className="my-3 grid gap-2" onSubmit={handleSubmitSubCategory}>
          <div className="grid gap-1">
            <label id="subCategoryName" htmlFor="">
              Sub Category Name
            </label>
            <input
              type="text"
              id="subCategoryName"
              name="name"
              placeholder="Enter sub category"
              value={subCategoryData.name}
              onChange={handleChange}
              className="bg-blue-50 p-2 outline-none border border-blue-100 focus-within:border-primary-200 rounded"
            />
          </div>
          <div className="grid gap-1">
            <p>Image</p>
            <div className="flex gap-4 flex-col lg:flex-row items-center">
              <div className="border bg-blue-50 h-36 w-full lg:w-36 flex items-center justify-center">
                {subCategoryData.image ? (
                  <img
                    src={subCategoryData.image}
                    alt="sub category"
                    className="w-full h-full object-scale-down"
                  />
                ) : (
                  <p className="text-neutral-500 text-sm">No image</p>
                )}
              </div>
              <label htmlFor="uploadCategoryImage">
                <div
                  className={`${
                    !subCategoryData.name
                      ? "bg-gray-300"
                      : "border-primary-200 hover:bg-primary-200 font-medium"
                  } py-2 px-3 cursor-pointer border`}
                >
                  Upload image
                </div>
                <input
                  disabled={!subCategoryData.name}
                  onChange={handleUploadSubCategoryImage}
                  type="file"
                  id="uploadCategoryImage"
                  className="hidden"
                />
              </label>
            </div>
          </div>
          <div className="grid gap-1">
            <label htmlFor="">Select Category</label>
            <div className="border focus-within:border-primary-200 rounded">
              {/* Display values */}
              <div className="flex flex-wrap gap-2">
                {subCategoryData.category.map((cat, index) => {
                  return (
                    <p
                      key={cat._id + "selectedvalue"}
                      className="bg-white shadow-md px-1 m-1 flex items-center gap-2"
                    >
                      {cat.name}
                      <div className="cursor-pointer hover:text-red-600" onClick={()=>handleDeleteCategorySelected(cat._id)}>
                        <IoClose size={20} />
                      </div>
                    </p>
                  );
                })}
              </div>
              {/* Select Category */}
              <select
                className="w-full p-2 bg-transparent outline-none border"
                onChange={(e) => {
                  const value = e.target.value;
                  const categoryDetals = allCategory.find(
                    (e1) => e1._id == value
                  );
                  setSubCategoryData((prev) => {
                    return {
                      ...prev,
                      category: [...prev.category, categoryDetals],
                    };
                  });
                }}
              >
                <option value={""}>
                  Select Category
                </option>
                {allCategory.map((category, index) => {
                  return (
                    <option
                      value={category?._id}
                      key={category._id + "subcategory"}
                    >
                      {category.name}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <button
            className={`${
              subCategoryData?.name && subCategoryData?.image && subCategoryData?.category[0]
                ? "bg-primary-200 hover:bg-primary-100"
                : "bg-gray-300"
            } py-2 font-semibold mt-3`}
          >
            Add Sub Category
          </button>
        </form>
      </div>
    </section>
  );
};

export default UploadSubCategoryModel;
