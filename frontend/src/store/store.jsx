import { configureStore } from '@reduxjs/toolkit'
import authReducer, { resetAuth, setCredentials } from './slices/authSlice'
import { setOnAuthFailedListener, setOnTokenRefreshedListener } from '../api/client'

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
})

// Wire up client 401 refresh success to keep Redux in-memory state updated
setOnTokenRefreshedListener(({ token, user }) => {
  store.dispatch(setCredentials({ token, user }))
})

// Wire up client 401 refresh failure to automatically reset Redux auth state
setOnAuthFailedListener(() => {
  store.dispatch(resetAuth())
})

export default store
