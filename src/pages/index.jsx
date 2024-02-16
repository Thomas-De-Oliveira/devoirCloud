import LoginForm from "@/web/components/Auth/LoginForm.jsx"
import useAppContext from "@/web/hooks/useAppContext.js"
import routes from "@/web/routes"
import { useRouter } from "next/router.js"
import { useCallback, useState, useEffect } from "react"

const Home = () => {
  const router = useRouter()
  const {
    actions: { signIn },
  } = useAppContext()

  useEffect(() => {
    const id = localStorage.getItem("devoirCloud")

    if(id != null && id != undefined) {
      router.push(routes.machine(id))
    }
  }, [router])

  const [error, setError] = useState(null)
  const handleSubmit = useCallback(
    async (values) => {
      setError(null)

      const [err, data] = await signIn(values)

      if (err) {
        setError(err)

        return
      }

      if(data.verify == true) {
        router.push(routes.machine(data.user.id))
      }
    },
    [signIn, router]
  )

  return (
    <main>
      <LoginForm onSubmit={handleSubmit} error={error} />
    </main>
  )
}

export default Home
