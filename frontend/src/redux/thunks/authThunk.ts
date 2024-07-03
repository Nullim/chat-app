import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";
import { SUCCESS_MESSAGE } from "../../utils/constants";
import { Credentials, PasswordConfirmation, Registry, User } from "../../utils/types";

export const login = createAsyncThunk<
  User, 
  Credentials, 
  { rejectValue: string }
> (
  'auth/login', 
  async (credentials: Credentials, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post('/auth/login', credentials)

      if (data.message === SUCCESS_MESSAGE) {
        return data.user
      }
    } catch (err) {
      let error
      if (err?.response?.data) {
        ({ error } = err.response.data)
      } else {
        error = err.message
      }

      if (error && typeof error === 'string') {
        return rejectWithValue(error)
      } else if (error && error.issues){
        return rejectWithValue(error.issues[0].message)
      }

      return rejectWithValue('Login failed')
    }
  }
)

export const register = createAsyncThunk<
  string, 
  Registry, 
  { rejectValue: string }
> (
  'auth/register', 
  async (credentials: Registry, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post('/auth/register', credentials)
      console.log(data)

      if (data.message === SUCCESS_MESSAGE) {
        return data.message
      }
    } catch (err) {
      let error
      if (err?.response?.data) {
        ({ error } = err.response.data)
      } else {
        error = err.message
      }

      if (error && typeof error === 'string') {
        return rejectWithValue(error)
      } else if (error && error.issues){
        return rejectWithValue(error.issues[0].message)
      }

      return rejectWithValue('Register failed')
    }
  }
)

export const passRecovery = createAsyncThunk<
  string,
  { email: string },
  { rejectValue: string }
> (
  'auth/passRecovery',
  async(email, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post('/auth/recovery', email)
      if (data.message === SUCCESS_MESSAGE) return data.message
    } catch (err) {
      let error
      if (err?.response?.data) {
        ({ error } = err.response.data)
      } else {
        error = err.message
      }

      if (error && typeof error === 'string') {
        return rejectWithValue(error)
      } else if (error && error.issues){
        return rejectWithValue(error.issues[0].message)
      }

      return rejectWithValue('Recovery failed')
    }
  }
)

export const recoveryVerification = createAsyncThunk<
  string,
  { code: string },
  { rejectValue: string }
> (
  'auth/recoveryVerification',
  async(code, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post('/auth/verify-recovery', code)
      if (data.message === SUCCESS_MESSAGE) return data.message
    } catch(err) {
      let error
      if (err?.response?.data) {
        ({ error } = err.response.data)
      } else {
        error = err.message
      }

      if (error && typeof error === 'string') {
        return rejectWithValue(error)
      } else if (error && error.issues){
        return rejectWithValue(error.issues[0].message)
      }

      return rejectWithValue('Recovery verification failed')
    }
  }
)

export const resetPassword = createAsyncThunk<
  string, 
  PasswordConfirmation,
  { rejectValue: string }
> (
  'auth/resetPassword',
  async(credentials: PasswordConfirmation, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.patch('/auth/reset-password', credentials)
      if (data.message === SUCCESS_MESSAGE) return data.message
    } catch(err) {
      let error
      if (err?.response?.data) {
        ({ error } = err.response.data)
      } else {
        error = err.message
      }

      if (error && typeof error === 'string') {
        return rejectWithValue(error)
      } else if (error && error.issues){
        return rejectWithValue(error.issues[0].message)
      }

      return rejectWithValue('Recovery verification failed')
    }
  }
)

export const logout = createAsyncThunk<
  string, 
  void, 
  { rejectValue: string }
> (
  'auth/logout', 
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post('/auth/logout')
      if (data.message === SUCCESS_MESSAGE) return data.message
    } catch (err) {
      let error
      if (err?.response?.data) {
        ({ error } = err.response.data)
      } else {
        error = err.message
      }

      if (error && typeof error === 'string') {
        return rejectWithValue(error)
      } else if (error && error.issues){
        return rejectWithValue(error.issues[0].message)
      }

      return rejectWithValue('Logout failed')
    }
  }
)
