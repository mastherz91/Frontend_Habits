import { configureStore } from "@reduxjs/toolkit";
import habitReducer from "../features/habitSlice";
import userReducer from "../features/user/userSlice";

// Redux/store.js
export const makeStore = () => {
    return configureStore({
        reducer: {
            habits: habitReducer,
            user: userReducer,
        },
    });
};


export const store = makeStore();
export const AppDispatch = store.dispatch;
export const RootState = store.getState;

