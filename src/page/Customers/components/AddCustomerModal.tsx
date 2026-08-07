import React, { useEffect } from 'react'
import { useFormik } from 'formik'
import { CustomModal } from '@/components/CustomModal'
import { CustomInput } from '@/components/CustomInput'
import { CustomSelect } from '@/components/CustomSelect'
import { CustomLabel } from '@/components/CustomLabel'
import { CustomPhoneInput } from '@/components/CustomPhoneInput'
import { Button } from '@/components/ui/button'
import { createCustomer } from '@/store/customer/customerCrud'
import { CustomError } from '@/components/CustomError'
import { addCustomerValidationSchema } from '../utils/validation'

interface AddCustomerModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  token: string | null
}

export const AddCustomerModal: React.FC<AddCustomerModalProps> = ({
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
      address: '',
      status: 'active' as 'active' | 'inactive',
    },
    validationSchema: addCustomerValidationSchema,
    validateOnBlur: false,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      if (!token) return
      try {
        setStatus(null)
        await createCustomer(token, values)
        formik.resetForm()
        onClose()
        onSuccess()
      } catch (err: any) {
        setStatus(err?.message || 'Failed to create customer.')
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

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Customer"
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
          <CustomLabel>Phone Number</CustomLabel>
          <CustomPhoneInput
            name="phone_number"
            value={formik.values.phone_number}
            onChange={(val) => formik.setFieldValue('phone_number', val)}
            onBlur={() => formik.setFieldTouched('phone_number', true)}
            error={formik.touched.phone_number ? formik.errors.phone_number as string : undefined}
          />
        </div>

        <div className="flex flex-col gap-2">
          <CustomLabel>Address</CustomLabel>
          <CustomInput
            name="address"
            value={formik.values.address}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="123 Main St, City, Country"
          />
          <CustomError error={formik.errors.address} touched={formik.touched.address} />
        </div>

        <div className="flex flex-col gap-2">
          <CustomLabel required>Status</CustomLabel>
          <CustomSelect
            name="status"
            options={[
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' }
            ]}
            value={formik.values.status}
            onChange={(val) => formik.setFieldValue('status', val)}
            onBlur={() => formik.setFieldTouched('status', true)}
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
            className="h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-4 border-none shadow-md shadow-indigo-500/10 cursor-pointer"
          >
            {formik.isSubmitting ? 'Creating...' : 'Create Customer'}
          </Button>
        </div>
      </form>
    </CustomModal>
  )
}
