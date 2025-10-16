import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { authApi } from '@/services/api/auth';
import { handleApiError } from '@/lib/utils/handleApiError';

interface OtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  signupToken: string;
  onSuccess: (accessToken: string) => Promise<void>;
}

const OtpModal = ({ isOpen, email, signupToken, onClose, onSuccess }: OtpModalProps) => {
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Timer logic
  useEffect(() => {
    if (isOpen) {
      setTimer(60);
      setCanResend(false);
      const interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const handleResend = async () => {
    setIsLoading(true);
    try {
      const res = await authApi.sendOtp({ email });
      setTimer(60);
      setCanResend(false);
      toast.success(res.message);
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!otp) {
      toast.error('Please enter the OTP');
      return;
    }
    setIsLoading(true);
    try {
      const res = await authApi.verifyOtp({ email, otp, signupToken });
      toast.success('Email verified and signup complete!');
      await onSuccess(res.accessToken);
      onClose();
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

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
          <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-[8%8%8%8%/12%12%12%12%] bg-white p-6 text-center shadow-lg transition-all">
                <Dialog.Title as="h3" className="text-2xl mt-2 font-bold text-gray-800">
                  Verify Your Email
                </Dialog.Title>
                <div className="mt-3">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    A 6-digit OTP was sent to <span className="font-medium text-gray-800">{email}</span>.
                  </p>
                  <div className="mt-5">
                    <input
                      type="text"
                      value={otp}
                      onChange={e => setOtp(e.target.value)}
                      placeholder="Enter 6-digit OTP"
                      className="w-full px-4 py-3 rounded-xl bg-slate-100 text-gray-800 placeholder-gray-400 text-center focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-50 transition-all disabled:opacity-50"
                      disabled={isLoading}
                      maxLength={6}
                    />
                  </div>
                  <div className="mt-4 flex justify-between items-center text-sm">
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={isLoading || !canResend}
                      className="font-medium text-cyan-500 hover:text-cyan-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      {isLoading && !canResend ? (
                        <span className="flex items-center">
                          <svg
                            className="animate-spin h-4 w-4 mr-2 text-cyan-500"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
                            />
                          </svg>
                          Sending...
                        </span>
                      ) : (
                        'Resend OTP'
                      )}
                    </button>
                    <p className="text-gray-500">{timer > 0 ? `Expires in ${timer}s` : 'OTP expired'}</p>
                  </div>
                  <div className="mt-6 flex justify-center gap-3 mb-2">
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={isLoading}
                      className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-200 rounded-xl hover:bg-gray-300 hover:scale-105 disabled:opacity-50 disabled:scale-100 transition-transform duration-200"
                    >
                      Cancel
                    </button>
                    <div className="group text-center">
                      <button
                        type="button"
                        onClick={handleVerify}
                        disabled={isLoading}
                        className="btn-primary group-hover:animate-glow-ring rounded-xl"
                      >
                        {isLoading ? (
                          <span className="flex items-center">
                            <svg
                              className="animate-spin h-4 w-4 mr-2 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
                              />
                            </svg>
                            Verifying...
                          </span>
                        ) : (
                          'Verify OTP'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default OtpModal;
