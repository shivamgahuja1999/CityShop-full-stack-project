import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import SearchPage from "../pages/SearchPage";
import Register from "../pages/Register";
import Login from "../pages/Login";
import ForgotPassword from "../pages/ForgotPassword";
import OtpVerification from "../pages/OtpVerification";
import ResetPassword from "../pages/ResetPassword";
import UserMenuMobileVersion from "../pages/UserMenuMobileVersion";
import Dashboard from "../layouts/Dashboard";
import Profile from "../pages/Profile";
import MyOrders from "../pages/MyOrders";
import Address from "../pages/Address";
import CategoryPage from "../pages/CategoryPage";
import SubCategoryPage from "../pages/SubCategoryPage";
import UploadProductPage from "../pages/UploadProductPage";
// import ProductPage from "../pages/ProductPage";
import AdminPermision from "../layouts/AdminPermision";
import ProductAdminPage from "../pages/ProductAdminPage";
import ProductListPage from "../pages/ProductListPage";
import ProductDisplayPage from "../pages/ProductDisplayPage";
import CartMobile from "../components/CartMobile"
import CheckoutPage from "../pages/CheckoutPage";
import Success from "../pages/Success";
import Cancel from "../pages/Cancel";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <Home /> },
      { path: "search", element: <SearchPage /> },
      { path: "register", element: <Register /> },
      { path: "login", element: <Login /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "otp-verification", element: <OtpVerification /> },
      { path: "reset-password", element: <ResetPassword /> },
      { path: "user-menu", element: <UserMenuMobileVersion /> },
      {
        path: "dashboard",
        element: <Dashboard />,
        children: [
          { path: "profile", element: <Profile /> },
          {
            path: "category",
            element: (
              <AdminPermision>
                <CategoryPage />
              </AdminPermision>
            ),
          },
          {
            path: "sub-category",
            element: (
              <AdminPermision>
                <SubCategoryPage />
              </AdminPermision>
            ),
          },
          {
            path: "upload-product",
            element: (
              <AdminPermision>
                <UploadProductPage />{" "}
              </AdminPermision>
            ),
          },
          {
            path: "product",
            element: (
              <AdminPermision>
                <ProductAdminPage />{" "}
              </AdminPermision>
            ),
          },
          { path: "myorders", element: <MyOrders /> },
          { path: "address", element: <Address /> },
        ],
      },
      {
        path: ":category",
        children: [{ path: ":subCategory", element: <ProductListPage /> }],
      },
      {
        path: "product/:product",
        element: <ProductDisplayPage />,
      },
      {
        path:"cart",
        element:<CartMobile/>
      },
      {
        path:"checkout",
        element:<CheckoutPage/>
      },
      {
        path:"success",
        element:<Success/>
      },
      {
        path:"cancel",
        element:<Cancel/>
      }
    ],
  },
  {},
]);

export default router;
