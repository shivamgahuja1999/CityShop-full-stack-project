import React, { useState } from "react";
import { IoMdEyeOff } from "react-icons/io";
import { FaEye } from "react-icons/fa";
import toast from "react-hot-toast";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { AxiosToastError } from "../utils/AxiosToastError";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Register = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const toastOptions = {
    position: "bottom-right",
    autoClose: 5000,
    pauseOnHover: true,
    draggable: true,
    style: {
      borderRadius: "10px",
      // background: "#333",
      color: "black",
    },
  };
  const validData = Object.values(data).every((value) => value);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const navigate = useNavigate();
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
    if (data.password !== data.confirmPassword) {
      toast.error("password and confirm password must be same", toastOptions);
      return;
    }
    try {
      const response = await Axios({
        ...SummaryApi.register,
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
        //  console.log("Response",response)
        setData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        navigate("/login");
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };
  return (
    <section className="container mx-auto px-5">
      <div className="bg-white my-10 mx-auto w-full max-w-lg rounded p-5">
        <p className="text-center font-semibold">Welcome to CityShop</p>
        <form action="" className="grid mt-6 gap-2" onSubmit={handleSubmit}>
          <div className="grid gap-1">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={data.name}
              onChange={handleChange}
              autoFocus
              className="bg-blue-50 p-2 border rounded outline-none focus:border-primary-200"
              placeholder="Enter your name"
            />
          </div>
          <div className="grid gap-1">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={data.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="bg-blue-50 p-2 border rounded outline-none focus:border-primary-200"
            />
          </div>
          <div className="grid gap-1">
            <label htmlFor="password">Password:</label>
            <div className="bg-blue-50 p-2 border rounded flex flex-row items-center gap-1 focus-within:border-primary-200">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={data.password}
                onChange={handleChange}
                className="w-full outline-none"
                placeholder="Enter your password"
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
                type={showConfirmPass ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={data.confirmPassword}
                onChange={handleChange}
                className="w-full outline-none"
                placeholder="Enter confirm password"
              />
              <div
                onClick={() => setShowConfirmPass((prev) => !prev)}
                className="cursor-pointer"
              >
                {showConfirmPass ? <FaEye /> : <IoMdEyeOff />}
              </div>
            </div>
          </div>
          <button
            disabled={!validData}
            className={`${
              validData ? "bg-green-700 hover:bg-green-600" : "bg-gray-500"
            } text-white py-2 rounded font-semibold my-3 tracking-wide`}
          >
            Register
          </button>
        </form>
        <p>
          Already have an Account ? <Link to={"/login"}
          className="font-semibold text-green-700 hover:text-green-800">Login</Link>
        </p>
      </div>
    </section>
  );
};

export default Register;
