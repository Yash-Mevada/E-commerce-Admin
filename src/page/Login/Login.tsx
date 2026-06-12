import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../store'
import { authService } from '../../services/api'
import { clearError } from '../../store/authSlice'
import { Gem, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react'
import LogoImg from '@/assets/logo.png'

const Login: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const { isLoading, error, isAuthenticated } = useAppSelector((state) => state.auth)

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true })
    }
    // Clean up any old errors on mount
    dispatch(clearError())
  }, [isAuthenticated, navigate, dispatch])

  // Clear errors when typing
  useEffect(() => {
    if (validationError) setValidationError(null)
    if (error) dispatch(clearError())
  }, [email, password])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Client-side validations
    if (!email?.trim()) {
      setValidationError('Please enter your email address.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setValidationError('Please enter a valid email address.')
      return
    }
    if (!password?.trim()) {
      setValidationError('Please enter your password.')
      return
    }

    try {
      await authService.login(email, password, dispatch)
    } catch (err) {
      // Errors handled by slice + service
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 font-sans text-slate-900 p-4 relative overflow-hidden">
      {/* Soft background glow decoration */}
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-blue-50/40 to-transparent pointer-events-none" />
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-400/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-400/5 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 p-8 sm:p-10 relative z-10 space-y-8 animate-fade-in">
        {/* Header / Logo */}
        <div className="flex flex-col items-center text-center space-y-4">
          <img src={LogoImg} alt="Velora Logo" className="size-12 rounded-2xl object-cover bg-white p-1 shadow-lg shadow-blue-500/10 select-none" />
          <div className="space-y-1">
            <h1 className="font-bold text-2xl tracking-tight text-slate-900">Velora</h1>
            <p className="text-[10px] text-cyan-600 font-bold tracking-wider uppercase">Admin Portal</p>
          </div>
          <div className="space-y-1 pt-2">
            <h2 className="text-xl font-bold text-slate-800">Welcome back</h2>
            <p className="text-slate-500 text-sm">Please sign in to access your dashboard.</p>
          </div>
        </div>

        {/* Error Alert Display */}
        {(validationError || error) && (
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl animate-shake">
            <AlertCircle className="size-5 text-red-500 shrink-0 mt-0.5" />
            <div className="text-sm text-red-700">
              {validationError || error}
            </div>
          </div>
        )}

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          {/* Email Field */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Mail className="size-5 text-slate-400" />
              </div>
              <input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                placeholder="admin@shopsphere.com"
                className="block w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 rounded-xl text-slate-900 placeholder-slate-400 text-sm transition-all outline-none"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Password
              </label>
              <a
                href="#"
                className="text-xs font-medium text-blue-600 hover:text-blue-500 transition-colors"
                onClick={(e) => e.preventDefault()}
              >
                Forgot password?
              </a>
            </div>
            <div className="relative rounded-xl shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock className="size-5 text-slate-400" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                placeholder="••••••••"
                className="block w-full pl-11 pr-11 py-3 bg-slate-50/50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 rounded-xl text-slate-900 placeholder-slate-400 text-sm transition-all outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none bg-transparent border-none p-0 cursor-pointer"
              >
                {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 bg-white border-slate-300 text-blue-600 focus:ring-blue-500/50 rounded cursor-pointer"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600 cursor-pointer select-none">
              Remember this device
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 disabled:opacity-50 disabled:cursor-not-allowed border-none cursor-pointer mt-4"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="size-4.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Signing in...</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <span>Sign In</span>
                <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center text-xs text-slate-400 border-t border-slate-100 pt-6">
          <span>&copy; {new Date().getFullYear()} Velora Admin. All rights reserved.</span>
        </div>
      </div>
    </div>
  )
}

export default Login
