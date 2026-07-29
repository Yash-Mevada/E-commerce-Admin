import * as Yup from 'yup'

export const baseUserValidationShape = {
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
    .trim()
    .required('Phone Number is required'),
  role: Yup.string()
    .oneOf(['user', 'admin'], 'Invalid role')
    .required('System role is required'),
}

export const addUserValidationSchema = Yup.object({
  ...baseUserValidationShape,
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[^a-zA-Z0-9]/, 'Password must contain at least one special character')
    .required('Password is required'),
})

export const editUserValidationSchema = Yup.object({
  ...baseUserValidationShape,
})
