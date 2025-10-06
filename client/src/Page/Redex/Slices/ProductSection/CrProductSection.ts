import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios, { AxiosError } from 'axios'
import { Url, ErrorMessage } from '../../api/api'



interface CrProductSectionState {
  isLoading: boolean
  isError: boolean
  isSuccess: boolean
  ErrorMessage: string
  data: [] | null
}

const initialState: CrProductSectionState = {
  data: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  ErrorMessage: '',
}

export const CrProductSectionFn = createAsyncThunk(
  '/user/CrProductSection',
  async (data: any, { rejectWithValue }) => {
    try {
      const token = JSON.parse(localStorage.getItem('userInfo') || '{}')?.token
      const res = await axios.post(`${Url}/productSection/register`, data, {
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
const CrProductSectionSlice = createSlice({
  name: 'CrProductSection',
  initialState,
  reducers: {
    resetCrProductSectionState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(CrProductSectionFn.pending, (state) => {
        state.isLoading = true
        state.isError = false
        state.isSuccess = false
        state.ErrorMessage = ''
        state.data = null
      })
      .addCase(CrProductSectionFn.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.isError = false
        state.ErrorMessage = ''
        state.data = action.payload
      })
      .addCase(CrProductSectionFn.rejected, (state, action) => {
        state.isLoading = false
        state.isSuccess = false
        state.isError = true
        state.ErrorMessage = String(action.payload)
        state.data = null
      })
  },
})

export default CrProductSectionSlice
export const { resetCrProductSectionState } = CrProductSectionSlice.actions