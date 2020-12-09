import Twilio from "twilio"

import handlers from "utils/requestHandlers"
import NetworkError from "utils/networkError"

let client

export default handlers.post(async (req, res) => {
  const { to, code } = req.body

  if (!to || !code) {
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
    .verificationChecks.create({ to, code })

  if (verification.status !== "approved") {
    throw new NetworkError(401)
  }

  return res.end()
})
