import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  loginApi,
  registerApi,
  logoutApi,
  refreshTokenApi,
} from '../../api/authApi'
import { setAccessToken, clearAccessToken } from '../../api/client'

// Async Thunk: Check and rehydrate auth session on app startup via httpOnly cookie
export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      // Attempt silent token refresh using the httpOnly cookie sent by browser
      const refreshData = await refreshTokenApi()
      if (refreshData?.user && refreshData?.accessToken) {
        setAccessToken(refreshData.accessToken)
        return { user: refreshData.user, token: refreshData.accessToken }
      }
      clearAccessToken()
      return rejectWithValue('No active session')
    } catch {
      clearAccessToken()
      return rejectWithValue('No active session')
    }
  }
)

// Async Thunk: User Login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const data = await loginApi({ email, password })
      if (data?.accessToken) {
        setAccessToken(data.accessToken)
      }
      return data
    } catch (err) {
      const message =
        err.response?.data?.message ||
        (err.code === 'ERR_NETWORK'
          ? 'Cannot connect to backend server. Make sure the server is running on port 3000.'
          : 'Invalid email or password.')
      return rejectWithValue(message)
    }
  }
)

// Async Thunk: User Registration
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ username, email, password }, { rejectWithValue }) => {
    try {
      const data = await registerApi({ username, email, password })
      if (data?.accessToken) {
        setAccessToken(data.accessToken)
      }
      return data
    } catch (err) {
      const message =
        err.response?.data?.message ||
        (err.code === 'ERR_NETWORK'
          ? 'Cannot connect to backend server. Make sure the server is running on port 3000.'
          : 'Registration failed. Please check your information.')
      return rejectWithValue(message)
    }
  }
)

// Async Thunk: User Logout
export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  await logoutApi()
  clearAccessToken()
  return null
})

// Async Thunk: Manual Refresh Token Trigger
export const refreshAuthSession = createAsyncThunk(
  'auth/refreshSession',
  async (_, { rejectWithValue }) => {
    try {
      const data = await refreshTokenApi()
      if (data?.accessToken) {
        setAccessToken(data.accessToken)
      }
      return data
    } catch (err) {
      clearAccessToken()
      return rejectWithValue(err.response?.data?.message || 'Refresh failed')
    }
  }
)

// Redux State: Access token is stored strictly in memory (state.token)
const initialState = {
  user: null,
  token: null, // Strictly in-memory Redux state, never in localStorage
  isAuthenticated: false,
  isLoading: true, // Initial session check
  isSubmitting: false, // Form submissions
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null
    },
    setCredentials: (state, action) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = Boolean(action.payload.user)
      state.isLoading = false
      if (action.payload.token) {
        setAccessToken(action.payload.token)
      }
    },
    resetAuth: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.isLoading = false
      state.isSubmitting = false
      state.error = null
      clearAccessToken()
    },
  },
  extraReducers: (builder) => {
    builder
      // checkAuth
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = Boolean(action.payload.user)
        state.isLoading = false
        state.error = null
      })
      .addCase(checkAuth.rejected, (state) => {
        state.user = null
        state.token = null
        state.isAuthenticated = false
        state.isLoading = false
      })

      // loginUser
      .addCase(loginUser.pending, (state) => {
        state.isSubmitting = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user
        state.token = action.payload.accessToken
        state.isAuthenticated = true
        state.isSubmitting = false
        state.error = null
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isSubmitting = false
        state.error = action.payload || 'Login failed'
      })

      // registerUser
      .addCase(registerUser.pending, (state) => {
        state.isSubmitting = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload.user
        state.token = action.payload.accessToken
        state.isAuthenticated = true
        state.isSubmitting = false
        state.error = null
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isSubmitting = false
        state.error = action.payload || 'Registration failed'
      })

      // logoutUser
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
        state.token = null
        state.isAuthenticated = false
        state.isLoading = false
        state.isSubmitting = false
        state.error = null
      })

      // refreshAuthSession
      .addCase(refreshAuthSession.fulfilled, (state, action) => {
        if (action.payload?.user) {
          state.user = action.payload.user
        }
        if (action.payload?.accessToken) {
          state.token = action.payload.accessToken
        }
        state.isAuthenticated = true
      })
      .addCase(refreshAuthSession.rejected, (state) => {
        state.user = null
        state.token = null
        state.isAuthenticated = false
      })
  },
})

export const { clearAuthError, setCredentials, resetAuth } = authSlice.actions

const authReducer = authSlice.reducer
export default authReducer
