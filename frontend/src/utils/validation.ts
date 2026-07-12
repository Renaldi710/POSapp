export const isEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

export const isRequired = (value: string): boolean => value.trim().length > 0

export const isNumber = (value: string): boolean => !isNaN(Number(value)) && value.trim() !== ''
