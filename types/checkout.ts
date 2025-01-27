export interface OrderDetails {
  contactInfo: {
    email: string
    phone: string
  }
  shippingAddress: {
    firstName: string
    lastName: string
    address: string
    apartment?: string
    city: string
    country: string
    state: string
    postalCode: string
  }
  billingAddress?: {
    firstName: string
    lastName: string
    address: string
    apartment?: string
    city: string
    country: string
    state: string
    postalCode: string
  }
  paymentMethod: {
    cardNumber: string
    nameOnCard: string
    expiryMonth: string
    expiryYear: string
    cvv: string
  }
}

