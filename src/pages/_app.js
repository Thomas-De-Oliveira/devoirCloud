import "@/styles.css"
import { AppContextProvider } from "@/web/hooks/useAppContext"

export default function App({ Component, pageProps }) {
  return <AppContextProvider><Component {...pageProps} /></AppContextProvider>
}
