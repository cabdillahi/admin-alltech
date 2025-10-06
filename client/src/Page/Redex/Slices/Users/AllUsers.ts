import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { ErrorMessage, Url } from "../../api/api";

// Initial state
const initialState = {
  isLoading: false,
  isError: false,
  isSuccess: false,
  ErrorMessage: '',
  data: [] as any[], 
};

// Async thunk
export const GetAllUsersFn = createAsyncThunk(
  'users/getAll', 
  async (_, { rejectWithValue }) => {
    try {
      const token = JSON.parse(localStorage.getItem('userInfo') || '{}')?.token;

      const response = await axios.get(`${Url}/users/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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

// Slice
export const GetAllUsersSlice = createSlice({
  name: 'users/getAll',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(GetAllUsersFn.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.ErrorMessage = '';
        state.data = [];
      })
      .addCase(GetAllUsersFn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.data = action.payload;
      })
      .addCase(GetAllUsersFn.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.ErrorMessage = String(action.payload);
      });
  },
});

export default GetAllUsersSlice.reducer;
