import { Page, Text } from "@geist-ui/react"

import Redirect from "components/Redirect"
import useUser from "hooks/useUser"

export default function Dashboard() {
  const { user, loading } = useUser()

  console.log(user, loading)

  return (
    <>
      <Redirect redirectTo="/join" />
      <Page>
        <Text h1>Dashboard</Text>
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          <Text>Welcome {user.displayName}</Text>
        )}
      </Page>
    </>
  )
}
