import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { UploadImage } from "../utils/UploadImage";
import { AxiosToastError } from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";

const UploadCategoryModel = ({ close, fetchData }) => {
  const [data, setData] = useState({
    name: "",
    image: "",
  });
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };
  const handleUploadCategoryImages = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    const response = await UploadImage(file);
    const { data: ImageResponse } = response;
    setData((prev) => {
      return {
        ...prev,
        image: ImageResponse.data.url,
      };
    });
    // console.log("upload image",response);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.addCategory,
        data: data,
      });
      const { data: responseData } = response;
      if (responseData.success) {
        toast.success(responseData.message);
        close();
        fetchData()
      }
    } catch (error) {
      AxiosToastError();
      } finally {
      setLoading(false);
    }
  };
  return (
    <section className="fixed top-0 bottom-0 left-0 right-0 bg-neutral-800 bg-opacity-70 flex items-center justify-center mt-20">
      <div className="bg-white max-w-4xl w-full p-4 rounded">
        <div className="flex items-center justify-between">
          <h1 className="font-semibold">Category</h1>
          <button onClick={close} className="w-fit block ml-auto">
            <IoClose size={25} />
          </button>
        </div>
        <form action="" className="my-3 grid gap-2" onSubmit={handleSubmit}>
          <div className="grid gap-1">
            <label id="categoryName" htmlFor="">
              Name
            </label>
            <input
              type="text"
              id="categoryName"
              name="name"
              placeholder="Enter category"
              value={data.name}
              onChange={handleChange}
              className="bg-blue-50 p-2 outline-none border border-blue-100 focus-within:border-primary-200 rounded"
            />
          </div>
          <div className="grid gap-1">
            <p>Image</p>
            <div className="flex gap-4 flex-col lg:flex-row items-center">
              <div className="border bg-blue-50 h-36 w-full lg:w-36 flex items-center justify-center">
                {data.image ? (
                  <img
                    src={data.image}
                    alt="category"
                    className="w-full h-full object-scale-down"
                  />
                ) : (
                  <p className="text-neutral-500 text-sm">No image</p>
                )}
              </div>
              <label htmlFor="uploadCategoryImage">
                <div
                  className={`${
                    !data.name
                      ? "bg-gray-300"
                      : "border-primary-200 hover:bg-primary-200 font-medium"
                  } py-2 px-3 cursor-pointer border`}
                >
                  Upload image
                </div>
                <input
                  disabled={!data.name}
                  onChange={handleUploadCategoryImages}
                  type="file"
                  id="uploadCategoryImage"
                  className="hidden"
                />
              </label>
            </div>
          </div>
          <button
            className={`${
              data.name && data.image
                ? "bg-primary-200 hover:bg-primary-100"
                : "bg-gray-300"
            } py-2 font-semibold mt-3`}
          >
            Add Category
          </button>
        </form>
      </div>
    </section>
  );
};

export default UploadCategoryModel;
