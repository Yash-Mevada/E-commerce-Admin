import { AppDispatch } from '@/store'
import { post, put, del } from '@/services/api'
import { CustomerRecord } from '@/types/customer'
import {
  deleteCustomerStart,
  deleteCustomerSuccess,
  deleteCustomerFailure
} from './customerSlice'

/**
 * Deletes a customer, dispatches success/failure to Redux, and returns boolean status.
 */
export const deleteCustomer = async (
  dispatch: AppDispatch,
  token: string,
  id: string
): Promise<boolean> => {
  try {
    dispatch(deleteCustomerStart())
    const result = await del(`/customers/delete/${id}`, token)
    if (result.success) {
      dispatch(deleteCustomerSuccess())
      return true
    } else {
      throw new Error(result.message || 'Failed to delete customer.')
    }
  } catch (err: any) {
    const errMsg = err?.message || 'An error occurred while deleting the customer.'
    dispatch(deleteCustomerFailure(errMsg))
    throw new Error(errMsg)
  }
}

/**
 * Creates a new customer.
 */
export const createCustomer = async (
  token: string,
  payload: {
    first_name: string
    last_name: string
    email: string
    phone_number: string
    address: string
    status: 'active' | 'inactive'
  }
): Promise<CustomerRecord> => {
  const result = await post('/customers/create', payload, token)
  if (result.success) {
    return result.data
  } else {
    throw new Error(result.message || 'Failed to create customer.')
  }
}

/**
 * Updates an existing customer.
 */
export const updateCustomer = async (
  token: string,
  id: string,
  payload: {
    first_name: string
    last_name: string
    email: string
    phone_number: string
    address: string
    status: 'active' | 'inactive'
  }
): Promise<CustomerRecord> => {
  const result = await put(`/customers/update/${id}`, payload, token)
  if (result.success) {
    return result.data
  } else {
    throw new Error(result.message || 'Failed to update customer.')
  }
}
