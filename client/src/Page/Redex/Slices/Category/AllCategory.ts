import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios, { AxiosError } from "axios"
import { ErrorMessage, Url } from "../../api/api"

// ------------------- Types -------------------
interface Category {
  id: number
  name: string
  description?: string
  isactive: boolean
  isdeleted: boolean
  createdAt: string
  User?: { name: string }
  Product?: any[]
  userUserid?: number
}

interface Meta {
  total: number
  totalPages: number
  currentPage: number
}

interface CategoryState {
  isLoading: boolean
  isError: boolean
  isSuccess: boolean
  ErrorMessage: string
  data: Category[]
  meta: Meta | null
}

// ------------------- Initial State -------------------
const initialState: CategoryState = {
  isLoading: false,
  isError: false,
  isSuccess: false,
  ErrorMessage: "",
  data: [],
  meta: null,
}

// ------------------- Thunk -------------------
export const GetAllCategoryFn = createAsyncThunk(
  "categories/getAll",
  async (params: any, { rejectWithValue }) => {
    try {
      const token = JSON.parse(localStorage.getItem("userInfo") || "{}")?.token

      const response = await axios.get(`${Url}/category/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params,
      })

      return response.data // { data: [...], meta: {...} }
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || ErrorMessage)
      }
      return rejectWithValue(ErrorMessage)
    }
  }
)

// ------------------- Slice -------------------
export const GetAllCategorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(GetAllCategoryFn.pending, (state) => {
        state.isLoading = true
        state.isError = false
        state.isSuccess = false
        state.ErrorMessage = ""
        state.data = []
        state.meta = null
      })
      .addCase(GetAllCategoryFn.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.data = action.payload.data // ✅ store array
        state.meta = action.payload.meta // ✅ store meta
      })
      .addCase(GetAllCategoryFn.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.ErrorMessage = String(action.payload)
      })
  },
})

export default GetAllCategorySlice.reducer
