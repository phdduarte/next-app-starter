import { Page, Col, Row, Input, Text, Button, useToasts } from "@geist-ui/react"
import Router from "next/router"
import { useRef, useEffect, useState, useCallback } from "react"
import { useForm } from "react-hook-form"
import parsePhoneNumber from "libphonenumber-js"
import firebase from "firebase"
import "firebase/auth"

import { setUserCookie } from "lib/cookies"
import initFirebase, { getAuth } from "lib/firebase"
import { SMSVerification, User } from "lib/api"
import UserError from "utils/userError"

let COUNTRY

initFirebase()

export default function JoinPage() {
  const [verificationId, setVerificationId] = useState(null)
  const [data, setData] = useState(null)
  const [_, setToast] = useToasts()
  const [loading, setLoading] = useState(false)
  const {
    watch,
    handleSubmit,
    errors,
    setValue,
    register,
    reset,
    getValues,
  } = useForm()

  const pnChange = watch("phoneNumber")

  const handleError = useCallback(
    (error) => {
      console.log(error)
      if (error instanceof UserError) {
        setToast({
          type: "warning",
          delay: 3000,
          text: `${error.title}
      ${error.message}`,
        })
      } else {
        setToast({
          type: "error",
          text: `Something when wrong`,
          delay: Infinity,
          actions: [
            { name: "Refresh", handler: () => window.location.reload() },
          ],
        })
      }
    },
    [setToast],
  )

  useEffect(() => {
    if (pnChange) {
      let pn
      if ((pn = parsePhoneNumber(pnChange, COUNTRY)?.formatNational())) {
        setValue("phoneNumber", pn)
      }
    }
  }, [pnChange, COUNTRY])

  const handleSignIn = useCallback(
    async ({ phoneNumber, name }) => {
      setLoading(true)

      try {
        const n = parsePhoneNumber(phoneNumber, COUNTRY)?.number

        if (!n) {
          // This should never happen otherwise the form validation
          // failed and ths was still allowed to run
          throw new UserError(`Invalid phone number`)
        }

        setData({ to: n, name })
        setVerificationId(await SMSVerification.request(n))
        reset()
      } catch (error) {
        handleError(error)
      } finally {
        setLoading(false)
      }
    },
    [setVerificationId, setLoading, handleError],
  )

  const handleValidate = useCallback(
    (value) => Boolean(parsePhoneNumber(value, COUNTRY)?.isValid()),
    [COUNTRY],
  )

  const verify = useCallback(
    async ({ code }) => {
      setLoading(true)

      try {
        const valid = await SMSVerification.verify(
          data.to,
          code,
          verificationId,
        )

        if (valid) {
          const { token, user } = await User.create(data.to, data.name)
          await getAuth().signInWithCustomToken(token)

          setUserCookie(user)
          Router.push("/dashboard")
        }
      } catch (error) {
        handleError(error)
      } finally {
        setLoading(false)
      }
    },
    [verificationId, setLoading, handleError, data],
  )

  const handleFormSubmit = useCallback(
    (data) => {
      if (data.code) {
        verify(data)
      } else {
        handleSignIn(data)
      }
    },
    [verify, handleSignIn],
  )

  useEffect(() => {
    if (typeof window !== undefined) {
      COUNTRY = navigator.language?.split("-").pop()
    }
  }, [])

  return (
    <Page>
      <Text h1>Join</Text>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        {verificationId ? (
          <Input
            name="code"
            placeholder="Code"
            ref={register({ required: true })}
          />
        ) : (
          <>
            <Input
              name="name"
              placeholder="Name"
              status={errors.name && "error"}
              ref={register({ required: true })}
            />
            <Input
              name="phoneNumber"
              placeholder="Phone Number"
              type="tel"
              status={errors.phoneNumber && "error"}
              ref={register({
                required: true,
                validate: handleValidate,
              })}
            />
          </>
        )}
        <Button htmlType="submit" loading={loading}>
          {verificationId ? "Verify" : "Join now"}
        </Button>
      </form>
    </Page>
  )
}
