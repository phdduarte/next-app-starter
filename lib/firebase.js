import firebase from "firebase/app"
import "firebase/auth"
import "firebase/analytics"

const CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
}

export default function initFirebase(config = CONFIG) {
  if (!firebase.apps.length) {
    firebase.initializeApp(config)
  }
}

export const getAuth = () => {
  const auth = firebase.auth()

  if (process.env.NODE_ENV === "development") {
    auth.useEmulator("http://localhost:9099")
  }

  return auth
}
