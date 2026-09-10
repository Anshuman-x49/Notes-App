import React from 'react'
import { Navigate, useLocation, Outlet } from 'react-router'
import { useSelector } from 'react-redux'
import { Loader2 } from 'lucide-react'

export const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth)
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f4f1eb] text-[#293b38] font-serif gap-3">
        <div className="w-12 h-12 rounded-xl bg-[#e5b46a] text-[#293b38] font-bold text-2xl flex items-center justify-center shadow-md animate-pulse">
          N
        </div>
        <div className="flex items-center gap-2 text-sm font-sans text-[#293b38]/80">
          <Loader2 className="w-4 h-4 animate-spin text-[#a26846]" />
          <span>Restoring your notebook...</span>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}

export const PublicOnlyRoute = () => {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth)

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f4f1eb] text-[#293b38] font-serif gap-3">
        <div className="w-12 h-12 rounded-xl bg-[#e5b46a] text-[#293b38] font-bold text-2xl flex items-center justify-center shadow-md animate-pulse">
          N
        </div>
        <div className="flex items-center gap-2 text-sm font-sans text-[#293b38]/80">
          <Loader2 className="w-4 h-4 animate-spin text-[#a26846]" />
          <span>Loading Notely...</span>
        </div>
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
