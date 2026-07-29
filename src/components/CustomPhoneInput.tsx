import React from 'react'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { cn } from '@/lib/utils'
import { CustomError } from '@/components/CustomError'

interface CustomPhoneInputProps {
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  name?: string
  className?: string
  placeholder?: string
  error?: string
}

export const CustomPhoneInput: React.FC<CustomPhoneInputProps> = ({
  value,
  onChange,
  onBlur,
  name,
  className,
  placeholder,
  error,
}) => {
  const handlePhoneChange = (val: string, country: any) => {
    // If empty or just country dial code, treat it as empty
    if (!val || val === country.dialCode) {
      onChange('')
    } else {
      // Prepend + if not already present
      onChange(val.startsWith('+') ? val : `+${val}`)
    }
  }

  return (
    <div className={cn('relative w-full', className)}>
      <style>{`
        /* Main container */
        .react-tel-input {
          width: 100% !important;
          height: 40px !important;
          font-family: inherit !important;
        }
        /* Input control */
        .react-tel-input .form-control {
          width: 100% !important;
          height: 40px !important;
          border-radius: 11px !important;
          border: 1px solid var(--border, #e2e8f0) !important;
          background-color: var(--background, #ffffff) !important;
          color: var(--foreground, #0f172a) !important;
          font-size: 14px !important;
          padding-left: 54px !important; /* Make sure flag doesn't overlap text */
          transition: border-color 0.2s, box-shadow 0.2s !important;
        }
        .react-tel-input .form-control:focus {
          border-color: #3b82f6 !important;
          box-shadow: none !important;
        }
        .dark .react-tel-input .form-control {
          border-color: var(--border, #1e293b) !important;
          background-color: var(--background, #0f172a) !important;
          color: var(--foreground, #f8fafc) !important;
        }
        .dark .react-tel-input .form-control:focus {
          border-color: #3b82f6 !important;
        }

        /* Flag dropdown container */
        .react-tel-input .flag-dropdown {
          background-color: transparent !important;
          border: none !important;
          border-right: 1px solid var(--border, #e2e8f0) !important;
          border-radius: 11px 0 0 11px !important;
          height: 38px !important;
          top: 1px !important;
          left: 1px !important;
          z-index: 10 !important; /* Make sure it sits above input but below dropdown */
        }
        .dark .react-tel-input .flag-dropdown {
          border-right-color: var(--border, #1e293b) !important;
        }

        /* Selected flag button */
        .react-tel-input .selected-flag {
          background-color: transparent !important;
          border-radius: 11px 0 0 11px !important;
          width: 40px !important;
          height: 100% !important;
          padding: 0 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }
        .react-tel-input .selected-flag .flag {
          position: static !important;
          margin-top: 0 !important;
        }
        .react-tel-input .selected-flag:hover,
        .react-tel-input .selected-flag.open {
          background-color: var(--accent, #f1f5f9) !important;
        }
        .dark .react-tel-input .selected-flag:hover,
        .dark .react-tel-input .selected-flag.open {
          background-color: rgb(30 41 59 / 0.5) !important;
        }

        .react-tel-input .selected-flag .arrow {
          display: none !important;
        }

        /* Country list dropdown */
        .react-tel-input .country-list {
          background-color: var(--popover, #ffffff) !important;
          color: var(--foreground, #0f172a) !important;
          border: 1px solid var(--border, #e2e8f0) !important;
          border-radius: 11px !important;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
          z-index: 99999 !important; /* Ensure it floats above other elements, dialog overlay, etc. */
          margin-top: 4px !important;
          max-height: 240px !important;
        }
        .dark .react-tel-input .country-list {
          background-color: var(--popover, #0f172a) !important;
          color: var(--foreground, #f8fafc) !important;
          border-color: var(--border, #1e293b) !important;
        }

        .react-tel-input .country-list .country {
          transition: background-color 0.2s !important;
          padding: 8px 12px !important;
        }
        .react-tel-input .country-list .country:hover {
          background-color: var(--accent, #f1f5f9) !important;
        }
        .dark .react-tel-input .country-list .country:hover {
          background-color: rgb(30 41 59 / 0.5) !important;
        }
        .react-tel-input .country-list .country.highlight {
          background-color: var(--accent, #f1f5f9) !important;
          color: var(--foreground, #0f172a) !important;
        }
        .dark .react-tel-input .country-list .country.highlight {
          background-color: rgb(30 41 59 / 0.5) !important;
          color: var(--foreground, #f8fafc) !important;
        }

        .react-tel-input .country-list .country-name {
          color: inherit !important;
          font-size: 13px !important;
          font-weight: 500 !important;
        }
        .react-tel-input .country-list .dial-code {
          color: var(--muted-foreground, #64748b) !important;
          font-size: 12px !important;
        }

        /* Search bar inside country list */
        .react-tel-input .search {
          background-color: var(--popover, #ffffff) !important;
          border-bottom: 1px solid var(--border, #e2e8f0) !important;
          padding: 8px 10px !important;
          z-index: 100000 !important;
        }
        .dark .react-tel-input .search {
          background-color: var(--popover, #0f172a) !important;
          border-bottom-color: var(--border, #1e293b) !important;
        }
        .react-tel-input .search-box {
          background-color: var(--background, #ffffff) !important;
          color: var(--foreground, #0f172a) !important;
          border: 1px solid var(--border, #e2e8f0) !important;
          border-radius: 8px !important;
          font-size: 13px !important;
          width: 100% !important;
          margin: 0 !important;
          padding: 6px 10px !important;
        }
        .dark .react-tel-input .search-box {
          background-color: var(--background, #0f172a) !important;
          color: var(--foreground, #f8fafc) !important;
          border-color: var(--border, #1e293b) !important;
        }
      `}</style>
      <PhoneInput
        country="in"
        value={value}
        onChange={handlePhoneChange}
        onBlur={onBlur}
        placeholder={placeholder || '98765 43210'}
        enableSearch
        disableSearchIcon
        searchPlaceholder="Search country..."
        inputProps={{
          name: name,
        }}
      />
      <CustomError error={error} touched={!!error} className="absolute mt-0.5 left-0" />
    </div>
  )
}
