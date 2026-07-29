import React, { useEffect } from 'react'
import { useFormik } from 'formik'
import { CustomModal } from '@/components/CustomModal'
import { CustomInput } from '@/components/CustomInput'
import { CustomLabel } from '@/components/CustomLabel'
import { Button } from '@/components/ui/button'
import { CategoryRecord } from '@/types/category'
import { ProductRecord } from '@/types/product'
import { updateProduct } from '@/store/product/productCrud'
import { productValidationSchema } from '../utils/validation'
import { CustomImageUpload } from '@/components/CustomImageUpload'
import { uploadFile } from '@/services/api'
import { CustomError } from '@/components/CustomError'
import { CustomSelect } from '@/components/CustomSelect'

interface EditProductModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  token: string | null
  product: ProductRecord | null
  categories: CategoryRecord[]
}

export const EditProductModal: React.FC<EditProductModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  token,
  product,
  categories,
}) => {

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      price: '',
      stock: '',
      category_id: '',
      image: '',
    },
    validationSchema: productValidationSchema,
    validateOnBlur: false,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      if (!token || !product) return
      try {
        await updateProduct(token, product.id, {
          name: values.name,
          description: values.description,
          price: Number(values.price),
          stock: Number(values.stock),
          category_id: values.category_id,
          image: values.image,
        })
        onSuccess()
        onClose()
      } catch (err: any) {
        setStatus(err?.message || 'Something went wrong. Please try again.')
      } finally {
        setSubmitting(false)
      }
    },
  })

  useEffect(() => {
    if (isOpen && product) {
      formik.setValues({
        name: product.name,
        description: product.description,
        price: String(product.price),
        stock: String(product.stock),
        category_id: product.category_id,
        image: product.image,
      })
    } else {
      formik.resetForm()
    }
  }, [isOpen, product])

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Product"
    >
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
        {formik.status && (
          <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-100 font-medium">
            {formik.status}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <CustomLabel required>Product Name</CustomLabel>
            <CustomInput
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="e.g. Wireless Headset"
            />
            <CustomError error={formik.errors.name} touched={formik.touched.name} />
          </div>

          <div className="flex flex-col gap-2">
            <CustomLabel required>Category</CustomLabel>
            <CustomSelect
              name="category_id"
              options={categories.map((cat) => ({ value: cat.id, label: cat.name }))}
              value={formik.values.category_id}
              onChange={(val) => formik.setFieldValue('category_id', val)}
              onBlur={() => formik.setFieldTouched('category_id', true)}
              placeholder="Select Category"
            />
            <CustomError error={formik.errors.category_id} touched={formik.touched.category_id} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <CustomLabel required>Price ($)</CustomLabel>
            <CustomInput
              name="price"
              type="number"
              step="0.01"
              value={formik.values.price}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="0.00"
            />
            <CustomError error={formik.errors.price} touched={formik.touched.price} />
          </div>

          <div className="flex flex-col gap-2">
            <CustomLabel required>Stock Quantity</CustomLabel>
            <CustomInput
              name="stock"
              type="number"
              value={formik.values.stock}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="0"
            />
            <CustomError error={formik.errors.stock} touched={formik.touched.stock} />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <CustomLabel required>Product Image</CustomLabel>
          <CustomImageUpload
            value={formik.values.image}
            onChange={(url) => formik.setFieldValue('image', url)}
            onUpload={async (file) => {
              const response = await uploadFile('/products/upload', file, token || undefined)
              if (response?.success && response?.data?.imageUrl) {
                return response.data.imageUrl
              }
              throw new Error(response?.message || 'Upload failed')
            }}
            error={formik.errors.image}
            touched={formik.touched.image}
          />
        </div>

        <div className="flex flex-col gap-2">
          <CustomLabel required>Description</CustomLabel>
          <textarea
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Describe the product details, specs, etc..."
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
