import { createSlice, type PayloadAction } from "@reduxjs/toolkit";


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
        loginSuccess: (state, action: PayloadAction<Omit<AuthState, "isAuthenticated">>) => {
            return {
                ...action.payload,
                isAuthenticated: false
            }
        },
        logout: () =>initialState
    }
})

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;