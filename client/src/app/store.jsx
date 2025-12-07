import { configureStore } from "@reduxjs/toolkit";
import { userApi } from "../features/user.slice.jsx";
import {userReducer, chatReducer} from "../features/user.slice.jsx";
export const store = configureStore({
  reducer: {
    user: userReducer,
    chat:chatReducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userApi.middleware),
});
