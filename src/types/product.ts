import { CategoryRecord } from './category'

export interface ProductRecord {
  id: string
  name: string
  description: string
  price: number
  stock: number
  category_id: string
  image: string
  created_at: string
  updated_at: string
  Category?: CategoryRecord
}
