import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchRegisterUser, fetchLoginUser } from "./userApi";

// Estado inicial
const initialState = {
    user: null,
    status: 'idle',
    error: null,
};

// Thunk para registrar usuario
export const fetchRegisterUserThunk = createAsyncThunk(
    "user/fetchRegisterUser",
    async ({ username, password }, { rejectWithValue }) => {
        try {
            const response = await fetchRegisterUser(username, password);
            if (response.message === "Usuario creado correctamente") {
                return response;
            } else {
                return rejectWithValue(response.message);
            }
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Thunk para login de usuario
export const fetchLoginUserThunk = createAsyncThunk(
    "user/fetchLoginUser",
    async ({ username, password }, { rejectWithValue }) => {
        try {
            const response = await fetchLoginUser(username, password);
            if (response.message === "Usuario autenticado correctamente") {
                return response;
            } else {
                return rejectWithValue(response.message);
            }
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Slice del usuario
const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        adduser: (state, action) => {
            state.user = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRegisterUserThunk.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload;
                alert("Usuario registrado correctamente");
            })
            .addCase(fetchRegisterUserThunk.rejected, (state, action) => {
                state.status = 'failed';
                state.user = null;
                alert(action.payload || "No se pudo registrar");
            })
            .addCase(fetchLoginUserThunk.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload;
                alert("Login exitoso");
            })
            .addCase(fetchLoginUserThunk.rejected, (state, action) => {
                state.status = 'failed';
                state.user = null;
                alert(action.payload || "No se pudo iniciar sesión");
            });
    },
});

export const { adduser } = userSlice.actions;
export default userSlice.reducer;
