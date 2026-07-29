import { AppDispatch } from '@/store'
import { post, put, del } from '@/services/api'
import { CategoryRecord } from '@/types/category'
import {
  deleteCategoryStart,
  deleteCategorySuccess,
  deleteCategoryFailure
} from './categorySlice'

/**
 * Deletes a category, dispatches success/failure to Redux, and returns boolean status.
 */
export const deleteCategory = async (
  dispatch: AppDispatch,
  token: string,
  id: string
): Promise<boolean> => {
  try {
    dispatch(deleteCategoryStart())
    const result = await del(`/categories/delete/${id}`, token)
    if (result.success) {
      dispatch(deleteCategorySuccess())
      return true
    } else {
      throw new Error(result.message || 'Failed to delete category.')
    }
  } catch (err: any) {
    const errMsg = err?.message || 'An error occurred while deleting the category.'
    dispatch(deleteCategoryFailure(errMsg))
    throw new Error(errMsg)
  }
}

/**
 * Creates a new category.
 */
export const createCategory = async (
  token: string,
  payload: {
    name: string
    description: string
  }
): Promise<CategoryRecord> => {
  const result = await post('/categories/create', payload, token)
  if (result.success) {
    return result.data
  } else {
    throw new Error(result.message || 'Failed to create category.')
  }
}

/**
 * Updates an existing category.
 */
export const updateCategory = async (
  token: string,
  id: string,
  payload: {
    name: string
    description: string
  }
): Promise<CategoryRecord> => {
  const result = await put(`/categories/update/${id}`, payload, token)
  if (result.success) {
    return result.data
  } else {
    throw new Error(result.message || 'Failed to update category.')
  }
}
