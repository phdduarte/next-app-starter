import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import useSWR from "swr"
import firebase from "firebase/app"
import "firebase/auth"

import { User } from "lib/api"
import initFirebase, { getAuth } from "lib/firebase"
import {
  removeUserCookies,
  setUserCookie,
  getUserFromCookie,
} from "lib/cookies"
import log from "utils/log"

initFirebase()

async function fetcher(route, token) {
  const user = await User.get(token)

  return setUserCookie(user)
}

export default function useUser() {
  const [userIdToken, setUserIdToken] = useState()
  const router = useRouter()
  const { data, mutate, error } = useSWR(
    () => {
      if (!userIdToken) {
        throw new Error("Missing user token")
      }

      return ["/api/user/get", userIdToken]
    },
    fetcher,
    { initialData: getUserFromCookie() },
  )

  const logout = () => {
    return getAuth()
      .signOut()
      .then(() => {
        removeUserCookies()
        router.push("/")
      })
      .catch(log.error)
  }

  useEffect(() => {
    let authToken

    getAuth()
      .currentUser?.getIdToken()
      .then((token) => setUserIdToken((authToken = token)))
      .catch(log.error)

    const tokenListener = async (user) => {
      if (user) {
        if ((await getAuth().currentUser?.getIdToken()) !== authToken) {
          mutate()
        }
      } else {
        removeUserCookies()
        mutate()
      }
    }

    const cancelListener = getAuth().onIdTokenChanged(tokenListener)

    return () => cancelListener()
  }, [])

  return { user: data, loading: !error && !data, logout }
}
