import firebase from "lib/firebase-admin"
import handlers from "utils/requestHandlers"
import log from "utils/log"
import NetworkError from "utils/networkError"

let db

export default handlers.post(async (req, res) => {
  const { phoneNumber } = req.body

  // TODO: use YUP to validate params
  if (phoneNumber == null) {
    log.error(`Cannot authorize user without phone number`)
    throw new NetworkError(400)
  }

  if (!db) {
    db = firebase.firestore()
  }

  const user = await db.collection("users").doc(phoneNumber).get()

  if (!user.exists) {
    log.error(`Could not access user with phone number ${phoneNumber}`)
    throw new NetworkError(401)
  }

  // TODO: handle additionalClaims for admin/premium
  const token = firebase.auth().createCustomToken(user.uid)

  return res.end(token)
})
