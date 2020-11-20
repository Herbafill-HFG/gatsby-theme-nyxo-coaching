import { Auth } from "aws-amplify"

export const isBrowser = typeof window !== `undefined`

export const setUser = (user: any) =>
  (window.localStorage.gatsbyUser = JSON.stringify(user))

const getUser = () => {
  if (window.localStorage.gatsbyUser) {
    const user = JSON.parse(window.localStorage.gatsbyUser)
    return user ? user : {}
  }
  return {}
}

export const isLoggedIn = (): boolean | undefined => {
  if (!isBrowser) return false

  const user = getUser()
  if (user) return !!user.username
}

export const getCurrentUser = (): Record<string, unknown> =>
  isBrowser && getUser()

export const logout = (callback: () => void): void => {
  if (!isBrowser) return
  setUser({})
  callback()
}

export const isCoach = async (): Promise<boolean> => {
  const response = await Auth.currentAuthenticatedUser()
  if (response?.idToken?.payload["coach"].includes("coach")) {
    return true
  }
  return false
}
