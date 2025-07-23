import React, { useEffect, useState } from "react";
import UploadCategoryModel from "../components/UploadCategoryModel";
import Loading from "../components/Loading";
import NoData from "../components/NoData";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import EditCategoryPage from "../components/EditCategoryPage";
import Confirmbox from "../components/Confirmbox";
import toast from "react-hot-toast";
import { AxiosToastError } from "../utils/AxiosToastError";
import { useDispatch, useSelector } from "react-redux";
import { setAllCategory } from "../store/productSlice";

const CategoryPage = () => {
  const [openUploadCategory, setOpenUploadCategory] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    image: "",
  });
  // const categoryData = useSelector((state) => state.product.allCategory);
  // const dispatch = useDispatch();
  const [openDeleteConfirmbox, setOpenDeleteConfirmbox] = useState(false);
  const [deleteCategory, setDeleteCategory] = useState({
    _id: "",
  });
  // console.log("All Category redux",categoryData)
  // useEffect(()=>{
  //   setCategoryData(allCategory)
  // },[allCategory])

  const fetchCategory = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getCategory,
      });
      const { data: responseData } = response;
      if (responseData.success) {
        setCategoryData(responseData.data)
        // dispatch(setAllCategory(responseData.data));
        // console.log("Redux categories updated",responseData.data)
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(()=>{
    fetchCategory()
  },[])

  const handleDeleteCategory = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.deleteCategory,
        data: deleteCategory,
      });
      const { data: responseData } = response;
      if (responseData.success) {
        toast.success(responseData.message);
        fetchCategory()
        dispatch(setAllCategory(responseData.data));
        setOpenDeleteConfirmbox(false);
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };
  return (
    <section>
      <div className="p-2 bg-white shadow-md flex items-center justify-between">
        <h2 className="font-semibold">Category</h2>
        <button
          onClick={() => setOpenUploadCategory(true)}
          className="text-sm border border-primary-200 hover:bg-primary-200 rounded px-3 py-2"
        >
          Add category
        </button>
      </div>
      {Array.isArray(categoryData) && categoryData.length === 0 && !loading && (
        <NoData />
      )}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 p-4">
        {Array.isArray(categoryData) &&
          categoryData.map((category, index) => {
            return (
              <div key={index} className="w-32 h-56 rounded shadow-md">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full object-scale-down"
                />
                <div className="flex items-center justify-evenly h-9 gap-1">
                  <button
                    onClick={() => {
                      setOpenEdit(true);
                      setEditData(category);
                    }}
                    className="bg-green-100 hover:bg-green-200 text-green-600 font-semibold px-2 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setOpenDeleteConfirmbox(true);
                      setDeleteCategory(category);
                    }}
                    className="bg-red-100 hover:bg-red-200 text-red-600 font-semibold px-2 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
      </div>
      {loading && <Loading />}
      {openUploadCategory && (
        <UploadCategoryModel
          fetchData={fetchCategory}
          close={() => setOpenUploadCategory(false)}
        />
      )}

      {openEdit && (
        <EditCategoryPage data={editData} close={() => setOpenEdit(false)} />
      )}
      {openDeleteConfirmbox && (
        <Confirmbox
          close={() => setOpenDeleteConfirmbox(false)}
          cancel={() => setOpenDeleteConfirmbox(false)}
          confirm={handleDeleteCategory}
        />
      )}
    </section>
  );
};

export default CategoryPage;
