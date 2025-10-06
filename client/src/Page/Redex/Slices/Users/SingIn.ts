import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { Url, ErrorMessage } from './../../api/api';

// Define the structure of login payload
interface LoginPayload {
  email: string
  password: string
}

// Response returned from backend upon successful registration
interface LoginResult {
  name: string
  email: string
  role: string
  token: string
}
// Define the state shape
interface LoginState {
  data: { result: LoginResult | null };
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  ErrorMessage: string;
}

// Initial state
const initialState: LoginState = {
  data: { result: null },
  isLoading: false,
  isSuccess: false,
  isError: false,
  ErrorMessage: '',
};

// Async thunk for login
export const LoginFn = createAsyncThunk(
  'user/login',
  async (data: LoginPayload, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${Url}/users/login`, data);
      return res.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data.message || ErrorMessage);
      }
      return rejectWithValue(ErrorMessage);
    }
  }
);

// Create slice
const LoginSlice = createSlice({
  name: 'Login',
  initialState,
  reducers: {
    resetlogin: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(LoginFn.pending, () => ({
        ...initialState,
        isLoading: true,
      }))
      .addCase(LoginFn.fulfilled, (_, action) => ({
        ...initialState,
        isSuccess: true,
        data: action.payload,
      }))
      .addCase(LoginFn.rejected, (_, action) => ({
        ...initialState,
        isError: true,
        ErrorMessage: String(action.payload),
        data: { result: null },
      }));
  },
});

export default LoginSlice;
export const { resetlogin } = LoginSlice.actions;