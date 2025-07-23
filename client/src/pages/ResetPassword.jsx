import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoMdEyeOff } from "react-icons/io";
import { FaEye } from "react-icons/fa";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import { AxiosToastError } from "../utils/AxiosToastError";
import Axios from "../utils/Axios";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const validData = Object.values(data).every((value) => value);

  useEffect(() => {
    if (!location?.state?.data?.success) {
      navigate("/");
    }
    if (location?.state?.email) {
      setData((prev) => {
        return {
          ...prev,
          email: location?.state?.email,
        };
      });
    }
  }, []);
  useEffect(() => {
    console.log("Updated reset data:", data);
  }, [data]);
  console.log("Resetpage location", location);

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
    //optional
    if(data.newPassword !== data.confirmPassword){
        toast.error("New Password & confirm password must be same")
        return
    }
    try {
      const response = await Axios({
        ...SummaryApi.reset_password,
        data: data,
      });

      if (!response.data.success) {
        toast.error(
          response.data.message || "Something went wrong",
          toastOptions
        );
        return;
      }
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/login");
        setData({
          email: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };
  return (
    <section className="container mx-auto px-5">
      <div className="bg-white my-10 mx-auto w-full max-w-lg rounded p-5">
        <p className="font-semibold text-lg">Enter your Password</p>
        <form action="" className="grid gap-2 py-3" onSubmit={handleSubmit}>
          <div className="grid gap-1">
            <label htmlFor="newPassword">New Password:</label>
            <div className="bg-blue-50 p-2 border rounded flex flex-row items-center gap-1 focus-within:border-primary-200">
              <input
                type={showPassword ? "text" : "password"}
                id="newPassword"
                name="newPassword"
                value={data.newPassword}
                onChange={handleChange}
                className="w-full outline-none"
                placeholder="Enter password"
              />
              <div
                onClick={() => setShowPassword((prev) => !prev)}
                className="cursor-pointer"
              >
                {showPassword ? <FaEye /> : <IoMdEyeOff />}
              </div>
            </div>
          </div>
          <div className="grid gap-1">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <div className="bg-blue-50 p-2 border rounded flex flex-row items-center gap-1 focus-within:border-primary-200">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={data.confirmPassword}
                onChange={handleChange}
                className="w-full outline-none"
                placeholder="Confirm password"
              />
              <div
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="cursor-pointer"
              >
                {showPassword ? <FaEye /> : <IoMdEyeOff />}
              </div>
            </div>
          </div>
          <button
            disabled={!validData}
            className={`${
              validData ? "bg-green-700 hover:bg-green-600" : "bg-gray-500"
            } text-white py-2 rounded font-semibold my-3 tracking-wide`}
          >
            Change Password
          </button>
        </form>
        <p>
          Already have an account ?
          <Link
            to={"/login"}
            className="font-semibold text-green-700 hover:text-green-800"
          >
            Login
          </Link>
        </p>
      </div>
    </section>
  );
};

export default ResetPassword;
