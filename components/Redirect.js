import React from "react"
import Head from "next/head"

const FORCED_HOME_PATH = process.env.NEXT_PUBLIC_FORCED_HOME_PATH ?? "/home"

export default function Redirect(props) {
  return (
    <>
      <Head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            if (document.cookie != null && document.cookie.indexOf("authed") ${
              props.redirectOnUser ? "> -1" : "< 0"
            }) {
                if (document.location.pathname !== "${FORCED_HOME_PATH}") {
                    window.location.href = "${props.redirectTo}";
                }
            }
        `,
          }}
        />
      </Head>
      <style global jsx>{`
        body {
          display: ${typeof window !== "undefined" &&
          props.redirectOnUser &&
          document.cookie.includes("authed") &&
          location.pathname !== FORCED_HOME_PATH
            ? "none"
            : "block"};
        }
      `}</style>
    </>
  )
}
