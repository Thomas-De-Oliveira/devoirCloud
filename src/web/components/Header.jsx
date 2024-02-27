import routes from "@/web/routes.js"
import { PowerIcon } from "@heroicons/react/20/solid"
import Link from "@/web/components/Link"
import useAppContext from "@/web/hooks/useAppContext"
import { useCallback } from "react"
import { useRouter } from "next/router"

const Header = () => {
  const {
    actions: { signOut },
  } = useAppContext()

  const router = useRouter()

  const handleSignOut = useCallback(async () => {
    await signOut()

    router.push(routes.home())
  }, [signOut, router])

  return (
    <nav className="bg-rose-300 flex justify-between items-center h-16 px-6">
      <div className="flex items-center">
        <h1 className="text-white text-2xl font-bold">Vos machines disponible</h1>
      </div>
      <div className="flex items-center">
        <Link href={routes.home()} onClick={handleSignOut}>
          <PowerIcon className="w-10 h-10 text-white" />
        </Link>
      </div>
    </nav>
  )
}

export default Header