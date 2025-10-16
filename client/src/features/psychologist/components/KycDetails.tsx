import { psychologistApi } from '@/services/api/psychologist';
import type { IKycDto } from '@/types/dtos/kyc';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import AnimatedTitle from '@/components/animation/AnimatedTitle';
import { Loader2 } from 'lucide-react';
import { getCloudinaryUrl } from '@/lib/utils/cloudinary';
import { handleApiError } from '@/lib/utils/handleApiError';
import { KycStatus } from '@/constants/Kyc';

const KycDetails = () => {
  const [kyc, setKyc] = useState<IKycDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [openDoc, setOpenDoc] = useState<string | null>(null);

  useEffect(() => {
    const fetchKyc = async () => {
      try {
        setLoading(true);
        const kyc = await psychologistApi.getKycDetails();
        setKyc(kyc);
      } catch (error) {
        handleApiError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchKyc();
  }, []);

  if (loading)
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8 bg-gradient-to-br from-indigo-50 to-white min-h-screen">
        <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
        </div>
      </div>
    );

  if (!kyc) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8 bg-gradient-to-br from-indigo-50 to-white min-h-screen">
        <AnimatedTitle>
          <h2 className="text-3xl font-bold text-gray-800 mb-4 text-start">KYC Details</h2>
        </AnimatedTitle>
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100 max-w-5xl mx-auto">
          <Card className="border-0 shadow-none bg-transparent">
            <CardContent className="p-0">
              <p className="text-gray-600 text-center font-medium text-lg">No KYC details available yet.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 bg-gradient-to-br from-indigo-50 to-white min-h-screen">
      <AnimatedTitle>
        <h2 className="text-3xl font-bold text-gray-800 mb-4 text-start">KYC Details</h2>
      </AnimatedTitle>
      <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
        <Card className="border-0 shadow-none bg-transparent">
          <CardHeader className="p-0 pb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle className="text-2xl font-semibold text-gray-800">Documents</CardTitle>
              <Badge
                className={`px-4 py-2 text-sm font-semibold capitalize rounded-full transition-colors duration-300 ${
                  kyc.kycStatus === KycStatus.PENDING
                    ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                    : kyc.kycStatus === KycStatus.APPROVED
                      ? 'bg-green-100 text-green-800 hover:bg-green-200'
                      : 'bg-red-100 text-red-800 hover:bg-red-200'
                }`}
              >
                {kyc.kycStatus}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: 'Identification Document', src: getCloudinaryUrl(kyc.identificationDoc) },
                { title: 'Educational Certification', src: getCloudinaryUrl(kyc.educationalCertification) },
                { title: 'Experience Certificate', src: getCloudinaryUrl(kyc.experienceCertificate) },
              ].map((doc, index) => (
                <Dialog key={index} open={openDoc === doc.src} onOpenChange={open => setOpenDoc(open ? doc.src : null)}>
                  <DialogTrigger asChild>
                    <div className="cursor-pointer group">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">{doc.title}</h3>
                      <div className="relative overflow-hidden rounded-xl shadow-md border border-gray-200 hover:shadow-xl transition-all duration-300 aspect-[4/3]">
                        <img
                          src={doc.src || undefined}
                          alt={doc.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300">
                          <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            View Full Document
                          </span>
                        </div>
                      </div>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-[90vw] max-h-[90vh] w-auto h-auto p-4 bg-white rounded-2xl shadow-2xl overflow-auto">
                    <img
                      src={doc.src || undefined}
                      alt={doc.title}
                      className="w-full h-auto max-h-[80vh] object-contain"
                    />
                  </DialogContent>
                </Dialog>
              ))}
            </div>
            {kyc.kycStatus === KycStatus.REJECTED && kyc.rejectionReason && (
              <div className="mt-8 p-6 bg-red-50 rounded-xl border border-red-200">
                <h3 className="text-lg font-semibold text-red-900 mb-2">Rejection Reason</h3>
                <p className="text-sm text-red-800">{kyc.rejectionReason}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default KycDetails;
