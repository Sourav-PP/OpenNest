import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  message?: string
}

const ConfirmModal = ({ isOpen, onClose, onConfirm, message }: ConfirmModalProps) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center px-4 py-8">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-90"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-90"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-admin-bg-box p-8 text-center align-middle shadow-2xl transition-all text-white border border-gray-700 relative">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-700 transition-colors"
                  aria-label="Close modal"
                >
                  <svg className="w-7 h-7 text-gray-300 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <Dialog.Title as="h3" className="text-2xl font-bold text-white mb-4 mt-4">
                  Update Status?
                </Dialog.Title>

                <p className="text-base text-gray-300 mb-8 leading-relaxed">
                  {message || 'Are you sure you want to perform this action?'}
                </p>

                <div className="flex justify-center gap-4">
                  <button
                    onClick={onConfirm}
                    className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-full transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={onClose}
                    className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-full transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Go Back
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default ConfirmModal