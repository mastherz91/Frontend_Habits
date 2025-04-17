import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchHabits, fetchAddHabit, fetchDone } from "./habitAPI";

// Acción asíncrona para obtener los hábitos
export const fetchHabitsThunk = createAsyncThunk('habits/fetchHabits', async (token, { rejectWithValue }) => {
    const response = await fetchHabits(token);

    console.log("Respuesta del backend (GET /habits):", response);
    if (!response) {
        return rejectWithValue(response.error || "Failed to fetch habits");
    }
    return response;
});

export const markHabitDoneThunk = createAsyncThunk(
    'habits/markHabitDone',
    async ({ id, token }, { dispatch, rejectWithValue }) => {
        console.log("ID del hábito:_4", id);
        try {
            const response = await fetchDone({ id, token });

            if (!response) {
                console.error("Backend error:", response);
                return rejectWithValue(response.error || "Failed to mark habit as done");

            } else if (response.message === "Habit restarted") {
                console.log("Hábito reiniciado:", response);
                await dispatch(fetchHabitsThunk(token)); // Recargar hábitos después de reiniciar
                return response;

            } else {
                await dispatch(fetchHabitsThunk(token)); //   Recargar hábitos después de marcar como hecho
                return response;
            }
        } catch (error) {
            console.error("Network error:", error);
            return rejectWithValue(error.message);
        }
    }
);



export const fetchAddHabitThunk = createAsyncThunk(
    'habits/fetchAddHabit',
    async ({ token, name, description, category, frequency, duration }, { rejectWithValue }) => {
        try {
            const response = await fetchAddHabit({ token, name, description, category, frequency, duration });
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Estado inicial
const initialState = {
    habits: [],
    loading: false,
    error: ''
};

// Slice de hábitos
const habitSlice = createSlice({
    name: 'habits',
    initialState,
    reducers: {
        addHabits: (state, action) => {
            state.habits = action.payload;
        },
        addHabit: (state, action) => {
            state.habits.push(action.payload);
        },
        removeHabit: (state, action) => {
            state.habits = state.habits.filter(habit => habit.id !== action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchHabitsThunk.fulfilled, (state, action) => {
                state.habits = action.payload;
                console.log("Habits fetched:", action.payload);
            })
            .addCase(fetchHabitsThunk.rejected, (state, action) => {
                state.error = action.payload;
                console.error("Error al cargar hábitos:", action.payload); // 
            })
            .addCase(markHabitDoneThunk.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(markHabitDoneThunk.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(fetchAddHabitThunk.fulfilled, (state, action) => {
                state.habits.push(action.payload);
                state.status = 'succeeded';
                state.error = null;
            });
    }






});

export const { addHabits, addHabit, removeHabit } = habitSlice.actions;
export default habitSlice.reducer;