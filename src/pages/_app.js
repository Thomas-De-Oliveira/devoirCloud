import { AppContextProvider } from "@/web/hooks/UseAppContext"

export default function App({ Component, pageProps }) {
  return <AppContextProvider><Component {...pageProps} /></AppContextProvider>
}
