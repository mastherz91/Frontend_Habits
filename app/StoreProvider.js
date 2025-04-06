"use client";
import { useRef } from "react";
import { Provider } from "react-redux";
import { makeStore } from "../Redux/store";



export default function StoreProvider({ children }) {
    const store = useRef(null);

    if (!store.current) {
        store.current = makeStore();
    }

    return <Provider store={store.current}>{children}</Provider>;
}

