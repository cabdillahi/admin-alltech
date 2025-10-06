import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { Url, ErrorMessage } from "../../api/api";

interface DeleteProductState {
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  ErrorMessage: string;
  data: any | null;
}

const initialState: DeleteProductState = {
  data: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  ErrorMessage: "",
};

// ✅ Delete product thunk
export const DeleteProductFn = createAsyncThunk(
  "product/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      const token = JSON.parse(localStorage.getItem("userInfo")!)?.token;
      const res = await axios.delete(`${Url}/products/delete/${id}`, {
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

const DeleteProductSlice = createSlice({
  name: "DeleteProduct",
  initialState,
  reducers: {
    resetDeleteProductState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(DeleteProductFn.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.ErrorMessage = "";
        state.data = null;
      })
      .addCase(DeleteProductFn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.ErrorMessage = "";
        state.data = action.payload;
      })
      .addCase(DeleteProductFn.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.ErrorMessage = String(action.payload);
        state.data = null;
      });
  },
});

export const { resetDeleteProductState } = DeleteProductSlice.actions;
export default DeleteProductSlice;
