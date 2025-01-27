let sensitiveData: {
  [key: string]: string
} = {}

export function storeSensitiveData(key: string, value: string) {
  const encodedValue = btoa(value) // Simple encoding, not secure for production
  sensitiveData[key] = encodedValue
}

export function getSensitiveData(key: string): string {
  const encodedValue = sensitiveData[key] || ""
  return atob(encodedValue) // Decode the value
}

export function clearSensitiveData() {
  sensitiveData = {}
}

