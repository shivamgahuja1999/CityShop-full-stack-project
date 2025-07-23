import React, { useEffect, useState } from "react";
import UploadSubCategoryModel from "../components/UploadSubCategoryModel";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { AxiosToastError } from "../utils/AxiosToastError";
import DisplayTable from "../components/DisplayTable";
import { createColumnHelper } from "@tanstack/react-table";
import ViewImage from "../components/ViewImage";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import EditSubCategory from "../components/EditSubCategory";
import Confirmbox from "../components/Confirmbox";
import toast from "react-hot-toast";

const SubCategoryPage = () => {
  const [openAddSubCategory, setOpenSubCategory] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const columnHelper = createColumnHelper();
  const [imageURL, setImageURL] = useState("");
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState({
    _id: "",
  });
  const [deleteSubCategory, setDeleteSubCategory] = useState({
    _id: "",
  });
  const [openDeleteConfirmbox, setOpenDeleteConfirmbox] = useState(false);

  const columns = [
    columnHelper.accessor("name", {
      header: "Name",
    }),
    columnHelper.accessor("image", {
      header: "Image",
      cell: ({ row }) => {
        // console.log("row", row.original.image);
        return (
          <div className="flex justify-center items-center">
            <img
              src={row.original.image}
              alt={row.original.name}
              className="w-8 h-10 cursor-pointer"
              onClick={() => {
                setImageURL(row.original.image);
              }}
            />
          </div>
        );
      },
    }),
    columnHelper.accessor("category", {
      header: "Category",
      cell: ({ row }) => {
        return (
          <>
            {row.original.category.map((cat, index) => {
              return (
                <p
                  key={cat._id + "table"}
                  className="shadow-md inline-block px-1"
                >
                  {cat.name}
                </p>
              );
            })}
          </>
        );
      },
    }),
    columnHelper.accessor("_id", {
      header: "Action",
      cell: ({ row }) => {
        console.log("row", row);
        return (
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => {
                setOpenEdit(true);
                setEditData(row.original);
              }}
              className="p-2 bg-green-100 rounded-full hover:text-green-600"
            >
              <MdEdit size={20} />
            </button>
            <button
              onClick={() => {
                setOpenDeleteConfirmbox(true);
                setDeleteSubCategory(row.original);
              }}
              className="p-2 bg-red-100 rounded-full text-red-500 hover:text-red-600"
            >
              <MdDelete size={20} />
            </button>
          </div>
        );
      },
    }),
  ];

  const fetchSubCategory = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getSubCategory,
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
    fetchSubCategory();
  }, []);
  // console.log("subCategory page data", data);

  const handleDeleteSubCategory = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.deleteSubCategory,
        data: deleteSubCategory,
      });
      const { data: responseData } = response;
      if (responseData.success) {
        toast.success(responseData.message);
        fetchSubCategory();
        setOpenDeleteConfirmbox(false);
        setDeleteSubCategory({ _id: "" });
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };
  return (
    <section>
      <div className="p-2 bg-white shadow-md flex items-center justify-between">
        <h2 className="font-semibold">Sub Category</h2>
        <button
          onClick={() => setOpenSubCategory(true)}
          className="text-sm border border-primary-200 hover:bg-primary-200 rounded px-3 py-2"
        >
          Add sub category
        </button>
      </div>
      <div className="overflow-auto w-full max-w-[95vw]">
        <DisplayTable data={data} column={columns} />
      </div>
      {openAddSubCategory && (
        <UploadSubCategoryModel
          fetchData={fetchSubCategory}
          close={() => setOpenSubCategory(false)}
        />
      )}

      {imageURL && <ViewImage url={imageURL} close={() => setImageURL("")} />}

      {openEdit && (
        <EditSubCategory
          data={editData}
          fetchData={fetchSubCategory}
          close={() => setOpenEdit(false)}
        />
      )}
      {openDeleteConfirmbox && (
        <Confirmbox
          close={() => setOpenDeleteConfirmbox(false)}
          cancel={() => setOpenDeleteConfirmbox(false)}
          confirm={handleDeleteSubCategory}
        />
      )}
    </section>
  );
};

export default SubCategoryPage;
