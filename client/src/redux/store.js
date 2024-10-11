import { createSlice, configureStore } from "@reduxjs/toolkit"

const authSlice = createSlice({
    name: "auth",
    initialState: {
        isLogin: localStorage.getItem("isLogin") === "true" || false, // Set initial state based on local storage
        darkMode: false,
        role: localStorage.getItem("role") || null,
    },
    reducers: {
        login(state, action) {
            state.isLogin = true;
            state.role = action.payload?.role || null; // Use optional chaining and default value
            localStorage.setItem("isLogin", true); 
            localStorage.setItem("role", action.payload?.role || null); // Save role only if it exists
        },
        logout(state) {
            state.isLogin = false;
            state.role = null;
            localStorage.removeItem("isLogin");
            localStorage.removeItem("role");
        },
        toggleDarkMode(state) {
            state.darkMode = !state.darkMode;
        }
    }
});



export const authActions = authSlice.actions;

export const store = configureStore({
    reducer: {
        auth: authSlice.reducer,    }
});