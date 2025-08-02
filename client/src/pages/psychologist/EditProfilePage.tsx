import Header from "../../components/psychologist/Header"
import Sidebar from "../../components/psychologist/Sidebar"
import EditProfileForm from "../../components/psychologist/EditProfileForm"
const EditProfilePage = () => {
  return (
    <div className="flex h-screen w-full bg-[#ECF1F3] text-primaryText overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header/>
        <EditProfileForm />
      </div>
    </div>
  )
}

export default EditProfilePage