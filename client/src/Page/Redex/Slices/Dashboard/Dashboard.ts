import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { ErrorMessage, Url } from "../../api/api";

// Types
interface UserRoleCount {
  role: string;
  count: number;
}

interface ProductConditionBreakdown {
  condition: "NEW" | "USED";
  count: number;
}

interface ProductStats {
  total: number;
  newThisMonth: number;
  byCondition: ProductConditionBreakdown[];
}

interface CategoryStats {
  total: number;
  active: number;
  inactive: number;
}

interface ProductSectionStats {
  type: string;
  count: number;
}

interface TrendData {
  month: string | Date;
  total: number;
}

interface RecentProduct {
  Productid: number;
  name: string;
  createdAt: string;
  Category?: { name: string };
  User?: { fullName: string };
}

interface RecentCategory {
  Categoryid: number;
  name: string;
  createdAt: string;
  User?: { fullName: string };
}

export interface DashboardData {
  users: UserRoleCount[];
  products: ProductStats;
  categories: CategoryStats;
  productSections: { byType: ProductSectionStats[] };
  trends: { products: TrendData[] };
  recentActivity: {
    products: RecentProduct[];
    categories: RecentCategory[];
  };
}

// State
interface DashboardState {
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  ErrorMessage: string;
  data: DashboardData | null;
}

const initialState: DashboardState = {
  isLoading: false,
  isError: false,
  isSuccess: false,
  ErrorMessage: "",
  data: null,
};

// Thunk
export const GetDashboardFn = createAsyncThunk<
  DashboardData,
  void,
  { rejectValue: string }
>("/Dashboard", async (_, { rejectWithValue }) => {
  try {
    const token = JSON.parse(localStorage.getItem("userInfo") || "{}")?.token;
    const response = await axios.get<DashboardData>(`${Url}/dashboard/overview`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue(error.response?.data?.message || ErrorMessage);
    }
    return rejectWithValue(ErrorMessage);
  }
});

// Slice
export const GetDashboardSlice = createSlice({
  name: "Dashboard",
  initialState,
  reducers: {
    resetDashboardState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(GetDashboardFn.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.ErrorMessage = "";
        state.data = null;
      })
      .addCase(GetDashboardFn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.data = action.payload;
      })
      .addCase(GetDashboardFn.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.ErrorMessage = String(action.payload);
        state.data = null;
      });
  },
});

export default GetDashboardSlice.reducer;
export const { resetDashboardState } = GetDashboardSlice.actions;
