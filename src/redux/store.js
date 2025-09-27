// "use client";

// import { configureStore } from "@reduxjs/toolkit";
// import languageReducer from "./features/languageSlice";

// // Current user reducer
// const currentUserInitialState = {
//   isLoggedIn: false,
//   user: null,
// };

// const currentUserReducer = (state = currentUserInitialState, action) => {
//   switch (action.type) {
//     case "LOGIN":
//       return { ...state, isLoggedIn: true, user: action.payload };
//     case "LOGOUT":
//       return currentUserInitialState;
//     default:
//       return state;
//   }
// };

// export const store = configureStore({
//   reducer: {
//     language: languageReducer,
//     currentUser: currentUserReducer,
//   },
// });
