import React, { useEffect, useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/store'
import { authService } from '@/services/api'
import { updateProfile } from '@/store/authSlice'
import { User, Mail, Shield, Award, Clock, Phone } from 'lucide-react'

const Profile: React.FC = () => {
  const { user, token } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return
      try {
        setLoading(true)
        setError(null)
        const profileData = await authService.getProfile(token)

        // Update user state in Redux store
        dispatch(
          updateProfile({
            email: profileData.email,
            name: `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim() || user?.name || 'Administrator',
            first_name: profileData.first_name,
            last_name: profileData.last_name,
            phone_number: profileData.phone_number,
            role: profileData.role,
          })
        )
      } catch (err: any) {
        setError(err.message || 'Failed to load profile details.')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [token, dispatch, user?.name])

  const initials = user?.name
    ? user.name
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
    : 'U'

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <div className="h-8 w-48 bg-slate-200 rounded-lg animate-pulse" />
          <div className="h-4 w-64 bg-slate-100 rounded-lg animate-pulse mt-2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Avatar Skeleton */}
          <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-sm flex flex-col items-center space-y-4">
            <div className="size-24 rounded-2xl bg-slate-100 animate-pulse" />
            <div className="h-5 w-32 bg-slate-150 rounded-lg animate-pulse" />
            <div className="h-4 w-20 bg-slate-100 rounded-lg animate-pulse" />
          </div>

          {/* Form Skeleton */}
          <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-slate-150 shadow-sm space-y-5">
            <div className="h-6 w-1/4 bg-slate-150 rounded-lg animate-pulse border-b pb-3" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <div className="h-3 w-16 bg-slate-100 rounded" />
                <div className="h-10 bg-slate-50 rounded-xl border animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="h-3 w-16 bg-slate-100 rounded" />
                <div className="h-10 bg-slate-50 rounded-xl border animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-12 bg-red-50 text-red-800 p-6 rounded-2xl border border-red-150 text-center space-y-4 shadow-sm">
        <p className="text-sm font-semibold">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold cursor-pointer border-none shadow-md transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Profile Settings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your administrative account preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Avatar & Summary Card */}
        <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-150 dark:border-slate-800 shadow-sm flex flex-col items-center text-center space-y-4">
          <div className="relative size-24 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-bold text-3xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            {initials}
          </div>

          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">{user?.name}</h2>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400">
              <Shield className="size-3.5" />
              <span>{user?.role || 'Super Admin'}</span>
            </div>
          </div>

          <div className="w-full border-t border-slate-100 dark:border-slate-800 pt-4 space-y-3 text-left">
            <div className="flex items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400">
              <Clock className="size-4 text-slate-400 dark:text-slate-500" />
              <span>Session: Active</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400">
              <Award className="size-4 text-slate-400 dark:text-slate-500" />
              <span>Role: Full Access Rights</span>
            </div>
          </div>
        </div>

        {/* Right Column: Profile Form Details */}
        <div className="md:col-span-2 bg-white dark:bg-slate-950 p-6 sm:p-8 rounded-2xl border border-slate-150 dark:border-slate-800 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-3">
            Account Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* First Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                First Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="size-4 text-slate-400 dark:text-slate-500" />
                </div>
                <input
                  type="text"
                  readOnly
                  value={user?.first_name || user?.name?.split(' ')[0] || ''}
                  className="block w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 text-sm focus:outline-none cursor-default font-medium"
                />
              </div>
            </div>

            {/* Last Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Last Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="size-4 text-slate-400 dark:text-slate-500" />
                </div>
                <input
                  type="text"
                  readOnly
                  value={user?.last_name || user?.name?.split(' ').slice(1).join(' ') || ''}
                  className="block w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 text-sm focus:outline-none cursor-default font-medium"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="size-4 text-slate-400 dark:text-slate-500" />
                </div>
                <input
                  type="email"
                  readOnly
                  value={user?.email || ''}
                  className="block w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 text-sm focus:outline-none cursor-default font-medium"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="size-4 text-slate-400 dark:text-slate-500" />
                </div>
                <input
                  type="text"
                  readOnly
                  value={user?.phone_number || 'N/A'}
                  className="block w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 text-sm focus:outline-none cursor-default font-medium"
                />
              </div>
            </div>

            {/* System Role */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                System Role
              </label>
              <input
                type="text"
                readOnly
                value={user?.role || 'Super Administrator'}
                className="block w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 text-sm focus:outline-none cursor-default font-medium"
              />
            </div>

            {/* Clearance Level */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Clearance Level
              </label>
              <input
                type="text"
                readOnly
                value="Level 3 (Full Access)"
                className="block w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 text-sm focus:outline-none cursor-default font-medium"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
