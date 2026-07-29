import * as Yup from 'yup'

export const productValidationSchema = Yup.object({
  name: Yup.string()
    .trim()
    .required('Product Name is required'),
  description: Yup.string()
    .trim()
    .required('Description is required')
    .max(1000, 'Description cannot exceed 1000 characters'),
  price: Yup.number()
    .typeError('Price must be a number')
    .positive('Price must be greater than zero')
    .required('Price is required'),
  stock: Yup.number()
    .typeError('Stock must be an integer')
    .integer('Stock must be an integer')
    .min(0, 'Stock cannot be negative')
    .required('Stock is required'),
  category_id: Yup.string()
    .trim()
    .required('Category selection is required'),
  image: Yup.string()
    .trim()
    .required('Product Image URL is required'),
})
