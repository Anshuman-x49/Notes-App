import React from 'react'
import { Link } from 'react-router'

const NotFound = () => {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#f4f1eb] font-serif p-6 text-center">
      <div className="max-w-md space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-[#e5b46a] text-[#293b38] font-bold text-3xl flex items-center justify-center mx-auto shadow-md">
          404
        </div>
        <h1 className="text-3xl font-bold text-[#263532]">Page Not Found</h1>
        <p className="text-sm font-sans text-stone-600 leading-relaxed">
          The page or route you are looking for does not exist or has been moved.
        </p>
        <div className="pt-4 font-sans">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-5 py-2.5 bg-[#293b38] hover:bg-[#38504b] text-[#f7f4ed] font-semibold text-xs rounded-xl shadow-xs transition-all"
          >
            ← Back to Notes
          </Link>
        </div>
      </div>
    </main>
  )
}

export default NotFound
