import React from 'react'
import { createBrowserRouter, RouterProvider } from "react-router"
import MainLayout from '../layouts/MainLayout'
import Home from '../pages/Home'

const AppRoutes = () => {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <MainLayout />,
            children : [
                {
                    index: true,
                    element: <Home />
                }
            ]
        }
    ])
  return <RouterProvider router={router} />
}

export default AppRoutes
