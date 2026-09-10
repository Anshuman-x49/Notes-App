import client, {
  getStoredRefreshToken,
  setStoredAccessToken,
  setStoredRefreshToken,
  clearStoredTokens,
} from './client'

/**
 * Register a new user
 * POST /api/auth/register
 */
export const registerApi = async ({ username, email, password }) => {
  const response = await client.post('/api/auth/register', {
    username,
    email,
    password,
  })

  const { accessToken, refreshToken, data } = response.data
  if (accessToken) {
    setStoredAccessToken(accessToken)
  }
  if (refreshToken) {
    setStoredRefreshToken(refreshToken)
  }

  return {
    user: data?.user,
    accessToken,
  }
}

/**
 * Login existing user
 * POST /api/auth/login
 */
export const loginApi = async ({ email, password }) => {
  const response = await client.post('/api/auth/login', {
    email,
    password,
  })

  const { accessToken, refreshToken, data } = response.data
  if (accessToken) {
    setStoredAccessToken(accessToken)
  }
  if (refreshToken) {
    setStoredRefreshToken(refreshToken)
  }

  return {
    user: data?.user,
    accessToken,
  }
}

/**
 * Refresh access token
 * POST /api/auth/refresh
 */
export const refreshTokenApi = async () => {
  const refreshToken = getStoredRefreshToken()
  const response = await client.post('/api/auth/refresh', {
    refreshToken,
  })

  const { accessToken, refreshToken: newRefreshToken, data } = response.data
  if (accessToken) {
    setStoredAccessToken(accessToken)
  }
  if (newRefreshToken) {
    setStoredRefreshToken(newRefreshToken)
  }

  return {
    user: data?.user,
    accessToken,
  }
}

/**
 * Get current authenticated user
 * GET /api/auth/get-user
 */
export const getCurrentUserApi = async () => {
  const response = await client.get('/api/auth/get-user')
  return response.data?.data?.user
}

/**
 * Logout user and clear tokens
 * POST /api/auth/logout
 */
export const logoutApi = async () => {
  try {
    const refreshToken = getStoredRefreshToken()
    await client.post('/api/auth/logout', { refreshToken })
  } catch (error) {
    console.warn('Backend logout request failed or session already cleared:', error)
  } finally {
    clearStoredTokens()
  }
}
