import { createBrowserRouter, RouterProvider } from "react-router"
import MainLayout from '../layouts/MainLayout'
import Home from '../pages/Home'
import NotFound from '../pages/NotFound'

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: "favorites",
        element: <Home />
      },
      {
        path: "note/:id",
        element: <Home />
      },
      {
        path: "*",
        element: <NotFound />
      }
    ]
  }
])

const AppRoutes = () => {
  return <RouterProvider router={router} />
}

export default AppRoutes
