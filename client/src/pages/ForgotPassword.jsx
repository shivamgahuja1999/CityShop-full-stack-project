import React, { useState } from "react";
import { IoMdEyeOff } from "react-icons/io";
import { FaEye } from "react-icons/fa";
import toast from "react-hot-toast";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { AxiosToastError } from "../utils/AxiosToastError";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [data, setData] = useState({
    email: "",
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
    try {
      const response = await Axios({
        ...SummaryApi.forgot_password,
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
        navigate("/otp-verification",{
          state:{email:data.email}
        });
        //  console.log("Response",response)
        setData({
          email: "",
        });
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };
  return (
    <section className="container mx-auto px-5">
      <div className="bg-white my-10 mx-auto w-full max-w-lg rounded p-5">
        <p className="font-semibold text-lg">Forgot password</p>
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
          <button
            disabled={!validData}
            className={`${
              validData ? "bg-green-700 hover:bg-green-600" : "bg-gray-500"
            } text-white py-2 rounded font-semibold my-3 tracking-wide`}
          >
            Send otp
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

export default ForgotPassword;
