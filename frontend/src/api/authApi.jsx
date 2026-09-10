import client, { setAccessToken, clearAccessToken } from './client'

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

  const { accessToken, data } = response.data
  if (accessToken) {
    setAccessToken(accessToken)
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

  const { accessToken, data } = response.data
  if (accessToken) {
    setAccessToken(accessToken)
  }

  return {
    user: data?.user,
    accessToken,
  }
}

/**
 * Refresh access token
 * POST /api/auth/refresh
 * (HttpOnly cookie is automatically attached by browser)
 */
export const refreshTokenApi = async () => {
  const response = await client.post('/api/auth/refresh', {})

  const { accessToken, data } = response.data
  if (accessToken) {
    setAccessToken(accessToken)
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
 * Logout user
 * POST /api/auth/logout
 */
export const logoutApi = async () => {
  try {
    await client.post('/api/auth/logout', {})
  } catch (error) {
    console.warn('Backend logout request failed or session already cleared:', error)
  } finally {
    clearAccessToken()
  }
}
