import React from 'react'
import { Outlet } from 'react-router'
import { ShieldCheck } from 'lucide-react'

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-[#f4f1eb] flex flex-col justify-center items-center px-4 py-8 sm:px-6 lg:px-8 font-serif">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#e5b46a] text-[#293b38] font-bold text-2xl shadow-sm mb-3">
            N
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#263532] tracking-tight">
            Notely
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm font-sans text-[#707c77]">
            Capture your thoughts in vintage clarity.
          </p>
        </div>

        {/* Auth Card Container */}
        <div className="bg-[#fbfaf7] border border-[#d9d4cb] rounded-2xl p-6 sm:p-8 shadow-sm">
          <Outlet />
        </div>

        {/* Security / Refresh Token Badge */}
        <div className="mt-6 flex items-center justify-center gap-2 text-[11px] font-sans text-[#8c928d]">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Protected with automatic JWT refresh sessions</span>
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
