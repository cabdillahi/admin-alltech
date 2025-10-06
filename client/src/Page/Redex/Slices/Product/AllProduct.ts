import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { Url, ErrorMessage } from "../../api/api";

interface Category {
  name: string;
  Categoryid: number;
}

interface User {
  name: string;
  Userid: number;
}

export interface Product {
  Productid: number;
  name: string;
  description?: string;
  price: number;
  oldPrice?: number;
  condition: string;
  rating?: number;
  imageUrl: string;
  contactMethod?: string;
  Category?: Category;
  User?: User;
  createdAt: string;
}

interface ApiMeta {
  total: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

interface ProductApiResponse {
  data: Product[];
  meta: ApiMeta;
}

interface ProductState {
  data: ProductApiResponse | null;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  ErrorMessage?: string;
}

const initialState: ProductState = {
  data: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  ErrorMessage: "",
};

// Async thunk
export const GetAllProductFn = createAsyncThunk<
  ProductApiResponse,
  Record<string, string> | undefined,
  { rejectValue: string }
>("products/getAll", async (params, { rejectWithValue }) => {
  try {
    const token = JSON.parse(localStorage.getItem("userInfo") || "{}")?.token;
    const response = await axios.get<ProductApiResponse>(`${Url}/products/all`, {
      params,
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    return rejectWithValue(
      (err.response?.data as { message?: string })?.message || ErrorMessage
    );
  }
});

const GetAllProductSlice = createSlice({
  name: "products/getAll",
  initialState,
  reducers: {
    resetProducts: (state) => {
      state.data = null;
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.ErrorMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(GetAllProductFn.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.ErrorMessage = "";
      })
      .addCase(GetAllProductFn.fulfilled, (state, action: PayloadAction<ProductApiResponse>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.data = action.payload;
      })
      .addCase(GetAllProductFn.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.ErrorMessage = action.payload as string;
      });
  },
});

export const { resetProducts } = GetAllProductSlice.actions;
export default GetAllProductSlice;
