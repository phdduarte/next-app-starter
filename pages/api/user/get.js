import firebase from "lib/firebase-admin"

import ensureAuth from "utils/ensureAuth"
import handlers from "utils/requestHandlers"
import NetworkError from "utils/networkError"

let db

export default handlers.post(async (req, res) => {
  const { token } = req.body

  const { user_id } = (await ensureAuth(token)) ?? {}

  if (!db) {
    db = firebase.firestore()
  }

  const users = await db.collection("users").where("uid", "==", user_id).get()

  if (users.empty || users.size !== 1) {
    throw new NetworkError(400)
  }

  const { 0: user } = users.docs

  res.json(user.data())
})
