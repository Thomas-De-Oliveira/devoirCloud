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
    <nav className="bg-slate-200 flex justify-between items-center h-16">
      <div className="flex gap-4 mr-8 items-center font-semibold text-lg">
        <Link href={routes.home()} onClick={handleSignOut}>
          <PowerIcon className="w-10 text-white" />
        </Link>
      </div>
    </nav>
  )
}

export default Header