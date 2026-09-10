import { configureStore } from '@reduxjs/toolkit'
import authReducer, { resetAuth } from './slices/authSlice'
import { setOnAuthFailedListener } from '../api/client'

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
})

// Wire up client 401 refresh failure to automatically clear Redux auth state
setOnAuthFailedListener(() => {
  store.dispatch(resetAuth())
})

export default store
