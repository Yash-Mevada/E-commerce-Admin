import React, { useEffect } from 'react'
import { useFormik } from 'formik'
import { CustomModal } from '@/components/CustomModal'
import { CustomInput } from '@/components/CustomInput'
import { CustomSelect } from '@/components/CustomSelect'
import { CustomLabel } from '@/components/CustomLabel'
import { CustomPhoneInput } from '@/components/CustomPhoneInput'
import { Button } from '@/components/ui/button'
import { createUser } from '@/store/user/userCrud'
import { CustomError } from '@/components/CustomError'
import { addUserValidationSchema } from '../utils/validation'

interface AddUserModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  token: string | null
}

export const AddUserModal: React.FC<AddUserModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  token,
}) => {
  const formik = useFormik({
    initialValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      role: 'user',
      password: '',
    },
    validationSchema: addUserValidationSchema,
    validateOnBlur: false,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      if (!token) return
      try {
        setStatus(null)
        await createUser(token, values)
        formik.resetForm()
        onClose()
        onSuccess()
      } catch (err: any) {
        setStatus(err?.message || 'Failed to create user.')
      } finally {
        setSubmitting(false)
      }
    },
  })

  // Reset form when modal is closed/opened
  useEffect(() => {
    if (isOpen) {
      formik.resetForm()
    }
  }, [isOpen])

  const password = formik.values.password || ''
  const reqMinLength = password.length >= 8
  const reqAlpha = /[a-z]/.test(password) && /[A-Z]/.test(password)
  const reqNumSpecial = /[0-9]/.test(password) && /[^a-zA-Z0-9]/.test(password)

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New User"
    >
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
        {formik.status && (
          <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-100 font-medium">
            {formik.status}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <CustomLabel required>First Name</CustomLabel>
            <CustomInput
              name="first_name"
              value={formik.values.first_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="John"
            />
             <CustomError error={formik.errors.first_name} touched={formik.touched.first_name} />
          </div>
          <div className="flex flex-col gap-2">
            <CustomLabel required>Last Name</CustomLabel>
            <CustomInput
              name="last_name"
              value={formik.values.last_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Doe"
            />
             <CustomError error={formik.errors.last_name} touched={formik.touched.last_name} />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <CustomLabel required>Email Address</CustomLabel>
          <CustomInput
            name="email"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="john.doe@example.com"
          />
           <CustomError error={formik.errors.email} touched={formik.touched.email} />
        </div>

        <div className="flex flex-col gap-2">
          <CustomLabel required>Password</CustomLabel>

          <div className="bg-slate-50 dark:bg-slate-900/30 rounded-xl p-3 border border-slate-100 dark:border-slate-800/60 text-[10px] space-y-2 transition-all duration-200">
            <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-0.5">Password Requirements:</span>
            <ul className="space-y-1.5 pl-0.5">
              <li className={`flex items-center gap-2 transition-all duration-200 ${reqMinLength ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-slate-500 dark:text-slate-400'}`}>
                <span className={`size-1.5 rounded-full shrink-0 transition-all duration-200 ${reqMinLength ? 'bg-emerald-500 scale-110 shadow-sm shadow-emerald-500/20' : 'bg-slate-300 dark:bg-slate-650'}`} />
                <span>Minimum of 8 characters</span>
              </li>
              <li className={`flex items-center gap-2 transition-all duration-200 ${reqAlpha ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-slate-500 dark:text-slate-400'}`}>
                <span className={`size-1.5 rounded-full shrink-0 transition-all duration-200 ${reqAlpha ? 'bg-emerald-500 scale-110 shadow-sm shadow-emerald-500/20' : 'bg-slate-300 dark:bg-slate-650'}`} />
                <span>At least one uppercase and one lowercase letter</span>
              </li>
              <li className={`flex items-center gap-2 transition-all duration-200 ${reqNumSpecial ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-slate-500 dark:text-slate-400'}`}>
                <span className={`size-1.5 rounded-full shrink-0 transition-all duration-200 ${reqNumSpecial ? 'bg-emerald-500 scale-110 shadow-sm shadow-emerald-500/20' : 'bg-slate-300 dark:bg-slate-650'}`} />
                <span>At least one number and one special character</span>
              </li>
            </ul>
          </div>

          <CustomInput
            name="password"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="••••••••"
          />
           <CustomError error={formik.errors.password} touched={formik.touched.password} />
        </div>

        <div className="flex flex-col gap-2">
          <CustomLabel required>Phone Number</CustomLabel>
          <CustomPhoneInput
            name="phone_number"
            value={formik.values.phone_number}
            onChange={(val) => formik.setFieldValue('phone_number', val)}
            onBlur={() => formik.setFieldTouched('phone_number', true)}
            error={formik.touched.phone_number ? formik.errors.phone_number as string : undefined}
          />
        </div>

        <div className="flex flex-col gap-2">
          <CustomLabel required>System Role</CustomLabel>
          <CustomSelect
            name="role"
            options={[
              { value: 'user', label: 'User' },
              { value: 'admin', label: 'Admin' }
            ]}
            value={formik.values.role}
            onChange={(val) => formik.setFieldValue('role', val)}
            onBlur={() => formik.setFieldTouched('role', true)}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="h-10 rounded-xl border-slate-200 dark:border-slate-800 dark:text-slate-200 px-4 text-xs font-semibold"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={formik.isSubmitting}
            className="h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 border-none shadow-md shadow-blue-500/10 cursor-pointer"
          >
            {formik.isSubmitting ? 'Creating...' : 'Create User'}
          </Button>
        </div>
      </form>
    </CustomModal>
  )
}
