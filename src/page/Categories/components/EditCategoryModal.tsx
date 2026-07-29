import React, { useEffect } from 'react'
import { useFormik } from 'formik'
import { CustomModal } from '@/components/CustomModal'
import { CustomInput } from '@/components/CustomInput'
import { CustomLabel } from '@/components/CustomLabel'
import { Button } from '@/components/ui/button'
import { CustomError } from '@/components/CustomError'
import { CategoryRecord } from '@/types/category'
import { updateCategory } from '@/store/category/categoryCrud'
import { categoryValidationSchema } from '../utils/validation'

interface EditCategoryModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  token: string | null
  category: CategoryRecord | null
}

export const EditCategoryModal: React.FC<EditCategoryModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  token,
  category,
}) => {
  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
    },
    validationSchema: categoryValidationSchema,
    validateOnBlur: false,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      if (!token || !category) return
      try {
        await updateCategory(token, category.id, values)
        onSuccess()
        onClose()
      } catch (err: any) {
        setStatus(err?.message || 'Something went wrong. Please try again.')
      } finally {
        setSubmitting(false)
      }
    },
  })

  // Load category values when the modal opens or category changes
  useEffect(() => {
    if (isOpen && category) {
      formik.setValues({
        name: category.name || '',
        description: category.description || '',
      })
      formik.setStatus(null)
    }
  }, [isOpen, category])

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Category"
    >
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
        {formik.status && (
          <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-100 font-medium">
            {formik.status}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <CustomLabel required>Category Name</CustomLabel>
          <CustomInput
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="e.g. Electronics, Clothing"
          />
          <CustomError error={formik.errors.name} touched={formik.touched.name} />
        </div>

        <div className="flex flex-col gap-2">
          <CustomLabel>Description</CustomLabel>
          <textarea
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Describe the category..."
            className="flex min-h-[100px] w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 transition-colors shadow-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 resize-y"
          />
          <CustomError error={formik.errors.description} touched={formik.touched.description} />
        </div>

        <div className="flex items-center justify-end gap-3 mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="rounded-xl border-slate-200 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={formik.isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 transition-colors"
          >
            {formik.isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </CustomModal>
  )
}
