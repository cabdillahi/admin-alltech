import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { Url, ErrorMessage } from "../../api/api";

interface CrCategoryState {
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  ErrorMessage: string;
  data: [] | null;
}

const initialState: CrCategoryState = {
  data: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  ErrorMessage: "",
};

export const CrCategoryFn = createAsyncThunk(
  "/user/CrCategory",
  async (data: any, { rejectWithValue }) => {
    try {
      const token = JSON.parse(localStorage.getItem("userInfo") || "{}")?.token;
      const res = await axios.post(`${Url}/category/register`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data.message || ErrorMessage);
      }
      return rejectWithValue(ErrorMessage);
    }
  }
);

// Slice
const CrCategorySlice = createSlice({
  name: "CrCategory",
  initialState,
  reducers: {
    resetCrCategoryState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(CrCategoryFn.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.ErrorMessage = "";
        state.data = null;
      })
      .addCase(CrCategoryFn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.ErrorMessage = "";
        state.data = action.payload;
      })
      .addCase(CrCategoryFn.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.ErrorMessage = String(action.payload);
        state.data = null;
      });
  },
});

export default CrCategorySlice;
export const { resetCrCategoryState } = CrCategorySlice.actions;
