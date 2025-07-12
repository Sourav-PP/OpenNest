import { createSlice } from "@reduxjs/toolkit";


interface AuthState {
    accessToken: string | null,
    role: "user" | "psychologist" | "admin" | null,
    isAuthenticated: boolean
    email: string | null,
    userId: string | null
}

const initialState: AuthState = {
    accessToken: null,
    role: null,
    isAuthenticated: false,
    email: null,
    userId: null
}

const authSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        loginSuccess(state, action) {
            const { accessToken, role, email, userId } = action.payload
            state.accessToken = accessToken;
            state.role = role;
            state.email = email;
            state.userId = userId
            state.isAuthenticated = true
        },
        logout(state) {
            state.accessToken = null;
            state.role = null;
            state.isAuthenticated = false;
            state.email = null;
            state.userId = null;
        }
    }
})

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;