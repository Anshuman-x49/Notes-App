import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useLocation } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser, clearAuthError } from '../store/slices/authSlice'
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, ArrowRight } from 'lucide-react'

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const { isSubmitting, error: authError, isAuthenticated } = useSelector(
    (state) => state.auth
  )

  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  // Clear any existing auth errors when the login component mounts
  useEffect(() => {
    dispatch(clearAuthError())
  }, [dispatch])

  // Navigate on successful login
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, navigate, from])

  const onSubmit = async (data) => {
    dispatch(loginUser({ email: data.email, password: data.password }))
  }

  return (
    <div>
      <h2 className="text-xl font-serif text-[#293b38] mb-1">
        Sign In
      </h2>
      <p className="text-xs font-sans text-[#8c928d] mb-6">
        Enter your credentials to access your notes and favorites.
      </p>

      {/* Server Error Alert */}
      {authError && (
        <div
          role="alert"
          className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200/80 text-rose-700 flex items-start gap-2.5 text-xs font-sans"
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
          <div className="flex-1 leading-relaxed">{authError}</div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 font-sans text-xs">
        {/* Email Field */}
        <div>
          <label
            htmlFor="login-email"
            className="block font-medium text-[#293b38] mb-1.5"
          >
            Email Address
          </label>
          <div className="relative flex items-center bg-white border border-[#d9d4cb] focus-within:border-[#a26846] focus-within:ring-2 focus-within:ring-[#a26846]/20 rounded-xl px-3 py-2.5 transition-all shadow-2xs">
            <Mail className="w-4 h-4 text-[#8c928d] mr-2.5 shrink-0" />
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              placeholder="author@notely.app"
              className="w-full bg-transparent text-[#29312f] placeholder-stone-400 outline-none"
              {...register('email', {
                required: 'Email address is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Please enter a valid email address',
                },
              })}
            />
          </div>
          {errors.email && (
            <p className="text-[11px] text-rose-600 mt-1 font-sans">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label
            htmlFor="login-password"
            className="block font-medium text-[#293b38] mb-1.5"
          >
            Password
          </label>
          <div className="relative flex items-center bg-white border border-[#d9d4cb] focus-within:border-[#a26846] focus-within:ring-2 focus-within:ring-[#a26846]/20 rounded-xl px-3 py-2.5 transition-all shadow-2xs">
            <Lock className="w-4 h-4 text-[#8c928d] mr-2.5 shrink-0" />
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full bg-transparent text-[#29312f] placeholder-stone-400 outline-none pr-8"
              {...register('password', {
                required: 'Password is required',
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 text-[#8c928d] hover:text-[#293b38] transition-colors p-1"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-[11px] text-rose-600 mt-1 font-sans">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-2 py-3 px-4 rounded-xl bg-[#293b38] hover:bg-[#344b47] active:scale-[0.99] text-[#f7f4ed] font-sans font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-60 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-[#e5b46a]" />
              <span>Signing In...</span>
            </>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#e5b46a]" />
            </>
          )}
        </button>
      </form>

      {/* Switch to Register */}
      <div className="mt-6 pt-5 border-t border-[#e8e4dc] text-center font-sans text-xs text-[#707c77]">
        Don&apos;t have an account yet?{' '}
        <Link
          to="/register"
          className="text-[#a26846] hover:text-[#7f4a2b] font-semibold underline underline-offset-2 transition-colors ml-1"
        >
          Create journal
        </Link>
      </div>
    </div>
  )
}

export default Login
