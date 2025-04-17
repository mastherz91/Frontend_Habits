"use client";

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { markHabitDoneThunk, fetchAddHabitThunk } from "@/features/habitSlice";
import { fetchHabitsThunk } from "@/features/habitSlice";
import { RootState, AppDispatch } from "@/Redux/store";
import { getCookie } from "cookies-next";
import { useEffect } from "react";


export default function Habits() {
    const dispatch = useDispatch();
    const habits = useSelector((state) => state.habits.habits);
    const status = useSelector((state) => state.habits.status);
    const user = useSelector((state) => state.user.user);
    const error = useSelector((state) => state.habits.error);
    const [name, setname] = useState("");
    const [description, setDescription] = useState("");
    const [messages, setMessages] = useState({});
    const [alertMessage, setAlertMessage] = useState("");
    const [category, setCategory] = useState("");
    const [frequency, setFrequency] = useState("");
    const [duration, setDuration] = useState("");

    const calculatedProgress = (days) => {
        return Math.min((days / 66) * 100, 100);
    };

    const handleAddHabit = () => {
        if (!name || !description) {
            setAlertMessage("Both Title and Description are required.");
            return;
        }

        const token = getCookie("habitToken");
        console.log("TOKEN DESDE COOKIE:", token);

        console.log("Enviando hábito con:", { token, name, description });

        dispatch(fetchAddHabitThunk({
            token,
            name,
            description,
            category,
            frequency,
            duration
        }));

        setname("");
        setDescription("");
        setCategory("");
        setFrequency("");
        setDuration("");
        dispatch(fetchHabitsThunk(token));
    };

    const handleMarkDone = async (id) => {
        console.log("ID del hábito marcado como hecho:", id);
        try {
            const token = getCookie("habitToken");
            console.log("TOKEN DESDE COOKIE Done:", token);

            const result = await dispatch(markHabitDoneThunk({ id, token }));

            if (markHabitDoneThunk.fulfilled.match(result)) {
                const message = result.payload;
                setMessages((prev) => ({ ...prev, [id]: message }));

                if (token) {
                    await dispatch(fetchHabitsThunk(token));
                }
            } else if (markHabitDoneThunk.rejected.match(result)) {
                const errorMsg = result.payload || "Error updating habit";
                console.error("Error in markHabitDoneThunk:", errorMsg);
                setMessages((prev) => ({ ...prev, [id]: `Error: ${errorMsg}` }));
            }
        } catch (error) {
            console.error("Unexpected error:", error);
            setMessages((prev) => ({ ...prev, [id]: "Unexpected error occurred" }));
        }

        setTimeout(() => {
            setMessages((prev) => {
                const copy = { ...prev };
                delete copy[id];
                return copy;
            });
        }, 4000);
    };

    useEffect(() => {
        const token = getCookie("habitToken");
        if (token) {
            dispatch(fetchHabitsThunk(token));
        } else {
            console.error("No se encontró el token en las cookies.");
        }
    }, [dispatch]);

    console.log("Habits cargados:", habits); // Verifica qué está llegando

    if (status === "loading") return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-center mb-6 text-black">
                Welcome to Habits List
            </h1>

            {/* Formulario para agregar hábito */}
            <div className="mt-8">
                <h2 className="text-xl font-bold mb-4 text-black">Add New Habit</h2>
                {alertMessage && (
                    <p className="text-red-500 mb-4">{alertMessage}</p>
                )}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setname(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <input
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Frecuencia</label>
                    <select
                        value={frequency}
                        onChange={(e) => setFrequency(Number(e.target.value))}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
                    >
                        <option value="">Selecciona una opción</option>
                        <option value="1">Cada día</option>
                        <option value="7">Cada semana</option>
                        <option value="30">Cada mes</option>
                        <option value="365">Cada año</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Fecha de fin</label>
                    <input
                        type="date"
                        onChange={(e) => {
                            const fechaFin = new Date(e.target.value);
                            const fechaHoy = new Date();
                            fechaHoy.setHours(0, 0, 0, 0); // quitar hora actual

                            const diferenciaEnMilisegundos = fechaFin - fechaHoy;
                            const dias = Math.ceil(diferenciaEnMilisegundos / (1000 * 60 * 60 * 24));

                            if (dias > 0) {
                                setDuration(dias.toString()); // ✅ guardamos como string, ya que duration es texto
                            } else {
                                alert("Selecciona una fecha futura válida");
                                setDuration("");
                            }
                        }}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
                    />
                </div>

                {/* Mostrar la duración calculada si existe */}
                {duration && (
                    <p className="text-sm text-gray-700 mb-4">
                        El hábito finalizará en <strong>{duration}</strong> días.
                    </p>
                )}




                <button
                    onClick={handleAddHabit}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                >
                    Add
                </button>
            </div>

            {/* Lista de hábitos */}
            {Array.isArray(habits) && habits.length === 0 && (
                <p className="text-center text-gray-500">No hay hábitos registrados aún.</p>
            )}

            <ul className="space-y-4">
                {habits.map((habit) => (
                    <li
                        key={habit._id}
                        className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition duration-300"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex flex-col justify-between items-start space-y-2 w-full">
                                <h2 className="text-2xl font-semibold text-gray-800">
                                    {habit.name}
                                </h2>

                                <div className="relative w-full h-4 bg-gray-200 rounded-full">
                                    <div
                                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-teal-400 to-teal-600 rounded-full"
                                        style={{ width: `${calculatedProgress(habit.days || 0)}%` }}
                                    ></div>
                                </div>
                            </div>

                            <button
                                className="bg-teal-400 text-black py-2 px-4 rounded-full hover:bg-teal-500 transition duration-300 ml-4"
                                onClick={() => handleMarkDone(habit._id)}
                            >
                                Done
                            </button>
                        </div>

                        {messages[habit._id] && (
                            <p className="text-sm text-green-600 font-medium mb-2">
                                {messages[habit._id]}
                            </p>
                        )}

                        <p className="text-gray-700 mb-2">
                            Description: {habit.description}
                        </p>
                        <p className="text-gray-700 mb-2">Category: {habit.category}</p>
                        <p className="text-gray-700 mb-2">Frequency: {habit.frequency}</p>
                        <p className="text-gray-700">Duration: {habit.duration}</p>
                        <p className="text-gray-700">
                            Fecha de inicio: {habit.startedaAt}
                        </p>
                        <p className="text-gray-700">
                            Última actualización: {habit.lastUpdate}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
