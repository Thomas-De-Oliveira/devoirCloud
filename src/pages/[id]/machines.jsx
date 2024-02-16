import Button from "@/web/components/Button"
import Header from "@/web/components/Header"
import routes from "@/web/routes"
import { useRouter } from "next/router.js"
import { useEffect, useState } from "react"
import config from "@/web/config.js"
import { PowerIcon } from "@heroicons/react/20/solid"


export const getServerSideProps = async ({query}) => {    
    return {
      props: {
        idPage: query.id,
      },
    }
  }

const Machines = (props) => {
    const {idPage} = props
    const router = useRouter()
    const allMachines = [{name: "Windows 10", price: 1}, {name: "Ubuntu", price:2},{name: "Debian", price:2}]
    const [creditUser, setCreditUser] = useState(null)

    useEffect(() => {
        const id = localStorage.getItem(config.session.localStorageKey)
        setCreditUser(localStorage.getItem(config.session.localStorageCredit))
    
        if(id != null && id != undefined && id != idPage) {
          router.push(routes.home())
        }
    }, [idPage, router])
    const dispoMachines = allMachines.filter((machine) => machine.price <= creditUser)


  return (
    <><Header />
        <div className="overflow-x-auto w-full">
          <table className="table-auto w-full">
              <thead className="bg-gray-100 text-black uppercase text-sm">
                  <tr className="border-b border-gray-200 hover:bg-gray-100">
                      <th className="py-3 px-4 sm:w-1/6">Nom Machine</th>
                      <th className="py-3 px-4 sm:w-1/6">Action</th>
                  </tr>
              </thead>
              <tbody className="text-black text-center">
                  {dispoMachines.map((machine, index) => 
                  <tr key={index}>
                      <td className="py-3 px-4 sm:w-1/6">{machine.name}</td>
                      <td className="py-3 px-4 group-hover:opacity-100 sm:items-center justify">
                          <Button className="h-12 bg-slate-400" variants="primary"><PowerIcon className="w-8 text-white" /></Button>
                      </td>
                  </tr>
                  )}
              </tbody>
          </table>
      </div>
    </>
  )
}

export default Machines
