import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { Url, ErrorMessage } from "../../api/api";

interface CrProductState {
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  ErrorMessage: string;
  data: any | null;
}

const initialState: CrProductState = {
  data: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  ErrorMessage: "",
};

export const CrProductFn = createAsyncThunk(
  "product/create",
  async (data: FormData, { rejectWithValue }) => {
    try {
      const token = JSON.parse(localStorage.getItem("userInfo")!)?.token;
      const res = await axios.post(`${Url}/products/register`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || ErrorMessage);
      }
      return rejectWithValue(ErrorMessage);
    }
  }
);

const CrProductSlice = createSlice({
  name: "CrProduct",
  initialState,
  reducers: {
    resetCrProductState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(CrProductFn.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.ErrorMessage = "";
        state.data = null;
      })
      .addCase(CrProductFn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.ErrorMessage = "";
        state.data = action.payload;
      })
      .addCase(CrProductFn.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.ErrorMessage = String(action.payload);
        state.data = null;
      });
  },
});

export const { resetCrProductState } = CrProductSlice.actions;
export default CrProductSlice;
