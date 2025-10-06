import DashboardPage from "@/components/Page/Dashboard";
import DashRouter from "@/components/Page/DashRouter";
import NotFound from "@/Home/NotFound";
import AllUsers from "@/Page/Auth/AllUsers";
import SignInPage from "@/Page/Auth/SignInPage";
import SignUpPage from "@/Page/Auth/SignUpPage";
import Category from "@/Tables/Category/Category";
import CreateCategory from "@/Tables/Category/CrCategory";
import CrProduct from "@/Tables/Product/CrProduct";
import Product from "@/Tables/Product/Product";
import CreateCroductSection from "@/Tables/ProductSection/CreateProductSection";
import ProductSection from "@/Tables/ProductSection/ProductSection";

import { createBrowserRouter, Outlet } from "react-router-dom";

const Router = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div></div>
      <div className="body flex-grow">
        <Outlet />
      </div>
      <div className="footer"></div>
    </div>
  );
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Router />,
    children: [
      { index: true, element: <SignInPage /> },
      { path: "SignIn", element: <SignInPage /> },
    
      { path: "*", element: <NotFound /> },
    ],
  },
  {
    path: "/dashboard",
    element: <DashRouter />,
    children: [
      {
        index: true, 
        element: <DashboardPage />,
      },
      {
        path: "CreateProduct", 
        element: <CrProduct />,
      },
       {
        path: "Product", 
        element: <Product />,
      },
        { path: "CreateUser", element: <SignUpPage /> },



 {
        path: "Category", 
        element: <Category />,
      },
       {
        path: "CrCategory", 
        element: <CreateCategory />,
      },


      
   {
        path: "ProductSection", 
        element: <ProductSection />,
      },

         {
        path: "CreateProductSection", 
        element: <CreateCroductSection />,
      },




       {
        path: "Users", 
        element: <AllUsers />,
      },
      {
        path: "*", 
        element: <NotFound />,
      },
    ],
  },
]);
