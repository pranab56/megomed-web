import { createSlice } from "@reduxjs/toolkit";

const currentUserSlice = createSlice({
  name: "currentUser",
  initialState: {
    currentUser: null,
    isLoggedIn: false,
  },
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
      state.isLoggedIn = true;
    },
    getCurrentUser: (state) => {
      return state.currentUser;
    },
    logout: (state) => {
      state.currentUser = null;
      state.isLoggedIn = false;
    },
  },
});

export const { setCurrentUser, getCurrentUser, logout } =
  currentUserSlice.actions;

export default currentUserSlice.reducer;
