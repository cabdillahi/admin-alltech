import { configureStore } from "@reduxjs/toolkit";
import userInfoSlice from "../Auth/UserInfo";
import LoginSlice from "./Slices/Users/SingIn";
import registerSlice from "./Slices/Users/SingUp";
import { GetAllUsersSlice } from "./Slices/Users/AllUsers";
import CrProductSlice from "./Slices/Product/CrProduct";
import CrCategorySlice from "./Slices/Category/CrDonors";
import { GetAllCategorySlice } from "./Slices/Category/AllCategory";
import CrProductSectionSlice from "./Slices/ProductSection/CrProductSection";
import { GetAllProductSectionSlice } from "./Slices/ProductSection/AllProductSection";
import { GetDashboardSlice } from "./Slices/Dashboard/Dashboard";
import GetAllProductSlice from "./Slices/Product/AllProduct";
import DeleteProductSlice from "./Slices/Product/delete-product";

export const store = configureStore({
  reducer: {
    userInfo: userInfoSlice.reducer,
    Register: registerSlice.reducer,
    Login: LoginSlice.reducer,
    GetAllUsers: GetAllUsersSlice.reducer,
    // Product
    CrProduct: CrProductSlice.reducer,
    AllProduct: GetAllProductSlice.reducer,
    deleteProduct: DeleteProductSlice.reducer,
    // Category
    CrCategory: CrCategorySlice.reducer,
    GetAllCategory: GetAllCategorySlice.reducer,

    // Employee
    CProductSection: CrProductSectionSlice.reducer,
    GetAllProductSection: GetAllProductSectionSlice.reducer,

    // dashboard
    dashboard: GetDashboardSlice.reducer,
  },
  devTools: false,
});

// Types for state and dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
