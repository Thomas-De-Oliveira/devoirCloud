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


//le useEffect va servir a verifier le local storage pour voir s'il y a déjà un utilisateur connecté si c'est le cas je fais une redirection vers la page adéquate
//Cela est pour empecher l'accès a la page connexion aux personnes déjà connecter
  useEffect(() => {
    const id = localStorage.getItem("devoirCloud")

    if(id != null && id != undefined) {
      router.push(routes.machine(id))
    }
  }, [router])

  const [error, setError] = useState(null)
  // le handle submit va appeler le service sign In avec les valeurs de la personnes qui essaye de se connecter mot de passe et nom d'utilisateur
  // Le service interrogera l'api et renverra une erreur ou une donnée s'il y a une erreur on affiche l'erreur et sinon on renvoit l'utilisateur sur la nouvelle page
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
