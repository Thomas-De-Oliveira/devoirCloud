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

    // le useEffect me permet de savoir si l'utilisateur est bien sur la bonne page je verifie déjà qu'il est connecté et si son id correspond bien a celui de l'url
    // s'il ne correspond je le redirige vers la page home
    useEffect(() => {
        const id = localStorage.getItem(config.session.localStorageKey)
        setCreditUser(localStorage.getItem(config.session.localStorageCredit))
    
        if(id != null && id != undefined && id != idPage) {
          router.push(routes.home())
        }
    }, [idPage, router])
    //ici je filtre les machines en fonction des droits de l'utilisateur
    const dispoMachines = allMachines.filter((machine) => machine.price <= creditUser)
    
    // le handleSubmit va créer une machine virtuel en fonction du type choisi en interrogent le service
    // il recevra une erreur ou un données de machine virtuel
    // si il y a une erreur on l'affiche
    // on ouvre le pop-up avec les information de la VM
    // et on enregistre les données de la VM
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

    //ce useEffect vérifie si nous avons les données d'une machien virtuel
    // si c'est le cas il lance un timer de 10 minutes qui au bout de ce temps supprimera la machine virtuel et le disk
    // une fois supprimer nous remettons les données de la machine virtuel a null
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
        }, 10 * 60 * 1000)
    
        return () => clearTimeout(timeoutId)
      }
    }, [virtualMachine, destroyVM, destroyDisk])


    return (
      <>
        <Header />
        <div className="max-w-4xl mx-auto p-4">
          <div className="overflow-x-auto">
            <FormError error={error} />
            <table className="table-auto w-full rounded-lg overflow-hidden">
              <thead className="bg-rose-100 text-black uppercase text-sm">
                <tr className="border-b border-gray-200 hover:bg-gray-100">
                  <th className="py-3 px-4 sm:w-1/6">Nom Machine</th>
                  <th className="py-3 px-4 sm:w-1/6">Action</th>
                </tr>
              </thead>
              <tbody className="text-black text-center">
                {dispoMachines.map((machine, index) => (
                  <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-4 sm:w-1/6">{machine.name}</td>
                    <td className="py-3 px-4 group-hover:opacity-100 sm:items-center justify-center">
                      <div className="flex justify-center">
                        <Button
                          className="h-12 bg-salmon hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
                          variants="primary"
                          onClick={() => handleSubmit(machine.name)}
                        >
                          <PowerIcon className="w-6 h-6" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Modal
              isOpen={isOpen}
              modalTitle="Virtual Machine détails"
              closeModal={() => setIsOpen(false)}
            >
              {virtualMachine != null ? (
                <>
                  <p>Addresse Ip: {virtualMachine.ipAddress}</p>
                  <p>Username: {virtualMachine.name}</p>
                  <p>Mot de passe: {virtualMachine.password}</p>
                </>
              ) : (
                ""
              )}
            </Modal>
          </div>
        </div>
      </>
    )
  }

export default Machines
