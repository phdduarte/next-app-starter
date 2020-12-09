import jwt from "jsonwebtoken"

import firebase from "lib/firebase-admin"
import log from "./log"
import NetworkError from "./networkError"

export default async function ensureAuth(idToken) {
  try {
    let user
    if (process.env.NODE_ENV === "production") {
      user = await firebase.auth().verifyIdToken(idToken)
    } else {
      user = jwt.decode(idToken)
    }

    return user
  } catch (error) {
    log.error(error)
    throw new NetworkError(401)
  }
}
