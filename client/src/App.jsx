import { useEffect, useState } from "react";
import "./App.css";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Toaster } from "react-hot-toast";
import { FetchUserDetails } from "./utils/FetchUserDetails";
import { setUserDetails } from "./store/userSlice";
import { setAllCategory, setAllSubCategory, setLoadingCategory } from "./store/productSlice";
import { useDispatch } from "react-redux";
import SummaryApi from "./common/SummaryApi";
import { AxiosToastError } from "./utils/AxiosToastError";
import Axios from "./utils/Axios";
import Loading from "./components/Loading";
import GlobalProvider, { useGlobalContext } from "./provider/GlobalProvider";
import { FaShoppingCart } from "react-icons/fa";
import CartMobileLink from "./components/CartMobileLink";

function App() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const location=useLocation();

  const fetchUser = async () => {
    const userData = await FetchUserDetails();
    dispatch(setUserDetails(userData.data));
    console.log("userdata", userData.data);
  };

  const fetchCategory = async () => {
    try {
      dispatch(setLoadingCategory(true))
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getCategory,
      });
      const { data: responseData } = response;
      if (responseData.success) {
        dispatch(setAllCategory(responseData.data));
        // console.log("Redux categories updated",responseData.data)
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
      dispatch(setLoadingCategory(false))
    }
  };
  const fetchSubCategory = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getSubCategory,
      });
      const { data: responseData } = response;
      if (responseData.success) {
        dispatch(setAllSubCategory(responseData.data));
        // console.log("Redux sub categories updated", responseData.data);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchCategory();
    fetchSubCategory();
  }, []);

  
  return (
    <GlobalProvider>
      <Header />
      <main className="lg:min-h-[76vh] min-h-[65vh]">
        <Outlet />
      </main>
      <Footer />
      <Toaster />
      {
        location.pathname !== "/checkout" &&(
          <CartMobileLink/>
        )
      }
    </GlobalProvider>
  );
}

export default App;
