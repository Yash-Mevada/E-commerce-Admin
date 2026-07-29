import * as Yup from 'yup'

export const categoryValidationSchema = Yup.object({
  name: Yup.string()
    .trim()
    .required('Category Name is required'),
  description: Yup.string()
    .trim()
    .max(500, 'Description cannot exceed 500 characters')
    .optional(),
})
