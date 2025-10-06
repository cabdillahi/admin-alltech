import { createSlice } from '@reduxjs/toolkit';

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

interface UserState {
  name: string;
  role: string;
  email: string;
  token: string;
  avatar: string;
}

let initialState: UserState = {
  name: '',
  role: '',
  email: '',
  token: '',
  avatar: '',
};

// Load from localStorage
const stored = localStorage.getItem('userInfo');

if (stored) {
  try {
    const parsed = JSON.parse(stored);
    const now = new Date().getTime();

    if (parsed.expiry && now < parsed.expiry) {
      initialState = {
        name: parsed.name || '',
        role: parsed.role || '',
        email: parsed.email || '',
        token: parsed.token || '',
        avatar: parsed.avatar || '',
      };
    } else {
      localStorage.removeItem('userInfo'); // Expired
    }
  } catch {
    localStorage.removeItem('userInfo'); // Corrupted
  }
}

const userInfoSlice = createSlice({
  name: 'userInfo',
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { name, role, email, token, avatar } = action.payload;

      state.name = name;
      state.role = role;
      state.email = email;
      state.token = token;
      state.avatar = avatar;

      const dataWithExpiry = {
        name,
        role,
        email,
        token,
        avatar,
        expiry: new Date().getTime() + ONE_DAY_MS,
      };

      localStorage.setItem('userInfo', JSON.stringify(dataWithExpiry));
    },

    logout: (state) => {
      localStorage.removeItem('userInfo');
      state.name = '';
      state.role = '';
      state.email = '';
      state.token = '';
      state.avatar = '';
    },
  },
});

export default userInfoSlice;
export const { setUser, logout } = userInfoSlice.actions;
