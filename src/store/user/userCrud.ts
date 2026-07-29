import { AppDispatch } from '@/store'
import { post, put, del } from '@/services/api'
import { UserRecord } from '@/types/user'
import {
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure
} from './userSlice'

/**
 * Deletes a user, dispatches success/failure to Redux, and returns boolean status.
 */
export const deleteUser = async (
  dispatch: AppDispatch,
  token: string,
  id: string
): Promise<boolean> => {
  try {
    dispatch(deleteUserStart())
    const result = await del(`/users/delete/${id}`, token)
    if (result.success) {
      dispatch(deleteUserSuccess())
      return true
    } else {
      throw new Error(result.message || 'Failed to delete user.')
    }
  } catch (err: any) {
    const errMsg = err?.message || 'An error occurred while deleting the user.'
    dispatch(deleteUserFailure(errMsg))
    throw new Error(errMsg)
  }
}

/**
 * Registers a new user.
 */
export const createUser = async (
  token: string,
  payload: {
    first_name: string
    last_name: string
    email: string
    phone_number: string
    role: string
    password?: string
  }
): Promise<UserRecord> => {
  const result = await post('/users/create', payload, token)
  if (result.success) {
    return result.data
  } else {
    throw new Error(result.message || 'Failed to create user.')
  }
}

/**
 * Updates an existing user.
 */
export const updateUser = async (
  token: string,
  id: string,
  payload: {
    first_name: string
    last_name: string
    email: string
    phone_number: string
    role: string
  }
): Promise<UserRecord> => {
  const result = await put(`/users/update/${id}`, payload, token)
  if (result.success) {
    return result.data
  } else {
    throw new Error(result.message || 'Failed to update user.')
  }
}
