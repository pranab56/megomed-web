"use client";

import { Provider } from "react-redux";
import { store } from '../../utils/store';


export default function AuthProvider({ children }) {
  return <Provider store={store}>{children}</Provider>;
}
