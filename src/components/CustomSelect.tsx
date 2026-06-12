import React from 'react'
import Select, { StylesConfig } from 'react-select'

interface Option {
  value: string
  label: string
}

interface CustomSelectProps {
  options: Option[]
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  placeholder?: string
  name?: string
  className?: string
}

const customStyles: StylesConfig<Option, false> = {
  control: (provided, state) => ({
    ...provided,
    height: '40px',
    borderRadius: '12px',
    borderColor: state.isFocused ? '#3b82f6' : 'var(--border)',
    boxShadow: 'none',
    '&:hover': {
      borderColor: state.isFocused ? '#3b82f6' : 'var(--border)',
    },
    fontSize: '14px',
    fontWeight: '500',
    color: 'var(--foreground)',
    backgroundColor: 'var(--background)',
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: '0 12px',
  }),
  singleValue: (provided) => ({
    ...provided,
    color: 'var(--foreground)',
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: '12px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    border: '1px solid var(--border)',
    backgroundColor: 'var(--popover)',
    overflow: 'hidden',
  }),
  option: (provided, state) => ({
    ...provided,
    fontSize: '14px',
    fontWeight: '500',
    backgroundColor: state.isSelected
      ? '#3b82f6'
      : state.isFocused
      ? 'var(--accent)'
      : 'transparent',
    color: state.isSelected
      ? '#ffffff'
      : state.isFocused
      ? 'var(--accent-foreground)'
      : 'var(--foreground)',
    cursor: 'pointer',
    '&:active': {
      backgroundColor: '#3b82f6',
      color: '#ffffff',
    },
  }),
  placeholder: (provided) => ({
    ...provided,
    color: 'var(--muted-foreground)',
  }),
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  onBlur,
  placeholder = 'Select option...',
  name,
  className,
}) => {
  const selectedOption = options.find((opt) => opt.value === value) || null

  return (
    <div className={className}>
      <Select
        name={name}
        options={options}
        value={selectedOption}
        onChange={(val) => onChange(val ? val.value : '')}
        onBlur={onBlur}
        placeholder={placeholder}
        styles={customStyles}
        isSearchable={false}
      />
    </div>
  )
}
