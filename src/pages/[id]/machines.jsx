import Button from "@/web/components/Button"
import Header from "@/web/components/Header"
import routes from "@/web/routes"
import useAppContext from "@/web/hooks/useAppContext.js"
import { useRouter } from "next/router.js"
import { useEffect, useState, useCallback } from "react"
import config from "@/web/config.js"
import { PowerIcon } from "@heroicons/react/20/solid"
import FormError from "@/web/components/FormError"
import Modal from "@/web/components/Modal"


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
    const allMachines = [{name: "Windows10", price: 1}, {name: "Ubuntu", price:2},{name: "Debian", price:2}]
    const [creditUser, setCreditUser] = useState(null)
    const [error, setError] = useState(null)
    const [isOpen, setIsOpen] = useState(false)
    const [virtualMachine, setVirtualMachine] = useState(null)

    const {
      actions: { createVM, destroyVM, destroyDisk },
    } = useAppContext()

    useEffect(() => {
        const id = localStorage.getItem(config.session.localStorageKey)
        setCreditUser(localStorage.getItem(config.session.localStorageCredit))
    
        if(id != null && id != undefined && id != idPage) {
          router.push(routes.home())
        }
    }, [idPage, router])
    const dispoMachines = allMachines.filter((machine) => machine.price <= creditUser)

    const handleSubmit = useCallback(
      async (name) => {
        setError(null)
  
        const [err, data] = await createVM(name)
  
        if (err) {
          setError(err)
  
          return
        }

        setIsOpen(true)
        setVirtualMachine(data)
      },
      [createVM]
    )

    useEffect(() => {
      if (virtualMachine != null) {
        const timeoutId = setTimeout(async () => {
          const [destroyErr] = await destroyVM(virtualMachine.nameVM)

          if (destroyErr) {
            setError("Erreur lors de la destruction de la machine virtuelle :", destroyErr)
          } else {
            setVirtualMachine(null)
            setIsOpen(false)
            await destroyDisk(virtualMachine.nameVM)
          }
        }, 1 * 60 * 1000)
    
        return () => clearTimeout(timeoutId)
      }
    }, [virtualMachine, destroyVM, destroyDisk])


  return (
    <><Header />
        <div className="overflow-x-auto w-full">
          <FormError error={error}/>
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
                          <Button className="h-12 bg-slate-400" variants="primary" onClick={() => handleSubmit(machine.name)}><PowerIcon className="w-8 text-white" /></Button>
                      </td>
                  </tr>
                  )}
              </tbody>
          </table>
          <Modal
            isOpen={isOpen}
            modalTitle="Virtual Machine détails"
            closeModal={() => setIsOpen(false)}
          >
          {virtualMachine != null ?  (
            <><p>Addresse Ip: {virtualMachine.ipAddress}</p><p>Username: {virtualMachine.name}</p><p>Mot de passe: {virtualMachine.password}</p></>
            ) : "" }
          </Modal>
      </div>
    </>
  )
}

export default Machines
