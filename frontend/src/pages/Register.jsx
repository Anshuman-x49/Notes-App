import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { registerUser, clearAuthError } from '../store/slices/authSlice'
import { User, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, ArrowRight } from 'lucide-react'

const Register = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { isSubmitting, error: authError, isAuthenticated } = useSelector(
    (state) => state.auth
  )

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const passwordValue = watch('password')

  // Clear any existing auth errors when the register component mounts
  useEffect(() => {
    dispatch(clearAuthError())
  }, [dispatch])

  // Navigate on successful registration
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const onSubmit = async (data) => {
    dispatch(
      registerUser({
        username: data.username,
        email: data.email,
        password: data.password,
      })
    )
  }

  return (
    <div>
      <h2 className="text-xl font-serif text-[#293b38] mb-1">
        Create Account
      </h2>
      <p className="text-xs font-sans text-[#8c928d] mb-6">
        Fill in your details below to register your journal.
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
        {/* Username Field */}
        <div>
          <label
            htmlFor="register-username"
            className="block font-medium text-[#293b38] mb-1.5"
          >
            Username
          </label>
          <div className="relative flex items-center bg-white border border-[#d9d4cb] focus-within:border-[#a26846] focus-within:ring-2 focus-within:ring-[#a26846]/20 rounded-xl px-3 py-2.5 transition-all shadow-2xs">
            <User className="w-4 h-4 text-[#8c928d] mr-2.5 shrink-0" />
            <input
              id="register-username"
              type="text"
              autoComplete="username"
              placeholder="hemingway"
              className="w-full bg-transparent text-[#29312f] placeholder-stone-400 outline-none"
              {...register('username', {
                required: 'Username is required',
                minLength: {
                  value: 3,
                  message: 'Username must be at least 3 characters',
                },
                pattern: {
                  value: /^[a-zA-Z0-9_-]+$/,
                  message: 'Letters, numbers, underscores, and dashes only',
                },
              })}
            />
          </div>
          {errors.username && (
            <p className="text-[11px] text-rose-600 mt-1 font-sans">
              {errors.username.message}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label
            htmlFor="register-email"
            className="block font-medium text-[#293b38] mb-1.5"
          >
            Email Address
          </label>
          <div className="relative flex items-center bg-white border border-[#d9d4cb] focus-within:border-[#a26846] focus-within:ring-2 focus-within:ring-[#a26846]/20 rounded-xl px-3 py-2.5 transition-all shadow-2xs">
            <Mail className="w-4 h-4 text-[#8c928d] mr-2.5 shrink-0" />
            <input
              id="register-email"
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
            htmlFor="register-password"
            className="block font-medium text-[#293b38] mb-1.5"
          >
            Password
          </label>
          <div className="relative flex items-center bg-white border border-[#d9d4cb] focus-within:border-[#a26846] focus-within:ring-2 focus-within:ring-[#a26846]/20 rounded-xl px-3 py-2.5 transition-all shadow-2xs">
            <Lock className="w-4 h-4 text-[#8c928d] mr-2.5 shrink-0" />
            <input
              id="register-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="At least 6 characters"
              className="w-full bg-transparent text-[#29312f] placeholder-stone-400 outline-none pr-8"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
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

        {/* Confirm Password Field */}
        <div>
          <label
            htmlFor="register-confirm-password"
            className="block font-medium text-[#293b38] mb-1.5"
          >
            Confirm Password
          </label>
          <div className="relative flex items-center bg-white border border-[#d9d4cb] focus-within:border-[#a26846] focus-within:ring-2 focus-within:ring-[#a26846]/20 rounded-xl px-3 py-2.5 transition-all shadow-2xs">
            <Lock className="w-4 h-4 text-[#8c928d] mr-2.5 shrink-0" />
            <input
              id="register-confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Repeat your password"
              className="w-full bg-transparent text-[#29312f] placeholder-stone-400 outline-none pr-8"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (val) =>
                  val === passwordValue || 'Passwords do not match',
              })}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 text-[#8c928d] hover:text-[#293b38] transition-colors p-1"
              aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
            >
              {showConfirmPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-[11px] text-rose-600 mt-1 font-sans">
              {errors.confirmPassword.message}
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
              <span>Creating Account...</span>
            </>
          ) : (
            <>
              <span>Create Account</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#e5b46a]" />
            </>
          )}
        </button>
      </form>

      {/* Switch to Login */}
      <div className="mt-6 pt-5 border-t border-[#e8e4dc] text-center font-sans text-xs text-[#707c77]">
        Already have a journal?{' '}
        <Link
          to="/login"
          className="text-[#a26846] hover:text-[#7f4a2b] font-semibold underline underline-offset-2 transition-colors ml-1"
        >
          Sign In
        </Link>
      </div>
    </div>
  )
}

export default Register
