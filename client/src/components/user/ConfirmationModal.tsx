import type { ReactNode } from 'react';

interface ConfirmationModalProps {
  title: string;
  description?: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmLoading?: boolean;
  children?: ReactNode;
}

const ConfirmationModal = ({
  title,
  description,
  isOpen,
  onClose,
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmLoading = false,
  children,
}: ConfirmationModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
        {description && <p className="text-sm text-gray-600 mb-4">{description}</p>}

        {children && <div className="mb-4">{children}</div>}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={confirmLoading}
            className={`px-4 py-2 text-sm rounded-lg text-white font-medium transition-colors ${
              confirmLoading ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {confirmLoading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
