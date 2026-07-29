import React, { useState, useRef } from 'react'
import { Icons } from '@/components/Icons'
import { Button } from '@/components/ui/button'
import { CustomError } from '@/components/CustomError'

interface CustomImageUploadProps {
  value: string
  onChange: (url: string) => void
  onUpload: (file: File) => Promise<string>
  error?: string
  touched?: boolean
}

export const CustomImageUpload: React.FC<CustomImageUploadProps> = ({
  value,
  onChange,
  onUpload,
  error,
  touched,
}) => {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size must be less than 5MB.')
      return
    }

    setIsUploading(true)
    setUploadError(null)

    try {
      const imageUrl = await onUpload(file)
      onChange(imageUrl)
    } catch (err: any) {
      setUploadError(err.message || 'Failed to upload image.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = () => {
    onChange('')
    setUploadError(null)
  }

  return (
    <div className="flex flex-col gap-2">
      {value ? (
        <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 h-40 flex items-center justify-center bg-slate-50 dark:bg-slate-900">
          <img
            src={value}
            alt="Product Preview"
            className="h-full object-contain"
          />
          <div className="absolute top-2 right-2 flex gap-1.5 z-10">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="rounded-lg h-7 w-7 border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer shadow-sm backdrop-blur-sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              title="Change image"
            >
              <Icons.Pen className="size-3.5" />
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="rounded-lg h-7 w-7 bg-red-600 hover:bg-red-700 text-white border-none cursor-pointer shadow-sm"
              onClick={handleRemoveImage}
              disabled={isUploading}
              title="Remove image"
            >
              <Icons.Trash className="size-3.5" />
            </Button>
          </div>
          {isUploading && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center gap-1.5 z-20">
              <Icons.Spinner className="size-6 text-white animate-spin" />
              <span className="text-xs text-white font-medium">Uploading...</span>
            </div>
          )}
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-6 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors h-40">
          <div className="flex flex-col items-center justify-center gap-2 text-center">
            {isUploading ? (
              <>
                <Icons.Spinner className="size-8 text-blue-600 animate-spin" />
                <p className="text-xs text-slate-500 font-medium">Uploading image...</p>
              </>
            ) : (
              <>
                <Icons.Upload className="size-8 text-slate-400" />
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Click to upload image
                </p>
                <p className="text-xs text-slate-400">
                  PNG, JPG, JPEG up to 5MB
                </p>
              </>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
            disabled={isUploading}
          />
        </label>
      )}

      {uploadError && (
        <div className="text-[11px] font-medium text-red-500 mt-1 flex items-center gap-1">
          <Icons.Alert className="size-3.5" />
          {uploadError}
        </div>
      )}

      <CustomError error={error} touched={touched} />
    </div>
  )
}
