import Button from "@/web/components/Button"
import Header from "@/web/components/Header"

const Machines = () => {
    const machines = [{name: "Windows 10"}, {name: "Ubuntu"},{name: "Debian"}]

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
                  {machines.map((machine, index) => <tr key={index}>
                      <td className="py-3 px-4 sm:w-1/6">{machine.name}</td>
                      <td className="py-3 px-4 opacity-0 group-hover:opacity-100 sm:items-center justify">
                          <Button className="h-12" variants="primary"></Button>
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
