import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios, { AxiosError } from 'axios'
import { Url, ErrorMessage } from './../../api/api'

// Payload for registering a user
interface UserRegisterData {
  name: string
  email: string
  password: string
  phone: string
}

// Response returned from backend upon successful registration
interface UserResponse {
  Userid: number
  name: string
  email: string
  phone: string
  role: string
  token: string
}

// State structure for registration
interface RegisterState {
  isLoading: boolean
  isError: boolean
  isSuccess: boolean
  ErrorMessage: string
  data: UserResponse | null
}

// Initial state
const initialState: RegisterState = {
  data: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  ErrorMessage: '',
}

// Thunk action for user registration
export const registerFn = createAsyncThunk(
  '/user/register',
  async (data: UserRegisterData, { rejectWithValue }) => {
    try {
      const token = JSON.parse(localStorage.getItem('userInfo') || '{}')?.token
      const res = await axios.post(`${Url}/users/register`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return res.data
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data.message || ErrorMessage)
      }
      return rejectWithValue(ErrorMessage)
    }
  }
)

// Slice
const registerSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    resetRegisterState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerFn.pending, (state) => {
        state.isLoading = true
        state.isError = false
        state.isSuccess = false
        state.ErrorMessage = ''
        state.data = null
      })
      .addCase(registerFn.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.isError = false
        state.ErrorMessage = ''
        state.data = action.payload
      })
      .addCase(registerFn.rejected, (state, action) => {
        state.isLoading = false
        state.isSuccess = false
        state.isError = true
        state.ErrorMessage = String(action.payload)
        state.data = null
      })
  },
})

export default registerSlice
export const { resetRegisterState } = registerSlice.actions