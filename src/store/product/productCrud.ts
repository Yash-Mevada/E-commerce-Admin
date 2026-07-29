import { AppDispatch } from '@/store'
import { post, put, del } from '@/services/api'
import { ProductRecord } from '@/types/product'
import {
  deleteProductStart,
  deleteProductSuccess,
  deleteProductFailure
} from './productSlice'

/**
 * Deletes a product, dispatches success/failure to Redux, and returns boolean status.
 */
export const deleteProduct = async (
  dispatch: AppDispatch,
  token: string,
  id: string
): Promise<boolean> => {
  try {
    dispatch(deleteProductStart())
    const result = await del(`/products/delete/${id}`, token)
    if (result.success) {
      dispatch(deleteProductSuccess())
      return true
    } else {
      throw new Error(result.message || 'Failed to delete product.')
    }
  } catch (err: any) {
    const errMsg = err?.message || 'An error occurred while deleting the product.'
    dispatch(deleteProductFailure(errMsg))
    throw new Error(errMsg)
  }
}

/**
 * Creates a new product.
 */
export const createProduct = async (
  token: string,
  payload: {
    name: string
    description: string
    price: number
    stock: number
    category_id: string
    image: string
  }
): Promise<ProductRecord> => {
  const result = await post('/products/create', payload, token)
  if (result.success) {
    return result.data
  } else {
    throw new Error(result.message || 'Failed to create product.')
  }
}

/**
 * Updates an existing product.
 */
export const updateProduct = async (
  token: string,
  id: string,
  payload: {
    name: string
    description: string
    price: number
    stock: number
    category_id: string
    image: string
  }
): Promise<ProductRecord> => {
  const result = await put(`/products/update/${id}`, payload, token)
  if (result.success) {
    return result.data
  } else {
    throw new Error(result.message || 'Failed to update product.')
  }
}
