import  { createSlice } from '@reduxjs/toolkit'
import { login, register, logout, passRecovery, recoveryVerification, resetPassword } from '../thunks/authThunk'
import { User } from '../../utils/types';
import { ERROR_MESSAGE, PENDING_MESSAGE, SUCCESS_MESSAGE } from '../../utils/constants';

type authState = {
  registerStatus : 'Idle' | 'Pending' | 'Success' | 'Error';
  loginStatus: 'Idle' | 'Pending' | 'Success' | 'Error';
  logoutStatus: 'Idle' | 'Pending' | 'Success' | 'Error';
  recoveryStatus: 'Idle' | 'Pending' | 'Success' | 'Error';
  recoveryVerificationStatus: 'Idle' | 'Pending' | 'Success' | 'Error';
  resetPassStatus: 'Idle' | 'Pending' | 'Success' | 'Error';
  user: User | null;
  error: string | null;
}

const initialState: authState = {
  registerStatus: 'Idle',
  loginStatus: 'Idle',
  logoutStatus: 'Idle',
  recoveryStatus: 'Idle',
  recoveryVerificationStatus: 'Idle',
  resetPassStatus: 'Idle',
  user: null,
  error: null,
} satisfies authState as authState

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loginStatus = PENDING_MESSAGE
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loginStatus = SUCCESS_MESSAGE
        state.resetPassStatus = 'Idle'
        state.recoveryStatus = 'Idle'
        state.recoveryVerificationStatus = 'Idle'
        state.user = action.payload
        state.error = null
      })
      .addCase(login.rejected, (state, action) => {
        state.loginStatus = ERROR_MESSAGE
        state.error = action?.payload ? action.payload : 'An unknown error occured'
      })

      .addCase(register.pending, (state) => {
        state.registerStatus = PENDING_MESSAGE
        state.error = null
      })
      .addCase(register.fulfilled, (state) => {
        state.registerStatus = SUCCESS_MESSAGE
        state.error = null
      })
      .addCase(register.rejected, (state, action) => {
        state.registerStatus = ERROR_MESSAGE
        state.error = action?.payload ? action.payload : 'An unknown error occured'
      })

      .addCase(logout.pending, (state) => {
        state.logoutStatus = PENDING_MESSAGE
        state.error = null
      })
      .addCase(logout.fulfilled, (state) => {
        state.logoutStatus = SUCCESS_MESSAGE
        state.user = null
        state.error = null
      })
      .addCase(logout.rejected, (state, action) => {
        state.logoutStatus = ERROR_MESSAGE,
        state.error = action?.payload ? action.payload : 'An unknown error occured'
      })

      .addCase(passRecovery.pending, (state) => {
        state.recoveryStatus = PENDING_MESSAGE
        state.error = null
      })
      .addCase(passRecovery.fulfilled, (state) => {
        state.recoveryStatus = SUCCESS_MESSAGE
        state.recoveryVerificationStatus = 'Idle'
        state.error = null
      })
      .addCase(passRecovery.rejected, (state, action) => {
        state.recoveryStatus = ERROR_MESSAGE
        state.error = action?.payload ? action.payload : 'An unknown error occured'
      })

      .addCase(recoveryVerification.pending, (state) => {
        state.recoveryVerificationStatus = PENDING_MESSAGE
        state.error = null
      })
      .addCase(recoveryVerification.fulfilled, (state) => {
        state.recoveryVerificationStatus = SUCCESS_MESSAGE
        state.resetPassStatus = 'Idle'
        state.error = null
      })
      .addCase(recoveryVerification.rejected, (state, action) => {
        state.recoveryVerificationStatus = ERROR_MESSAGE
        state.error = action?.payload ? action.payload : 'An unknown error occured'
      })

      .addCase(resetPassword.pending, (state) => {
        state.resetPassStatus = PENDING_MESSAGE
        state.error = null
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.resetPassStatus = SUCCESS_MESSAGE
        state.recoveryStatus = 'Idle'
        state.error = null
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.resetPassStatus = ERROR_MESSAGE
        state.error = action?.payload ? action.payload : 'An unknown error occured'
      })
  }
})

export const { setUser } = authSlice.actions

export default authSlice.reducer
