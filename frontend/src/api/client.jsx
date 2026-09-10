import axios from 'axios'

// In development, target http://localhost:3000 if not proxying, or relative URL if proxied
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? 'http://localhost:3000' : '')

// Storage keys
const ACCESS_TOKEN_KEY = 'notely_access_token'
const REFRESH_TOKEN_KEY = 'notely_refresh_token'

export const getStoredAccessToken = () => {
  try {
    return localStorage.getItem(ACCESS_TOKEN_KEY)
  } catch {
    return null
  }
}

export const setStoredAccessToken = (token) => {
  try {
    if (token) {
      localStorage.setItem(ACCESS_TOKEN_KEY, token)
    } else {
      localStorage.removeItem(ACCESS_TOKEN_KEY)
    }
  } catch (e) {
    console.warn('Could not store access token:', e)
  }
}

export const getStoredRefreshToken = () => {
  try {
    return localStorage.getItem(REFRESH_TOKEN_KEY)
  } catch {
    return null
  }
}

export const setStoredRefreshToken = (token) => {
  try {
    if (token) {
      localStorage.setItem(REFRESH_TOKEN_KEY, token)
    } else {
      localStorage.removeItem(REFRESH_TOKEN_KEY)
    }
  } catch (e) {
    console.warn('Could not store refresh token:', e)
  }
}

export const clearStoredTokens = () => {
  try {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  } catch (e) {
    console.warn('Could not clear stored tokens:', e)
  }
}

// Global subscriber for auth state invalidation (e.g. refresh token failure)
let onAuthFailedListener = null
export const setOnAuthFailedListener = (callback) => {
  onAuthFailedListener = callback
}

// Primary axios instance
const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// Request interceptor — attach access token
client.interceptors.request.use(
  (config) => {
    const token = getStoredAccessToken()
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor with refresh token queuing
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (!error.response) {
      return Promise.reject(error)
    }

    const { status } = error.response
    const isAuthEndpoint =
      originalRequest.url?.includes('/api/auth/login') ||
      originalRequest.url?.includes('/api/auth/register') ||
      originalRequest.url?.includes('/api/auth/refresh')

    // Only attempt refresh on 401 for non-auth requests that haven't been retried
    if (status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      if (isRefreshing) {
        // Queue the request until refreshing finishes
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return client(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const refreshToken = getStoredRefreshToken()
        // Call refresh endpoint directly using raw axios to bypass client interceptors
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/api/auth/refresh`,
          { refreshToken },
          {
            withCredentials: true,
            headers: { 'Content-Type': 'application/json' },
          }
        )

        const newAccessToken = refreshResponse.data?.accessToken
        const newRefreshToken = refreshResponse.data?.refreshToken

        if (!newAccessToken) {
          throw new Error('No access token returned from refresh endpoint')
        }

        // Store new tokens
        setStoredAccessToken(newAccessToken)
        if (newRefreshToken) {
          setStoredRefreshToken(newRefreshToken)
        }

        // Update default header on client
        client.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

        // Resolve queued requests
        processQueue(null, newAccessToken)

        return client(originalRequest)
      } catch (refreshErr) {
        processQueue(refreshErr, null)
        clearStoredTokens()

        if (typeof onAuthFailedListener === 'function') {
          onAuthFailedListener()
        }

        return Promise.reject(refreshErr)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default client
