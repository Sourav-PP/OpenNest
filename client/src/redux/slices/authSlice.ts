import type { UserRoleType } from '@/constants/types/User';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  accessToken: string | null;
  role: UserRoleType | null;
  isAuthenticated: boolean;
  email: string | null;
  userId: string | null;
  profileImage: string | null;
  isSubmittedVerification?: boolean;
}

const initialState: AuthState = {
  accessToken: null,
  role: null,
  isAuthenticated: false,
  email: null,
  userId: null,
  profileImage: null,
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
    updateUserProfile: (
      state,
      action: PayloadAction<{ email?: string; profileImage?: string | null }>
    ) => {
      if (action.payload.email !== undefined) state.email = action.payload.email;
      if (action.payload.profileImage !== undefined) state.profileImage = action.payload.profileImage;
    },
    updateVerificationStatus: (state, action: PayloadAction<boolean>) => {
      state.isSubmittedVerification = action.payload;
    },
    logout: () => initialState,
  },
});

export const { loginSuccess, logout, updateVerificationStatus, updateUserProfile } = authSlice.actions;
export default authSlice.reducer;
