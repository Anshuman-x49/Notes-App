import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  loginApi,
  registerApi,
  logoutApi,
  refreshTokenApi,
  getCurrentUserApi,
} from '../../api/authApi'
import {
  getStoredAccessToken,
  getStoredRefreshToken,
  clearStoredTokens,
} from '../../api/client'

// Async Thunk: Check and rehydrate auth session on app startup
export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    const storedAccessToken = getStoredAccessToken()
    const storedRefreshToken = getStoredRefreshToken()

    if (storedAccessToken) {
      try {
        const user = await getCurrentUserApi()
        return { user, token: storedAccessToken }
      } catch {
        // Access token expired, proceed to attempt refresh
      }
    }

    if (storedRefreshToken || (typeof document !== 'undefined' && document.cookie.includes('refreshToken'))) {
      try {
        const refreshData = await refreshTokenApi()
        if (refreshData?.user) {
          return { user: refreshData.user, token: refreshData.accessToken }
        }
      } catch (err) {
        clearStoredTokens()
        return rejectWithValue(err.response?.data?.message || 'Session expired')
      }
    }

    clearStoredTokens()
    return rejectWithValue('No active session')
  }
)

// Async Thunk: User Login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const data = await loginApi({ email, password })
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
  clearStoredTokens()
  return null
})

// Async Thunk: Refresh Token
export const refreshAuthSession = createAsyncThunk(
  'auth/refreshSession',
  async (_, { rejectWithValue }) => {
    try {
      const data = await refreshTokenApi()
      return data
    } catch (err) {
      clearStoredTokens()
      return rejectWithValue(err.response?.data?.message || 'Refresh failed')
    }
  }
)

const initialState = {
  user: null,
  token: getStoredAccessToken(),
  isAuthenticated: false,
  isLoading: true, // initial check loading
  isSubmitting: false, // form submit loading
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
    },
    resetAuth: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.isLoading = false
      state.isSubmitting = false
      state.error = null
      clearStoredTokens()
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
export default authSlice.reducer
