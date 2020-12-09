import Twilio from "twilio"

import NetworkError from "utils/networkError"
import handlers from "utils/requestHandlers"

let client

export default handlers.post(async (req, res) => {
  const { to, channel = "sms" } = req.body

  if (!to) {
    throw new NetworkError(400)
  }

  if (!client) {
    client = Twilio(
      process.env.NODE_ENV === "production"
        ? process.env.TWILIO_ACCOUNT_SID
        : process.env.TWILIO_ACCOUNT_SID_TEST,
      process.env.NODE_ENV === "production"
        ? process.env.TWILIO_AUTH_TOKEN
        : process.env.TWILIO_AUTH_TOKEN_TEST,
    )
  }

  const verification = await client.verify
    .services(process.env.TWILIO_VERIFY_SERVICE_SID)
    .verifications.create({ to, channel })

  res.json({ sid: verification.sid })
})
