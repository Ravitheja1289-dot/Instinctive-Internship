import { ValidationResult, CreateIncidentRequest, UpdateIncidentRequest, CreateCameraRequest, UpdateCameraRequest } from './types'
import { Validators } from './api-utils'

// Generic validator function
export function validate<T>(data: T, rules: ValidationRule<T>[]): ValidationResult {
  const errors: string[] = []
  
  for (const rule of rules) {
    const value = data[rule.field]
    const fieldName = String(rule.field)
    
    // Check required fields
    if (rule.required && (value === undefined || value === null || value === '')) {
      errors.push(rule.message || `${fieldName} is required`)
      continue
    }
    
    // Skip validation if field is not required and empty
    if (!rule.required && (value === undefined || value === null || value === '')) {
      continue
    }
    
    // Type validation
    if (rule.type) {
      switch (rule.type) {
        case 'string':
          if (typeof value !== 'string') {
            errors.push(rule.message || `${fieldName} must be a string`)
          }
          break
        case 'number':
          if (typeof value !== 'number' || isNaN(value)) {
            errors.push(rule.message || `${fieldName} must be a number`)
          }
          break
        case 'boolean':
          if (typeof value !== 'boolean') {
            errors.push(rule.message || `${fieldName} must be a boolean`)
          }
          break
        case 'date':
          if (!Validators.isValidDate(String(value))) {
            errors.push(rule.message || `${fieldName} must be a valid date`)
          }
          break
        case 'email':
          if (!Validators.isValidEmail(String(value))) {
            errors.push(rule.message || `${fieldName} must be a valid email`)
          }
          break
      }
    }
    
    // String length validation
    if (typeof value === 'string') {
      if (rule.minLength && value.length < rule.minLength) {
        errors.push(rule.message || `${fieldName} must be at least ${rule.minLength} characters`)
      }
      if (rule.maxLength && value.length > rule.maxLength) {
        errors.push(rule.message || `${fieldName} must be no more than ${rule.maxLength} characters`)
      }
    }
    
    // Number range validation
    if (typeof value === 'number') {
      if (rule.min !== undefined && value < rule.min) {
        errors.push(rule.message || `${fieldName} must be at least ${rule.min}`)
      }
      if (rule.max !== undefined && value > rule.max) {
        errors.push(rule.message || `${fieldName} must be no more than ${rule.max}`)
      }
    }
    
    // Pattern validation
    if (rule.pattern && typeof value === 'string') {
      if (!rule.pattern.test(value)) {
        errors.push(rule.message || `${fieldName} format is invalid`)
      }
    }
    
    // Custom validation
    if (rule.custom && !rule.custom(value)) {
      errors.push(rule.message || `${fieldName} is invalid`)
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  }
}

interface ValidationRule<T> {
  field: keyof T
  required?: boolean
  type?: 'string' | 'number' | 'boolean' | 'date' | 'email'
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
  pattern?: RegExp
  custom?: (value: any) => boolean
  message?: string
}

// Specific validators for each entity
export const validateCreateIncident = (data: CreateIncidentRequest): ValidationResult => {
  return validate(data, [
    {
      field: 'cameraId',
      required: true,
      type: 'string',
      minLength: 1,
      message: 'Camera ID is required and must be a valid string',
    },
    {
      field: 'type',
      required: true,
      type: 'string',
      custom: (value) => Validators.isValidIncidentType(value),
      message: 'Incident type must be one of: Unauthorised Access, Gun Threat, Face Recognised, Suspicious Activity, Perimeter Breach, Equipment Tampering',
    },
    {
      field: 'tsStart',
      required: true,
      type: 'string',
      custom: (value) => Validators.isValidDate(value),
      message: 'Start time must be a valid date string',
    },
    {
      field: 'tsEnd',
      required: true,
      type: 'string',
      custom: (value) => Validators.isValidDate(value),
      message: 'End time must be a valid date string',
    },
    {
      field: 'thumbnailUrl',
      required: false,
      type: 'string',
      maxLength: 500,
      message: 'Thumbnail URL must be a string with maximum 500 characters',
    },
    {
      field: 'resolved',
      required: false,
      type: 'boolean',
      message: 'Resolved must be a boolean value',
    },
  ])
}

export const validateUpdateIncident = (data: UpdateIncidentRequest): ValidationResult => {
  return validate(data, [
    {
      field: 'cameraId',
      required: false,
      type: 'string',
      minLength: 1,
      message: 'Camera ID must be a valid string',
    },
    {
      field: 'type',
      required: false,
      type: 'string',
      custom: (value) => value ? Validators.isValidIncidentType(value) : true,
      message: 'Incident type must be one of: Unauthorised Access, Gun Threat, Face Recognised, Suspicious Activity, Perimeter Breach, Equipment Tampering',
    },
    {
      field: 'tsStart',
      required: false,
      type: 'string',
      custom: (value) => value ? Validators.isValidDate(value) : true,
      message: 'Start time must be a valid date string',
    },
    {
      field: 'tsEnd',
      required: false,
      type: 'string',
      custom: (value) => value ? Validators.isValidDate(value) : true,
      message: 'End time must be a valid date string',
    },
    {
      field: 'thumbnailUrl',
      required: false,
      type: 'string',
      maxLength: 500,
      message: 'Thumbnail URL must be a string with maximum 500 characters',
    },
    {
      field: 'resolved',
      required: false,
      type: 'boolean',
      message: 'Resolved must be a boolean value',
    },
  ])
}

export const validateCreateCamera = (data: CreateCameraRequest): ValidationResult => {
  return validate(data, [
    {
      field: 'name',
      required: true,
      type: 'string',
      minLength: 1,
      maxLength: 100,
      message: 'Camera name is required and must be 1-100 characters',
    },
    {
      field: 'location',
      required: true,
      type: 'string',
      minLength: 1,
      maxLength: 200,
      message: 'Camera location is required and must be 1-200 characters',
    },
  ])
}

export const validateUpdateCamera = (data: UpdateCameraRequest): ValidationResult => {
  return validate(data, [
    {
      field: 'name',
      required: false,
      type: 'string',
      minLength: 1,
      maxLength: 100,
      message: 'Camera name must be 1-100 characters',
    },
    {
      field: 'location',
      required: false,
      type: 'string',
      minLength: 1,
      maxLength: 200,
      message: 'Camera location must be 1-200 characters',
    },
  ])
}

// Custom validation functions
export const validateDateRange = (startDate: string, endDate: string): ValidationResult => {
  const errors: string[] = []
  
  if (!Validators.isValidDate(startDate)) {
    errors.push('Start date must be a valid date')
  }
  
  if (!Validators.isValidDate(endDate)) {
    errors.push('End date must be a valid date')
  }
  
  if (errors.length === 0) {
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    if (start >= end) {
      errors.push('Start date must be before end date')
    }
    
    // Check if dates are not too far in the future
    const now = new Date()
    const maxFutureDate = new Date(now.getTime() + 24 * 60 * 60 * 1000) // 24 hours from now
    
    if (start > maxFutureDate) {
      errors.push('Start date cannot be more than 24 hours in the future')
    }
    
    if (end > maxFutureDate) {
      errors.push('End date cannot be more than 24 hours in the future')
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  }
}

export const validatePaginationParams = (page?: string, limit?: string): ValidationResult => {
  const errors: string[] = []
  
  if (page) {
    const pageNum = parseInt(page)
    if (isNaN(pageNum) || pageNum < 1) {
      errors.push('Page must be a positive integer')
    }
  }
  
  if (limit) {
    const limitNum = parseInt(limit)
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      errors.push('Limit must be a positive integer between 1 and 100')
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  }
}