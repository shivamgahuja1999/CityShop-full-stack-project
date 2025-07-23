import React, { useState } from "react";
import { IoMdEyeOff } from "react-icons/io";
import { FaEye } from "react-icons/fa";
import toast from "react-hot-toast";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { AxiosToastError } from "../utils/AxiosToastError";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { FetchUserDetails } from "../utils/FetchUserDetails";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../store/userSlice";

const Login = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
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
  const navigate = useNavigate();
  const dispatch=useDispatch();
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
    try {
      const response = await Axios({
        ...SummaryApi.login,
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
        localStorage.setItem('CityShop accesstoken',response.data.data.accessToken);
        localStorage.setItem('CityShop refreshtoken',response.data.data.refreshToken);

        const userDetails=await FetchUserDetails();
        dispatch(setUserDetails(userDetails.data))
        setData({
          email: "",
          password: "",
        });
        navigate("/");
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };
  return (
    <section className="container mx-auto px-5">
      <div className="bg-white my-10 mx-auto w-full max-w-lg rounded p-5">
        <form action="" className="grid gap-2 py-3" onSubmit={handleSubmit}>
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
            <Link to={"/forgot-password"} className="block ml-auto hover:text-primary-200">Forgot Password ?</Link>
          </div>

          <button
            disabled={!validData}
            className={`${
              validData ? "bg-green-700 hover:bg-green-600" : "bg-gray-500"
            } text-white py-2 rounded font-semibold my-3 tracking-wide`}
          >
            Login
          </button>
        </form>
        <p>
          Don't have account ?
          <Link
            to={"/register"}
            className="font-semibold text-green-700 hover:text-green-800"
          >
            Register
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Login;
