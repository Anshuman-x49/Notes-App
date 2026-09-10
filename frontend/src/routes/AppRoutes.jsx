import { useEffect } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router'
import { useDispatch } from 'react-redux'
import { checkAuth } from '../store/slices/authSlice'
import AuthLayout from '../layouts/AuthLayout'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import NotFound from '../pages/NotFound'
import { ProtectedRoute, PublicOnlyRoute } from './ProtectedRoute'

const router = createBrowserRouter([
  {
    element: <PublicOnlyRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: 'login',
            element: <Login />,
          },
          {
            path: 'register',
            element: <Register />,
          },
        ],
      },
    ],
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <Home />,
      },
    ],
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        path: 'favorites',
        element: <Home />,
      },
      {
        path: 'note/:id',
        element: <Home />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
])

const AppRoutes = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(checkAuth())
  }, [dispatch])

  return <RouterProvider router={router} />
}

export default AppRoutes
