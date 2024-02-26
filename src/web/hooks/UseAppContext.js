import config from "@/web/config.js"
import createAPIClient from "@/web/createAPIClient.js"
import signInService from "@/web/services/login.js"
import createVMService from "@/web/services/createVM.js"
import destroyVMService from "../services/destroyVM.js"
import destroyDiskService from "../services/destroyDisk.js"
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
  const createVM = createVMService({api})
  const destroyVM = destroyVMService({api})
  const destroyDisk = destroyDiskService({api})
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
          createVM,
          destroyVM,
          destroyDisk
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