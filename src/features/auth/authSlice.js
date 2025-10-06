import { createSlice } from "@reduxjs/toolkit";
import { removeToken, saveToken } from "./authService";

const initialState = {
  token: null,
  isInitialized: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      saveToken(action.payload);
    },
    setInitialized: (state, action) => {
      state.isInitialized = action.payload;
    },
    logout: (state) => {
      state.token = null;
      state.isInitialized = true;
      removeToken();
    },
  },
});

export const { setToken, setInitialized, logout } = authSlice.actions;
export default authSlice.reducer;
