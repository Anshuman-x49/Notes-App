import axios from 'axios'

// In development, target http://localhost:3000 if not proxying, or relative URL if proxied
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? 'http://localhost:3000' : '')

// In-Memory access token storage (never written to localStorage)
let inMemoryAccessToken = null

export const getAccessToken = () => inMemoryAccessToken

export const setAccessToken = (token) => {
  inMemoryAccessToken = token || null
}

export const clearAccessToken = () => {
  inMemoryAccessToken = null
}

// Global subscribers for auth synchronization with Redux store
let onAuthFailedListener = null
export const setOnAuthFailedListener = (callback) => {
  onAuthFailedListener = callback
}

let onTokenRefreshedListener = null
export const setOnTokenRefreshedListener = (callback) => {
  onTokenRefreshedListener = callback
}

// Primary axios instance configured with credentials for httpOnly cookies
const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// Request interceptor — attach in-memory access token
client.interceptors.request.use(
  (config) => {
    const token = getAccessToken()
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
        // Call refresh endpoint directly (httpOnly cookie automatically sent with credentials)
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/api/auth/refresh`,
          {},
          {
            withCredentials: true,
            headers: { 'Content-Type': 'application/json' },
          }
        )

        const newAccessToken = refreshResponse.data?.accessToken
        const user = refreshResponse.data?.data?.user

        if (!newAccessToken) {
          throw new Error('No access token returned from refresh endpoint')
        }

        // Store new access token in memory
        setAccessToken(newAccessToken)

        // Notify Redux store of token refresh
        if (typeof onTokenRefreshedListener === 'function') {
          onTokenRefreshedListener({ token: newAccessToken, user })
        }

        // Update default header on client and active request
        client.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

        // Resolve queued requests
        processQueue(null, newAccessToken)

        return client(originalRequest)
      } catch (refreshErr) {
        processQueue(refreshErr, null)
        clearAccessToken()

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
