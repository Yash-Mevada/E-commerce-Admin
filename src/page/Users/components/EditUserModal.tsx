import React, { useEffect } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { CustomModal } from '@/components/CustomModal'
import { CustomInput } from '@/components/CustomInput'
import { CustomSelect } from '@/components/CustomSelect'
import { CustomLabel } from '@/components/CustomLabel'
import { Button } from '@/components/ui/button'
import { userService, UserRecord } from '@/services/api'

interface EditUserModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  token: string | null
  user: UserRecord | null
}

const editUserValidationSchema = Yup.object({
  first_name: Yup.string()
    .trim()
    .required('First Name is required'),
  last_name: Yup.string()
    .trim()
    .required('Last Name is required'),
  email: Yup.string()
    .trim()
    .email('Invalid email address')
    .required('Email address is required'),
  phone_number: Yup.string()
    .trim(),
  role: Yup.string()
    .oneOf(['user', 'admin'], 'Invalid role')
    .required('System role is required'),
})

export const EditUserModal: React.FC<EditUserModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  token,
  user,
}) => {
  const formik = useFormik({
    initialValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      role: 'user',
    },
    validationSchema: editUserValidationSchema,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      if (!token || !user) return
      try {
        setStatus(null)
        await userService.updateUser(token, user.id, values)
        onClose()
        onSuccess()
      } catch (err: any) {
        setStatus(err?.message || 'Failed to update user.')
      } finally {
        setSubmitting(false)
      }
    },
  })

  // Populate form values when user edits
  useEffect(() => {
    if (isOpen && user) {
      formik.setValues({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone_number: user.phone_number || '',
        role: user.role || 'user',
      })
      formik.setStatus(null)
    }
  }, [isOpen, user])

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit User Details"
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
            {formik.touched.first_name && formik.errors.first_name && (
              <span className="text-[10px] text-red-500 font-medium">{formik.errors.first_name}</span>
            )}
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
            {formik.touched.last_name && formik.errors.last_name && (
              <span className="text-[10px] text-red-500 font-medium">{formik.errors.last_name}</span>
            )}
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
          {formik.touched.email && formik.errors.email && (
            <span className="text-[10px] text-red-500 font-medium">{formik.errors.email}</span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <CustomLabel>Phone Number</CustomLabel>
          <CustomInput
            name="phone_number"
            value={formik.values.phone_number}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="555-0100"
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
            {formik.isSubmitting ? 'Updating...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </CustomModal>
  )
}
