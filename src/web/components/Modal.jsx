import { XMarkIcon } from "@heroicons/react/20/solid"
import Button from "./Button"
const Modal = (props) => {
  const { isOpen, modalTitle, closeModal, children } = props

  return (
    <div
      className={`fixed z-50 inset-0 transform transition-all overflow-y-auto  ${
        isOpen ? "" : "hidden"
      }`}
    >
      <div className="flex items-center justify-center min-h-screen">
        <div className="fixed inset-0 bg-gray opacity-75"></div>
        <div className="bg-white border-primary border-solid border-4 rounded-3xl z-20 p-6 max-h-[90vh] w-fit overflow-y-auto">
          <div className="flex mb-4 justify-between items-center gap-6">
            <h3 className="font-bold text-2xl">{modalTitle}</h3>
            <Button onClick={closeModal} size="sm" className="rounded-lg">
              <XMarkIcon className="w-6" />
            </Button>
          </div>
          <div className="mb-4">{children}</div>
        </div>
      </div>
    </div>
  )
}

export default Modal