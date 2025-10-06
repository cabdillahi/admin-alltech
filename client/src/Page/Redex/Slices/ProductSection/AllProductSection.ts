import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { Url, ErrorMessage } from "../../api/api";

interface ProductSection {
  id: number;
  sectionType: string;
  displayOrder: number;
  isactive: boolean;
  createdAt: string;
  User?: { name?: string; email?: string };
}

interface Meta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

interface GetAllProductSectionState {
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  errorMessage: string;
  data: { data: ProductSection[]; meta: Meta } | null;
}

const initialState: GetAllProductSectionState = {
  isLoading: false,
  isError: false,
  isSuccess: false,
  errorMessage: "",
  data: null,
};

// Async thunk
export const GetAllProductSectionFn = createAsyncThunk(
  "productSection/getAll",
  async (params: {
    page: string;
    limit: string;
    sortBy: string;
    sortOrder: string;
    sectionType?: string;
    search?: string;
  }, { rejectWithValue }) => {
    try {
      const token = JSON.parse(localStorage.getItem("userInfo") || "{}")?.token;
      const response = await axios.get(`${Url}/productSection/all`, {
        params,
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || ErrorMessage);
      }
      return rejectWithValue(ErrorMessage);
    }
  }
);

export const GetAllProductSectionSlice = createSlice({
  name: "GetAllProductSection",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(GetAllProductSectionFn.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.errorMessage = "";
        state.data = null;
      })
      .addCase(GetAllProductSectionFn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.data = action.payload;
      })
      .addCase(GetAllProductSectionFn.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = String(action.payload);
      });
  },
});

export default GetAllProductSectionSlice.reducer;
