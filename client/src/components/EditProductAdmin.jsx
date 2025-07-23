import React, { useEffect, useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { UploadImage } from "../utils/UploadImage";
import Loading from "../components/Loading";
import ViewImage from "../components/ViewImage";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import { IoClose } from "react-icons/io5";
import AddField from "../components/AddField";
import { AxiosToastError } from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import successAlert from "../utils/successAlert";

const EditProductAdmin = ({data:propsData,fetchProductData, close}) => {
  const [data, setData] = useState({
    _id:propsData._id,
    name: propsData.name,
    image: propsData.image,
    category: propsData.category,
    subCategory: propsData.subCategory,
    unit: propsData.unit,
    stock: propsData.stock,
    price: propsData.price,
    discount: propsData.discount,
    description: propsData.description,
    more_details: propsData.more_details || {},
  });
  console.log("propsData.category", propsData.category);

  const [imageLoading, setImageLoading] = useState(false);
  const [viewImageURL, setViewImageURL] = useState("");
  const allCategory = useSelector((state) => state.product.allCategory);
  const [selectedCategory, setSelectedCategory] = useState("");
  const allSubCategory = useSelector((state) => state.product.allSubCategory);
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [openAddField, setOpenAddField] = useState(false);
  const [fieldName, setFieldName] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("Submit data",data)
    try {
      const response = await Axios({
        ...SummaryApi.updateProduct,
        data: data,
      });
      const { data: responseData } = response;
      if (responseData.success) {
        successAlert(responseData.message);
        if(close){
          close()
        }
        fetchProductData()
        setData({
          name: "",
          image: [],
          category: [],
          subCategory: [],
          unit: "",
          stock: "",
          price: "",
          discount: "",
          description: "",
          more_details: {},
        });
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    // console.log("file",file)
    if (!file) {
      return;
    }
    setImageLoading(true);
    const response = await UploadImage(file);
    const { data: ImageResponse } = response;
    const imageURL = ImageResponse.data.url;
    // console.log("upload image",response);
    setData((prev) => {
      return {
        ...prev,
        image: [...prev.image, imageURL],
      };
    });
    setImageLoading(false);
  };

  const handleDeleteImage = (index) => {
    data.image.splice(index, 1);
    setData((prev) => {
      return {
        ...prev,
      };
    });
  };

  const handleDeleteCategorySelected = (categoryId) => {
    const index = data.category.findIndex((e1) => e1._id === categoryId);
    console.log("index", index);
    data.category.splice(index, 1);
    setData((prev) => {
      return {
        ...prev,
      };
    });
  };

  const handleDeleteSubCategorySelected = (index) => {
    data.subCategory.splice(index, 1);
    setData((prev) => {
      return {
        ...prev,
      };
    });
  };

  const handleAddFieldName = () => {
    setData((prev) => {
      return {
        ...prev,
        more_details: {
          ...prev.more_details,
          [fieldName]: "",
        },
      };
    });
    setFieldName("");
    setOpenAddField(false);
  };
  return (
    <section className="fixed top-0 bottom-0 left-0 right-0 bg-neutral-800 bg-opacity-70 flex items-center justify-center mt-20 z-50">
      <div className="bg-white max-w-2xl w-full p-4 rounded overflow-y-auto h-full mt-5">
        <section>
          <div className="p-2 bg-white shadow-md flex items-center justify-between">
            <h2 className="font-semibold">Update Product</h2>
            <button onClick={close}>
                <IoClose size={25}/>
            </button>
          </div>
          <div className="grid p-4">
            <form onSubmit={handleSubmit} className="grid gap-2">
              {/* Name */}
              <div className="grid gap-1">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  placeholder="Enter product name"
                  name="name"
                  value={data.name}
                  onChange={handleChange}
                  required
                  className="bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded"
                />
              </div>
              {/* Description */}
              <div className="grid gap-1">
                <label htmlFor="description">Description</label>
                <textarea
                  type="text"
                  id="description"
                  placeholder="Enter product description"
                  name="description"
                  value={data.description}
                  rows={4}
                  aria-multiline
                  onChange={handleChange}
                  required
                  className="bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded resize-none"
                />
              </div>
              <div>
                <p>Image</p>
                <div>
                  <label
                    htmlFor="productImage"
                    className="bg-neutral-100 h-24 flex justify-center items-center border rounded"
                  >
                    <div className="flex flex-col justify-center items-center cursor-pointer">
                      {imageLoading ? (
                        <Loading />
                      ) : (
                        <>
                          <FaCloudUploadAlt size={40} className="" />
                          <p>Update image</p>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      id="productImage"
                      className="hidden"
                      accept="image/*"
                      onChange={handleUploadImage}
                    />
                  </label>
                  {/* Display uploaded image */}
                  <div className="flex flex-wrap gap-4">
                    {data.image.map((img, index) => {
                      return (
                        <div
                          key={img + index}
                          className="mt-2 h-20 w-20 min-w-20 bg-blue-50 border relative group"
                        >
                          <img
                            src={img}
                            alt={img}
                            className="w-full h-full object-scale-down cursor-pointer "
                            onClick={() => setViewImageURL(img)}
                          />
                          <div>
                            <MdDelete
                              size={24}
                              onClick={() => handleDeleteImage(index)}
                              className="absolute bottom-0 right-0 bg-red-200  hover:bg-red-300 rounded-full p-1 hidden group-hover:block"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              {/* Category Section */}
              <div className="grid gap-2">
                <label htmlFor="">Category</label>
                <div>
                  <select
                    id=""
                    className="w-full p-2 bg-blue-50 outline-none border rounded"
                    value={selectedCategory}
                    onChange={(e) => {
                      const value = e.target.value;
                      // console.log("value",value)
                      const categoryDetals = allCategory.find(
                        (e1) => e1._id == value
                      );
                      // console.log("category details",categoryDetals)
                      if (categoryDetals) {
                        setData((prev) => ({
                          ...prev,
                          category: [...prev.category, categoryDetals],
                        }));
                      }
                      setSelectedCategory("");
                    }}
                  >
                    <option value={""}>Select Category</option>
                    {/* Select category */}
                    {allCategory.map((category, index) => {
                      return (
                        <option
                          value={category?._id}
                          key={category._id + "category"}
                        >
                          {category.name}
                        </option>
                      );
                    })}
                  </select>
                  {/* Display category */}
                  <div className="flex flex-wrap gap-1">
                    {data.category.map((cat, index) => {
                      return (
                        <p
                          key={cat._id + index + "category"}
                          className="bg-white shadow-md px-1 m-1 flex items-center gap-2"
                        >
                          {cat.name}
                          <div
                            className="cursor-pointer hover:text-red-600"
                            onClick={() =>
                              handleDeleteCategorySelected(cat._id)
                            }
                          >
                            <IoClose size={20} />
                          </div>
                        </p>
                      );
                    })}
                  </div>
                </div>
              </div>
              {/* Sub Ctaegory Section */}
              <div className="grid gap-2">
                <label htmlFor="">Sub Category</label>
                <div>
                  <select
                    id=""
                    className="w-full p-2 bg-blue-50 outline-none border rounded"
                    value={selectedSubCategory}
                    onChange={(e) => {
                      const value = e.target.value;
                      // console.log("value",value)
                      const SubCategoryDetals = allSubCategory.find(
                        (e1) => e1._id == value
                      );
                      // console.log("Sub category details",SubCategoryDetals)
                      if (SubCategoryDetals) {
                        setData((prev) => ({
                          ...prev,
                          subCategory: [...prev.subCategory, SubCategoryDetals],
                        }));
                      }
                      setSelectedSubCategory("");
                    }}
                  >
                    <option value={""}>Select Sub Category</option>
                    {/* Select sub category */}
                    {allSubCategory.map((subcategory, index) => {
                      return (
                        <option
                          value={subcategory?._id}
                          key={subcategory._id + "subcategory"}
                        >
                          {subcategory.name}
                        </option>
                      );
                    })}
                  </select>
                  {/* Display sub category */}
                  <div className="flex flex-wrap gap-1">
                    {data.subCategory.map((cat, index) => {
                      return (
                        <p
                          key={cat._id + index + "subcategory"}
                          className="bg-white shadow-md px-1 m-1 flex items-center gap-2"
                        >
                          {cat.name}
                          <div
                            className="cursor-pointer hover:text-red-600"
                            onClick={() =>
                              handleDeleteSubCategorySelected(index)
                            }
                          >
                            <IoClose size={20} />
                          </div>
                        </p>
                      );
                    })}
                  </div>
                </div>
              </div>
              {/* Unit */}
              <div className="grid gap-1">
                <label htmlFor="unit">Unit</label>
                <input
                  type="text"
                  id="unit"
                  placeholder="Enter product unit"
                  name="unit"
                  value={data.unit}
                  onChange={handleChange}
                  required
                  className="bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded"
                />
              </div>
              {/* Stock */}
              <div className="grid gap-1">
                <label htmlFor="stock">Number of Stock</label>
                <input
                  type="number"
                  id="stock"
                  placeholder="Enter product stock"
                  name="stock"
                  value={data.stock}
                  onChange={handleChange}
                  required
                  className="bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded"
                />
              </div>
              {/* Price */}
              <div className="grid gap-1">
                <label htmlFor="price">Price</label>
                <input
                  type="number"
                  id="price"
                  placeholder="Enter product price"
                  name="price"
                  value={data.price}
                  onChange={handleChange}
                  required
                  className="bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded"
                />
              </div>
              {/* Discount */}
              <div className="grid gap-1">
                <label htmlFor="discount">Discount</label>
                <input
                  type="number"
                  id="discount"
                  placeholder="Enter discount"
                  name="discount"
                  value={data.discount}
                  onChange={handleChange}
                  required
                  className="bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded"
                />
              </div>
              {/*Add More Details */}
              <div>
                {Object?.keys(data?.more_details)?.map((key, index) => {
                  return (
                    <div className="grid gap-1">
                      <label htmlFor={key}>{key}</label>
                      <input
                        type="text"
                        id={key}
                        placeholder={`Enter ${key}`}
                        value={data?.more_details[key]}
                        onChange={(e) => {
                          const value = e.target.value;
                          setData((prev) => {
                            return {
                              ...prev,
                              more_details: {
                                ...prev.more_details,
                                [key]: value,
                              },
                            };
                          });
                        }}
                        required
                        className="bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded"
                      />
                    </div>
                  );
                })}
              </div>
              <div
                onClick={() => setOpenAddField(true)}
                className="bg-primary-200 w-32 py-1 flex items-center justify-center font-semibold border hover:border-primary-200 hover:bg-white hover:text-neutral-900 cursor-pointer"
              >
                Add fields
              </div>
              <button className="bg-primary-100 hover:bg-primary-200 rounded font-semibold py-1">
                Update Product
              </button>
            </form>
          </div>
          {viewImageURL && (
            <ViewImage url={viewImageURL} close={() => setViewImageURL("")} />
          )}
          {openAddField && (
            <AddField
              value={fieldName}
              onChange={(e) => setFieldName(e.target.value)}
              submit={handleAddFieldName}
              close={() => setOpenAddField(false)}
            />
          )}
        </section>
      </div>
    </section>
  );
};

export default EditProductAdmin;
