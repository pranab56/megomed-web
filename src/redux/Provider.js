"use client";

import { Provider as ReduxProviderComponent } from "react-redux";
import { store } from "./store";

export function Provider({ children }) {
  return (
    <ReduxProviderComponent store={store}>{children}</ReduxProviderComponent>
  );
}
