import Header from "../../components/psychologist/Header"
import Sidebar from "../../components/psychologist/Sidebar"
import Profile from "../../components/psychologist/Profile"

const ProfilePage = () => {
  console.log("📍 Loaded: ProfilePage");
  return (
    <div className="flex h-screen w-full bg-[#ECF1F3] text-primaryText overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header/>
        <Profile />
      </div>
    </div>
  )
}

export default ProfilePage
