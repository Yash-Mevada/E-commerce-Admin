import {
  Search,
  Trash2,
  UserPlus,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Shield,
  User,
  X,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Edit,
  Pencil,
  Moon,
  Sun,
  Upload
} from 'lucide-react'

export const Icons = {
  Search,
  Trash: Trash2,
  AddUser: UserPlus,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Spinner: RefreshCw,
  Shield,
  User,
  Close: X,
  ChevronLeft,
  ChevronRight,
  Alert: AlertCircle,
  Edit,
  Pen: Pencil,
  Moon,
  Sun,
  Upload
} as const

export type IconType = keyof typeof Icons
