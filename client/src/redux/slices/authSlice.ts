import type { UserRoleType } from '@/constants/User';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  accessToken: string | null;
  role: UserRoleType | null;
  isAuthenticated: boolean;
  email: string | null;
  userId: string | null;
  isSubmittedVerification?: boolean;
}

const initialState: AuthState = {
  accessToken: null,
  role: null,
  isAuthenticated: false,
  email: null,
  userId: null,
  isSubmittedVerification: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<Omit<AuthState, 'isAuthenticated'>>) => {
      return {
        ...action.payload,
        isAuthenticated: true,
      };
    },
    updateVerificationStatus: (state, action: PayloadAction<boolean>) => {
      state.isSubmittedVerification = action.payload;
    },
    logout: () => initialState,
  },
});

export const { loginSuccess, logout, updateVerificationStatus } = authSlice.actions;
export default authSlice.reducer;
