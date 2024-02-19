import config from "@/web/config.js"
import createAPIClient from "@/web/createAPIClient.js"
import signInService from "@/web/services/login.js"
import createVMService from "@/web/services/createVM.js"
import {
  createContext,
  useCallback,
  useContext,
  useState,
  useEffect
} from "react"

const AppContext = createContext()

export const AppContextProvider = (props) => {
  const { ...otherProps } = props

  useEffect(() => {
    const jwt = localStorage.getItem(config.session.localStorageToken)

    if (!jwt) {
      return
    }

    setJwt(jwt)
  }, [])
  const [session, setSession] = useState(null)
  const [jwt, setJwt] = useState(null)
  const api = createAPIClient()

  const signIn = signInService({ api, setSession, setJwt })
  const createVM = createVMService({api, jwt})
  const signOut = useCallback(() => {
    localStorage.removeItem(config.session.localStorageKey)
    localStorage.removeItem(config.session.localStorageCredit)
    localStorage.removeItem(config.session.localStorageToken)
    setSession(null)
  }, [])

  return (
    <AppContext.Provider
      {...otherProps}
      value={{
        actions: {
          signOut,
          signIn,
          createVM
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