import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaRegUserCircle } from "react-icons/fa";
import { useState } from "react";
import UserProfileAvatarEdit from "../components/UserProfileAvatarEdit";
import { AxiosToastError } from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import { FetchUserDetails } from "../utils/FetchUserDetails";
import { setUserDetails } from "../store/userSlice";

const Profile = () => {
  const user = useSelector((state) => state?.user);
  const [openProfileAvatarEdit, setProfileAvatarEdit] = useState(false);
  // console.log("Profile section",user)
  const [userData, setUserData] = useState({
    name: user.name,
    email: user.email,
    mobile: user.mobile,
  });
  useEffect(() => {
    setUserData({
      name: user.name,
      email: user.email,
      mobile: user.mobile,
    });
  }, [user]);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };
  const handleOnSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.updateUserDetails,
        data: userData,
      });
      const { data: responseData } = response;
      if (responseData.success) {
        toast.success(responseData.message);
        const userData = await FetchUserDetails();
        dispatch(setUserDetails(userData.data));
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="p-4">
      {/* Profile Avatar image update and display */}
      <div className="w-20 h-20 flex items-center justify-center rounded-full overflow-hidden drop-shadow-sm">
        {user.avatar ? (
          <img src={user.avatar} alt={user.name} className="w-full h-full" />
        ) : (
          <FaRegUserCircle size={60} />
        )}
      </div>
      <button
        onClick={() => setProfileAvatarEdit(true)}
        className="text-xs min-w-20 border border-primary-100 hover:border-primary-200 hover:bg-primary-200 px-3 py-1 rounded-full mt-2"
      >
        Edit Profile
      </button>
      {openProfileAvatarEdit && (
        <UserProfileAvatarEdit close={() => setProfileAvatarEdit(false)} />
      )}
      {/* display and update name, email, change password*/}
      <form className="my-4 grid gap-4" action="" onSubmit={handleOnSubmit}>
        <div className="grid">
          <label htmlFor="">Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            name="name"
            value={userData.name}
            onChange={handleOnChange}
            required
            className="p-2 bg-blue-50 outline-none border focus-within:border-primary-200 rounded"
          />
        </div>
        <div className="grid">
          <label htmlFor="">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            name="email"
            value={userData.email}
            onChange={handleOnChange}
            required
            className="p-2 bg-blue-50 outline-none border focus-within:border-primary-200 rounded"
          />
        </div>
        <div className="grid">
          <label htmlFor="">Mobile</label>
          <input
            type="number"
            placeholder="Enter your contact"
            name="mobile"
            value={userData.mobile}
            onChange={handleOnChange}
            required
            className="p-2 bg-blue-50 outline-none border focus-within:border-primary-200 rounded"
          />
        </div>
        <button className="border border-primary-100 px-4 py-2 font-semibold rounded hover:bg-primary-200">
          {loading ? "Loading" : "Submit"}
        </button>
      </form>
    </section>
  );
};

export default Profile;
