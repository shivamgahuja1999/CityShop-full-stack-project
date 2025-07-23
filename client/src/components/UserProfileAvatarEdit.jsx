import React from "react";
import { useState } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { AxiosToastError } from "../utils/AxiosToastError";
import { updateAvatar } from "../store/userSlice";
import { IoClose } from "react-icons/io5";

const UserProfileAvatarEdit = ({close}) => {
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
  };
  const handleUploadAvatarImage = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    const formData = new FormData();
    formData.append("avatar", file);
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.updateAvatar,
        data: formData,
      });
      const { data: responseData } = response;
      dispatch(updateAvatar(responseData.data.avatar));
      console.log("Avatar update",response.data);
    } catch (error) {
      AxiosToastError();
      console.error("Upload failed:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="fixed top-0 bottom-0 left-0 right-0 bg-neutral-900 bg-opacity-70 p-4 flex items-center justify-center">
      <div className="bg-white max-w-sm w-full rounded p-4 flex flex-col items-center justify-center">
        <button
          className="w-fit block ml-auto"
          onClick={close}
        >
          <IoClose size={23}/>
        </button>
        <div className="w-20 h-20 flex items-center justify-center rounded-full overflow-hidden drop-shadow-sm">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-full h-full" />
          ) : (
            <FaRegUserCircle size={60} />
          )}
        </div>
        <form action="" onSubmit={handleSubmit}>
          <label htmlFor="uploadProfile">
            <div className="text-sm min-w-20 border border-primary-100 hover:border-primary-200 hover:bg-primary-200 px-4 py-1 rounded my-3 cursor-pointer">
              {loading ? "Loading.." : "Upload"}
            </div>
          </label>
          <input
            onChange={handleUploadAvatarImage}
            type="file"
            id="uploadProfile"
            className="hidden"
          />
        </form>
      </div>
    </section>
  );
};

export default UserProfileAvatarEdit;
