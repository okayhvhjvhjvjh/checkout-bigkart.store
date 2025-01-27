export const validateCard = (number: string): boolean => {
  // Luhn Algorithm Implementation
  let sum = 0
  let isEven = false

  // Remove any spaces or dashes
  number = number.replace(/\D/g, "")

  for (let n = number.length - 1; n >= 0; n--) {
    let digit = Number.parseInt(number[n], 10)

    if (isEven) {
      digit *= 2
      if (digit > 9) {
        digit -= 9
      }
    }

    sum += digit
    isEven = !isEven
  }

  return sum % 10 === 0
}

export const validateExpiryDate = (month: string, year: string): boolean => {
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth() + 1

  const expMonth = Number.parseInt(month, 10)
  const expYear = 2000 + Number.parseInt(year, 10)

  if (expYear < currentYear) return false
  if (expYear === currentYear && expMonth < currentMonth) return false

  return true
}

