import { rest } from "msw"

const handlers = [
  rest.post(
    `http://verify.twilio.com/v2/Services/:serviceSid/Verifications`,
    (req, res, ctx) => {
      const { serviceSid } = req.params

      return res(
        ctx.json({
          sid: "VEXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
          service_sid: serviceSid,
          to: "+15017122661",
          status: "pending",
        }),
      )
    },
  ),
  rest.post(
    "http://verify.twilio.com/v2/Services/:serviceSid/VerificationCheck",
    (req, res, ctx) => {
      const { serviceSid } = req.params

      return res(
        ctx.json({
          sid: "VEXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
          service_sid: serviceSid,
          to: "+15017122661",
          status: "approved",
        }),
      )
    },
  ),
]

export default handlers
