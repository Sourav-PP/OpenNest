import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { IAdminKycDto } from "@/types/api/admin";
import { toast } from "react-toastify";
import { adminApi } from "@/server/api/admin";
import ConfirmModal from "./ConfirmModal";

const KycVerification = () => {
  const { psychologistId } = useParams<{ psychologistId: string }>();
  const [kyc, setKyc] = useState<IAdminKycDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false)
  const [action, setAction] = useState<'approved' | 'rejected' | null> (null)
  const [message, setMessage] = useState('')

  const fetchKyc = async () => {
      try {
        const data = await adminApi.getKycDetailsByPsychologistId(psychologistId!);
        console.log('data: ', data)
        setKyc(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch KYC for psychologist");
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchKyc();
  }, [psychologistId]);

  const handleAction = async (status: 'approved' | 'rejected', reason?: string) => {
    if(!kyc) return

    try {
        setActionLoading(true)
        if(status === 'approved') {
            await adminApi.approveKyc(psychologistId!)
            toast.success('KYC approved successfully')
        } else {
          console.log("reason: ", reason)
            await adminApi.rejectKyc(psychologistId!, reason!)
            toast.success("KYC rejected successfully")
        }

        await fetchKyc()
    } catch (err) {
        console.log(err)
        toast.error("Failed to do the action")
    } finally {
        setActionLoading(false)
        setModalOpen(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        Loading...
      </div>
    );
  }

  if (!kyc) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        No KYC data found.
      </div>
    );
  }

  return (
    <div className="bg-admin-bg-secondary min-h-screen text-white p-8">
      <h1 className="text-2xl font-bold mb-6">KYC Details</h1>

      <div className="bg-admin-bg-box rounded-3xl p-8 flex flex-col lg:flex-row gap-8">
        {/* Left Section */}
        <div className="flex flex-col items-start gap-4 w-full lg:w-1/2">
          <img
            src={kyc.profileImage}
            alt="Profile"
            className="w-32 h-32 object-cover rounded-lg"
          />

          <div>
            <h2 className="text-lg font-semibold">
              Name: {kyc.psychologistName}
            </h2>
            <p>{kyc.psychologistEmail}</p>
            <p>Phone: 8921356789</p>
          </div>

          <div>
            <h3 className="font-semibold">Qualification</h3>
            <p>{kyc.qualification}</p>
          </div>

          <div className="flex items-center gap-2">
            <span>Status:</span>
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                kyc.kycStatus === "pending"
                  ? "bg-yellow-700"
                  : kyc.kycStatus === "approved"
                  ? "bg-green-700"
                  : "bg-red-700"
              }`}
            >
              {kyc.kycStatus}
            </span>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full lg:w-1/2">
          <h3 className="font-semibold mb-4">KYC Documents</h3>
          <div className="flex flex-col gap-4">
            <div>
              <p className="mb-1">ID CARD:</p>
              <img
                src={kyc.identificationDoc}
                alt="ID Card"
                className="w-full h-32 object-cover rounded-md bg-gray-600"
                onClick={() => setPreviewUrl(kyc.identificationDoc)}
              />
            </div>

            <div>
              <p className="mb-1">Educational Certificate:</p>
              <img
                src={kyc.educationalCertification}
                alt="Educational Certificate"
                className="w-full h-32 object-cover rounded-md bg-gray-600"
                onClick={() => setPreviewUrl(kyc.educationalCertification)}
              />
            </div>

            <div>
              <p className="mb-1">Experience Certificate:</p>
              <img
                src={kyc.experienceCertificate}
                alt="Experience Certificate"
                className="w-full h-32 object-cover rounded-md bg-gray-600"
                onClick={() => setPreviewUrl(kyc.experienceCertificate)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-6 justify-end">
        <button
        disabled={kyc.kycStatus === 'approved' || actionLoading}
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full"
        onClick={() => {
            setAction('approved')
            setMessage('Are you sure you want to approve this KYC?')
            setModalOpen(true)
        }}
        >
          Approve
        </button>
        <button
        disabled={kyc.kycStatus === 'rejected' || actionLoading}
        className="bg-red-700 hover:bg-red-800 text-white px-6 py-2 rounded-full"
        onClick={() => {
            setAction('rejected')
            setMessage('Please provide a reason for rejecting this KYC?')
            setModalOpen(true)
        }}
        >
          Reject
        </button>
      </div>

      {previewUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={previewUrl}
              alt="Preview"
              className="max-h-[90vh] rounded-lg shadow-lg"
            />
            <button
              onClick={() => setPreviewUrl(null)}
              className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={(reason) => action && handleAction(action, reason)}
        title={action === 'approved' ? 'Approve KYC?' : "Reject KYC?"}
        message={message}
        requireReason={action === 'rejected'}
        />
    </div>
  );
};

export default KycVerification;
