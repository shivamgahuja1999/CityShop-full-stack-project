import React, { useEffect, useRef, useState } from "react";
import { IoMdEyeOff } from "react-icons/io";
import { FaEye } from "react-icons/fa";
import toast from "react-hot-toast";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { AxiosToastError } from "../utils/AxiosToastError";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const OtpVerification = () => {
  const [data, setData] = useState(["", "", "", "", "", ""]);
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
  const validData = data.every((value) => value);
  const navigate = useNavigate();
  const inputRef = useRef([]);
  const location = useLocation();
  useEffect(() => {
    if (!location?.state?.email) {
      navigate("/forgot-password");
    }
  }, []);
  // console.log("location",location)

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios({
        ...SummaryApi.verify_forgotPassword_otp,
        data: {
          otp: data.join(""),
          email: location?.state?.email,
        },
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
        navigate("/reset-password", {
          state: {
            data: response.data,
            email:location?.state?.email,
          },
        });
        // console.log("Response otp verification page",response)
        setData(["", "", "", "", "", ""]);
      }
    } catch (error) {
      console.log(error)
      AxiosToastError(error);
    }
  };
  return (
    <section className="container mx-auto px-5">
      <div className="bg-white my-4 mx-auto w-full max-w-lg rounded p-5">
        <p className="font-semibold text-lg">Enter OTP</p>
        <form action="" className="grid gap-2 py-3" onSubmit={handleSubmit}>
          <div className="grid gap-1">
            <label htmlFor="otp">Enter yout OTP:</label>
            <div className="flex items-center gap-3 justify-between">
              {data.map((Element, index) => {
                return (
                  <input
                    key={index}
                    type="text"
                    id="otp"
                    maxLength={1}
                    ref={(ref) => {
                      inputRef.current[index] = ref;
                      return ref;
                    }}
                    value={data[index]}
                    onChange={(e) => {
                      const value = e.target.value;
                      const newData = [...data];
                      newData[index] = value;
                      setData(newData);
                      // console.log(value);

                      if (value && index < inputRef.current.length - 1) {
                        inputRef.current[index + 1].focus();
                      }
                    }}
                    className="bg-blue-50 flex w-full max-w-13 p-2 border rounded outline-none focus:border-primary-200 text-center font-semibold"
                  />
                );
              })}
            </div>
          </div>
          <button
            disabled={!validData}
            className={`${
              validData ? "bg-green-700 hover:bg-green-600" : "bg-gray-500"
            } text-white py-2 rounded font-semibold my-3 tracking-wide`}
          >
            Verify OTP
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

export default OtpVerification;
