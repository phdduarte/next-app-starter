import cookies from "js-cookie"

export const AUTH_COOKIE =
  process.env.NEXT_PUBLIC_USER_COOKIE_NAME || "nxt_auth"

export const getUserFromCookie = () => {
  const cookie = cookies.get(AUTH_COOKIE)

  if (!cookie) return undefined

  try {
    return JSON.parse(cookie)
  } catch {
    return undefined
  }
}

export const setUserCookie = (user) => {
  const userObject = {
    id: user.uid,
    email: user.email,
    phoneNumber: user.phoneNumber,
    displayName: user.name,
    photo: user.photoURL,
  }

  cookies.set("authed", true, { expires: 1 / 24 })
  cookies.set(AUTH_COOKIE, userObject, { expires: 1 / 24 })

  return userObject
}

export const removeUserCookies = () => {
  cookies.remove(AUTH_COOKIE)
  cookies.remove("authed")
}
