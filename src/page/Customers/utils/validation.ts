import * as Yup from 'yup'

export const baseCustomerValidationShape = {
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
  address: Yup.string()
    .trim(),
  status: Yup.string()
    .oneOf(['active', 'inactive'], 'Invalid status')
    .required('Status is required'),
}

export const addCustomerValidationSchema = Yup.object({
  ...baseCustomerValidationShape,
})

export const editCustomerValidationSchema = Yup.object({
  ...baseCustomerValidationShape,
})
