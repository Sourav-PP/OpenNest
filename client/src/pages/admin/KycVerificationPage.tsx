import Sidebar from "../../components/admin/Sidebar";
import Header from "../../components/admin/Header";
import KycVerification from "@/components/admin/KycVerification";

const KycVerificationPage = () => {
  return (
    <div className="flex h-screen w-full bg-admin-bg-secondary text-white overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header/>
        <KycVerification/>
      </div>
    </div>
  )
}

export default KycVerificationPage
