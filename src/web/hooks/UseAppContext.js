import config from "@/web/config.js"
import createAPIClient from "@/web/createAPIClient.js"
import signInService from "@/web/services/login.js"
import {
  createContext,
  useCallback,
  useContext,
  useState,
} from "react"

const AppContext = createContext()

export const AppContextProvider = (props) => {
  const { ...otherProps } = props
  const [session, setSession] = useState(null)
  const api = createAPIClient()

  const signIn = signInService({ api, setSession })
  const signOut = useCallback(() => {
    localStorage.removeItem(config.session.localStorageKey)
    localStorage.removeItem(config.session.localStorageCredit)
    setSession(null)
  }, [])

  return (
    <AppContext.Provider
      {...otherProps}
      value={{
        actions: {
          signOut,
          signIn,
        },
        state: {
          session,
        },
      }}
    />
  )
}

const useAppContext = () => useContext(AppContext)

export default useAppContext